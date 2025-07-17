import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { 
  shopifyClient,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  GET_CART_QUERY
} from '../lib/shopify';
import { 
  CartItem, 
  ShopifyCartInput,
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesUpdateResponse,
  CartLinesRemoveResponse,
  GetCartResponse
} from '../types/shopify';
import { 
  transformCart, 
  getStoredCartId, 
  storeCartId, 
  removeStoredCartId 
} from '../lib/shopify-utils';
import { MockCartService } from '../lib/mock-data';

interface CartState {
  id: string | null;
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  subtotalAmount: number;
  totalTaxAmount: number;
  currencyCode: string;
  checkoutUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: Partial<CartState> }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  id: null,
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  subtotalAmount: 0,
  totalTaxAmount: 0,
  currencyCode: 'USD',
  checkoutUrl: null,
  isLoading: false,
  error: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CART':
      return { ...state, ...action.payload, isLoading: false, error: null };
    case 'CLEAR_CART':
      return { ...initialState };
    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateCartItem: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  getCartItemQuantity: (variantId: string) => number;
  isInCart: (variantId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Check if we should use mock data
  const shouldUseMockData = () => {
    return !import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 
           !import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
  };

  // Helper to transform mock cart data
  const transformMockCart = (mockCart: any) => ({
    id: mockCart.id,
    items: mockCart.lines.edges.map((edge: any) => ({
      id: edge.node.id,
      variantId: edge.node.merchandise.id,
      productId: edge.node.merchandise.product.id,
      title: edge.node.merchandise.product.title,
      variantTitle: edge.node.merchandise.title,
      quantity: edge.node.quantity,
      price: parseFloat(edge.node.merchandise.price.amount),
      totalPrice: parseFloat(edge.node.cost.totalAmount.amount),
      currencyCode: edge.node.merchandise.price.currencyCode,
      image: edge.node.merchandise.product.images.edges[0]?.node || null,
      handle: edge.node.merchandise.product.handle,
    })),
    totalQuantity: mockCart.totalQuantity,
    totalAmount: parseFloat(mockCart.cost.totalAmount.amount),
    subtotalAmount: parseFloat(mockCart.cost.subtotalAmount.amount),
    totalTaxAmount: 0,
    currencyCode: mockCart.cost.totalAmount.currencyCode,
    checkoutUrl: mockCart.checkoutUrl,
  });

  // Initialize cart on mount
  useEffect(() => {
    initializeCart();
  }, []);

  const initializeCart = async () => {
    if (shouldUseMockData()) {
      // Initialize mock cart
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const mockCart = await MockCartService.getCart();
        
        dispatch({
          type: 'SET_CART',
          payload: transformMockCart(mockCart)
        });
      } catch (error) {
        console.error('Failed to initialize mock cart:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
      }
      return;
    }

    const storedCartId = getStoredCartId();
    
    if (storedCartId) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const response = await shopifyClient.request<GetCartResponse>(GET_CART_QUERY, {
          variables: { cartId: storedCartId }
        });

        if (response.data?.cart) {
          const transformedCart = transformCart(response.data.cart);
          dispatch({
            type: 'SET_CART',
            payload: {
              id: transformedCart.id,
              items: transformedCart.items,
              totalQuantity: transformedCart.totalQuantity,
              totalAmount: transformedCart.cost.totalAmount,
              subtotalAmount: transformedCart.cost.subtotalAmount,
              totalTaxAmount: transformedCart.cost.totalTaxAmount,
              currencyCode: transformedCart.cost.currencyCode,
              checkoutUrl: transformedCart.checkoutUrl,
            }
          });
        } else {
          // Cart not found, remove from storage
          removeStoredCartId();
          dispatch({ type: 'CLEAR_CART' });
        }
      } catch (error) {
        console.error('Failed to initialize cart:', error);
        removeStoredCartId();
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
      }
    }
  };

  const createCart = async (variantId: string, quantity: number = 1) => {
    try {
      const cartInput: ShopifyCartInput = {
        lines: [{ merchandiseId: variantId, quantity }]
      };

      const response = await shopifyClient.request<CartCreateResponse>(CREATE_CART_MUTATION, {
        variables: { input: cartInput }
      });

      if (response.data?.cartCreate.userErrors.length > 0) {
        throw new Error(response.data.cartCreate.userErrors[0].message);
      }

      if (response.data?.cartCreate.cart) {
        const transformedCart = transformCart(response.data.cartCreate.cart);
        storeCartId(transformedCart.id);
        
        dispatch({
          type: 'SET_CART',
          payload: {
            id: transformedCart.id,
            items: transformedCart.items,
            totalQuantity: transformedCart.totalQuantity,
            totalAmount: transformedCart.cost.totalAmount,
            subtotalAmount: transformedCart.cost.subtotalAmount,
            totalTaxAmount: transformedCart.cost.totalTaxAmount,
            currencyCode: transformedCart.cost.currencyCode,
            checkoutUrl: transformedCart.checkoutUrl,
          }
        });

        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Failed to create cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create cart' });
      toast.error('Failed to add to cart');
    }
  };

  const addToCart = async (variantId: string, quantity: number = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      if (shouldUseMockData()) {
        // Use mock cart service
        const mockCart = await MockCartService.addToCart(variantId, quantity);
        
        dispatch({
          type: 'SET_CART',
          payload: transformMockCart(mockCart)
        });

        toast.success('Added to cart!');
        return;
      }

      if (!state.id) {
        await createCart(variantId, quantity);
        return;
      }

      const response = await shopifyClient.request<CartLinesAddResponse>(ADD_TO_CART_MUTATION, {
        variables: {
          cartId: state.id,
          lines: [{ merchandiseId: variantId, quantity }]
        }
      });

      if (response.data?.cartLinesAdd.userErrors.length > 0) {
        throw new Error(response.data.cartLinesAdd.userErrors[0].message);
      }

      if (response.data?.cartLinesAdd.cart) {
        const transformedCart = transformCart(response.data.cartLinesAdd.cart);
        
        dispatch({
          type: 'SET_CART',
          payload: {
            items: transformedCart.items,
            totalQuantity: transformedCart.totalQuantity,
            totalAmount: transformedCart.cost.totalAmount,
            subtotalAmount: transformedCart.cost.subtotalAmount,
            totalTaxAmount: transformedCart.cost.totalTaxAmount,
            currencyCode: transformedCart.cost.currencyCode,
            checkoutUrl: transformedCart.checkoutUrl,
          }
        });

        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add to cart' });
      toast.error('Failed to add to cart');
    }
  };

  const updateCartItem = async (lineId: string, quantity: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      if (shouldUseMockData()) {
        // Use mock cart service
        const mockCart = await MockCartService.updateCartItem(lineId, quantity);
        
        dispatch({
          type: 'SET_CART',
          payload: transformMockCart(mockCart)
        });

        toast.success('Cart updated!');
        return;
      }

      if (!state.id) return;

      const response = await shopifyClient.request<CartLinesUpdateResponse>(UPDATE_CART_MUTATION, {
        variables: {
          cartId: state.id,
          lines: [{ id: lineId, quantity }]
        }
      });

      if (response.data?.cartLinesUpdate.userErrors.length > 0) {
        throw new Error(response.data.cartLinesUpdate.userErrors[0].message);
      }

      if (response.data?.cartLinesUpdate.cart) {
        const transformedCart = transformCart(response.data.cartLinesUpdate.cart);
        
        dispatch({
          type: 'SET_CART',
          payload: {
            items: transformedCart.items,
            totalQuantity: transformedCart.totalQuantity,
            totalAmount: transformedCart.cost.totalAmount,
            subtotalAmount: transformedCart.cost.subtotalAmount,
            totalTaxAmount: transformedCart.cost.totalTaxAmount,
            currencyCode: transformedCart.cost.currencyCode,
            checkoutUrl: transformedCart.checkoutUrl,
          }
        });

        toast.success('Cart updated!');
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart' });
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (lineId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      if (shouldUseMockData()) {
        // Use mock cart service
        const mockCart = await MockCartService.removeFromCart(lineId);
        
        dispatch({
          type: 'SET_CART',
          payload: transformMockCart(mockCart)
        });

        toast.success('Removed from cart!');
        return;
      }

      if (!state.id) return;

      const response = await shopifyClient.request<CartLinesRemoveResponse>(REMOVE_FROM_CART_MUTATION, {
        variables: {
          cartId: state.id,
          lineIds: [lineId]
        }
      });

      if (response.data?.cartLinesRemove.userErrors.length > 0) {
        throw new Error(response.data.cartLinesRemove.userErrors[0].message);
      }

      if (response.data?.cartLinesRemove.cart) {
        const transformedCart = transformCart(response.data.cartLinesRemove.cart);
        
        dispatch({
          type: 'SET_CART',
          payload: {
            items: transformedCart.items,
            totalQuantity: transformedCart.totalQuantity,
            totalAmount: transformedCart.cost.totalAmount,
            subtotalAmount: transformedCart.cost.subtotalAmount,
            totalTaxAmount: transformedCart.cost.totalTaxAmount,
            currencyCode: transformedCart.cost.currencyCode,
            checkoutUrl: transformedCart.checkoutUrl,
          }
        });

        toast.success('Removed from cart!');
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from cart' });
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = () => {
    removeStoredCartId();
    dispatch({ type: 'CLEAR_CART' });
  };

  const refreshCart = async () => {
    if (!state.id) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await shopifyClient.request<GetCartResponse>(GET_CART_QUERY, {
        variables: { cartId: state.id }
      });

      if (response.data?.cart) {
        const transformedCart = transformCart(response.data.cart);
        dispatch({
          type: 'SET_CART',
          payload: {
            items: transformedCart.items,
            totalQuantity: transformedCart.totalQuantity,
            totalAmount: transformedCart.cost.totalAmount,
            subtotalAmount: transformedCart.cost.subtotalAmount,
            totalTaxAmount: transformedCart.cost.totalTaxAmount,
            currencyCode: transformedCart.cost.currencyCode,
            checkoutUrl: transformedCart.checkoutUrl,
          }
        });
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh cart' });
    }
  };

  const getCartItemQuantity = (variantId: string): number => {
    const item = state.items.find(item => item.variantId === variantId);
    return item ? item.quantity : 0;
  };

  const isInCart = (variantId: string): boolean => {
    return state.items.some(item => item.variantId === variantId);
  };

  const contextValue: CartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    getCartItemQuantity,
    isInCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}
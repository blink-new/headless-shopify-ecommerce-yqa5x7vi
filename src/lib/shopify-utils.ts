import { 
  ShopifyProduct, 
  ShopifyCart, 
  ShopifyCartLine,
  Product, 
  ProductVariant, 
  CartItem,
  ShopifyMoney 
} from '../types/shopify';

// Transform Shopify product to local product format
export function transformProduct(shopifyProduct: ShopifyProduct): Product {
  const images = shopifyProduct.images.edges.map(edge => edge.node);
  
  const variants: ProductVariant[] = shopifyProduct.variants.edges.map(edge => ({
    id: edge.node.id,
    title: edge.node.title,
    price: parseFloat(edge.node.price.amount),
    compareAtPrice: edge.node.compareAtPrice ? parseFloat(edge.node.compareAtPrice.amount) : undefined,
    currencyCode: edge.node.price.currencyCode,
    availableForSale: edge.node.availableForSale,
    quantityAvailable: edge.node.quantityAvailable,
    selectedOptions: edge.node.selectedOptions,
    image: edge.node.image,
  }));

  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description,
    tags: shopifyProduct.tags,
    vendor: shopifyProduct.vendor,
    productType: shopifyProduct.productType,
    images,
    variants,
    priceRange: {
      min: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
      max: parseFloat(shopifyProduct.priceRange.maxVariantPrice.amount),
      currencyCode: shopifyProduct.priceRange.minVariantPrice.currencyCode,
    },
    options: shopifyProduct.options,
  };
}

// Transform Shopify cart line to local cart item format
export function transformCartLine(cartLine: ShopifyCartLine): CartItem {
  const image = cartLine.merchandise.product.images.edges[0]?.node;
  
  return {
    id: cartLine.id,
    variantId: cartLine.merchandise.id,
    productId: cartLine.merchandise.product.id,
    title: cartLine.merchandise.title,
    productTitle: cartLine.merchandise.product.title,
    handle: cartLine.merchandise.product.handle,
    quantity: cartLine.quantity,
    price: parseFloat(cartLine.merchandise.price.amount),
    currencyCode: cartLine.merchandise.price.currencyCode,
    image,
    totalPrice: parseFloat(cartLine.cost.totalAmount.amount),
  };
}

// Transform Shopify cart to local cart format
export function transformCart(shopifyCart: ShopifyCart) {
  const items = shopifyCart.lines.edges.map(edge => transformCartLine(edge.node));
  
  return {
    id: shopifyCart.id,
    checkoutUrl: shopifyCart.checkoutUrl,
    totalQuantity: shopifyCart.totalQuantity,
    items,
    cost: {
      totalAmount: parseFloat(shopifyCart.cost.totalAmount.amount),
      subtotalAmount: parseFloat(shopifyCart.cost.subtotalAmount.amount),
      totalTaxAmount: shopifyCart.cost.totalTaxAmount ? parseFloat(shopifyCart.cost.totalTaxAmount.amount) : 0,
      currencyCode: shopifyCart.cost.totalAmount.currencyCode,
    },
  };
}

// Format price for display
export function formatPrice(amount: number | string, currencyCode: string = 'USD'): string {
  const price = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(price);
}

// Format Shopify money object
export function formatShopifyMoney(money: ShopifyMoney): string {
  return formatPrice(money.amount, money.currencyCode);
}

// Get product's main image
export function getProductMainImage(product: Product | ShopifyProduct) {
  if ('images' in product && Array.isArray(product.images)) {
    return product.images[0];
  }
  
  if ('images' in product && 'edges' in product.images) {
    return product.images.edges[0]?.node;
  }
  
  return undefined;
}

// Get variant's image or fallback to product's main image
export function getVariantImage(variant: ProductVariant, product: Product) {
  return variant.image || getProductMainImage(product);
}

// Check if product is in stock
export function isProductInStock(product: Product): boolean {
  return product.variants.some(variant => variant.availableForSale);
}

// Check if variant is in stock
export function isVariantInStock(variant: ProductVariant): boolean {
  return variant.availableForSale && (variant.quantityAvailable === undefined || variant.quantityAvailable > 0);
}

// Get product's price range text
export function getPriceRangeText(product: Product): string {
  const { min, max, currencyCode } = product.priceRange;
  
  if (min === max) {
    return formatPrice(min, currencyCode);
  }
  
  return `${formatPrice(min, currencyCode)} - ${formatPrice(max, currencyCode)}`;
}

// Get variant's display price (with compare at price if available)
export function getVariantPriceDisplay(variant: ProductVariant): {
  price: string;
  compareAtPrice?: string;
  onSale: boolean;
} {
  const price = formatPrice(variant.price, variant.currencyCode);
  const compareAtPrice = variant.compareAtPrice ? formatPrice(variant.compareAtPrice, variant.currencyCode) : undefined;
  const onSale = Boolean(variant.compareAtPrice && variant.compareAtPrice > variant.price);
  
  return {
    price,
    compareAtPrice,
    onSale,
  };
}

// Calculate savings amount and percentage
export function calculateSavings(price: number, compareAtPrice: number, currencyCode: string = 'USD') {
  const savings = compareAtPrice - price;
  const percentage = Math.round((savings / compareAtPrice) * 100);
  
  return {
    amount: formatPrice(savings, currencyCode),
    percentage,
  };
}

// Generate product URL
export function getProductUrl(handle: string): string {
  return `/products/${handle}`;
}

// Extract Shopify ID from GraphQL ID
export function extractShopifyId(gid: string): string {
  return gid.split('/').pop() || gid;
}

// Create Shopify GraphQL ID
export function createShopifyGid(resource: string, id: string): string {
  return `gid://shopify/${resource}/${id}`;
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Local storage helpers for cart persistence
export const CART_STORAGE_KEY = 'shopify-cart-id';

export function getStoredCartId(): string | null {
  try {
    return localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeCartId(cartId: string): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, cartId);
  } catch {
    // Ignore storage errors
  }
}

export function removeStoredCartId(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

// Image optimization helpers
export function getOptimizedImageUrl(
  url: string, 
  width?: number, 
  height?: number, 
  crop?: 'center' | 'top' | 'bottom' | 'left' | 'right'
): string {
  if (!url) return '';
  
  const params = new URLSearchParams();
  
  if (width) params.append('width', width.toString());
  if (height) params.append('height', height.toString());
  if (crop) params.append('crop', crop);
  
  const separator = url.includes('?') ? '&' : '?';
  return params.toString() ? `${url}${separator}${params.toString()}` : url;
}

// Responsive image sizes for different breakpoints
export const IMAGE_SIZES = {
  thumbnail: { width: 100, height: 100 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
  hero: { width: 1920, height: 1080 },
} as const;

// Get responsive image URL
export function getResponsiveImageUrl(url: string, size: keyof typeof IMAGE_SIZES): string {
  const { width, height } = IMAGE_SIZES[size];
  return getOptimizedImageUrl(url, width, height, 'center');
}
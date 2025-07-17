// Shopify Storefront API Types

export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: ShopifySelectedOption[];
  image?: ShopifyImage;
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoney;
  maxVariantPrice: ShopifyMoney;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  tags: string[];
  vendor: string;
  productType: string;
  createdAt: string;
  updatedAt: string;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
  priceRange: ShopifyPriceRange;
  options?: ShopifyProductOption[];
}

export interface ShopifyProductEdge {
  node: ShopifyProduct;
  cursor: string;
}

export interface ShopifyProductConnection {
  edges: ShopifyProductEdge[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: ShopifyMoney;
    product: {
      id: string;
      title: string;
      handle: string;
      images: {
        edges: {
          node: ShopifyImage;
        }[];
      };
    };
  };
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
  };
}

export interface ShopifyCartCost {
  totalAmount: ShopifyMoney;
  subtotalAmount: ShopifyMoney;
  totalTaxAmount?: ShopifyMoney;
  totalDutyAmount?: ShopifyMoney;
}

export interface ShopifyCart {
  id: string;
  createdAt: string;
  updatedAt: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
  cost: ShopifyCartCost;
}

export interface ShopifyCartInput {
  lines?: {
    merchandiseId: string;
    quantity: number;
  }[];
}

export interface ShopifyCartLineInput {
  merchandiseId: string;
  quantity: number;
}

export interface ShopifyCartLineUpdateInput {
  id: string;
  quantity: number;
}

export interface ShopifyUserError {
  field?: string[];
  message: string;
}

// Local cart item type for easier handling
export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  productTitle: string;
  handle: string;
  quantity: number;
  price: number;
  compareAtPrice?: number;
  currencyCode: string;
  image?: ShopifyImage;
  totalPrice: number;
}

// Local product type for easier handling
export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  tags: string[];
  vendor: string;
  productType: string;
  images: ShopifyImage[];
  variants: ProductVariant[];
  priceRange: {
    min: number;
    max: number;
    currencyCode: string;
  };
  options?: ShopifyProductOption[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  currencyCode: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: ShopifySelectedOption[];
  image?: ShopifyImage;
}

// Filter and sort options
export interface ProductFilters {
  search?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  availability?: 'available' | 'unavailable';
}

export interface ProductSortOptions {
  sortBy: 'title' | 'price' | 'created' | 'updated' | 'best-selling' | 'relevance';
  reverse?: boolean;
}

// API response types
export interface ProductsResponse {
  products: ShopifyProductConnection;
}

export interface ProductByHandleResponse {
  productByHandle: ShopifyProduct | null;
}

export interface SearchProductsResponse {
  products: ShopifyProductConnection;
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
}

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
}

export interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
}

export interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
}

export interface GetCartResponse {
  cart: ShopifyCart | null;
}
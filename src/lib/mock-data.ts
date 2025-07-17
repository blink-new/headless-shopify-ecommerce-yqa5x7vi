import { Product } from '../types/shopify';

// Mock product data for demonstration
export const mockProducts: Product[] = [
  {
    id: 'gid://shopify/Product/1',
    title: 'Premium Wireless Headphones',
    handle: 'premium-wireless-headphones',
    description: 'Experience crystal-clear audio with our premium wireless headphones featuring noise cancellation and 30-hour battery life.',
    vendor: 'AudioTech',
    productType: 'Electronics',
    tags: ['electronics', 'audio', 'wireless', 'premium'],
    images: [
      {
        id: 'img1',
        url: '/placeholder-product.jpg',
        altText: 'Premium Wireless Headphones',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: 'var1',
        title: 'Black',
        price: { amount: '299.99', currencyCode: 'USD' },
        compareAtPrice: { amount: '399.99', currencyCode: 'USD' },
        availableForSale: true,
        quantityAvailable: 50,
        selectedOptions: [{ name: 'Color', value: 'Black' }]
      }
    ],
    priceRange: {
      minVariantPrice: { amount: '299.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '299.99', currencyCode: 'USD' }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Smart Fitness Watch',
    handle: 'smart-fitness-watch',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and 7-day battery life.',
    vendor: 'FitTech',
    productType: 'Wearables',
    tags: ['fitness', 'smartwatch', 'health', 'technology'],
    images: [
      {
        id: 'img2',
        url: '/placeholder-product.jpg',
        altText: 'Smart Fitness Watch',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: 'var2',
        title: 'Silver',
        price: { amount: '199.99', currencyCode: 'USD' },
        compareAtPrice: null,
        availableForSale: true,
        quantityAvailable: 25,
        selectedOptions: [{ name: 'Color', value: 'Silver' }]
      }
    ],
    priceRange: {
      minVariantPrice: { amount: '199.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '199.99', currencyCode: 'USD' }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'gid://shopify/Product/3',
    title: 'Organic Cotton T-Shirt',
    handle: 'organic-cotton-t-shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt perfect for everyday wear. Available in multiple colors.',
    vendor: 'EcoWear',
    productType: 'Clothing',
    tags: ['clothing', 'organic', 'sustainable', 'cotton'],
    images: [
      {
        id: 'img3',
        url: '/placeholder-product.jpg',
        altText: 'Organic Cotton T-Shirt',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: 'var3',
        title: 'Medium / White',
        price: { amount: '29.99', currencyCode: 'USD' },
        compareAtPrice: { amount: '39.99', currencyCode: 'USD' },
        availableForSale: true,
        quantityAvailable: 100,
        selectedOptions: [
          { name: 'Size', value: 'Medium' },
          { name: 'Color', value: 'White' }
        ]
      }
    ],
    priceRange: {
      minVariantPrice: { amount: '29.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '29.99', currencyCode: 'USD' }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'gid://shopify/Product/4',
    title: 'Stainless Steel Water Bottle',
    handle: 'stainless-steel-water-bottle',
    description: 'Keep your drinks at the perfect temperature with this insulated stainless steel water bottle. 24oz capacity.',
    vendor: 'HydroLife',
    productType: 'Accessories',
    tags: ['accessories', 'water bottle', 'stainless steel', 'insulated'],
    images: [
      {
        id: 'img4',
        url: '/placeholder-product.jpg',
        altText: 'Stainless Steel Water Bottle',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: 'var4',
        title: 'Blue',
        price: { amount: '34.99', currencyCode: 'USD' },
        compareAtPrice: null,
        availableForSale: true,
        quantityAvailable: 75,
        selectedOptions: [{ name: 'Color', value: 'Blue' }]
      }
    ],
    priceRange: {
      minVariantPrice: { amount: '34.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '34.99', currencyCode: 'USD' }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'gid://shopify/Product/5',
    title: 'Wireless Charging Pad',
    handle: 'wireless-charging-pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
    vendor: 'ChargeTech',
    productType: 'Electronics',
    tags: ['electronics', 'wireless charging', 'accessories', 'tech'],
    images: [
      {
        id: 'img5',
        url: '/placeholder-product.jpg',
        altText: 'Wireless Charging Pad',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: 'var5',
        title: 'Black',
        price: { amount: '49.99', currencyCode: 'USD' },
        compareAtPrice: { amount: '69.99', currencyCode: 'USD' },
        availableForSale: true,
        quantityAvailable: 30,
        selectedOptions: [{ name: 'Color', value: 'Black' }]
      }
    ],
    priceRange: {
      minVariantPrice: { amount: '49.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '49.99', currencyCode: 'USD' }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'gid://shopify/Product/6',
    title: 'Bamboo Desk Organizer',
    handle: 'bamboo-desk-organizer',
    description: 'Sustainable bamboo desk organizer with multiple compartments for pens, papers, and office supplies.',
    vendor: 'EcoOffice',
    productType: 'Office',
    tags: ['office', 'bamboo', 'organizer', 'sustainable'],
    images: [
      {
        id: 'img6',
        url: '/placeholder-product.jpg',
        altText: 'Bamboo Desk Organizer',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: 'var6',
        title: 'Natural',
        price: { amount: '24.99', currencyCode: 'USD' },
        compareAtPrice: null,
        availableForSale: true,
        quantityAvailable: 40,
        selectedOptions: [{ name: 'Finish', value: 'Natural' }]
      }
    ],
    priceRange: {
      minVariantPrice: { amount: '24.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '24.99', currencyCode: 'USD' }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'gid://shopify/Product/7',
    title: 'LED Desk Lamp',
    handle: 'led-desk-lamp',
    description: 'Adjustable LED desk lamp with touch controls, multiple brightness levels, and USB charging port.',
    vendor: 'LightTech',
    productType: 'Lighting',
    tags: ['lighting', 'LED', 'desk lamp', 'adjustable'],
    images: [
      {
        id: 'img7',
        url: '/placeholder-product.jpg',
        altText: 'LED Desk Lamp',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: 'var7',
        title: 'White',
        price: { amount: '79.99', currencyCode: 'USD' },
        compareAtPrice: { amount: '99.99', currencyCode: 'USD' },
        availableForSale: true,
        quantityAvailable: 20,
        selectedOptions: [{ name: 'Color', value: 'White' }]
      }
    ],
    priceRange: {
      minVariantPrice: { amount: '79.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '79.99', currencyCode: 'USD' }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'gid://shopify/Product/8',
    title: 'Ceramic Coffee Mug Set',
    handle: 'ceramic-coffee-mug-set',
    description: 'Set of 4 handcrafted ceramic coffee mugs with unique glazed finish. Perfect for your morning coffee.',
    vendor: 'CraftWare',
    productType: 'Kitchen',
    tags: ['kitchen', 'ceramic', 'coffee', 'handcrafted'],
    images: [
      {
        id: 'img8',
        url: '/placeholder-product.jpg',
        altText: 'Ceramic Coffee Mug Set',
        width: 800,
        height: 800
      }
    ],
    variants: [
      {
        id: 'var8',
        title: 'Mixed Colors',
        price: { amount: '39.99', currencyCode: 'USD' },
        compareAtPrice: null,
        availableForSale: true,
        quantityAvailable: 15,
        selectedOptions: [{ name: 'Set', value: 'Mixed Colors' }]
      }
    ],
    priceRange: {
      minVariantPrice: { amount: '39.99', currencyCode: 'USD' },
      maxVariantPrice: { amount: '39.99', currencyCode: 'USD' }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock cart functionality
export class MockCartService {
  private static cartItems: any[] = [];
  private static cartId = 'mock-cart-id';

  static async createCart() {
    this.cartItems = [];
    return {
      id: this.cartId,
      totalQuantity: 0,
      checkoutUrl: 'https://checkout.shopify.com/mock-checkout',
      lines: { edges: [] },
      cost: {
        totalAmount: { amount: '0.00', currencyCode: 'USD' },
        subtotalAmount: { amount: '0.00', currencyCode: 'USD' }
      }
    };
  }

  static async addToCart(variantId: string, quantity: number = 1) {
    const product = mockProducts.find(p => p.variants.some(v => v.id === variantId));
    const variant = product?.variants.find(v => v.id === variantId);
    
    if (!product || !variant) {
      throw new Error('Product or variant not found');
    }

    const existingItem = this.cartItems.find(item => item.variantId === variantId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        id: `line-${Date.now()}`,
        variantId,
        quantity,
        product,
        variant
      });
    }

    return this.getCart();
  }

  static async updateCartItem(lineId: string, quantity: number) {
    const item = this.cartItems.find(item => item.id === lineId);
    if (item) {
      if (quantity <= 0) {
        this.cartItems = this.cartItems.filter(item => item.id !== lineId);
      } else {
        item.quantity = quantity;
      }
    }
    return this.getCart();
  }

  static async removeFromCart(lineId: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== lineId);
    return this.getCart();
  }

  static async getCart() {
    const totalQuantity = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.variant.price.amount) * item.quantity);
    }, 0);

    return {
      id: this.cartId,
      totalQuantity,
      checkoutUrl: 'https://checkout.shopify.com/mock-checkout',
      lines: {
        edges: this.cartItems.map(item => ({
          node: {
            id: item.id,
            quantity: item.quantity,
            merchandise: {
              id: item.variantId,
              title: item.variant.title,
              price: item.variant.price,
              product: {
                id: item.product.id,
                title: item.product.title,
                handle: item.product.handle,
                images: {
                  edges: item.product.images.map(img => ({ node: img }))
                }
              }
            },
            cost: {
              totalAmount: {
                amount: (parseFloat(item.variant.price.amount) * item.quantity).toFixed(2),
                currencyCode: 'USD'
              }
            }
          }
        }))
      },
      cost: {
        totalAmount: { amount: subtotal.toFixed(2), currencyCode: 'USD' },
        subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: 'USD' }
      }
    };
  }
}
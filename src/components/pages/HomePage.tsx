import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ProductGrid } from '../products/ProductGrid';
import { shopifyClient, PRODUCTS_QUERY } from '../../lib/shopify';
import { ProductsResponse } from '../../types/shopify';
import { transformProduct } from '../../lib/shopify-utils';
import { Product } from '../../types/shopify';
import { mockProducts } from '../../lib/mock-data';

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setIsLoading(true);
      
      // Check if Shopify credentials are configured
      const hasShopifyCredentials = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN && 
                                   import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
      
      if (hasShopifyCredentials) {
        // Use real Shopify API
        const response = await shopifyClient.request<ProductsResponse>(PRODUCTS_QUERY, {
          variables: {
            first: 8
          }
        });

        if (response.data?.products) {
          const transformedProducts = response.data.products.edges.map(edge => 
            transformProduct(edge.node)
          );
          setFeaturedProducts(transformedProducts);
        }
      } else {
        // Use mock data for demonstration
        console.log('Using mock data - configure Shopify credentials to connect to real store');
        setFeaturedProducts(mockProducts.slice(0, 8));
      }
    } catch (error) {
      console.error('Failed to load featured products, falling back to mock data:', error);
      // Fallback to mock data if Shopify API fails
      setFeaturedProducts(mockProducts.slice(0, 8));
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day hassle-free returns'
    },
    {
      icon: Star,
      title: 'Quality Guarantee',
      description: 'Premium quality products only'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              New Collection Available
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Discover Amazing
              <span className="text-primary block">Products</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Shop the latest trends and discover unique products from top brands. 
              Quality guaranteed with fast, secure checkout.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Collections
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-accent/10 blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>

          <ProductGrid 
            products={featuredProducts} 
            isLoading={isLoading}
            className="mb-12"
          />

          <div className="text-center">
            <Button size="lg" variant="outline">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Subscribe to our newsletter for the latest products and exclusive offers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-foreground bg-background border-0 focus:ring-2 focus:ring-primary-foreground/20"
              />
              <Button 
                variant="secondary" 
                size="lg"
                className="px-8"
              >
                Subscribe
              </Button>
            </div>
            
            <p className="text-sm opacity-75 mt-4">
              No spam, unsubscribe at any time
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Products</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Brands</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">99%</div>
              <div className="text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
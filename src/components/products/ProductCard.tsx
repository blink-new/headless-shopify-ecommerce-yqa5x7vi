import React, { useState } from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Product } from '../../types/shopify';
import { useCart } from '../../contexts/CartContext';
import { 
  formatPrice, 
  getResponsiveImageUrl, 
  isProductInStock,
  getVariantPriceDisplay,
  calculateSavings
} from '../../lib/shopify-utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart, isLoading: cartLoading, getCartItemQuantity } = useCart();

  const mainImage = product.images[0];
  const secondaryImage = product.images[1];
  const inStock = isProductInStock(product);
  const defaultVariant = product.variants[0];
  const cartQuantity = getCartItemQuantity(defaultVariant?.id || '');

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (defaultVariant && inStock) {
      await addToCart(defaultVariant.id, 1);
    }
  };

  const handleProductClick = () => {
    window.location.href = `/products/${product.handle}`;
  };

  const priceDisplay = defaultVariant ? getVariantPriceDisplay(defaultVariant) : null;
  const savings = defaultVariant && defaultVariant.compareAtPrice 
    ? calculateSavings(defaultVariant.price, defaultVariant.compareAtPrice, defaultVariant.currencyCode)
    : null;

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* Main Image */}
          <img
            src={mainImage ? getResponsiveImageUrl(mainImage.url, 'medium') : '/placeholder-product.svg'}
            alt={mainImage?.altText || product.title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
              isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'
            } ${imageLoaded ? 'scale-100' : 'scale-110'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Secondary Image (hover effect) */}
          {secondaryImage && (
            <img
              src={getResponsiveImageUrl(secondaryImage.url, 'medium')}
              alt={secondaryImage.altText || product.title}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex space-x-2">
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white"
                onClick={handleAddToCart}
                disabled={!inStock || cartLoading}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Add to wishlist functionality
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Quick view functionality
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {!inStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {priceDisplay?.onSale && savings && (
              <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
                Save {savings.percentage}%
              </Badge>
            )}
            {product.tags.includes('new') && (
              <Badge variant="default" className="text-xs">
                New
              </Badge>
            )}
          </div>

          {/* Cart Quantity Indicator */}
          {cartQuantity > 0 && (
            <div className="absolute top-3 right-3">
              <Badge variant="default" className="text-xs">
                {cartQuantity} in cart
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Vendor */}
          {product.vendor && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.vendor}
            </p>
          )}

          {/* Title */}
          <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          {priceDisplay && (
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-foreground">
                {priceDisplay.price}
              </span>
              {priceDisplay.compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {priceDisplay.compareAtPrice}
                </span>
              )}
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Add to Cart Button - Mobile */}
          <Button
            className="w-full mt-3 md:hidden"
            size="sm"
            onClick={handleAddToCart}
            disabled={!inStock || cartLoading}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {cartQuantity > 0 ? `Add More (${cartQuantity})` : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { X, Plus, Minus, ShoppingBag, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useCart } from '../../contexts/CartContext';
import { formatPrice, getResponsiveImageUrl } from '../../lib/shopify-utils';
import { Skeleton } from '../ui/skeleton';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    items,
    totalQuantity,
    totalAmount,
    subtotalAmount,
    totalTaxAmount,
    currencyCode,
    checkoutUrl,
    isLoading,
    updateCartItem,
    removeFromCart,
  } = useCart();

  const handleQuantityChange = async (lineId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(lineId);
    } else {
      await updateCartItem(lineId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Shopping Cart</span>
              {totalQuantity > 0 && (
                <Badge variant="secondary">{totalQuantity}</Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="space-y-4 py-4">
              {isLoading && items.length === 0 ? (
                // Loading skeleton
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <Skeleton className="h-16 w-16 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                // Empty cart
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-4">
                    Add some products to get started
                  </p>
                  <Button onClick={onClose}>Continue Shopping</Button>
                </div>
              ) : (
                // Cart items
                items.map((item) => (
                  <div key={item.id} className="flex space-x-4 py-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image ? getResponsiveImageUrl(item.image.url, 'small') : '/placeholder-product.svg'}
                        alt={item.image?.altText || item.title}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {item.productTitle}
                          </h4>
                          {item.title !== 'Default Title' && (
                            <p className="text-sm text-muted-foreground truncate">
                              {item.title}
                            </p>
                          )}
                          <p className="text-sm font-medium text-foreground mt-1">
                            {formatPrice(item.price, item.currencyCode)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={isLoading}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={isLoading}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-sm font-medium">
                          {formatPrice(item.totalPrice, item.currencyCode)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalAmount, currencyCode)}</span>
                </div>
                {totalTaxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(totalTaxAmount, currencyCode)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount, currencyCode)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={!checkoutUrl || isLoading}
              >
                <span>Checkout</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                You'll be redirected to Shopify's secure checkout
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
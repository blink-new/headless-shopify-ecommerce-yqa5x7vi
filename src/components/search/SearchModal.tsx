import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { shopifyClient, SEARCH_PRODUCTS_QUERY } from '../../lib/shopify';
import { SearchProductsResponse } from '../../types/shopify';
import { transformProduct, debounce, formatPrice, getResponsiveImageUrl } from '../../lib/shopify-utils';
import { Product } from '../../types/shopify';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch?: (query: string) => void;
}

export function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        const response = await shopifyClient.request<SearchProductsResponse>(SEARCH_PRODUCTS_QUERY, {
          variables: {
            query: searchQuery,
            first: 10
          }
        });

        if (response.data?.products) {
          const transformedProducts = response.data.products.edges.map(edge => 
            transformProduct(edge.node)
          );
          setResults(transformedProducts);
        }
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleProductClick = (product: Product) => {
    window.location.href = `/products/${product.handle}`;
    onClose();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Search Products</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4"
              autoFocus
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </form>
        </div>

        {/* Search Results */}
        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="mt-4">
            {!hasSearched && !query && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start typing to search for products</p>
              </div>
            )}

            {hasSearched && !isLoading && results.length === 0 && query && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No products found for "{query}"</p>
                <p className="text-sm mt-2">Try different keywords or check your spelling</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </p>
                
                {results.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.images[0] ? getResponsiveImageUrl(product.images[0].url, 'thumbnail') : '/placeholder-product.svg'}
                        alt={product.images[0]?.altText || product.title}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {product.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-medium text-foreground">
                          {formatPrice(product.priceRange.min, product.priceRange.currencyCode)}
                          {product.priceRange.min !== product.priceRange.max && (
                            <span> - {formatPrice(product.priceRange.max, product.priceRange.currencyCode)}</span>
                          )}
                        </span>
                        {product.vendor && (
                          <Badge variant="secondary" className="text-xs">
                            {product.vendor}
                          </Badge>
                        )}
                      </div>
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {product.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
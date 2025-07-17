import React, { useState, useEffect } from 'react';
import { Filter, SortAsc, Grid, List, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ProductGrid } from '../products/ProductGrid';
import { shopifyClient, PRODUCTS_QUERY, SEARCH_PRODUCTS_QUERY } from '../../lib/shopify';
import { ProductsResponse, SearchProductsResponse } from '../../types/shopify';
import { transformProduct, debounce } from '../../lib/shopify-utils';
import { Product, ProductFilters, ProductSortOptions } from '../../types/shopify';
import { mockProducts } from '../../lib/mock-data';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortOptions, setSortOptions] = useState<ProductSortOptions>({
    sortBy: 'title',
    reverse: false
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Available filter options (these would typically come from your Shopify store)
  const availableVendors = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony'];
  const availableProductTypes = ['Electronics', 'Clothing', 'Shoes', 'Accessories'];
  const availableTags = ['new', 'sale', 'featured', 'bestseller', 'limited'];

  useEffect(() => {
    loadProducts();
  }, [searchQuery, filters, sortOptions]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);

      // Check if Shopify credentials are configured
      const hasShopifyCredentials = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN && 
                                   import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
      
      let transformedProducts: Product[] = [];

      if (hasShopifyCredentials) {
        // Use real Shopify API
        let response;
        
        if (searchQuery.trim()) {
          // Use search query
          response = await shopifyClient.request<SearchProductsResponse>(SEARCH_PRODUCTS_QUERY, {
            variables: {
              query: searchQuery,
              first: 50
            }
          });
        } else {
          // Load all products
          response = await shopifyClient.request<ProductsResponse>(PRODUCTS_QUERY, {
            variables: {
              first: 50
            }
          });
        }

        if (response.data?.products) {
          transformedProducts = response.data.products.edges.map(edge => 
            transformProduct(edge.node)
          );
        }
      } else {
        // Use mock data for demonstration
        console.log('Using mock data - configure Shopify credentials to connect to real store');
        transformedProducts = [...mockProducts];
        
        // Apply search to mock data
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          transformedProducts = transformedProducts.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.vendor.toLowerCase().includes(query) ||
            product.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
      }

      // Apply client-side filters
      transformedProducts = applyFilters(transformedProducts, filters);
      
      // Apply client-side sorting
      transformedProducts = applySorting(transformedProducts, sortOptions);

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Failed to load products, falling back to mock data:', error);
      // Fallback to mock data if Shopify API fails
      let transformedProducts = [...mockProducts];
      
      // Apply search to mock data
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        transformedProducts = transformedProducts.filter(product =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.vendor.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Apply client-side filters
      transformedProducts = applyFilters(transformedProducts, filters);
      
      // Apply client-side sorting
      transformedProducts = applySorting(transformedProducts, sortOptions);

      setProducts(transformedProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (products: Product[], filters: ProductFilters): Product[] => {
    return products.filter(product => {
      // Vendor filter
      if (filters.vendor && product.vendor !== filters.vendor) {
        return false;
      }

      // Product type filter
      if (filters.productType && product.productType !== filters.productType) {
        return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => product.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const { min, max } = filters.priceRange;
        const productMin = product.priceRange.min;
        const productMax = product.priceRange.max;
        
        if (min !== undefined && productMax < min) return false;
        if (max !== undefined && productMin > max) return false;
      }

      // Availability filter
      if (filters.availability) {
        const isAvailable = product.variants.some(variant => variant.availableForSale);
        if (filters.availability === 'available' && !isAvailable) return false;
        if (filters.availability === 'unavailable' && isAvailable) return false;
      }

      return true;
    });
  };

  const applySorting = (products: Product[], sortOptions: ProductSortOptions): Product[] => {
    const sorted = [...products].sort((a, b) => {
      switch (sortOptions.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price':
          return a.priceRange.min - b.priceRange.min;
        case 'created':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'updated':
          return new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
        default:
          return 0;
      }
    });

    return sortOptions.reverse ? sorted.reverse() : sorted;
  };

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of premium products
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search products..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Sort */}
          <Select
            value={`${sortOptions.sortBy}-${sortOptions.reverse}`}
            onValueChange={(value) => {
              const [sortBy, reverse] = value.split('-');
              setSortOptions({
                sortBy: sortBy as ProductSortOptions['sortBy'],
                reverse: reverse === 'true'
              });
            }}
          >
            <SelectTrigger className="w-full lg:w-48">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-false">Name A-Z</SelectItem>
              <SelectItem value="title-true">Name Z-A</SelectItem>
              <SelectItem value="price-false">Price Low-High</SelectItem>
              <SelectItem value="price-true">Price High-Low</SelectItem>
              <SelectItem value="created-true">Newest First</SelectItem>
              <SelectItem value="created-false">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Vendor Filter */}
                <div>
                  <h3 className="font-medium mb-3">Brand</h3>
                  <Select
                    value={filters.vendor || ''}
                    onValueChange={(value) => handleFilterChange('vendor', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All brands</SelectItem>
                      {availableVendors.map(vendor => (
                        <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Type Filter */}
                <div>
                  <h3 className="font-medium mb-3">Category</h3>
                  <Select
                    value={filters.productType || ''}
                    onValueChange={(value) => handleFilterChange('productType', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      {availableProductTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Filter */}
                <div>
                  <h3 className="font-medium mb-3">Availability</h3>
                  <Select
                    value={filters.availability || ''}
                    onValueChange={(value) => handleFilterChange('availability', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All products</SelectItem>
                      <SelectItem value="available">In stock</SelectItem>
                      <SelectItem value="unavailable">Out of stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange?.min || ''}
                      onChange={(e) => handleFilterChange('priceRange', {
                        ...filters.priceRange,
                        min: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange?.max || ''}
                      onChange={(e) => handleFilterChange('priceRange', {
                        ...filters.priceRange,
                        max: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                    />
                  </div>
                </div>

                <Separator />

                {/* Clear Filters */}
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.vendor && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Brand: {filters.vendor}
                <button
                  onClick={() => handleFilterChange('vendor', undefined)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.productType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {filters.productType}
                <button
                  onClick={() => handleFilterChange('productType', undefined)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.availability && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {filters.availability === 'available' ? 'In Stock' : 'Out of Stock'}
                <button
                  onClick={() => handleFilterChange('availability', undefined)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid 
          products={products} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
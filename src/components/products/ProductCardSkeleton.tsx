import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Image Skeleton */}
        <Skeleton className="aspect-square w-full" />
        
        {/* Content Skeleton */}
        <div className="p-4 space-y-3">
          {/* Vendor */}
          <Skeleton className="h-3 w-16" />
          
          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          {/* Tags */}
          <div className="flex space-x-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
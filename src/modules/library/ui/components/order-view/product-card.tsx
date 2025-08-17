/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Tag, Folder } from "lucide-react";
import ProductReviewForm from "./product-review-form";
import { Media, Product } from "@/payload-types";

interface ProductCardProps {
  product: Product;
  initialReview?: any;
}

export default function ProductCard({
  product,
  initialReview,
}: ProductCardProps) {
  const formattedPrice = (product.price / 100).toFixed(2);
  const image = product.image as Media;

  return (
    <Card className="overflow-hidden gap-3 bg-white dark:bg-gray-800 group shadow-lg hover:shadow-xl transition-all duration-300 border-0 ring-1 ring-gray-200 dark:ring-gray-700">
      <div className="relative">
        {image?.url && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-gray-900 font-semibold shadow-sm">
                ${formattedPrice || product.price}
              </Badge>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 line-clamp-2">
            {product.name}
          </h3>
        </div>
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mt-2">
            {product.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Category */}
        {product.category && typeof product.category !== "string" && (
          <div className="flex items-center space-x-2 text-sm">
            <Folder className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {product.category.name}
            </span>
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="space-y-2 flex items-center gap-2">
            <div className="flex items-center space-x-2 text-sm">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag: any) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Refund Policy */}
        {product.refundPolicy && (
          <div className="flex items-center space-x-2 text-sm">
            <ShoppingBag className="w-4 h-4 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">
              <span className="font-medium text-green-600 dark:text-green-400">
                {product.refundPolicy}
              </span>{" "}
              refund policy
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <ProductReviewForm productId={product.id} initialData={initialReview} />
      </CardFooter>
    </Card>
  );
}

import { Category } from "@/payload-types";
import { useCallback, useEffect, useRef, useState } from "react";

export const useResponsiveCategories = (categories: Category[]) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);
  
  const [visibleCount, setVisibleCount] = useState(categories.length);
  const [isCalculating, setIsCalculating] = useState(true);

  const calculateVisible = useCallback(() => {
    if (!containerRef.current || !measureRef.current || !viewAllRef.current) {
      return;
    }

    try {
      setIsCalculating(true);
      
      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth - 16; // Add some padding

      const items = Array.from(measureRef.current.children) as HTMLElement[];
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const itemWidth = rect.width + 8; // Add margin between items
        
        if (totalWidth + itemWidth > availableWidth) {
          break;
        }
        
        totalWidth += itemWidth;
        visible++;
      }

      // Ensure at least one category is always visible if there are categories
      const finalVisibleCount = Math.max(1, Math.min(visible, categories.length));
      setVisibleCount(finalVisibleCount);
    } catch (error) {
      console.error("Error calculating visible categories:", error);
      setVisibleCount(Math.min(3, categories.length)); // Fallback
    } finally {
      setIsCalculating(false);
    }
  }, [categories.length]);

  useEffect(() => {
    // Initial calculation with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(calculateVisible, 100);

    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize calculations
      clearTimeout(timeoutId);
      setTimeout(calculateVisible, 150);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [calculateVisible]);

  return {
    containerRef,
    measureRef,
    viewAllRef,
    visibleCount,
    isCalculating,
  };
};
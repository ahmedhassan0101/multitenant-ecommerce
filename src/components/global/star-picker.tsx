import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarPickerProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

export default function StarPicker({
  value,
  onChange,
  error,
  disabled,
}: StarPickerProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starIndex: number) => {
    if (!disabled) {
      onChange(starIndex);
    }
  };

  const handleStarHover = (starIndex: number) => {
    if (!disabled) {
      setHoverRating(starIndex);
    }
  };

  const handleStarLeave = () => {
    if (!disabled) {
      setHoverRating(0);
    }
  };
  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex flex-col space-y-1",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={cn(
                "p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1",
                !disabled && "hover:bg-yellow-100 dark:hover:bg-yellow-900/20",
                disabled && "cursor-not-allowed"
              )}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              onMouseLeave={handleStarLeave}
              disabled={disabled}
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  star <= (hoverRating || value)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600",
                  disabled && "opacity-70"
                )}
              />
            </button>
          ))}
        </div>
        {/* <span className="text-sm text-gray-600 dark:text-gray-400">
          {value > 0 ? `${value} out of 5 stars` : "Select rating"}
        </span> */}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

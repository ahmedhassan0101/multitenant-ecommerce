import { Star } from "lucide-react";
import { useState } from "react";

interface StarPickerProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export default function StarPicker({
  value,
  onChange,
  error,
}: StarPickerProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-1">
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || value)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                }`}
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

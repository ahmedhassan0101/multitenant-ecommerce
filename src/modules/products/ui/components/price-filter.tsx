import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAsCurrency } from "@/lib/utils";
import React, { ChangeEvent } from "react";

type Props = {
  minPrice?: string | null;
  maxPrice?: string | null;
  onChange: (field: "minPrice" | "maxPrice", value: string) => void;
};

export default function PriceFilter({ minPrice, maxPrice, onChange }: Props) {
  
  const handleChange = (field: "minPrice" | "maxPrice") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const numericValue = event.target.value.replace(/[^0-9.]/g, "");
      onChange(field, numericValue);
    };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="minPrice">Minimum Price</Label>
        <Input
          type="text"
          placeholder="$0"
          value={minPrice ? formatAsCurrency(minPrice) : ""}
          onChange={handleChange("minPrice")}
          id="minPrice"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="maxPrice">Maximum Price</Label>
        <Input
          type="text"
          placeholder="∞"
          value={maxPrice ? formatAsCurrency(maxPrice) : ""}
          onChange={handleChange("maxPrice")}
          id="maxPrice"
        />
      </div>
    </div>
  );
}

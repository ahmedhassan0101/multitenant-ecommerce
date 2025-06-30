import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatAsCurrency = (value: string): string => {
  if (!value) return "";

  const numericValue = value.replace(/[^0-9.]/g, "");
  const [whole, decimal] = numericValue.split(".");
  const cleanValue = whole + (decimal ? `.${decimal.slice(0, 2)}` : "");

  const numberValue = parseFloat(cleanValue);
  if (isNaN(numberValue)) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", // Format output as currency
    currency: "USD", // Use US Dollars
    maximumFractionDigits: 0, // Round to whole number
  }).format(Number(value)); // Convert value to number and apply formatting
}

export function generateTenantURL(tenantSlug: string) {
  return `/tenants/${tenantSlug}`;
}

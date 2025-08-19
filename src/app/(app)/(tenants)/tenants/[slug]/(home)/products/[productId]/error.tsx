"use client"; // Enables client-side rendering

import { TriangleAlertIcon } from "lucide-react";

// ErrorPage - Displays a fallback UI when an error occurs on the product page
const ErrorPage = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      {/* Container for error card with responsive padding */}
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <TriangleAlertIcon />
        <p className="text-base font-medium">Something went wrong</p>
      </div>
    </div>
  );
};

export default ErrorPage; // Export the error component as default

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import StarPicker from "@/components/global/star-picker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface ProductReviewFormProps {
  productId: string;

  initialData?: any; // Review object or null
}

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  description: z
    .string()
    .min(1, "Please write a review")
    .refine(
      (val) => val.trim().length <= 500,
      "Review must be 500 characters or less"
    ),
});
type ReviewFormData = z.infer<typeof reviewSchema>;

export default function ProductReviewForm({
  productId,

  initialData,
}: ProductReviewFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Track if the form is in preview mode (readonly) based on presence of initial review data
  const [isPreview, setIsPreview] = useState(!!initialData);

  // Mutations
  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: (newReview) => {
        // Update the multiple reviews cache
        const productIds = [productId];
        queryClient.setQueryData(
          trpc.reviews.getMultiple.queryKey({ productIds }),
          (oldData: Record<string, any> | undefined) => ({
            ...oldData,
            [productId]: newReview,
          })
        );

        setIsPreview(true);
        toast.success("Review submitted successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
        setIsPreview(false);
      },
    })
  );

  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: (updatedReview) => {
        // Update the multiple reviews cache
        const productIds = [productId];
        queryClient.setQueryData(
          trpc.reviews.getMultiple.queryKey({ productIds }),
          (oldData: Record<string, any> | undefined) => ({
            ...oldData,
            [productId]: updatedReview,
          })
        );

        setIsPreview(true);
        toast.success("Review updated successfully!");
      },
      onError: (error) => {
        toast.error(error.message);
        setIsPreview(false);
      },
    })
  );

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      description: initialData?.description || "",
    },
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        rating: initialData.rating,
        description: initialData.description,
      });
      setIsPreview(true);
    } else {
      form.reset({
        rating: 0,
        description: "",
      });
      setIsPreview(false);
    }
  }, [initialData, form, setIsPreview]);

  const onSubmit = (values: ReviewFormData) => {
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id,
        rating: values.rating,
        description: values.description,
      });
    } else {
      createReview.mutate({
        productId,
        rating: values.rating,
        description: values.description,
      });
    }
  };

  const watchedDescription = form.watch("description") || "";
  const isLoading = createReview.isPending || updateReview.isPending;

  return (
    <Card className="mt-6 w-full bg-gradient-to-br gap-2 from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-gray-700">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {isPreview ? "Your rating:" : "Liked it? Give it a rating"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating Stars */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <StarPicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPreview}
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Comment Textarea */}
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Review
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Share your experience with this product..."
                        {...field}
                        rows={4}
                        className="resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                        maxLength={500}
                        disabled={isPreview}
                      />
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {watchedDescription.length}/500 characters
                        </div>
                        {fieldState.error && (
                          <FormMessage className="text-xs" />
                        )}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {!isPreview && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <>{initialData ? "Update Review" : "Post Review"}</>
                  )}
                </Button>
              )}
              
              {isPreview && (
                <Button
                  type="button"
                  onClick={() => setIsPreview(false)}
                  variant="outline"
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20"
                >
                  Edit Review
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// export default function ProductReviewForm({
//   productId,
//   productName,
//   onSubmit,
// }: ProductReviewFormProps) {
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (rating === 0) {
//       alert("Please select a rating");
//       return;
//     }

//     setIsSubmitting(true);

//     const reviewData: ReviewData = {
//       productId,
//       rating,
//       comment: comment.trim(),
//     };

//     try {
//       if (onSubmit) {
//         await onSubmit(reviewData);
//       }

//       // Reset form after successful submission
//       setRating(0);
//       setComment("");
//       alert("Review submitted successfully!");
//     } catch (error) {
//       console.log("🚀 ~ handleSubmit ~ error:", error);
//       alert("Failed to submit review. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleStarClick = (starIndex: number) => {
//     setRating(starIndex);
//   };

//   const handleStarHover = (starIndex: number) => {
//     setHoverRating(starIndex);
//   };

//   const handleStarLeave = () => {
//     setHoverRating(0);
//   };

//   return (
//     <Card className="mt-6 w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-gray-700">
//       <CardHeader className="">
//         <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//           Rate & Review: {productName}
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Rating Stars */}

//           <div className="space-y-2">
//             <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               Your Rating *
//             </Label>
//             <div className="flex flex-col space-y-1">
//               <div>
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     type="button"
//                     className="p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
//                     onClick={() => handleStarClick(star)}
//                     onMouseEnter={() => handleStarHover(star)}
//                     onMouseLeave={handleStarLeave}
//                   >
//                     <Star
//                       className={`w-8 h-8 transition-colors ${
//                         star <= (hoverRating || rating)
//                           ? "fill-yellow-400 text-yellow-400"
//                           : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
//                       }`}
//                     />
//                   </button>
//                 ))}
//               </div>

//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 {rating > 0 ? `${rating} out of 5 stars` : "Select rating"}
//               </span>
//             </div>
//           </div>

//           {/* Comment Textarea */}
//           <div className="space-y-2">
//             <Label
//               htmlFor="comment"
//               className="text-sm font-medium text-gray-700 dark:text-gray-300"
//             >
//               Your Review (Optional)
//             </Label>
//             <Textarea
//               id="comment"
//               placeholder="Share your experience with this product..."
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               rows={4}
//               className="resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
//               maxLength={500}
//             />
//             <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
//               {comment.length}/500 characters
//             </div>
//           </div>

//           {/* Submit Button */}
//           <Button
//             type="submit"
//             disabled={rating === 0 || isSubmitting}
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isSubmitting ? (
//               <div className="flex items-center space-x-2">
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 <span>Submitting...</span>
//               </div>
//             ) : (
//               "Submit Review"
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
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

interface ProductReviewFormProps {
  productId: string;
}

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.trim().length <= 500,
      "Comment must be 500 characters or less"
    ),
});
type ReviewFormData = z.infer<typeof reviewSchema>;

export default function ProductReviewForm({
  productId,
}: ProductReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  // const handleReviewSubmit = (reviewData: any) => {
  //   console.log("Review data:", reviewData);

  //   // TODO: Implement review submission when API is ready
  //   // Example of what the API call might look like:
  //   /*
  //   try {
  //     await trpc.reviews.create.mutate({
  //       productId: reviewData.productId,
  //       orderId: orderId,
  //       rating: reviewData.rating,
  //       comment: reviewData.comment,
  //     });
  //   } catch (error) {
  //     console.error("Failed to submit review:", error);
  //     throw error; // Re-throw to be handled by the form
  //   }
  //   */

  //   // Simulate API delay for now
  //   // await new Promise(resolve => setTimeout(resolve, 1000));
  // };
  const handleSubmit = (values: ReviewFormData) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);

    // setIsSubmitting(true);

    // try {
    //   if (onSubmit) {
    //     await onSubmit({
    //       ...data,
    //       productId,
    //       comment: data.comment?.trim() || "",
    //     });
    //   }

    //   // Reset form after successful submission
    //   form.reset();
    //   toast.success("Review submitted successfully!", {
    //     description: "Thank you for your feedback!",
    //   });
    // } catch (error) {
    //   console.error("Error submitting review:", error);
    //   toast.error("Failed to submit review", {
    //     description: "Please try again later.",
    //   });
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  const watchedComment = form.watch("comment") || "";

  return (
    <Card className="mt-6 w-full bg-gradient-to-br gap-2 from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-gray-700">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Liked it? Give it a rating
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Rating Stars */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <StarPicker
                      // value={field.value}
                      // onChange={field.onChange}
                      {...field}
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Comment Textarea */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Review (Optional)
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Share your experience with this product..."
                        {...field}
                        rows={4}
                        className="resize-none border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {watchedComment.length}/500 characters
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                "Submit Review"
              )}
            </Button>
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

import { useState } from "react";
import { Button } from "@/shared/ui";
import { Star } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";
import { useAuth } from "@clerk/clerk-react";
import { trpc } from "@/trpc/trpc";

interface ProductReviewPopupProps {
  productName: string;
  productId: string;
  onSubmit?: (review: {
    rating: number;
    title: string;
    comment: string;
    productId: string;
  }) => void;
}

export default function ProductReviewPopup({
  productName,
  productId,
  onSubmit,
}: ProductReviewPopupProps) {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get mutation function for creating reviews
  const createReviewMutation = trpc.review.createReview.useMutation({
    onError: () => {
      setIsSubmitting(false);
      setError(t("products.reviewFailed") || "Failed to submit review");
    },
    onSuccess: () => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTitle("");
      setComment("");
      setRating(0);
    },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    if (!isSignedIn) {
      setError(
        t("products.signInRequired") ||
          "You must be signed in to leave a review"
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit directly with the mutation
      createReviewMutation.mutate({
        product: productId,
        rating,
        title,
        comment,
      });

      // Also call the onSubmit prop if provided (for compatibility)
      if (onSubmit) {
        onSubmit({
          rating,
          title,
          comment,
          productId,
        });
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      setError(
        t("products.reviewFailed") ||
          "Failed to submit review. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setRating(0);
    setTitle("");
    setComment("");
    setError(null);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(resetForm, 300);
  };

  // If modal is not open, just render the button
  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => {
          setIsOpen(true);
          if (!isSignedIn) {
            setError(
              t("products.signInRequired") ||
                "You must be signed in to leave a review"
            );
          } else {
            setError(null);
          }
        }}
      >
        {t("products.writeReview") || "Write a Review"}
      </Button>
    );
  }

  // Render modal when open
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6 shadow-lg">
        {!isSubmitted ? (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {t("products.reviewProduct", { product: productName }) ||
                  `Review ${productName}`}
              </h3>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </div>

            <div className="py-4">
              <div className="flex items-center justify-center space-x-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                    aria-label={`${t("products.rating") || "Rate"}`}
                    disabled={!isSignedIn || createReviewMutation.isError}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } ${
                        !isSignedIn || createReviewMutation.isError
                          ? "opacity-50"
                          : ""
                      }`}
                    />
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                placeholder={t("products.reviewTitle") || "Review Title"}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={!isSignedIn || createReviewMutation.isError}
              />

              <textarea
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setComment(e.target.value)
                }
                placeholder={
                  t("products.reviewPlaceholder") || "Write your review here..."
                }
                className="w-full min-h-[120px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={!isSignedIn || createReviewMutation.isError}
              />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={closeModal}
              >
                {t("common.cancel") || "Cancel"}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  rating === 0 ||
                  !title.trim() ||
                  isSubmitting ||
                  !isSignedIn ||
                  createReviewMutation.isError
                }
                className="bg-primary text-white"
              >
                {isSubmitting
                  ? t("common.submitting") || "Submitting..."
                  : t("products.submitReview") || "Submit Review"}
              </Button>
            </div>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium">
              {t("products.reviewThanks")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("products.reviewSubmitted")}
            </p>
            <Button
              onClick={closeModal}
              className="mt-4"
            >
              {t("common.close") || "Close"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useCommentTranslation } from "@/i18n/useReviewTranslation";
import { TranslateButton } from "@/shared/ui/TranslateButton";
import { Review } from "@/trpc/types";

const ReviewCard = ({ review }: { review: Review }) => {
  const {
    displayText,
    isTranslating,
    isTranslated,
    translationError,
    translateComment,
    resetTranslation,
  } = useCommentTranslation(review.comment);

  return (
    <div className="bg-white rounded-xl p-6 border">
      <div className="flex sm:flex-row flex-col justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-medium text-primary">
            {review.user?.toUpperCase() ||
              `${review?.userSurname} ${review?.userName}`}
          </span>
          <TranslateButton
            isTranslating={isTranslating}
            isTranslated={isTranslated}
            onTranslate={translateComment}
            onReset={resetTranslation}
          />
        </div>
        <div className="flex items-center gap-1">
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <span
                  key={i}
                  className={
                    i < review.rating ? "text-primary" : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
          </div>
          <span className="text-gray-400 text-sm">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <h4 className="font-medium mb-1 text-green-500">{review.title}</h4>
      <div className="text-gray-600">{displayText}</div>

      {translationError && (
        <div className="mt-2 text-red-500 text-sm">{translationError}</div>
      )}
    </div>
  );
};

export default ReviewCard;

import { Button } from "@/shared/ui";
import { Loader2, Languages } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface TranslateButtonProps {
  isTranslating: boolean;
  isTranslated: boolean;
  onTranslate: () => void;
  onReset?: () => void;
  className?: string;
}

export const TranslateButton = ({
  isTranslating,
  isTranslated,
  onTranslate,
  onReset,
  className = "",
}: TranslateButtonProps) => {
  const { t } = useTranslation();

  if (isTranslated && onReset) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className={`text-xs ${className} text-primary`}
      >
        {t("common.showOriginal")}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onTranslate}
      disabled={isTranslated}
      className={`text-xs ${className} text-primary`}
    >
      {isTranslating ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : (
        <Languages className="h-3 w-3" />
      )}
    </Button>
  );
};

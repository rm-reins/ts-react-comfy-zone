import { useState, useCallback } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { translateText } from "@/i18n/translationService";

export const useCommentTranslation = (
  originalText: string,
  originalLanguage?: string
) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const { language } = useTranslation();

  const translateComment = useCallback(async () => {
    if (isTranslated || (originalLanguage && originalLanguage === language)) {
      return;
    }

    setIsTranslating(true);
    setTranslationError(null);

    try {
      const translated = await translateText(originalText, language);

      setTranslatedText(translated);
      setIsTranslated(true);
    } catch (error) {
      setTranslationError(
        error instanceof Error ? error.message : `Failed to translate review`
      );
    } finally {
      setIsTranslating(false);
    }
  }, [originalText, language, originalLanguage, isTranslated]);

  const resetTranslation = useCallback(() => {
    setTranslatedText(null);
    setIsTranslated(false);
    setTranslationError(null);
  }, []);

  return {
    translatedText,
    isTranslating,
    translationError,
    isTranslated,
    translateComment,
    resetTranslation,
    displayText: isTranslated ? translatedText : originalText,
  };
};

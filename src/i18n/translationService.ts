import axios from "axios";
import { translationCache } from "./translationCacheService";

interface LanguageCodeMap {
  [key: string]: string;
}

const languageCodeMap: LanguageCodeMap = {
  enUS: "EN-US",
  deDE: "DE",
  ruRU: "RU",
};

export const translateText = async (
  text: string,
  targetLanguage: string
): Promise<string> => {
  try {
    if (translationCache.has(text, targetLanguage)) {
      const cachedTranslation = translationCache.get(text, targetLanguage);
      if (cachedTranslation) {
        return cachedTranslation;
      }
    }

    const response = await axios.post("/api/v1/translations/deepl", {
      text: [text],
      target_lang: languageCodeMap[targetLanguage],
    });

    const translatedText = response.data.translations[0].text;

    translationCache.set(text, targetLanguage, translatedText);

    return translatedText;
  } catch (error) {
    console.error("Translation error", error);
    throw error;
  }
};

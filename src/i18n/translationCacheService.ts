interface CacheEntry {
  translatedText: string;
  timestamp: number;
}

type TranslationCache = Record<string, CacheEntry>;

const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

class TranslationCacheService {
  private cache: TranslationCache = {};

  private getCacheKey(text: string, targetLanguage: string): string {
    return `${text}:${targetLanguage}`;
  }

  public has(text: string, targetLanguage: string): boolean {
    const cacheKey = this.getCacheKey(text, targetLanguage);
    const entry = this.cache[cacheKey];

    if (!entry) return false;

    const now = Date.now();
    return now - entry.timestamp < CACHE_EXPIRATION;
  }

  public get(text: string, targetLanguage: string): string | null {
    const cacheKey = this.getCacheKey(text, targetLanguage);
    const entry = this.cache[cacheKey];

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_EXPIRATION) {
      delete this.cache[cacheKey];
      return null;
    }

    return entry.translatedText;
  }

  public set(
    text: string,
    targetLanguage: string,
    translatedText: string
  ): void {
    const cacheKey = this.getCacheKey(text, targetLanguage);
    this.cache[cacheKey] = {
      translatedText,
      timestamp: Date.now(),
    };
  }

  public clear(): void {
    this.cache = {};
  }
}

export const translationCache = new TranslationCacheService();

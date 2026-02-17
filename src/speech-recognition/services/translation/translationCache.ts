import type { TranslationResult } from '../../types/translation';
import { TRANSLATION_CONFIG } from '../../constants/translation';

// 翻訳キャッシュ（パフォーマンス向上のため）
const translationCache = new Map<string, TranslationResult>();

// キャッシュキーを生成
const generateCacheKey = (text: string, targetLanguage: string, sourceLanguage?: string): string => {
  return `${text.toLowerCase().trim()}_${targetLanguage}_${sourceLanguage || TRANSLATION_CONFIG.SOURCE_LANGUAGE_AUTO}`;
};

// キャッシュから取得
export const getCachedTranslation = (
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): TranslationResult | null => {
  const cacheKey = generateCacheKey(text, targetLanguage, sourceLanguage);
  if (translationCache.has(cacheKey)) {
    const cached = translationCache.get(cacheKey)!;
    translationCache.delete(cacheKey);
    translationCache.set(cacheKey, cached);
    console.log('Translation cache hit:', cacheKey);
    return cached;
  }
  return null;
};

// キャッシュに保存
export const setCachedTranslation = (
  text: string,
  targetLanguage: string,
  sourceLanguage: string | undefined,
  result: TranslationResult
): void => {
  const cacheKey = generateCacheKey(text, targetLanguage, sourceLanguage);
  translationCache.set(cacheKey, result);
  
  // キャッシュサイズを制限（メモリ使用量を制御）
  if (translationCache.size > TRANSLATION_CONFIG.CACHE_SIZE) {
    const firstKey = translationCache.keys().next().value;
    if (firstKey) {
      translationCache.delete(firstKey);
    }
  }
};


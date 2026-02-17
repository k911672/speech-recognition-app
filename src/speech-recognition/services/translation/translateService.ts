import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import type { TranslationResult } from '../../types/translation';
import { TRANSLATION_CONFIG, TRANSLATION_ERROR_MESSAGES } from '../../constants/translation';
import { ERROR_MESSAGES } from '../../constants/transcription';
import { getCachedTranslation, setCachedTranslation } from './translationCache';

// AWS Translateクライアントの設定
const translateClient = new TranslateClient({
  region: import.meta.env.VITE_AWS_REGION || 'ap-northeast-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

// テキストを翻訳する
export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<TranslationResult> => {
  try {
    if (!text.trim()) {
      throw new Error(TRANSLATION_ERROR_MESSAGES.EMPTY_TEXT_ERROR);
    }

    // キャッシュをチェック
    const cached = getCachedTranslation(text, targetLanguage, sourceLanguage);
    if (cached) {
      return cached;
    }

    // AWS Translate APIを呼び出し
    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: sourceLanguage || TRANSLATION_CONFIG.SOURCE_LANGUAGE_AUTO,
      TargetLanguageCode: targetLanguage,
    });
    const response = await translateClient.send(command);

    // 翻訳結果を生成
    const result: TranslationResult = {
      originalText: text,
      translatedText: response.TranslatedText || '',
      sourceLanguage: response.SourceLanguageCode || TRANSLATION_CONFIG.SOURCE_LANGUAGE_AUTO,
      targetLanguage: response.TargetLanguageCode || targetLanguage,
      confidence: response.AppliedTerminologies?.length ? TRANSLATION_CONFIG.DEFAULT_CONFIDENCE : undefined,
    };

    // 結果をキャッシュに保存
    setCachedTranslation(text, targetLanguage, sourceLanguage, result);

    return result;
  } catch (error) {
    console.error('Translation error:', error);
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
    throw new Error(`${TRANSLATION_ERROR_MESSAGES.FAILED}: ${errorMessage}`);
  }
};


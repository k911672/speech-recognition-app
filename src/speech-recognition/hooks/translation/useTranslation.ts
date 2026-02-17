import { useCallback } from "react";
import type { TranscriptionSegment } from '../../types/transcription';
import { translateText } from '../../services/translation/translateService';

interface UseTranslationOptions {
  targetLanguage: string;
  updateSegmentById: (id: string, updater: (segment: TranscriptionSegment) => TranscriptionSegment) => void;
}

// 翻訳のセグメントを管理するフック
export const useTranslation = ({ targetLanguage, updateSegmentById }: UseTranslationOptions) => {
  // 翻訳処理
  const translateSegment = useCallback(async (segment: TranscriptionSegment): Promise<void> => {
    if (!segment.text || segment.translation || segment.isTranslating || segment.isPartial) {
      return;
    }

    try {
      // 翻訳中の状態を設定
      updateSegmentById(segment.id, s => ({ ...s, isTranslating: true }));

      // 翻訳を実行（AWS Translateが自動的に言語を検出）
      const translation = await translateText(
        segment.text,
        targetLanguage
      );

      // 翻訳結果を更新
      updateSegmentById(segment.id, s => ({ ...s, translation: translation, isTranslating: false }));
      
    } catch (error) {
      console.error('Translation error:', error);
      // 翻訳エラーの場合、翻訳中の状態を解除
      updateSegmentById(segment.id, s => ({ ...s, isTranslating: false }));
    }
  }, [targetLanguage, updateSegmentById]);

  return { translateSegment };
};

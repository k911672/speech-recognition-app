import { useState, useCallback } from 'react';
import type { TranscriptionSegment } from '../../types/transcription';
import { MESSAGES, ERROR_MESSAGES } from '../../constants/transcription';
import type { TranscribeService } from '../../services/transcription/transcribeService';

interface UseTranscriptionControlOptions {
  getService: () => TranscribeService | null;
  setSegmentsArray: (segments: TranscriptionSegment[]) => void;
  handleError: (error: Error | null, prefix?: string) => void;
}

// 文字起こしの開始/停止ロジックを管理するフック
export const useTranscriptionControl = ({
  getService,
  setSegmentsArray,
  handleError,
}: UseTranscriptionControlOptions) => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  // 文字起こし開始
  const startTranscription = useCallback(async () => {
    try {
      setIsTranscribing(true);
      
      // システムメッセージを設定（segmentsには追加しない）
      setSystemMessage(MESSAGES.START_RECOGNITION);
      
      // セグメント配列を空で初期化
      setSegmentsArray([]);
      
      const service = getService();
      if (service) {
        await service.startTranscription();
      }
    } catch (error) {
      console.error('Error starting transcription:', error);
      handleError(error as Error, ERROR_MESSAGES.START_FAILED);
      setIsTranscribing(false);
      setSystemMessage(null);
    }
  }, [getService, setSegmentsArray, handleError]);

  // 文字起こし停止
  const stopTranscription = useCallback(() => {
    handleError(null);
    const service = getService();
    if (service) {
      service.stopTranscription();
    }
    setIsTranscribing(false);
    setSegmentsArray([]);
    setSystemMessage(null);
  }, [getService, setSegmentsArray, handleError]);

  return {
    isTranscribing,
    systemMessage,
    startTranscription,
    stopTranscription,
  };
};

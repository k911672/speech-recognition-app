import { useEffect, useRef, useCallback } from 'react';
import TranscribeService, { type TranscriptionResult } from '../../services/transcription/transcribeService';

interface UseTranscriptionServiceOptions {
  onTranscript: (result: TranscriptionResult) => void;
  onError: (error: Error) => void;
}

// TranscribeServiceの初期化とライフサイクル管理を行うフック
export const useTranscriptionService = ({
  onTranscript,
  onError,
}: UseTranscriptionServiceOptions) => {
  const transcribeServiceRef = useRef<TranscribeService | null>(null);

  // TranscribeServiceの初期化
  useEffect(() => {
    transcribeServiceRef.current = new TranscribeService();
    
    // コールバック関数を設定
    transcribeServiceRef.current.setCallbacks({
      onTranscript,
      onError,
    });
    
    return () => {
      if (transcribeServiceRef.current?.isActive()) {
        transcribeServiceRef.current.stopTranscription();
      }
    };
  }, [onTranscript, onError]);

  // TranscribeServiceインスタンスを取得する関数
  const getService = useCallback((): TranscribeService | null => {
    return transcribeServiceRef.current;
  }, []);

  return { getService };
};

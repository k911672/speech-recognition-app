import React, { useCallback } from 'react';
import { Paper, Alert, Stack } from '@mantine/core';
import ControlButton from '../../common/components/Button/ControlButton';
import { useTranscriptionSegments } from '../hooks/transcription/useTranscriptionSegments';
import { useTranslation } from '../hooks/translation/useTranslation';
import { useErrorHandler } from '../../common/hooks/useErrorHandler';
import { useTranscriptionService } from '../hooks/transcription/useTranscriptionService';
import { useTranscriptionControl } from '../hooks/transcription/useTranscriptionControl';
import type { TranscriptionResult } from '../services/transcription/transcribeService';
import type { TranscriptionSegment } from '../types/transcription';
import { BUTTON_TEXT } from '../constants/transcription';
import { TRANSLATION_CONFIG } from '../constants/translation';
import { generateUniqueId } from '../../common/utils/idGenerator';
import TranscriptionResults from './TranscriptionResults';

const StandaloneTranscription: React.FC = () => {
  const { segments: transcriptionSegments, updatePartialSegment, addFinalSegment, updateSegmentById, setSegmentsArray } = useTranscriptionSegments();
  const { translateSegment } = useTranslation({ 
    targetLanguage: TRANSLATION_CONFIG.TARGET_LANGUAGE, 
    updateSegmentById 
  });
  const { handleError, error } = useErrorHandler();

  // 文字起こし結果の処理
  const handleTranscript = useCallback((result: TranscriptionResult) => {
    if (result.isPartial) {
      // 部分的な結果を更新
      updatePartialSegment(result.transcript);
    } else {
      // 最終結果を追加
      const finalSegment: TranscriptionSegment = {
        id: generateUniqueId(),
        text: result.transcript,
        timestamp: new Date(),
        isPartial: false,
      };
      
      addFinalSegment(finalSegment);
      
      // 翻訳を実行
      if (result.transcript.trim()) {
        translateSegment(finalSegment);
      }
    }
  }, [updatePartialSegment, addFinalSegment, translateSegment]);

  // TranscribeServiceの初期化と管理
  const { getService } = useTranscriptionService({
    onTranscript: handleTranscript,
    onError: handleError,
  });

  // 文字起こしの制御
  const { isTranscribing, systemMessage, startTranscription, stopTranscription } = useTranscriptionControl({
    getService,
    setSegmentsArray,
    handleError,
  });

  return (
    <Paper
      p="xl"
      withBorder
      shadow="sm"
      w="100%"
      maw="100%"
      mih="50vh"
      styles={{
        root: {
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
        },
      }}
    >
      <Stack gap="md">
        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}
        
        {/* ワンクリックコントロールボタン */}
        <ControlButton
          onClick={isTranscribing ? stopTranscription : startTranscription}
          variant="contained"
          color={isTranscribing ? "inherit" : "primary"}
        >
          {isTranscribing ? BUTTON_TEXT.STOP : BUTTON_TEXT.START}
        </ControlButton>

        {/* リアルタイム文字起こし結果 */}
        <TranscriptionResults segments={transcriptionSegments} systemMessage={systemMessage} isTranscribing={isTranscribing} />
      </Stack>
    </Paper>
  );
};

export default StandaloneTranscription;

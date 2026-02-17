import React, { useRef } from 'react';
import { Stack, Alert, Paper, Flex, Center, Text } from '@mantine/core';
import TranscriptionColumn from './TranscriptionColumn';
import type { TranscriptionSegment } from '../types/transcription';
import { MESSAGES, COLUMN_CONFIG } from '../constants/transcription';
import { useAutoScroll } from '../../common/hooks/useAutoScroll';

interface TranscriptionResultsProps {
  segments: TranscriptionSegment[];
  systemMessage: string | null;
  isTranscribing: boolean;
}

const TranscriptionResults: React.FC<TranscriptionResultsProps> = ({ segments, systemMessage, isTranscribing }) => {
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const { scrollToBottom } = useAutoScroll();

  // 新しいセグメントが追加されたときに自動スクロール
  React.useEffect(() => {
    if (segments.length > 0) {
      // 少し遅延させてDOMの更新を待つ
      setTimeout(() => {
        scrollToBottom(leftColumnRef);
        scrollToBottom(rightColumnRef);
      }, 100);
    }
  }, [segments, scrollToBottom]);

  return (
    <Stack gap="md" mt="md" style={{ flex: 1 }}>
      {/* システムメッセージ（枠外） */}
      {systemMessage && (
        <Alert
          color="blue"
          variant="light"
          styles={{
            root: {
              textAlign: 'center',
            },
            message: {
              fontSize: '20px',
              fontWeight: 600,
            },
          }}
        >
          {systemMessage}
        </Alert>
      )}
      
      <Paper
        withBorder
        p="md"
        bg="gray.0"
        mih="70vh"
        mah="80vh"
        style={{ overflow: 'hidden' }}
      >
        {isTranscribing ? (
          <Flex
            gap="md"
            h="100%"
            mih="60vh"
            style={{ overflow: 'hidden' }}
          >
            {/* 左側：黄色のブロック（日本語のストリーミング認識） */}
            <TranscriptionColumn
              segments={segments}
              columnRef={leftColumnRef}
              config={COLUMN_CONFIG.JAPANESE}
            />
            
            {/* 右側：緑のブロック（英語の翻訳結果） */}
            <TranscriptionColumn
              segments={segments}
              columnRef={rightColumnRef}
              config={COLUMN_CONFIG.ENGLISH}
            />
          </Flex>
        ) : (
          <Center h="100%" mih="60vh">
            <Stack align="center" gap="xs">
              <Text c="dimmed" size="md">{MESSAGES.NO_RESULTS}</Text>
              <Text c="dimmed" size="sm">{MESSAGES.NO_RESULTS_HINT}</Text>
            </Stack>
          </Center>
        )}
      </Paper>
    </Stack>
  );
};

export default TranscriptionResults;


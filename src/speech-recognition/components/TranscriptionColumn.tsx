import React from 'react';
import { Paper, Box, Card, Group, Badge, Text, ScrollArea } from '@mantine/core';
import type { TranscriptionSegment } from '../types/transcription';

interface ColumnConfig {
  TITLE: string;
  SPEAKER_LABEL: string;
  BORDER_COLOR: string;
  HEADER_BG: string;
  HEADER_COLOR: string;
  SEGMENT_BG: string;
  SEGMENT_BORDER_COLOR: string;
  IS_PARTIAL: boolean;
  filterFunction: (segment: TranscriptionSegment) => boolean;
  getDisplayText: (segment: TranscriptionSegment) => string;
}

interface TranscriptionColumnProps {
  segments: TranscriptionSegment[];
  columnRef: React.RefObject<HTMLDivElement>;
  config: ColumnConfig;
}

const TranscriptionColumn = ({ segments, columnRef, config }: TranscriptionColumnProps) => {
  const { 
    TITLE: title, 
    SPEAKER_LABEL: speakerLabel, 
    BORDER_COLOR: borderColor,
    HEADER_BG: headerBg,
    HEADER_COLOR: headerColor,
    SEGMENT_BG: segmentBg,
    SEGMENT_BORDER_COLOR: segmentBorderColor,
    IS_PARTIAL: isPartial,
    filterFunction, 
    getDisplayText 
  } = config;

  return (
    <Paper
      withBorder
      style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: 'calc(50% - 10px)',
        height: '60vh',
        maxHeight: '60vh',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: `var(--mantine-color-${borderColor.replace('.', '-')})`,
      }}
    >
      {/* Column Header */}
      <Box
        bg={headerBg}
        p="md"
        style={{ 
          borderBottom: `2px solid var(--mantine-color-${borderColor.replace('.', '-')})`,
          textAlign: 'center',
        }}
      >
        <Text fw={700} size="lg" c={headerColor}>
          {title}
        </Text>
      </Box>

      {/* Column Content */}
      <ScrollArea 
        style={{ flex: 1 }} 
        p="md"
        viewportRef={columnRef}
        scrollbarSize={6}
      >
        {segments
          .filter(filterFunction)
          .map((segment) => (
            <Card
              key={segment.id}
              withBorder
              mb="sm"
              p="md"
              bg={segmentBg}
              styles={{
                root: {
                  borderLeft: `6px solid var(--mantine-color-${segmentBorderColor.replace('.', '-')})`,
                  borderTop: `3px solid var(--mantine-color-${segmentBorderColor.replace('.', '-')})`,
                  animation: isPartial ? 'pulse 2s infinite' : undefined,
                  position: 'relative',
                },
              }}
            >
              <Group justify="space-between" mb="xs">
                <Badge 
                  variant="light" 
                  color={isPartial ? 'orange' : 'green'}
                  size="lg"
                >
                  {speakerLabel}
                </Badge>
                <Text size="sm" c="dimmed" ff="monospace">
                  {segment.timestamp.toLocaleTimeString()}
                </Text>
              </Group>
              <Text 
                size="xl" 
                fw={600} 
                style={{ 
                  lineHeight: 1.6,
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                }}
              >
                {getDisplayText(segment)}
              </Text>
              
              {/* Status indicator */}
              <Text
                size="md"
                fw="bold"
                c={isPartial ? 'orange' : 'green'}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                }}
              >
                {isPartial ? '●' : '✓'}
              </Text>
            </Card>
          ))
        }
      </ScrollArea>
      
      {/* Pulse animation keyframes */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Paper>
  );
};

export default TranscriptionColumn;


import { useState, useCallback } from "react";
import type{ TranscriptionSegment } from "../../types/transcription";
import { generateUniqueId } from "../../../common/utils/idGenerator";

// 文字起こしのセグメントを管理するフック
export const useTranscriptionSegments = () => {
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);

  // 部分的な結果(文字起こし途中の文字)を更新または追加
  const updatePartialSegment = useCallback((transcript: string, confidence?: number) => {
    setSegments(prev => {
      const existingIndex = prev.findIndex(s => s.isPartial);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          text: transcript,
          confidence
        };
        return updated;
      } else {
        return [...prev, {
          id: generateUniqueId(),
          text: transcript,
          timestamp: new Date(),
          isPartial: true,
          confidence
        }];
      }
    });
  }, []);

  // 最終結果(文字起こし完了後の文字)を追加する
  // 最終結果を追加するのに使われている
  const addFinalSegment = useCallback((segment: TranscriptionSegment) => {
    setSegments(prev => {
      const filtered = prev.filter(s => !s.isPartial); // 部分的な結果を削除
      return [...filtered, segment];
    });
  }, []);

  // 特定のIDのセグメントのプロパティを更新
  // 翻訳の状態を更新するのに使われている
  const updateSegmentById = useCallback((
    id: string,
    updater: (segment: TranscriptionSegment) => TranscriptionSegment
  ) => {
    setSegments(prev =>
      prev.map(s => s.id === id ? updater(s) : s)
    );
  }, []);

  return {
    segments,
    updatePartialSegment,
    addFinalSegment,
    updateSegmentById,
    // setSegmentsは useState の setter なので参照が安定しており、useCallback不要
    setSegmentsArray: setSegments
  };
};

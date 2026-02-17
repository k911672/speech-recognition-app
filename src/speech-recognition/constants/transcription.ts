// src/features/transcription/constants/transcription.ts

import type { TranscriptionSegment } from '../types/transcription';

export const MESSAGES = {
  START_RECOGNITION: '🎙️ 音声認識を開始しました。',
  NO_RESULTS: '文字起こしの結果がありません',
  NO_RESULTS_HINT: '「翻訳開始」ボタンをクリックして開始してください',
}

export const BUTTON_TEXT = {
  START: '翻訳開始',
  STOP: '🛑 全て停止',
}

export const COLUMN_CONFIG = {
  JAPANESE: {
    TITLE: '日本語',
    SPEAKER_LABEL: '話者',
    BORDER_COLOR: 'orange.5',
    HEADER_BG: 'orange.1',
    HEADER_COLOR: 'orange.7',
    SEGMENT_BG: 'orange.0',
    SEGMENT_BORDER_COLOR: 'orange.5',
    IS_PARTIAL: true,
    filterFunction: () => true,
    getDisplayText: (segment: TranscriptionSegment) => segment.text,
  },
  ENGLISH: {
    TITLE: 'English',
    SPEAKER_LABEL: 'Speaker',
    BORDER_COLOR: 'green.5',
    HEADER_BG: 'green.1',
    HEADER_COLOR: 'green.7',
    SEGMENT_BG: 'green.0',
    SEGMENT_BORDER_COLOR: 'green.5',
    IS_PARTIAL: false,
    filterFunction: (segment: TranscriptionSegment) => !segment.isPartial && !!segment.translation,
    getDisplayText: (segment: TranscriptionSegment) => segment.translation?.translatedText || '',
  },
}

export const TRANSCRIBE_CONFIG = {
  LANGUAGE_CODE: 'ja-JP',
  PARTIAL_RESULTS_STABILITY: 'high',
} as const;

export const ERROR_MESSAGES = {
  START_FAILED: '文字起こし開始に失敗しました',
  STOP_FAILED: '音声認識の停止に失敗しました',
  TRANSLATION_FAILED: '翻訳に失敗しました',
  // 共通エラー
  UNKNOWN_ERROR: 'Unknown error',
  // AWS関連
  AWS_CREDENTIALS_INVALID: 'AWS認証情報が正しく設定されていません。環境変数を確認してください。',
  AWS_REGION_INVALID: 'AWSリージョンが正しく設定されていません。',
  TRANSCRIBE_BAD_REQUEST: 'Transcribe Streamingの設定に問題があります。設定を確認してください。',
  TRANSCRIBE_UNAUTHORIZED: 'Transcribe Streamingの権限がありません。IAMポリシーを確認してください。',
  TRANSCRIBE_THROTTLING: 'リクエストが多すぎます。しばらく待ってから再試行してください。',
  TRANSCRIBE_UNKNOWN_ERROR: 'Transcribe Streamingで不明なエラーが発生しました。',
  // マイク関連
  MIC_NOT_ALLOWED: 'マイクへのアクセスが拒否されました。ブラウザの設定でマイクの許可を確認してください。',
  MIC_NOT_FOUND: 'マイクが見つかりません。マイクが接続されているか確認してください。',
  BROWSER_NOT_SUPPORTED: 'このブラウザでは音声認識がサポートされていません。',
  // AudioWorklet関連
  AUDIOWORKLET_INIT_FAILED: 'AudioWorklet initialization failed',
};
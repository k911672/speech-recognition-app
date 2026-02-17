// 音声処理の基本設定
export const AUDIO_CONFIG = {
  MEDIA_ENCODING: 'pcm',
  SAMPLE_RATE: 16000,  // 音声サンプリングレート（Hz）
  CHANNEL_COUNT: 1,
  SAMPLE_SIZE: 16,
};

// AudioWorklet関連の設定
export const AUDIOWORKLET_CONFIG = {
  PROCESSOR_NAME: 'audio-processor',
  BUFFER_SIZE: 2048,
};

// エラーメッセージ
export const AUDIO_ERROR_MESSAGES = {
  AUDIO_CONTEXT_NOT_INITIALIZED: 'AudioContext is not initialized',
  AUDIO_DATA_SEND_FAILED: '音声データの送信に失敗しました',

};
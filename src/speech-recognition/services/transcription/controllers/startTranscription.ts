import { type TranscriptionCallbacks } from '../transcribeService';
import { AudioStream, TranscribeStreamingClient } from '@aws-sdk/client-transcribe-streaming';
import { AudioProcessor } from '../utils/audioProcessor';
import { ERROR_MESSAGES } from '../../../constants/transcription';
import { mapBrowserError } from '../../../../common/utils/errorMapper';
import { startTranscribeStreaming } from './transcribeStreaming';

// マイクからの音声ストリームを取得して文字起こしを開始する関数
export async function startTranscription(
  client: TranscribeStreamingClient,
  callbacks: TranscriptionCallbacks | null,
  isStreamingRef: { current: boolean }
): Promise<{
  audioWorkletNode: AudioWorkletNode;
  audioStream: ReadableStream<AudioStream>;
  currentStream: MediaStream;
}> {
  try {
    isStreamingRef.current = true;
    // マイクアクセスの取得（日本語音声認識最適化設定）
    const currentStream = await AudioProcessor.getUserMediaStream();

    // AudioContextの取得
    const audioContext = await AudioProcessor.getAudioContext();

    // AudioContextが停止状態の場合は再開
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // AudioWorkletを使用
    const audioWorkletNode = await AudioProcessor.initializeAudioWorklet();
    
    if (!audioWorkletNode) {
      throw new Error(ERROR_MESSAGES.AUDIOWORKLET_INIT_FAILED);
    }

    // 音声ストリームの作成（audioWorkletNodeを渡す）
    const audioStream = AudioProcessor.createAudioStream(audioWorkletNode, callbacks);

    // 音声ストリームのソースを作成
    const source = audioContext.createMediaStreamSource(currentStream);
    source.connect(audioWorkletNode);
    audioWorkletNode.connect(audioContext.destination);

    // Transcribe Streamingの開始
    await startTranscribeStreaming(client, callbacks!, audioStream, isStreamingRef);

    return {
      audioWorkletNode,
      audioStream,
      currentStream
    };

  } catch (error) {
    console.error('Transcription error:', error);
    isStreamingRef.current = false;
    
    // エラーの種類に応じて適切なメッセージを表示
    let errorMessage = ERROR_MESSAGES.START_FAILED;
    if (error instanceof Error) {
      errorMessage = mapBrowserError(error);
    }
    
    callbacks?.onError(new Error(errorMessage));
    throw error;
  }
}

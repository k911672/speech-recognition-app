import { type TranscriptionCallbacks } from '../transcribeService';
import { AudioProcessor } from '../utils/audioProcessor';
import { ERROR_MESSAGES } from '../../../constants/transcription';

// 文字起こし停止を行う関数
export async function stopTranscription(
  audioWorkletNode: AudioWorkletNode | null,
  currentStream: MediaStream | null,
  callbacks: TranscriptionCallbacks | null,
  isStreamingRef: { current: boolean }
): Promise<void> {
  isStreamingRef.current = false;
  
  try {
    // AudioWorkletNodeのクリーンアップ
    if (audioWorkletNode) {
      audioWorkletNode.disconnect();
      audioWorkletNode.port.close();
    }

    // AudioContextのクローズ
    AudioProcessor.closeAudioContext();

    // MediaStreamのクリーンアップ
    if (currentStream) {
      currentStream.getTracks().forEach(track => {
        track.stop();
      });
    }

    console.log('Transcription stopped');
  } catch (error) {
    console.error('Error stopping transcription:', error);
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
    callbacks?.onError(new Error(`${ERROR_MESSAGES.STOP_FAILED}: ${errorMessage}`));
  }
}

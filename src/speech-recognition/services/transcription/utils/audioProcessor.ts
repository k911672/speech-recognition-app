import type { TranscriptionCallbacks } from '../transcribeService';
import type { AudioStream } from '@aws-sdk/client-transcribe-streaming';
import { AUDIOWORKLET_CONFIG, AUDIO_ERROR_MESSAGES, AUDIO_CONFIG } from '../../../../common/constants/audio';

// 音声処理関連のクラス
export class AudioProcessor {
  private static audioContext: AudioContext | null = null;

  // ============================================
  // 初期化・取得系（処理フロー順）
  // ============================================

  // 1. マイクからの音声ストリーム取得
  static async getUserMediaStream(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
        channelCount: AUDIO_CONFIG.CHANNEL_COUNT,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleSize: AUDIO_CONFIG.SAMPLE_SIZE,
      },
    });
  }

  // 2. AudioContextの取得（シングルトン）
  static async getAudioContext(): Promise<AudioContext> {
    // 既存のインスタンスがあり、closedでなければそれを返す
    if (this.audioContext && this.audioContext.state !== 'closed') {
      return this.audioContext;
    }
    const audioContext = new AudioContext({
      sampleRate: AUDIO_CONFIG.SAMPLE_RATE
    });
    this.audioContext = audioContext;
    return audioContext;
  }

  // 3. AudioWorkletの初期化
  static async initializeAudioWorklet(): Promise<AudioWorkletNode | null> {
    try {
      if (!AudioProcessor.audioContext) {
        throw new Error(AUDIO_ERROR_MESSAGES.AUDIO_CONTEXT_NOT_INITIALIZED);
      }
      // AudioWorkletモジュールを読み込み
      await AudioProcessor.audioContext.audioWorklet.addModule('/audio-processor.js');
      // AudioWorkletNodeを作成
      const audioWorkletNode = await AudioProcessor.createAudioWorkletNode();

      return audioWorkletNode;
    } catch (error) {
      console.error('Failed to initialize AudioWorklet:', error);
      return null;
    }
  }

  // 4. 音声ストリームの作成
  static createAudioStream(
    audioWorkletNode: AudioWorkletNode,
    callbacks: TranscriptionCallbacks | null
  ): ReadableStream<AudioStream> {
    return new ReadableStream<AudioStream>({
      start(controller) {
        // AudioWorkletからのメッセージを直接処理
        audioWorkletNode.port.onmessage = (event) => {
          const { type, audioData } = event.data;
          
          if (type === 'audioData') {
            try {
              // Float32ArrayをPCM16に変換
              const pcmData = AudioProcessor.convertFloat32ToPCM16(audioData);
              
              // 音声データをストリームに直接enqueue
              const audioEvent: AudioStream = {
                AudioEvent: {
                  AudioChunk: new Uint8Array(pcmData.buffer)
                }
              };
              
              controller.enqueue(audioEvent);
            } catch (error) {
              console.error('Error processing audio data:', error);
              callbacks?.onError(
                new Error(`${AUDIO_ERROR_MESSAGES.AUDIO_DATA_SEND_FAILED}: ${error instanceof Error ? error.message : 'Unknown error'}`)
              );
            }
          }
        };
      }
    });
  }

  // ============================================
  // 内部処理（private）
  // ============================================

  // AudioWorkletNodeの作成（initializeAudioWorkletから呼ばれる）
  private static async createAudioWorkletNode(): Promise<AudioWorkletNode> {
    if (!AudioProcessor.audioContext) {
      throw new Error(AUDIO_ERROR_MESSAGES.AUDIO_CONTEXT_NOT_INITIALIZED);
    }
    const audioWorkletNode = new AudioWorkletNode(
      AudioProcessor.audioContext, 
      AUDIOWORKLET_CONFIG.PROCESSOR_NAME
    );

    // AudioWorkletの設定
    audioWorkletNode.port.postMessage({
      type: 'configure',
      data: {
        bufferSize: AUDIOWORKLET_CONFIG.BUFFER_SIZE
      }
    });

    return audioWorkletNode;
  }

  // Float32ArrayをPCM16に変換（createAudioStreamから呼ばれる）
  private static convertFloat32ToPCM16(float32Array: Float32Array): Int16Array {
    const pcm16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16Array[i] = sample < 0 
        ? sample * 0x8000 
        : sample * 0x7FFF;
    }
    return pcm16Array;
  }

  // ============================================
  // クリーンアップ
  // ============================================

  // AudioContextのクローズ
  static closeAudioContext(): void {
    if (AudioProcessor.audioContext) {
      AudioProcessor.audioContext.close();
      AudioProcessor.audioContext = null;
    }
  }
}

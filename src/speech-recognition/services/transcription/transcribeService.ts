import { 
  TranscribeStreamingClient
} from '@aws-sdk/client-transcribe-streaming';
import { stopTranscription } from './controllers/stopTranscription';
import { startTranscription } from './controllers/startTranscription';

export interface TranscriptionResult {
  transcript: string;
  isPartial: boolean;
  startTime?: number;
  endTime?: number;
}

export interface TranscriptionCallbacks {
  onTranscript: (result: TranscriptionResult) => void;
  onError: (error: Error) => void;
}

export class TranscribeService {
  private client: TranscribeStreamingClient;
  private callbacks: TranscriptionCallbacks | null = null;
  private audioWorkletNode: AudioWorkletNode | null = null;
  private currentStream: MediaStream | null = null;
  // ストリーミング状態をインスタンスで管理（refオブジェクトとして関数に渡す）
  private isStreamingRef = { current: false };

  constructor(region: string = 'ap-northeast-1') {
    // AWS認証情報の設定（Vite環境変数）
    const credentials = {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || ''
    };
    // リージョンの設定
    const awsRegion = import.meta.env.VITE_AWS_REGION || region;
    this.client = new TranscribeStreamingClient({ 
      region: awsRegion,
      credentials: credentials.accessKeyId && credentials.secretAccessKey ? credentials : undefined
    });
  }

  // コールバック関数を設定
  setCallbacks(callbacks: TranscriptionCallbacks) {
    this.callbacks = callbacks;
  }

  // 文字起こし開始
  async startTranscription(): Promise<void> {
    const resources = await startTranscription(
      this.client,
      this.callbacks,
      this.isStreamingRef
    );
    this.audioWorkletNode = resources.audioWorkletNode;
    this.currentStream = resources.currentStream;
  }

  // 文字起こし停止
  async stopTranscription(): Promise<void> {
    await stopTranscription(
      this.audioWorkletNode,
      this.currentStream,
      this.callbacks,
      this.isStreamingRef
    );
  }

  // 文字起こしの状態を確認
  isActive(): boolean {
    return this.isStreamingRef.current;
  }
}

export default TranscribeService;

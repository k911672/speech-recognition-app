import { type TranscriptionCallbacks, type TranscriptionResult } from '../transcribeService';
import { AudioStream, StartStreamTranscriptionCommand, TranscribeStreamingClient } from '@aws-sdk/client-transcribe-streaming';
import { ERROR_MESSAGES, TRANSCRIBE_CONFIG } from '../../../constants/transcription';
import { AUDIO_CONFIG } from '../../../../common/constants/audio';
import { mapAwsError } from '../../../../common/utils/errorMapper';

// AWS Transcribe Streamingとの通信を担当する関数
export async function startTranscribeStreaming(
  client: TranscribeStreamingClient,
  callbacks: TranscriptionCallbacks,
  audioStream: ReadableStream<AudioStream>,
  isStreamingRef: { current: boolean }
): Promise<void> {
  try {
    // Transcribe StreamingのAPIを呼び出し
    const commandParams: any = {
      LanguageCode: TRANSCRIBE_CONFIG.LANGUAGE_CODE,
      MediaEncoding: AUDIO_CONFIG.MEDIA_ENCODING,
      MediaSampleRateHertz: AUDIO_CONFIG.SAMPLE_RATE,
      AudioStream: audioStream as any,
      EnablePartialResultsStabilization: true,
      PartialResultsStability: TRANSCRIBE_CONFIG.PARTIAL_RESULTS_STABILITY, 
      ShowSpeakerLabel: false,
    };
    const command = new StartStreamTranscriptionCommand(commandParams);
    const response = await client.send(command);
    
    // ストリーミング結果の処理
    if (response.TranscriptResultStream) {
      for await (const event of response.TranscriptResultStream) {
        // ストリーミングが停止された場合はループを抜ける
        if (!isStreamingRef.current) {
          break;
        }
        
        // ストリーミング結果の処理
        if (event.TranscriptEvent?.Transcript?.Results) {
          for (const result of event.TranscriptEvent.Transcript.Results) {
            if (result.Alternatives && result.Alternatives.length > 0) {
              const alternative = result.Alternatives[0];
              
              // ストリーミング結果のテキスト
              const transcript = alternative.Transcript || '';
              
              // ストリーミング結果のオブジェクト
              const transcriptionResult: TranscriptionResult = {
                transcript: transcript,
                isPartial: result.IsPartial || false,
                startTime: result.StartTime,
                endTime: result.EndTime,
              };
              
              callbacks?.onTranscript(transcriptionResult);
            }
          }
        } else {
          console.log('No transcript results in event:', event);
        }
      }
    }
  } catch (error) {
    // エラーが発生した場合はストリーミングを停止する
    isStreamingRef.current = false;
    
    // エラーの種類に応じて適切なメッセージを表示
    if (error instanceof Error) {
      const errorMessage = mapAwsError(error);
      callbacks?.onError(new Error(errorMessage));
    } else {
      callbacks?.onError(new Error(ERROR_MESSAGES.TRANSCRIBE_UNKNOWN_ERROR));
    }
  }
}

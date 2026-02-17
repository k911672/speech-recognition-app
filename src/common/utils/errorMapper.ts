import { ERROR_MESSAGES } from '../../speech-recognition/constants/transcription';

// AWSエラーのマッピング関数
export const mapAwsError = (error: Error): string => {
  if (error.message.includes('credentials')) {
    return ERROR_MESSAGES.AWS_CREDENTIALS_INVALID;
  }
  if (error.message.includes('region')) {
    return ERROR_MESSAGES.AWS_REGION_INVALID;
  }
  if (error.message.includes('BadRequestException')) {
    return ERROR_MESSAGES.TRANSCRIBE_BAD_REQUEST;
  }
  if (error.message.includes('UnauthorizedOperation')) {
    return ERROR_MESSAGES.TRANSCRIBE_UNAUTHORIZED;
  }
  if (error.message.includes('ThrottlingException')) {
    return ERROR_MESSAGES.TRANSCRIBE_THROTTLING;
  }
  return ERROR_MESSAGES.TRANSCRIBE_UNKNOWN_ERROR;
};

// ブラウザエラーのマッピング関数
export const mapBrowserError = (error: Error): string => {
  if (error.name === 'NotAllowedError') {
    return ERROR_MESSAGES.MIC_NOT_ALLOWED;
  }
  if (error.name === 'NotFoundError') {
    return ERROR_MESSAGES.MIC_NOT_FOUND;
  }
  if (error.name === 'NotSupportedError') {
    return ERROR_MESSAGES.BROWSER_NOT_SUPPORTED;
  }
  return ERROR_MESSAGES.TRANSCRIBE_UNKNOWN_ERROR;
};


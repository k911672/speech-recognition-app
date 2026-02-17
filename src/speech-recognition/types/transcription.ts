import type { TranslationResult } from './translation';


export interface TranscriptionSegment {
  id: string;
  text: string;
  timestamp: Date;
  isPartial: boolean;
  confidence?: number;
  translation?: TranslationResult;
  isTranslating?: boolean;
}


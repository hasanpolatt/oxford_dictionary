export interface WordDetailsInput {
  CEFR: string;
  type: string;
  word: string;
  translations: {
    tr: {
      word: string;
    }
  };
}

export interface Translation {
  word: string;
  examples?: string[];
}

export interface WordEnrichment {
  _id: string;
  word: string;
  sourceLanguage: string;
  type: string;
  CEFR: string;
  definition: string;
  pronunciation: string;
  examples: string[];
  synonyms: string[];
  translations: {
    tr: Translation;
  };
  note: string;
  
  turkishTranslation?: string;
  turkishExamples?: string[];
}

export interface WordDetailsResponse {
  message?: string;
  data?: WordEnrichment;
}
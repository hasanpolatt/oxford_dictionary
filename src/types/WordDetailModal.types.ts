
export interface WordDetailsInput {
  CEFR: string;
  type: string;
  English: string;
  Turkish: string;
}


export interface Example {
  en: string;
  tr: string;
}


export interface WordEnrichment {
  English: string;
  Turkish: string;
  CEFR: string;
  type: string;
  definition: string;
  example: Example;
  synonyms: string[];
  notes?: string;
}


export interface WordDetailsResponse {
  message: string;
  data: WordEnrichment;
}
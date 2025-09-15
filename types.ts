
export enum TemplateId {
  API_ENDPOINT = 'api-endpoint',
  FUNCTION_DOCSTRING = 'function-docstring',
  README_SECTION = 'readme-section',
  CODE_EXPLAINER = 'code-explainer',
  ARCHITECTURE_OVERVIEW = 'architecture-overview',
}

export enum Tone {
  FORMAL = 'Formal',
  CONCISE = 'Concise',
  BEGINNER_FRIENDLY = 'Beginner-Friendly',
}

export interface CustomizationParams {
  tone: Tone;
  language: string;
  maxLength: number;
}

export interface Template {
  id: TemplateId;
  name: string;
  description: string;
  placeholder: string;
  prompt: (input: string, params: CustomizationParams) => string;
}

export interface PerformanceMetrics {
  generationTime: number | null;
  totalTokens: number | null;
}

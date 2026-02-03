
export interface CopyOption {
  title: string;
  content: string;
  tags: string[];
  style: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  results: CopyOption[];
}

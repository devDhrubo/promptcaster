export interface PromptDefinition {
  id: string;
  name: string;
  template: string;
  category: PromptCategory;
  shortcut?: string;
  description: string;
}

export type PromptCategory =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "Testing"
  | "Documentation"
  | "AI Development";

export interface CustomPrompt {
  name: string;
  prompt: string;
  category?: PromptCategory;
}

export interface PromptExpansionResult {
  name: string;
  template: string;
  expandedPrompt: string;
  hasSelectedCode: boolean;
  selectedCode?: string;
}

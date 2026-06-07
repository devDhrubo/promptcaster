import * as vscode from "vscode";
import { PromptDefinition, CustomPrompt, PromptExpansionResult } from "../types";
import { PromptProvider } from "../providers/PromptProvider";

export class PromptService {
  /**
   * Returns standard prompts merged with custom prompts defined in user settings.
   */
  public getMergedPrompts(): PromptDefinition[] {
    const defaultPrompts = PromptProvider.getPrompts();
    
    // Retrieve custom prompts from VS Code configuration
    const config = vscode.workspace.getConfiguration("promptForge");
    const customPrompts = config.get<CustomPrompt[]>("customPrompts") || [];

    const mappedCustoms: PromptDefinition[] = customPrompts.map((cp, idx) => {
      const sanitizedId = `custom_${cp.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${idx}`;
      return {
        id: sanitizedId,
        name: cp.name,
        template: cp.prompt,
        category: cp.category || "AI Development",
        description: `Custom prompt: ${cp.name}`,
        shortcut: cp.name.toLowerCase().startsWith("/") ? cp.name.toLowerCase() : undefined
      };
    });

    return [...defaultPrompts, ...mappedCustoms];
  }

  /**
   * Expands the template placeholders with editor content.
   */
  public expandPrompt(template: string, selectedCode: string): PromptExpansionResult {
    const hasSelectedCode = selectedCode.trim().length > 0;
    
    let expandedPrompt = template;
    if (template.includes("{{selectedCode}}")) {
      if (hasSelectedCode) {
        expandedPrompt = template.replace(/\{\{selectedCode\}\}/g, selectedCode);
      } else {
        // Fallback context: clean up variable or ask user for code snippet
        expandedPrompt = template.replace(/\{\{selectedCode\}\}/g, "[No code selected - type or insert your code here]");
      }
    } else {
      // If no placeholder, append selection at the end
      if (hasSelectedCode) {
        expandedPrompt = `${template}\n\nCode to review:\n\n${selectedCode}`;
      }
    }

    return {
      name: "", // Will be filled by client
      template,
      expandedPrompt,
      hasSelectedCode,
      selectedCode: hasSelectedCode ? selectedCode : undefined,
    };
  }
}

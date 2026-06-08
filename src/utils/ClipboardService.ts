import * as vscode from "vscode";

export class ClipboardService {
  /**
   * Copies the given text directly to the VS Code host clipboard.
   */
  public static async copy(text: string): Promise<boolean> {
    try {
      await vscode.env.clipboard.writeText(text);
      vscode.window.showInformationMessage("PromptCaster: Copied prompt to clipboard successfully!");
      return true;
    } catch (error) {
      vscode.window.showErrorMessage(`PromptCaster: Failed to copy to clipboard. Error: ${error}`);
      return false;
    }
  }
}

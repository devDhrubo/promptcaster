import * as vscode from "vscode";
import { CommandManager } from "./commands/CommandManager";

let commandManager: CommandManager | undefined;

/**
 * Activated when VS Code identifies that PromptCaster should boot.
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "promptcaster" is now active!');

  // Initialize and register all commands
  commandManager = new CommandManager(context.extensionUri);
  commandManager.registerAll(context);

  vscode.window.setStatusBarMessage("PromptCaster is Active: Ready for instant prompts!", 5000);
}

/**
 * Executed when VS Code standard environment disposes or unloads the extension.
 */
export function deactivate() {
  console.log('PromptCaster extension has been deactivated.');
}

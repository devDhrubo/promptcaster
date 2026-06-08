import * as vscode from "vscode";
import { PromptService } from "../promptService/PromptService";
import { ClipboardService } from "../utils/ClipboardService";
import { PreviewPanel } from "../utils/PreviewPanel";
import { PromptDefinition, PromptExpansionResult } from "../types";

export class CommandManager {
  private readonly _promptService: PromptService;
  private readonly _extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri) {
    this._promptService = new PromptService();
    this._extensionUri = extensionUri;
  }

  /**
   * Registers all commands defined in the package.json.
   */
  public registerAll(context: vscode.ExtensionContext): void {
    // 1. Register the Prompt Library command (Quick Pick menu)
    context.subscriptions.push(
      vscode.commands.registerCommand("promptCaster.openLibrary", () => {
        this._showPromptLibrary();
      })
    );

    // 2. Register Clipboard Copy Command
    context.subscriptions.push(
      vscode.commands.registerCommand("promptCaster.copyPrompt", () => {
        this._copyQuickPrompt();
      })
    );

    // 3. Register individual prompt shortcut commands
    const promptShortcuts = [
      { cmd: "promptCaster.review", id: "review" },
      { cmd: "promptCaster.bug", id: "bug" },
      { cmd: "promptCaster.test", id: "test" },
      { cmd: "promptCaster.explain", id: "explain" },
      { cmd: "promptCaster.clean", id: "clean" },
      { cmd: "promptCaster.readme", id: "readme" },
      { cmd: "promptCaster.optimize", id: "optimize" },
      { cmd: "promptCaster.refactor", id: "refactor" },
      { cmd: "promptCaster.document", id: "document" },
      { cmd: "promptCaster.security", id: "security" }
    ];

    for (const shortcut of promptShortcuts) {
      context.subscriptions.push(
        vscode.commands.registerCommand(shortcut.cmd, () => {
          this._executeDirectPrompt(shortcut.id);
        })
      );
    }

    // 4. Register Workspace slash command listener (Optional editor behavior)
    if (vscode.workspace.getConfiguration("promptCaster").get<boolean>("enableSlashCommands", true)) {
      context.subscriptions.push(this._registerSlashCommandListener());
    }
  }

  /**
   * Triggers the interactive Quick Pick containing categorized prompts.
   */
  private async _showPromptLibrary(): Promise<void> {
    const prompts = this._promptService.getMergedPrompts();
    
    // Convert prompts into QuickPickItems
    const items: (vscode.QuickPickItem & { promptDef: PromptDefinition })[] = prompts.map((p) => {
      return {
        label: p.name,
        description: p.shortcut || "",
        detail: `[${p.category}] - ${p.description}`,
        promptDef: p,
      };
    });

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: "PromptCaster: Search or select an AI prompt template...",
      matchOnDescription: true,
      matchOnDetail: true,
    });

    if (selected) {
      this._handlePromptSelected(selected.promptDef);
    }
  }

  /**
   * Allows copying an expanded prompt immediately from the full list.
   */
  private async _copyQuickPrompt(): Promise<void> {
    const prompts = this._promptService.getMergedPrompts();
    const items = prompts.map((p) => ({
      label: `Copy: ${p.name}`,
      description: p.shortcut || "",
      detail: p.description,
      promptDef: p,
    }));

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: "Select a prompt template to copy directly as expanded...",
    });

    if (selected) {
      const selectedCode = this._getSelectedCode();
      const expanded = this._promptService.expandPrompt(selected.promptDef.template, selectedCode);
      await ClipboardService.copy(expanded.expandedPrompt);
    }
  }

  /**
   * Executes a prompt directly via command palette or keyboard shortcut.
   */
  private _executeDirectPrompt(promptId: string): void {
    const prompts = this._promptService.getMergedPrompts();
    const prompt = prompts.find((p) => p.id === promptId);
    
    if (prompt) {
      this._handlePromptSelected(prompt);
    } else {
      vscode.window.showErrorMessage(`PromptCaster: Prompt structure '${promptId}' not found!`);
    }
  }

  /**
   * Handles what happens when a prompt template needs processing (e.g. preview pane or direct insertion).
   */
  private _handlePromptSelected(prompt: PromptDefinition): void {
    const selectedCode = this._getSelectedCode();
    const expandedResult = this._promptService.expandPrompt(prompt.template, selectedCode);
    expandedResult.name = prompt.name;

    const previewEnabled = vscode.workspace.getConfiguration("promptCaster").get<boolean>("previewBeforeInsertion", true);

    if (previewEnabled) {
      PreviewPanel.createOrShow(
        this._extensionUri,
        expandedResult,
        (action, text) => {
          if (action === "insert") {
            this._insertTextToEditor(text);
          } else if (action === "copy") {
            ClipboardService.copy(text);
          }
        }
      );
    } else {
      // If preview is disabled, prompt user for action
      vscode.window
        .showInformationMessage(
          `PromptCaster: Prompt '${prompt.name}' expanded. What would you like to do?`,
          "Copy to Clipboard",
          "Insert at Cursor",
          "Open in New Document"
        )
        .then((choice) => {
          if (choice === "Copy to Clipboard") {
            ClipboardService.copy(expandedResult.expandedPrompt);
          } else if (choice === "Insert at Cursor") {
            this._insertTextToEditor(expandedResult.expandedPrompt);
          } else if (choice === "Open in New Document") {
            this._openInNewDocument(expandedResult.expandedPrompt);
          }
        });
    }
  }

  /**
   * Helper that retrieves selected text in active editor.
   */
  private _getSelectedCode(): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return "";
    }
    const selection = editor.selection;
    if (selection.isEmpty) {
      return "";
    }
    return editor.document.getText(selection);
  }

  /**
   * Helper that inserts text at active editor cursor position or selection range.
   */
  private _insertTextToEditor(text: string): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      this._openInNewDocument(text);
      return;
    }

    editor.edit((editBuilder) => {
      // Replaces current selection or inserts at cursor
      editBuilder.replace(editor.selection, text);
    }).then((success) => {
      if (success) {
        vscode.window.showInformationMessage("PromptCaster: Inserted prompt text successfully!");
      }
    });
  }

  /**
   * Opens the compiled text in a side-by-side markdown file.
   */
  private _openInNewDocument(text: string): void {
    vscode.workspace.openTextDocument({
      content: text,
      language: "markdown",
    }).then((doc) => {
      vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
    });
  }

  /**
   * Listens to key presses / text additions in active document as a lightweight slash-command hook.
   * If they type a registered command (e.g., /review) and type a space or TAB, we suggest expanding.
   */
  private _registerSlashCommandListener(): vscode.Disposable {
    return vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || event.document !== editor.document) {
        return;
      }

      const changes = event.contentChanges;
      if (changes.length === 0) {
        return;
      }

      // Detect if user typed a space or triggered check immediately after slash command
      const lastChange = changes[0];
      const typedText = lastChange.text;

      if (typedText === " " || typedText === "\t" || typedText === "\n") {
        const line = editor.document.lineAt(lastChange.range.start.line);
        const lineText = line.text.substring(0, lastChange.range.start.character);
        const words = lineText.trim().split(/\s+/);
        const lastWord = words[words.length - 1];

        if (lastWord && lastWord.startsWith("/")) {
          const prompts = this._promptService.getMergedPrompts();
          const matchingPrompt = prompts.find((p) => p.shortcut === lastWord);

          if (matchingPrompt) {
            // Found slash command! Suggest triggering extension
            vscode.window
              .showInformationMessage(
                `PromptCaster: Trigger shortcut matching '${lastWord}' (${matchingPrompt.name})?`,
                "Expand Prompt",
                "Dismiss"
              )
              .then((choice) => {
                if (choice === "Expand Prompt") {
                  // Delete the trigger text (e.g. /review)
                  const wordStartChar = line.text.indexOf(lastWord);
                  const wordRange = new vscode.Range(
                    line.lineNumber,
                    wordStartChar,
                    line.lineNumber,
                    wordStartChar + lastWord.length + typedText.length
                  );
                  editor.edit((editBuilder) => {
                    editBuilder.delete(wordRange);
                  }).then(() => {
                    this._handlePromptSelected(matchingPrompt);
                  });
                }
              });
          }
        }
      }
    });
  }
}

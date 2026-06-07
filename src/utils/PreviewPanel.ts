import * as vscode from "vscode";
import { PromptExpansionResult } from "../types";

export class PreviewPanel {
  public static currentPanel: PreviewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    promptData: PromptExpansionResult,
    onSuccess: (action: "insert" | "copy" | "cancel", text: string) => void
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    this._panel.webview.html = this._getHtmlForWebview(promptData);

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "insert":
            onSuccess("insert", message.text);
            this.dispose();
            return;
          case "copy":
            onSuccess("copy", message.text);
            this.dispose();
            return;
          case "cancel":
            onSuccess("cancel", "");
            this.dispose();
            return;
        }
      },
      null,
      this._disposables
    );
  }

  public static createOrShow(
    extensionUri: vscode.Uri,
    promptData: PromptExpansionResult,
    onSuccess: (action: "insert" | "copy" | "cancel", text: string) => void
  ) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (PreviewPanel.currentPanel) {
      PreviewPanel.currentPanel._panel.reveal(column);
      PreviewPanel.currentPanel._panel.webview.html = PreviewPanel.currentPanel._getHtmlForWebview(promptData);
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      "promptForgePreview",
      `Prompt Preview: ${promptData.name || "Compiled Prompt"}`,
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [extensionUri],
      }
    );

    PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri, promptData, onSuccess);
  }

  public dispose() {
    PreviewPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(data: PromptExpansionResult): string {
    const escapedExpandedPrompt = this._escapeHtml(data.expandedPrompt);
    const escapedSelectedCode = data.selectedCode ? this._escapeHtml(data.selectedCode) : "";
    const nameLabel = data.name || "Selected Prompt Preview";
    const selectedBadgeHtml = data.hasSelectedCode
      ? `<span class="badge badge-success">✓ Selected Code Attached</span>`
      : `<span class="badge badge-warning">⚠ No Selection (Generic Prompt)</span>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PromptForge Preview</title>
  <style>
    body {
      font-family: var(--vscode-editor-font-family, Consolas, 'Courier New', monospace);
      font-size: var(--vscode-editor-font-size, 14px);
      color: var(--vscode-editor-foreground, #cccccc);
      background-color: var(--vscode-editor-background, #1e1e1e);
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--vscode-editorGroupHeader-border, #3c3c3c);
    }
    h2 {
      margin: 0;
      color: var(--vscode-editor-foreground, #ffffff);
      font-weight: 500;
    }
    .badge {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
    }
    .badge-success {
      background-color: #2ea44f;
      color: #ffffff;
    }
    .badge-warning {
      background-color: #d29922;
      color: #ffffff;
    }
    .section-title {
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 18px;
      margin-bottom: 6px;
      color: var(--vscode-textPreformat-foreground, #58a6ff);
    }
    pre {
      background-color: #161b22;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      user-select: text;
    }
    code {
      font-family: var(--vscode-editor-font-family, 'Fira Code', monospace);
      color: #e6edf3;
    }
    .footer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--vscode-editorGroupHeader-border, #3c3c3c);
    }
    button {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      user-select: none;
      transition: opacity 0.15s ease;
      font-family: inherit;
    }
    button:hover {
      opacity: 0.9;
    }
    .btn-primary {
      background-color: var(--vscode-button-background, #007acc);
      color: var(--vscode-button-foreground, #ffffff);
      border: none;
    }
    .btn-secondary {
      background-color: var(--vscode-button-secondaryBackground, #3c3c3c);
      color: var(--vscode-button-secondaryForeground, #ffffff);
      border: none;
    }
    .btn-danger {
      background-color: #da3633;
      color: #ffffff;
      border: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>PromptForge Preview: ${nameLabel}</h2>
      ${selectedBadgeHtml}
    </div>

    ${escapedSelectedCode ? `
      <div class="section-title">Selected Target Code</div>
      <pre><code>${escapedSelectedCode}</code></pre>
    ` : ""}

    <div class="section-title">Generated System Prompt</div>
    <pre><code id="generated-prompt">${escapedExpandedPrompt}</code></pre>

    <div class="footer-actions">
      <button class="btn-secondary" id="btn-cancel">Cancel</button>
      <button class="btn-secondary" id="btn-copy">Copy to Clipboard</button>
      <button class="btn-primary" id="btn-insert">Insert Into Editor</button>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const promptText = \`${this._escapeJavaScriptValue(data.expandedPrompt)}\`;
    
    document.getElementById('btn-insert').addEventListener('click', () => {
      vscode.postMessage({ command: 'insert', text: promptText });
    });
    
    document.getElementById('btn-copy').addEventListener('click', () => {
      vscode.postMessage({ command: 'copy', text: promptText });
    });
    
    document.getElementById('btn-cancel').addEventListener('click', () => {
      vscode.postMessage({ command: 'cancel' });
    });
  </script>
</body>
</html>`;
  }

  private _escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  private _escapeJavaScriptValue(val: string): string {
    return val
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$/g, "\\$");
  }
}

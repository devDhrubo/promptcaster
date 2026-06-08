"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode5 = __toESM(require("vscode"));

// src/commands/CommandManager.ts
var vscode4 = __toESM(require("vscode"));

// src/promptService/PromptService.ts
var vscode = __toESM(require("vscode"));

// src/providers/PromptProvider.ts
var PromptProvider = class {
  static getPrompts() {
    return [...this.defaultPrompts];
  }
};
__publicField(PromptProvider, "defaultPrompts", [
  {
    id: "review",
    name: "Code Review",
    shortcut: "/review",
    category: "AI Development",
    description: "Review code quality, performance, security, and maintainability.",
    template: `Review the following code:

{{selectedCode}}

Focus on:
* Code quality
* Performance
* Security
* Maintainability

Provide:
* Issues found
* Improvements
* Refactored code`
  },
  {
    id: "bug",
    name: "Bug Analysis",
    shortcut: "/bug",
    category: "Testing",
    description: "Analyze code for logical bugs, edge cases, and crash scenarios.",
    template: `Analyze the following code for bugs:

{{selectedCode}}

Provide:
* Root cause
* Explanation
* Fix
* Improved implementation`
  },
  {
    id: "test",
    name: "Generate Tests",
    shortcut: "/test",
    category: "Testing",
    description: "Create comprehensive unit tests covering edge cases and errors.",
    template: `Create comprehensive unit tests for:

{{selectedCode}}

Requirements:
* Edge cases
* Error handling
* Best practices`
  },
  {
    id: "explain",
    name: "Explain Code",
    shortcut: "/explain",
    category: "AI Development",
    description: "Explain code step-by-step for a junior developer.",
    template: `Explain the following code step-by-step:

{{selectedCode}}

Assume the reader is a junior developer.`
  },
  {
    id: "clean",
    name: "Clean / Refactor Code",
    shortcut: "/clean",
    category: "AI Development",
    description: "Refactor code for structure, readability, and modern styles.",
    template: `Refactor this code using modern best practices:

{{selectedCode}}

Requirements:
* Cleaner structure
* Better readability
* Improved maintainability`
  },
  {
    id: "readme",
    name: "Generate README",
    shortcut: "/readme",
    category: "Documentation",
    description: "Generate a professional README.md file.",
    template: `Generate a professional README.md for:

{{selectedCode}}

Include:
* Project Overview
* Features
* Installation
* Usage
* API
* License`
  },
  {
    id: "optimize",
    name: "Performance Optimization",
    shortcut: "/optimize",
    category: "Backend",
    description: "Optimize execution time, memory overhead, and resource loops.",
    template: `Optimize the execution performance of the following code:

{{selectedCode}}

Analyze:
* Time complexity bottlenecks
* Memory allocation patterns
* Cache locality and loops

Provide:
* Optimized code replacement
* Benchmark or step complexity comparison`
  },
  {
    id: "refactor",
    name: "General Refactoring",
    shortcut: "/refactor",
    category: "AI Development",
    description: "Apply design patterns to improve code modularity.",
    template: `Refactor the following code using appropriate SOLID design principles or architectural patterns:

{{selectedCode}}

Requirements:
* Adhere to Single Responsibility
* Decouple heavy dependencies
* Return the refactored version with inline architecture comments.`
  },
  {
    id: "document",
    name: "Documentation Generation",
    shortcut: "/document",
    category: "Documentation",
    description: "Generate comprehensive inline docstrings, JSDoc, or comments.",
    template: `Generate comprehensive block docstrings and descriptive comments for the following code:

{{selectedCode}}

Requirements:
* Follow standard type comment conventions appropriate for this language (e.g., JSDoc, Docstrings).
* Document parameters, return types, exceptions thrown, and internal processing blocks.`
  },
  {
    id: "security",
    name: "Security Audit",
    shortcut: "/security",
    category: "Backend",
    description: "Scan code for OWASP vulnerabilities, leaks, or injections.",
    template: `Perform a comprehensive security review and audit of the following code snippet:

{{selectedCode}}

Identify:
* Injection vulnerabilities, memory leaks, and input sanitisations
* Secrets, hardcoded API values, or insecure communication
* Authorization, access control, or buffer overflows

Provide:
* Severity risk assessment (High/Medium/Low)
* Exploitation analysis
* Remediation steps and secured code snippet`
  }
]);

// src/promptService/PromptService.ts
var PromptService = class {
  /**
   * Returns standard prompts merged with custom prompts defined in user settings.
   */
  getMergedPrompts() {
    const defaultPrompts = PromptProvider.getPrompts();
    const config = vscode.workspace.getConfiguration("promptCaster");
    const customPrompts = config.get("customPrompts") || [];
    const mappedCustoms = customPrompts.map((cp, idx) => {
      const sanitizedId = `custom_${cp.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${idx}`;
      return {
        id: sanitizedId,
        name: cp.name,
        template: cp.prompt,
        category: cp.category || "AI Development",
        description: `Custom prompt: ${cp.name}`,
        shortcut: cp.name.toLowerCase().startsWith("/") ? cp.name.toLowerCase() : void 0
      };
    });
    return [...defaultPrompts, ...mappedCustoms];
  }
  /**
   * Expands the template placeholders with editor content.
   */
  expandPrompt(template, selectedCode) {
    const hasSelectedCode = selectedCode.trim().length > 0;
    let expandedPrompt = template;
    if (template.includes("{{selectedCode}}")) {
      if (hasSelectedCode) {
        expandedPrompt = template.replace(/\{\{selectedCode\}\}/g, selectedCode);
      } else {
        expandedPrompt = template.replace(/\{\{selectedCode\}\}/g, "[No code selected - type or insert your code here]");
      }
    } else {
      if (hasSelectedCode) {
        expandedPrompt = `${template}

Code to review:

${selectedCode}`;
      }
    }
    return {
      name: "",
      // Will be filled by client
      template,
      expandedPrompt,
      hasSelectedCode,
      selectedCode: hasSelectedCode ? selectedCode : void 0
    };
  }
};

// src/utils/ClipboardService.ts
var vscode2 = __toESM(require("vscode"));
var ClipboardService = class {
  /**
   * Copies the given text directly to the VS Code host clipboard.
   */
  static async copy(text) {
    try {
      await vscode2.env.clipboard.writeText(text);
      vscode2.window.showInformationMessage("PromptCaster: Copied prompt to clipboard successfully!");
      return true;
    } catch (error) {
      vscode2.window.showErrorMessage(`PromptCaster: Failed to copy to clipboard. Error: ${error}`);
      return false;
    }
  }
};

// src/utils/PreviewPanel.ts
var vscode3 = __toESM(require("vscode"));
var _PreviewPanel = class {
  _panel;
  _extensionUri;
  _disposables = [];
  constructor(panel, extensionUri, promptData, onSuccess) {
    this._panel = panel;
    this._extensionUri = extensionUri;
    this._panel.webview.html = this._getHtmlForWebview(promptData);
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
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
  static createOrShow(extensionUri, promptData, onSuccess) {
    const column = vscode3.window.activeTextEditor ? vscode3.window.activeTextEditor.viewColumn : void 0;
    if (_PreviewPanel.currentPanel) {
      _PreviewPanel.currentPanel._panel.reveal(column);
      _PreviewPanel.currentPanel._panel.webview.html = _PreviewPanel.currentPanel._getHtmlForWebview(promptData);
      return;
    }
    const panel = vscode3.window.createWebviewPanel(
      "promptCasterPreview",
      `Prompt Preview: ${promptData.name || "Compiled Prompt"}`,
      column || vscode3.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [extensionUri]
      }
    );
    _PreviewPanel.currentPanel = new _PreviewPanel(panel, extensionUri, promptData, onSuccess);
  }
  dispose() {
    _PreviewPanel.currentPanel = void 0;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
  _getHtmlForWebview(data) {
    const escapedExpandedPrompt = this._escapeHtml(data.expandedPrompt);
    const escapedSelectedCode = data.selectedCode ? this._escapeHtml(data.selectedCode) : "";
    const nameLabel = data.name || "Selected Prompt Preview";
    const selectedBadgeHtml = data.hasSelectedCode ? `<span class="badge badge-success">\u2713 Selected Code Attached</span>` : `<span class="badge badge-warning">\u26A0 No Selection (Generic Prompt)</span>`;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PromptCaster Preview</title>
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
      <h2>PromptCaster Preview: ${nameLabel}</h2>
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
  _escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
  _escapeJavaScriptValue(val) {
    return val.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
  }
};
var PreviewPanel = _PreviewPanel;
__publicField(PreviewPanel, "currentPanel");

// src/commands/CommandManager.ts
var CommandManager = class {
  _promptService;
  _extensionUri;
  constructor(extensionUri) {
    this._promptService = new PromptService();
    this._extensionUri = extensionUri;
  }
  /**
   * Registers all commands defined in the package.json.
   */
  registerAll(context) {
    context.subscriptions.push(
      vscode4.commands.registerCommand("promptCaster.openLibrary", () => {
        this._showPromptLibrary();
      })
    );
    context.subscriptions.push(
      vscode4.commands.registerCommand("promptCaster.copyPrompt", () => {
        this._copyQuickPrompt();
      })
    );
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
        vscode4.commands.registerCommand(shortcut.cmd, () => {
          this._executeDirectPrompt(shortcut.id);
        })
      );
    }
    if (vscode4.workspace.getConfiguration("promptCaster").get("enableSlashCommands", true)) {
      context.subscriptions.push(this._registerSlashCommandListener());
    }
  }
  /**
   * Triggers the interactive Quick Pick containing categorized prompts.
   */
  async _showPromptLibrary() {
    const prompts = this._promptService.getMergedPrompts();
    const items = prompts.map((p) => {
      return {
        label: p.name,
        description: p.shortcut || "",
        detail: `[${p.category}] - ${p.description}`,
        promptDef: p
      };
    });
    const selected = await vscode4.window.showQuickPick(items, {
      placeHolder: "PromptCaster: Search or select an AI prompt template...",
      matchOnDescription: true,
      matchOnDetail: true
    });
    if (selected) {
      this._handlePromptSelected(selected.promptDef);
    }
  }
  /**
   * Allows copying an expanded prompt immediately from the full list.
   */
  async _copyQuickPrompt() {
    const prompts = this._promptService.getMergedPrompts();
    const items = prompts.map((p) => ({
      label: `Copy: ${p.name}`,
      description: p.shortcut || "",
      detail: p.description,
      promptDef: p
    }));
    const selected = await vscode4.window.showQuickPick(items, {
      placeHolder: "Select a prompt template to copy directly as expanded..."
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
  _executeDirectPrompt(promptId) {
    const prompts = this._promptService.getMergedPrompts();
    const prompt = prompts.find((p) => p.id === promptId);
    if (prompt) {
      this._handlePromptSelected(prompt);
    } else {
      vscode4.window.showErrorMessage(`PromptCaster: Prompt structure '${promptId}' not found!`);
    }
  }
  /**
   * Handles what happens when a prompt template needs processing (e.g. preview pane or direct insertion).
   */
  _handlePromptSelected(prompt) {
    const selectedCode = this._getSelectedCode();
    const expandedResult = this._promptService.expandPrompt(prompt.template, selectedCode);
    expandedResult.name = prompt.name;
    const previewEnabled = vscode4.workspace.getConfiguration("promptCaster").get("previewBeforeInsertion", true);
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
      vscode4.window.showInformationMessage(
        `PromptCaster: Prompt '${prompt.name}' expanded. What would you like to do?`,
        "Copy to Clipboard",
        "Insert at Cursor",
        "Open in New Document"
      ).then((choice) => {
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
  _getSelectedCode() {
    const editor = vscode4.window.activeTextEditor;
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
  _insertTextToEditor(text) {
    const editor = vscode4.window.activeTextEditor;
    if (!editor) {
      this._openInNewDocument(text);
      return;
    }
    editor.edit((editBuilder) => {
      editBuilder.replace(editor.selection, text);
    }).then((success) => {
      if (success) {
        vscode4.window.showInformationMessage("PromptCaster: Inserted prompt text successfully!");
      }
    });
  }
  /**
   * Opens the compiled text in a side-by-side markdown file.
   */
  _openInNewDocument(text) {
    vscode4.workspace.openTextDocument({
      content: text,
      language: "markdown"
    }).then((doc) => {
      vscode4.window.showTextDocument(doc, vscode4.ViewColumn.Beside);
    });
  }
  /**
   * Listens to key presses / text additions in active document as a lightweight slash-command hook.
   * If they type a registered command (e.g., /review) and type a space or TAB, we suggest expanding.
   */
  _registerSlashCommandListener() {
    return vscode4.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode4.window.activeTextEditor;
      if (!editor || event.document !== editor.document) {
        return;
      }
      const changes = event.contentChanges;
      if (changes.length === 0) {
        return;
      }
      const lastChange = changes[0];
      const typedText = lastChange.text;
      if (typedText === " " || typedText === "	" || typedText === "\n") {
        const line = editor.document.lineAt(lastChange.range.start.line);
        const lineText = line.text.substring(0, lastChange.range.start.character);
        const words = lineText.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        if (lastWord && lastWord.startsWith("/")) {
          const prompts = this._promptService.getMergedPrompts();
          const matchingPrompt = prompts.find((p) => p.shortcut === lastWord);
          if (matchingPrompt) {
            vscode4.window.showInformationMessage(
              `PromptCaster: Trigger shortcut matching '${lastWord}' (${matchingPrompt.name})?`,
              "Expand Prompt",
              "Dismiss"
            ).then((choice) => {
              if (choice === "Expand Prompt") {
                const wordStartChar = line.text.indexOf(lastWord);
                const wordRange = new vscode4.Range(
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
};

// src/extension.ts
var commandManager;
function activate(context) {
  console.log('Congratulations, your extension "promptcaster" is now active!');
  commandManager = new CommandManager(context.extensionUri);
  commandManager.registerAll(context);
  vscode5.window.setStatusBarMessage("PromptCaster is Active: Ready for instant prompts!", 5e3);
}
function deactivate() {
  console.log("PromptCaster extension has been deactivated.");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map

# PromptForge ⚒️

PromptForge is a fast, lightweight, and developer-centric Visual Studio Code extension designed to boost your coding flow by letting you instantly compose, preview, and copy structured AI prompts containing your highlighted code.

Instead of writing repetitive instructions for ChatGPT, Claude, Copilot, Cursor, or Continue, you can trigger PromptForge. Highlight a block of code, type a direct slash command (like `/review` or `/bug`), or hit a keyboard shortcut, and let PromptForge compile a highly optimized developer prompt ready for your favorite AI model.

---

## 🚀 Core Features

1. **Intelligent Slash Commands**: Type `/review`, `/bug`, `/test`, `/explain` directly in your workspace editor. Press `TAB` or space, and PromptForge will recognize the command and compile your template.
2. **Selective Code Injection**: Automatically embeds whatever code you have highlighted in the editor directly into the prompt using the `{{selectedCode}}` placeholder.
3. **Interactive Prompt Preview Panel**: Opens a native VS Code Webview panel where you can preview the generated prompt, check details, edit, copy to clipboard, or insert it in-place.
4. **Quick Pick Library Catalog**: Run `PromptForge: Open Prompt Library` from the Command Palette (`Ctrl+Shift+P`) to search through categorized prompts.
5. **Keyboard Hotkeys**: Bindings are configured out of the box (e.g., `Ctrl+Alt+R` for Code Review, `Ctrl+Alt+B` for Bug Analysis).
6. **Fully Customizable Settings**: Define your own prompts, name variables, and set target categories using VS Code standard workspace settings.

---

## 📥 Installation Instructions

### Method A: From the VS Code Marketplace
1. Launch VS Code.
2. Open the **Extensions** panel (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
3. Search for `PromptForge` by `PromptForgeDev`.
4. Click **Install**.

### Method B: Install from VSIX package (Local Deploy)
1. Grab a pre-built `.vsix` copy or follow the build instructions below to package it your own.
2. In VS Code, open the Extensions view, click the `...` menu in the top-right corner, and select **Install from VSIX...**
3. Locate and choose your compiled `promptforge-1.0.0.vsix` file.

---

## 🛠️ Keyboard Shortcuts & Default Configurations

| Keyboard Shortcut (Windows/Linux) | Keyboard Shortcut (macOS) | Command Title | Slash Command Trigger |
| :--- | :--- | :--- | :--- |
| `Ctrl + Alt + R` | `Cmd + Alt + R` | PromptForge: Review Code | `/review` |
| `Ctrl + Alt + B` | `Cmd + Alt + B` | PromptForge: Bug Analysis | `/bug` |
| `Ctrl + Alt + T` | `Cmd + Alt + T` | PromptForge: Generate Tests | `/test` |
| `Ctrl + Alt + E` | `Cmd + Alt + E` | PromptForge: Explain Code | `/explain` |
| `Ctrl + Alt + C` | `Cmd + Alt + C` | PromptForge: Clean/Refactor Code | `/clean` |

### General Commands:
- **`PromptForge: Open Prompt Library`**: Opens a searchable catalog covering all standard and custom templates.
- **`PromptForge: Copy Prompt to Clipboard`**: Select any template to immediately place the compiled text in your clipboard.

---

## 🗂️ Default Prompt Categories

Prompts are organized across 7 predefined groups inside the quick library catalog:

*   **Professional Frameworks (New!)**: Highly structured, role-based developmental prompt layouts with standard shortcuts:
    *   `/build` - **AI Development Master** (Flagship, Phase 1 to Phase 10 development workflow)
    *   `/se` - **Senior Software Engineer** (Production planning and algorithmic drafting)
    *   `/frontend` - **Senior Frontend Architect** (Component mappings and reactive views)
    *   `/backend` - **Senior Backend Architect** (Drizzle schema definitions and controller logic)
    *   `/saas` - **SaaS Product Architect** (Multi-tenancy models and Stripe payment pipes)
    *   `/cto` - **Startup CTO** (MVP validation tracks and lean development routing)
    *   `/reviewer` - **Code Reviewer** (Algorithmic quality grades and bug hunts)
    *   `/debug` - **Bug Hunter** (Exception tracing and regression validation blocks)
*   **AI Development**: General prompts like structural refactorings and explain loops.
*   **Testing**: Unit tests generation, boundary tests, coverage, and bug scans.
*   **Documentation**: README generators, docstring JSDoc creators, and architectural logs.
*   **Frontend**: Angular, React, Vue, CSS design, and component split analyses.
*   **Backend**: Performance loops, memory scans, and algorithm optimizations.
*   **DevOps**: Dockerfiles, GitHub actions, Kubernetes manifests guidelines.

---

## ⚙️ Custom Prompt & Framework Configuration

You can fully customize or add your own custom prompts and professional frameworks in your VS Code `settings.json`.

Open **File > Preferences > Settings** (`Ctrl+,`) and add your custom declarations:

```json
{
  "promptForge.previewBeforeInsertion": true,
  "promptForge.enableSlashCommands": true,
  "promptForge.customPrompts": [
    {
      "name": "Angular Component Review",
      "prompt": "Review this Angular component to see if it follows RxJS guidelines:\n\n{{selectedCode}}",
      "category": "Frontend"
    }
  ],
  "promptForge.customFrameworks": [
    {
      "name": "Laravel Architect",
      "command": "/laravel",
      "category": "Backend",
      "prompt": "ROLE:\nLaravel Architect.\n\nMISSION:\nDevelop MVC features.\n\nCONTEXT:\nFile: {{fileName}} in language: {{language}}. Code:\n{{selectedCode}}"
    }
  ]
}
```

### Dynamic Context Variables
The extension automatically replaces placeholders inside the templates on compilation:
*   `{{selectedCode}}`: The highlighted editor code block.
*   `{{userInput}}`: Custom instruction from developer input.
*   `{{projectName}}`: Active project context folder.
*   `{{workspaceName}}`: Active developer environment name.
*   `{{framework}}`: Target frontend/backend framework in focus.
*   `{{language}}`: Derived main development language.
*   `{{fileName}}`: Inherited editor filename.

### Commands:
*   **`PromptForge: Export Frameworks`**: Exports your configured custom frameworks to standard JSON format.
*   **`PromptForge: Import Frameworks`**: Pastes and registers bulk framework modules into settings.
*   **Toggle Favorites**: Highlight prompts and select Star (★) to prioritize favorite items to the top-level of the Prompt Library.

---

## 🏗️ Developer Build & Compilation

To build, test, and package PromptForge locally, make sure you have [Node.js](https://nodejs.org) and NPM installed:

### 1. Install Workspace Dependencies
Navigating to the extension package folder:
```bash
cd promptforge-extension
npm install
```

### 2. Build and Bundle using Esbuild
PromptForge utilizes Esbuild to bundle the extension's files into a single optimized JavaScript file, preventing slow launch times during startup.
```bash
# Run one-off build
npm run bundle

# Or watch for changes during development
npm run watch
```

### 3. Run and Debug Inside VS Code
1. Open the `promptforge-extension` directory in VS Code.
2. Press `F5` to start a new **Extension Development Host** session.
3. In the new window, select or write code, toggle `Ctrl+Alt+R`, or run `PromptForge: Open Prompt Library` to test!

---

## 📦 Publishing to the VS Code Marketplace

Follow these steps to publish `PromptForge` publicly so others can find it:

### Pack your VSIX
You will need `vsce` (Visual Studio Code Extension Manager) to package your codebase into a single VSIX extension container:
```bash
# Install vsce globally
npm install -g @vscode/vsce

# Package into a .vsix file
vsce package
```
This is going to generate `promptforge-1.0.0.vsix` in the root folder.

### Register and Upload
1. Create a [Microsoft Partner Center Account](https://partner.microsoft.com/) if you don't already have one.
2. Set up a marketplace Publisher profile (e.g. `PromptForgeDev`).
3. Generate a Personal Access Token (PAT) with `All accessible organizations` and `Marketplace (publish)` privileges in Azure DevOps.
4. Log in and publish directly from the CLI tool:
```bash
vsce login <publisher-name>
vsce publish
```
Alternatively, log in to the web browser on the [VS Code Marketplace Publisher Panel](https://marketplace.visualstudio.com/manage) and click **New Extension > Visual Studio Code** to upload your `.vsix` file manually.

---

## ⚖️ License
Released under the [Apache-2.0 License](LICENSE).
Codebase designed with high structural discipline. Happy Forging!
#   p r o m p t f o r g e  
 
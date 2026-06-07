# PromptForge ⚒️

PromptForge is a lightweight VS Code extension that helps developers generate structured AI prompts instantly from selected code.

Instead of manually writing prompts for ChatGPT, Claude, Cursor, Copilot, or Continue, simply highlight code, trigger a slash command or keyboard shortcut, and PromptForge builds a professional prompt ready to use.

## ✨ Features

* **Slash Commands** (`/review`, `/bug`, `/test`, `/explain`, `/clean`)
* **Automatic Code Injection** using `{{selectedCode}}`
* **Prompt Preview Panel** before copying or inserting
* **Prompt Library** with categorized templates
* **Keyboard Shortcuts** for common workflows
* **Custom Prompt Frameworks** via VS Code settings

## 🚀 Built-in Frameworks

### Professional Roles

* `/build` — AI Development Master
* `/se` — Senior Software Engineer
* `/frontend` — Senior Frontend Architect
* `/backend` — Senior Backend Architect
* `/saas` — SaaS Product Architect
* `/cto` — Startup CTO
* `/reviewer` — Code Reviewer
* `/debug` — Bug Hunter

### Categories

* AI Development
* Testing
* Documentation
* Frontend
* Backend
* DevOps

## ⌨️ Default Shortcuts

| Shortcut   | Action         |
| ---------- | -------------- |
| Ctrl+Alt+R | Review Code    |
| Ctrl+Alt+B | Bug Analysis   |
| Ctrl+Alt+T | Generate Tests |
| Ctrl+Alt+E | Explain Code   |
| Ctrl+Alt+C | Refactor Code  |

## ⚙️ Custom Prompts

```json
{
  "promptForge.customPrompts": [
    {
      "name": "Angular Review",
      "prompt": "Review this component:\n\n{{selectedCode}}",
      "category": "Frontend"
    }
  ]
}
```

### Supported Variables

* `{{selectedCode}}`
* `{{userInput}}`
* `{{projectName}}`
* `{{workspaceName}}`
* `{{framework}}`
* `{{language}}`
* `{{fileName}}`

## 🛠 Development

```bash
npm install
npm run bundle
```

Press `F5` in VS Code to launch an Extension Development Host.

## 📦 Build VSIX

```bash
npm install -g @vscode/vsce
vsce package
```

## License

Apache-2.0 License.

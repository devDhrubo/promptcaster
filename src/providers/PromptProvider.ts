import { PromptDefinition, PromptCategory } from "../types";

export class PromptProvider {
  private static readonly defaultPrompts: PromptDefinition[] = [
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
  ];

  public static getPrompts(): PromptDefinition[] {
    return [...this.defaultPrompts];
  }
}

# Contributing to Tech Notes Hub

First of all, thank you for taking the time to contribute! 🎉
Your contributions help make this project more valuable for the developer community.

## 🚀 Ways to Contribute

There are many ways you can participate:

- 📚 Add new technical notes or topics
- 💡 Improve existing explanations or code snippets
- 🐛 Report bugs or suggest improvements
- ✨ Clean up and standardize content formatting
- 🌍 Translate notes to other languages (coming soon)

## 📝 Contribution Guidelines

Please follow these guidelines to ensure consistency and maintainability:

### 1. Fork the Repository

Click the "Fork" button in the top-right corner of the GitHub page to create a copy of the repository in your account.

### 2. Clone to Your Machine

```bash
git clone https://github.com/your-username/tech-notes.git
cd tech-notes-hub
```

### 3. Create a New Branch

Name your branch clearly, briefly describing what you'll add or modify:

```bash
git checkout -b feature/add-graph-algorithms
```

### 🧩 Branch Naming Rules

Branch names should follow this structure:

```bash
<change-type>/<brief-description>
```

| Type       | Meaning                                               | Example                          |
| ---------- | ----------------------------------------------------- | -------------------------------- |
| `feature`  | Add new notes/sections                                | `feature/add-docker-notes`       |
| `fix`      | Fix content errors, typos, examples                   | `fix/typo-in-graph-note`         |
| `update`   | Update or improve existing notes                      | `update/aws-ec2-note`            |
| `refactor` | Restructure files/content without changing core ideas | `refactor/reorganize-folders`    |
| `remove`   | Remove outdated or inappropriate content              | `remove/duplicate-array-example` |
| `docs`     | Update project documentation like README, CONTRIBUTING| `docs/improve-readme`            |

### 4. Make Your Changes

* Follow the existing folder and file structure
* Notes should use Markdown format (`.md`)
* Code should be placed in fenced code blocks, e.g., \`\`\`python
* Keep explanations concise and clear
* Add inline comments if necessary

### 💬 Commit Message Rules

Write clear, meaningful, and understandable commit messages. Suggested structure:

```bash
<change-type>: <brief description>
```

#### 📌 Examples:

- `feature: add notes on HTTP Status Codes`
- `fix: correct typos in design-patterns.md`
- `update: improve binary search examples`
- `refactor: reorganize folder structure`
- `remove: delete duplicate notes in aws folder`
- `docs: add instructions for creating pull requests`

#### 🧠 Additional Tips:

- You can only write in **English**
- **Avoid vague commits** like: `update 1`, `fix bug`, `test`
- If related to an issue, add the number at the end:
  👉 `fix: typo in aws-note #12`

### 5. Commit & Push

```bash
git add .
git commit -m "Add notes on graph algorithms"
git push origin feature/add-graph-algorithms
```

### 6. Create a Pull Request

Go back to the original repository and click **"Compare & Pull Request"**. Remember to include:

* A clear, concise title
* A detailed description of what you've added/modified
* References to related issues if applicable

## ✅ Checklist Before Submitting a Pull Request

Before submitting, ensure:

* [ ] Content is properly formatted and follows project structure
* [ ] No spelling errors or broken links
* [ ] Code snippets (if any) work correctly
* [ ] No sensitive information or proprietary assets included

## 📁 File & Folder Naming Conventions

* Use lowercase and hyphens for file and folder names: `graph_traversal.md` (except for code files like C# using PascalCase such as `GraphTraversal.cs`, or Java using CamelCase like `GraphTraversal.java`)
* For translations, add language suffix: `graph_traversal_vi.md`, but no suffix is needed if in the /i18n/[language_code]/ folder
* Notes should be grouped by docs folders (e.g., `docs/algorithms/`, `docs/aws/`, `docs/design-patterns/`)

### 📂 Code Snippets Structure

Code snippets must follow this directory structure for proper display on the website:

```
snippets/[category]/[topic-name]/[filename].[extension]
```

Examples:
- `snippets/algorithms/graph-traversal/graph_traversal.py`
- `snippets/devops/ci-cd/ci-cd.sh`
- `snippets/databases/mongodb/mongodb_query.js`

The `[topic-name]` folder must match the slug of your blog post for snippets to appear automatically. All files inside this folder will be displayed as code snippets on the corresponding blog post page.

## 🤝 Code of Conduct

Be respectful, open, and constructive in all interactions. We're building a friendly and inclusive learning space for all developers.

## 📩 Need Help?

If you have questions or ideas, please [create a new issue](https://github.com/tech-notes-hub/tech-notes/issues).

Thank you again for contributing to **Tech Notes Hub**! 🙌

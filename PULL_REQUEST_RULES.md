# 📏 Pull Request Rules for Tech Notes Hub

To maintain the quality, clarity, and consistency of this knowledge base, we have a few rules for what is allowed (✅) and not allowed (❌) in pull requests.

Please read carefully before submitting a PR.

---

## 📝 Pull Request Template

When submitting a pull request, please include:

### Description
A clear description of the changes you have made.

### Related Issue
Link to any related issues: `Fixes #(issue number)`

### Type of Change
Select the appropriate options:
- [ ] New content (notes, snippets)
- [ ] Content improvement (updates, fixes, expansion)
- [ ] Documentation update
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] Infrastructure/tooling (CI, scripts, etc.)
- [ ] Translation (i18n) - specify language: ______
- [ ] Other (please describe)

### Checklist
- [ ] My content follows the style guidelines of this project
- [ ] I have performed a self-review of my own content/code
- [ ] I have included references/links where appropriate
- [ ] My changes generate no new warnings or errors
- [ ] I have checked that all links are valid
- [ ] For translations: I've followed the i18n folder structure (i18n/[language_code]/...)

---

## ✅ Allowed in Pull Requests

- **New content** such as:
  - Well-written technical notes
  - New algorithms, patterns, or architecture topics
  - AWS/cloud service notes
  - Interview-prep or reference guides
- **Code snippets** that:
  - Are correct, clear, and minimal
  - Follow syntax best practices
  - Include inline comments if helpful
- **Improvements** to:
  - Existing explanations or formatting
  - Typo and grammar fixes
  - Markdown formatting or link corrections
- **New language versions**:
  - Translations in the `i18n/[language_code]/` folder structure (e.g., `i18n/vi/`, `i18n/fr/`)
  - Must match the structure and logic of the original file
  - Should be referenced in the SUMMARY.md under appropriate language section

## ❌ Not Allowed in Pull Requests

- ❌ **AI-generated content** without human review or editing
- ❌ Low-effort or duplicate content (e.g., copy-paste from blogs)
- ❌ Off-topic notes not related to software engineering or dev practices
- ❌ Large dumps of code without explanation or context
- ❌ Personal promotion, affiliate links, or ads
- ❌ Files with broken structure, invalid markdown, or irrelevant naming
- ❌ Notes that contain **plagiarized content** (copying from copyrighted materials)
- ❌ Translations not following the proper i18n folder structure

## 🔖 Style & Structure Reminders

- Use clear, **conversational but concise** explanations
- Use correct heading hierarchy (`#`, `##`, `###`, etc.)
- Name files using lowercase and underscore: `binary_search.md`
- Place content in the appropriate folder (`algorithms/`, `design-patterns/`, etc.)
- For translations, use the `i18n/[language_code]/` structure, mirroring the main docs structure
- Update SUMMARY.md to include new content or translations

## 📢 Final Note

We appreciate your contribution and effort!
All pull requests will be reviewed by maintainers before merging.
Feel free to open a discussion issue if you're unsure whether something fits.

Let's build a high-quality, developer-friendly knowledge base together. 🚀

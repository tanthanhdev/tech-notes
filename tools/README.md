# Tools for Tech Notes Hub

This directory contains utility scripts for maintaining the Tech Notes Hub project.

## Scripts

### `update-frontmatter.js`

A Node.js script that automatically updates the frontmatter (metadata) in all Markdown files in the `/docs` and `/i18n/vi` directories.

#### Features

- Ensures all Markdown files have consistent frontmatter
- Updates the `update` field with the current date **only if the field doesn't exists**
- Sets default values for missing fields:
  - `author`: "Tech Notes Hub"
  - `date`: Current date (if missing)
  - `tags`: Default tags (if missing)
  - `title`: Generated from filename (if missing)
  - `description`: Generated from title (if missing)
- Logs include timestamps for better tracking

#### Requirements

- Node.js
- Dependencies:
  - `gray-matter`
  - `glob`

#### Usage

**Update all files:**

```bash
# Install dependencies if not already installed
npm install gray-matter glob

# Make the script executable
chmod +x tools/update-frontmatter.js

# Run the script to update all files
node tools/update-frontmatter.js
# Or explicitly specify all files
node tools/update-frontmatter.js --all
```

**Update a single file manually:**

```bash
# Update a specific file by providing the relative path from either docs/ or i18n/vi/
node tools/update-frontmatter.js algorithms/sorting-algorithms.md

# The script will check for the file in both directories:
# - /docs/algorithms/sorting-algorithms.md
# - /i18n/vi/algorithms/sorting-algorithms.md
```

#### Automation

This script is configured to run automatically via GitHub Actions when:

1. Any Markdown file is changed in the `/docs` or `/i18n` directories
2. Weekly on Monday at 00:00 UTC
3. Manually via the GitHub Actions interface

The automation will commit any changes back to the repository with a commit message "chore: update markdown frontmatter [skip ci]".

## Adding New Tools

When adding new tools to this directory, please follow these guidelines:

1. Create a well-documented script with clear comments
2. Update this README with information about the tool
3. Ensure the tool follows project coding standards
4. Add any necessary dependencies to the project's package.json

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');

// Default configuration for frontmatter
const DEFAULT_AUTHOR = 'Tech Notes Hub';
const DEFAULT_TAGS = 'learning, technology, programming';
const CURRENT_DATE = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

// Path to the directories to update
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const I18N_VI_DIR = path.join(__dirname, '..', 'i18n', 'vi');

// Logger function with timestamp
const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
  const prefix = {
    info: '📝',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  console.log(`${timestamp} ${prefix[type] || ''} ${message}`);
};

// Get all markdown files
const getMarkdownFiles = (directory) => {
  return glob.sync('**/*.md', {
    cwd: directory,
    ignore: ['**/README.md', '**/SUMMARY.md', '**/LICENSE.md']
  }).map(file => path.join(directory, file));
};

// Update frontmatter for a file
const updateFrontmatter = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);

    // Update or add frontmatter fields
    const updatedData = {
      ...data,
      author: data.author || DEFAULT_AUTHOR,
      tags: data.tags || DEFAULT_TAGS,
    };

    // Only update the 'update' field if it doesn't exist
    if (!data.update) {
      updatedData.update = CURRENT_DATE;
    }

    // If 'date' field is missing, add it
    if (!data.date) {
      updatedData.date = CURRENT_DATE;
    }

    // If 'title' field is missing, create title from file name
    if (!data.title) {
      const fileName = path.basename(filePath, '.md');
      updatedData.title = fileName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // If 'description' field is missing, add default description
    if (!data.description) {
      updatedData.description = `Guide about ${updatedData.title}`;
    }

    // Create new content with updated frontmatter
    const updatedContent = matter.stringify(markdownContent, updatedData);

    // Write back to file
    fs.writeFileSync(filePath, updatedContent);

    log(`Updated: ${filePath}`, 'success');
    return true;
  } catch (error) {
    log(`Error updating ${filePath}: ${error.message}`, 'error');
    return false;
  }
};

// Check if file exists
const fileExists = (filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
};

// Main function to update all markdown files
const updateAllFiles = () => {
  // Get all markdown files
  const docsFiles = getMarkdownFiles(DOCS_DIR);
  const i18nViFiles = getMarkdownFiles(I18N_VI_DIR);
  const allFiles = [...docsFiles, ...i18nViFiles];

  log(`Found ${allFiles.length} markdown files to process...`);

  // Update each file
  let successCount = 0;
  for (const file of allFiles) {
    if (updateFrontmatter(file)) {
      successCount++;
    }
  }

  log(`\nCompleted: ${successCount}/${allFiles.length} files updated successfully.`, 'info');
};

// Function to update a single file manually
const updateSingleFile = (relativePath) => {
  // Try to find the file in both directories
  const docPath = path.join(DOCS_DIR, relativePath);
  const i18nPath = path.join(I18N_VI_DIR, relativePath);

  if (fileExists(docPath)) {
    log(`Updating file in docs directory: ${docPath}`);
    updateFrontmatter(docPath);
    return true;
  } else if (fileExists(i18nPath)) {
    log(`Updating file in i18n/vi directory: ${i18nPath}`);
    updateFrontmatter(i18nPath);
    return true;
  } else {
    log(`File not found: ${relativePath}`, 'error');
    log(`Looked in: \n  ${docPath}\n  ${i18nPath}`, 'warning');
    return false;
  }
};

// Process command line arguments
const processArgs = () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // No arguments, update all files
    log('No specific file provided, updating all files...');
    updateAllFiles();
    return;
  }

  // First argument is the file path
  const filePath = args[0];
  log(`Manual update requested for: ${filePath}`);

  if (filePath === '--all') {
    // Update all files
    updateAllFiles();
  } else {
    // Update single file
    updateSingleFile(filePath);
  }
};

// Run script
log('Starting frontmatter update process...');
processArgs();

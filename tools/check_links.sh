#!/bin/bash
#
# Link Checker Script
#
# This script checks for broken links in markdown files within the repository.
# It uses markdown-link-check to validate both internal and external links.
#
# Usage:
#   ./check_links.sh [directory]
#
# If no directory is specified, it will check all markdown files in the repo.
#
# Requirements:
#   - npm (Node Package Manager)
#   - markdown-link-check (will be installed if not present)
#

set -e

# Default search directory is the repo root
SEARCH_DIR=${1:-$(git rev-parse --show-toplevel)}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Tech Notes Hub Link Checker ===${NC}"

# Check if markdown-link-check is installed, if not install it
if ! command -v markdown-link-check &> /dev/null; then
    echo -e "${YELLOW}markdown-link-check not found. Installing...${NC}"
    npm install -g markdown-link-check
fi

# Configuration file for markdown-link-check
CONFIG_FILE=$(mktemp)
cat > "$CONFIG_FILE" << EOF
{
  "ignorePatterns": [
    {
      "pattern": "^#"
    },
    {
      "pattern": "^mailto:"
    }
  ],
  "replacementPatterns": [
    {
      "pattern": "^/",
      "replacement": "file://$(pwd)/"
    }
  ],
  "timeout": "5s",
  "retryOn429": true,
  "retryCount": 3,
  "fallbackRetryDelay": "30s"
}
EOF

# Find all markdown files in the specified directory
echo -e "${YELLOW}Searching for markdown files in ${SEARCH_DIR}...${NC}"
FILES=$(find "$SEARCH_DIR" -name "*.md" | sort)

if [ -z "$FILES" ]; then
    echo -e "${RED}No markdown files found in ${SEARCH_DIR}${NC}"
    rm "$CONFIG_FILE"
    exit 1
fi

TOTAL_FILES=$(echo "$FILES" | wc -l)
TOTAL_FILES=$(echo "$TOTAL_FILES" | tr -d '[:space:]')
echo -e "${GREEN}Found ${TOTAL_FILES} markdown files to check${NC}"

# Variables to track results
PASSED=0
FAILED=0
FAILED_FILES=""

# Process each file
for FILE in $FILES; do
    echo -e "${YELLOW}Checking links in ${FILE}...${NC}"
    
    # Run markdown-link-check
    if markdown-link-check --config "$CONFIG_FILE" "$FILE" | grep -q "ERROR"; then
        echo -e "${RED}❌ Failed: ${FILE}${NC}"
        FAILED=$((FAILED+1))
        FAILED_FILES="${FAILED_FILES}\n${FILE}"
    else
        echo -e "${GREEN}✅ Passed: ${FILE}${NC}"
        PASSED=$((PASSED+1))
    fi
done

# Clean up
rm "$CONFIG_FILE"

# Print summary
echo -e "\n${YELLOW}=== Summary ===${NC}"
echo -e "${GREEN}✅ ${PASSED} files passed${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ ${FAILED} files failed:${FAILED_FILES}${NC}"
    exit 1
else
    echo -e "${GREEN}All links are valid!${NC}"
    exit 0
fi
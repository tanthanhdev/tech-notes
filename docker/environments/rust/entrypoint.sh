#!/bin/bash
set -e

FILE=$1
FILENAME=$(basename "$FILE")

echo "Running $FILENAME with rustc..."
rustc -o temp_executable "$FILE" && ./temp_executable
rm -f temp_executable

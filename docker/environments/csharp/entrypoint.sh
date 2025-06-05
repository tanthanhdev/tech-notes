#!/bin/bash
set -e

FILE=$1
FILENAME=$(basename "$FILE")
OUTPUT_NAME="${FILENAME%.*}"

echo "Compiling $FILENAME..."
csc /out:"$OUTPUT_NAME.exe" "$FILE"

echo "Running $OUTPUT_NAME.exe..."
mono "$OUTPUT_NAME.exe"

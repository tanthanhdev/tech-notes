#!/bin/bash
set -e

FILE=$1
FILENAME=$(basename "$FILE")
EXTENSION="${FILENAME##*.}"
OUTPUT_NAME="${FILENAME%.*}"

echo "Compiling $FILENAME..."
if [ "$EXTENSION" == "c" ]; then
    gcc -o "$OUTPUT_NAME" "$FILE" -lm
elif [ "$EXTENSION" == "cpp" ]; then
    g++ -o "$OUTPUT_NAME" "$FILE" -std=c++17
else
    echo "Unsupported file extension: $EXTENSION"
    exit 1
fi

echo "Running $OUTPUT_NAME..."
./"$OUTPUT_NAME"

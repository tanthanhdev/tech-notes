#!/bin/bash
set -e

FILE=$1
FILENAME=$(basename "$FILE")
CLASSNAME="${FILENAME%.*}"

echo "Compiling $FILENAME..."
javac "$FILE"

echo "Running $CLASSNAME..."
java -cp "$(dirname "$FILE")" "$CLASSNAME"

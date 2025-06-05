#!/bin/bash
set -e

if [ $# -lt 1 ]; then
    echo "Usage: $0 <snippet_file_path>"
    exit 1
fi

SNIPPET_PATH="$1"
EXTENSION="${SNIPPET_PATH##*.}"

# Map file extensions to Docker services
case "$EXTENSION" in
    py)
        SERVICE="python"
        ;;
    js)
        SERVICE="javascript"
        ;;
    java)
        SERVICE="java"
        ;;
    c|cpp)
        SERVICE="cpp"
        ;;
    go)
        SERVICE="go"
        ;;
    rs)
        SERVICE="rust"
        ;;
    php)
        SERVICE="php"
        ;;
    cs)
        SERVICE="csharp"
        ;;
    rb)
        SERVICE="ruby"
        ;;
    sh)
        SERVICE="shell"
        ;;
    ipynb)
        SERVICE="databricks"
        ;;
    *)
        echo "Unsupported file extension: $EXTENSION"
        exit 1
        ;;
esac

# Get absolute path from relative path
ABSOLUTE_PATH=$(realpath "$SNIPPET_PATH")
# Get the path relative to the project root
RELATIVE_PATH=$(realpath --relative-to="$(pwd)" "$ABSOLUTE_PATH")

# Special handling for shell scripts
if [ "$EXTENSION" == "sh" ]; then
    echo "Running $RELATIVE_PATH in $SERVICE environment..."
    # Make the script executable in the container and run it
    docker-compose run --rm "$SERVICE" -c "chmod +x /app/$RELATIVE_PATH && /app/$RELATIVE_PATH"
elif [ "$EXTENSION" == "ipynb" ]; then
    echo "Running Jupyter notebook $RELATIVE_PATH in $SERVICE environment..."
    docker-compose run --rm "$SERVICE" -m jupyter nbconvert --execute --to notebook --inplace "/app/$RELATIVE_PATH"
else
    echo "Running $RELATIVE_PATH in $SERVICE environment..."
    docker-compose run --rm "$SERVICE" "/app/$RELATIVE_PATH"
fi

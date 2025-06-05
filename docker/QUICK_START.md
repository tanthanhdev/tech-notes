# Docker Quick Start Guide

This guide will help you get started with running code snippets in Docker environments.

## Prerequisites

1. Docker installed on your machine
2. Docker Compose installed on your machine

## Getting Started

### 1. Build the Docker Environments

First, build all the Docker environments:

```bash
# Using Docker Compose directly
docker-compose build

# Or using the Makefile
make build
```

### 2. Run a Code Snippet

You can run any code snippet from the repository using the provided script:

```bash
# Using the script directly
./docker/run-snippet.sh snippets/algorithms/graph-traversal/graph_traversal.py

# Or using the Makefile
make run-snippet FILE=snippets/algorithms/graph-traversal/graph_traversal.py
```

The script automatically detects the file extension and uses the appropriate Docker container for the language.

### 3. Running Different Languages

The setup supports multiple programming languages:

- **Python**: `.py` files
- **JavaScript**: `.js` files
- **Java**: `.java` files
- **C/C++**: `.c` and `.cpp` files
- **Go**: `.go` files
- **Rust**: `.rs` files
- **PHP**: `.php` files
- **C#**: `.cs` files
- **Ruby**: `.rb` files

### 4. Troubleshooting

If you encounter any issues:

1. Make sure Docker and Docker Compose are installed and running
2. Verify that the Docker daemon is running
3. Check the file path provided to the run-snippet script
4. Ensure the file extension is supported

For more detailed information, see the [Docker README](README.md).

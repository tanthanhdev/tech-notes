# Docker Environment for Tech Notes Hub

This directory contains Docker configurations for running code snippets in various programming languages and environments.

## Directory Structure

- `environments/` - Contains Dockerfiles and setup scripts for each language
  - `python/` - Python environment
  - `javascript/` - JavaScript/Node.js environment
  - `java/` - Java environment
  - `cpp/` - C/C++ environment
  - `go/` - Go environment
  - `rust/` - Rust environment
  - `php/` - PHP environment
  - `csharp/` - C# environment
  - `ruby/` - Ruby environment
  - `databases/` - Database environments
    - `mysql/` - MySQL environment
    - `postgresql/` - PostgreSQL environment
    - `mongodb/` - MongoDB environment
    - `redis/` - Redis environment
    - `sqlite/` - SQLite environment
  - `shell/` - Shell environment for Linux scripts and DevOps
  - `databricks/` - Databricks/PySpark environment for data processing

## Usage

### Running a Snippet

Use the provided `run-snippet.sh` script to run a code snippet in the appropriate Docker environment:

```bash
./docker/run-snippet.sh snippets/algorithms/graph-traversal/graph_traversal.py
```

The script automatically detects the file extension and uses the appropriate Docker container.

### Running a Snippet with Database Connection

Use the provided `run-db-snippet.sh` script to run a code snippet with a database connection:

```bash
./docker/run-db-snippet.sh mysql snippets/databases/mysql_example.py
```

The script starts the specified database, connects it to your code environment, and runs the code with the appropriate connection parameters.

For more information on using databases, see the [Database Guide](DATABASE_GUIDE.md).

### Building All Environments

To build all Docker environments without running them:

```bash
docker-compose build
```

### Running a Specific Environment

To run a specific environment:

```bash
docker-compose run --rm python snippets/path/to/your/script.py
docker-compose run --rm javascript snippets/path/to/your/script.js
docker-compose run --rm java snippets/path/to/your/script.java
# etc.
```

### Database Operations

To start a specific database:

```bash
docker-compose -f docker/environments/databases/docker-compose.yml up -d mysql
# Or using the Makefile
make db-start DB=mysql
```

To stop a database:

```bash
docker-compose -f docker/environments/databases/docker-compose.yml stop mysql
# Or using the Makefile
make db-stop DB=mysql
```

### Database Environment Variables

The database configurations use environment variables for sensitive information. A `.env.example` file is provided in the `docker/environments/databases/` directory as a template.

To use custom database credentials:

1. Copy the example file to create a `.env` file:
   ```bash
   cp docker/environments/databases/.env.example docker/environments/databases/.env
   ```

2. Edit the `.env` file to set your own credentials.

3. The `.env` file is included in `.gitignore` to ensure sensitive data isn't committed to the repository.

## Adding New Languages

To add support for a new language:

1. Create a new directory in `environments/` for your language
2. Add a `Dockerfile` for the language
3. If needed, add an `entrypoint.sh` script for handling compilation/execution
4. Update the `docker-compose.yml` file to include your new service
5. Update the `run-snippet.sh` script to recognize the new file extension

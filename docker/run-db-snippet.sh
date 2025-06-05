#!/bin/bash
set -e

if [ $# -lt 2 ]; then
    echo "Usage: $0 <database_type> <snippet_file_path>"
    echo "Database types: mysql, postgres, mongodb, redis, sqlite"
    exit 1
fi

DB_TYPE="$1"
SNIPPET_PATH="$2"
EXTENSION="${SNIPPET_PATH##*.}"

# Load environment variables from .env file if it exists
ENV_FILE="docker/environments/databases/.env"
if [ -f "$ENV_FILE" ]; then
    echo "Loading environment variables from $ENV_FILE"
    export $(grep -v '^#' "$ENV_FILE" | xargs)
else
    echo "No .env file found at $ENV_FILE, using default values"
fi

# Start the selected database
function start_database() {
    echo "Starting $DB_TYPE database..."
    docker-compose -f docker/environments/databases/docker-compose.yml up -d "$DB_TYPE"

    # Give some time for the database to start
    sleep 5

    echo "$DB_TYPE database is ready."
}

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
    *)
        echo "Unsupported file extension: $EXTENSION"
        exit 1
        ;;
esac

# Get the database connection details
case "$DB_TYPE" in
    mysql)
        DB_HOST="tech-notes-mysql"
        DB_PORT="3306"
        DB_USER="${MYSQL_USER:-user}"
        DB_PASS="${MYSQL_PASSWORD:-password}"
        DB_NAME="${MYSQL_DATABASE:-tech_notes}"
        DB_CONN_STR="mysql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME"
        ;;
    postgres)
        DB_HOST="tech-notes-postgres"
        DB_PORT="5432"
        DB_USER="${POSTGRES_USER:-user}"
        DB_PASS="${POSTGRES_PASSWORD:-password}"
        DB_NAME="${POSTGRES_DB:-tech_notes}"
        DB_CONN_STR="postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME"
        ;;
    mongodb)
        DB_HOST="tech-notes-mongodb"
        DB_PORT="27017"
        DB_USER="${MONGO_USER:-user}"
        DB_PASS="${MONGO_PASSWORD:-password}"
        DB_NAME="${MONGO_INITDB_DATABASE:-tech_notes}"
        DB_CONN_STR="mongodb://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME"
        ;;
    redis)
        DB_HOST="tech-notes-redis"
        DB_PORT="6379"
        DB_PASS="${REDIS_PASSWORD:-}"
        if [ -n "$DB_PASS" ]; then
            DB_CONN_STR="redis://:$DB_PASS@$DB_HOST:$DB_PORT"
        else
            DB_CONN_STR="redis://$DB_HOST:$DB_PORT"
        fi
        ;;
    sqlite)
        DB_CONN_STR="sqlite:///data/tech_notes.db"
        ;;
    *)
        echo "Unsupported database type: $DB_TYPE"
        exit 1
        ;;
esac

# Start the database
start_database

# Get absolute path from relative path
ABSOLUTE_PATH=$(realpath "$SNIPPET_PATH")
# Get the path relative to the project root
RELATIVE_PATH=$(realpath --relative-to="$(pwd)" "$ABSOLUTE_PATH")

# Create a custom docker network if it doesn't exist
if ! docker network inspect tech-notes-network >/dev/null 2>&1; then
    echo "Creating docker network: tech-notes-network"
    docker network create tech-notes-network

    # Add the database container to the network
    echo "Adding $DB_TYPE database to the network"
    docker network connect tech-notes-network "tech-notes-$DB_TYPE"
fi

echo "Running $RELATIVE_PATH in $SERVICE environment with $DB_TYPE database..."
docker-compose run --rm \
    --network tech-notes-network \
    -e DB_HOST="$DB_HOST" \
    -e DB_PORT="$DB_PORT" \
    -e DB_USER="$DB_USER" \
    -e DB_PASS="$DB_PASS" \
    -e DB_NAME="$DB_NAME" \
    -e DB_CONN_STR="$DB_CONN_STR" \
    "$SERVICE" "/app/$RELATIVE_PATH"

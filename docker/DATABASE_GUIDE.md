# Database Usage Guide with Docker

This guide helps you run code snippets with connections to databases in Docker environments.

## Supported Databases

- **MySQL** (8.0)
- **PostgreSQL** (15)
- **MongoDB** (6)
- **Redis** (7)
- **SQLite** (3.x)

## How to Use

### 1. Start a Specific Database

```bash
# Using Docker Compose directly
docker-compose -f docker/environments/databases/docker-compose.yml up -d mysql

# Or using the Makefile
make db-start DB=mysql
```

Valid values for DB are: `mysql`, `postgres`, `mongodb`, `redis`, `sqlite`

### 2. Run a Code Snippet with Database Connection

```bash
# Using the script directly
./docker/run-db-snippet.sh mysql snippets/databases/mysql_example.py

# Or using the Makefile
make db-run-snippet DB=mysql FILE=snippets/databases/mysql_example.py
```

### 3. Stop a Database When Not in Use

```bash
# Using Docker Compose directly
docker-compose -f docker/environments/databases/docker-compose.yml stop mysql

# Or using the Makefile
make db-stop DB=mysql
```

## Database Connection Information

When running a code snippet with a database, the following environment variables will be automatically passed to the container:

- `DB_HOST`: Database hostname
- `DB_PORT`: Database port
- `DB_USER`: Username for connection
- `DB_PASS`: Password for connection
- `DB_NAME`: Database name
- `DB_CONN_STR`: Full connection string

### Default Connection Strings

- **MySQL**: `mysql://user:password@tech-notes-mysql:3306/tech_notes`
- **PostgreSQL**: `postgresql://user:password@tech-notes-postgres:5432/tech_notes`
- **MongoDB**: `mongodb://user:password@tech-notes-mongodb:27017/tech_notes`
- **Redis**: `redis://tech-notes-redis:6379`
- **SQLite**: `sqlite:///data/tech_notes.db`

### Environment Variables Configuration

To change the default connection information, you can create a `.env` file in the `docker/environments/databases/` directory:

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp docker/environments/databases/.env.example docker/environments/databases/.env
   ```

2. Edit the `.env` file to change the connection information (usernames, passwords, database names, etc.)

3. When running the `run-db-snippet.sh` command or `make db-run-snippet`, the environment variables from the `.env` file will be automatically used.

Note: The `.env` file has been added to `.gitignore` to prevent it from being tracked by Git, ensuring sensitive information is not pushed to the repository.

## Example Connection Code

### Python with MySQL

```python
import os
import mysql.connector

# Get connection info from environment variables
db_host = os.environ.get('DB_HOST', 'localhost')
db_port = os.environ.get('DB_PORT', '3306')
db_user = os.environ.get('DB_USER', 'user')
db_pass = os.environ.get('DB_PASS', 'password')
db_name = os.environ.get('DB_NAME', 'tech_notes')

# Connect to the database
conn = mysql.connector.connect(
    host=db_host,
    port=db_port,
    user=db_user,
    password=db_pass,
    database=db_name
)

cursor = conn.cursor()
cursor.execute("SELECT * FROM users")
users = cursor.fetchall()

for user in users:
    print(user)

conn.close()
```

### JavaScript with MongoDB

```javascript
const { MongoClient } = require('mongodb');

// Get connection string from environment variable
const uri = process.env.DB_CONN_STR || 'mongodb://user:password@localhost:27017/tech_notes';

async function main() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('tech_notes');
        const users = database.collection('users');

        const query = {};
        const cursor = users.find(query);

        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }

        await cursor.forEach(user => {
            console.log(user);
        });

    } finally {
        await client.close();
    }
}

main().catch(console.error);
```

## Sample Data

Each database has been configured with the following sample data:

- `users` table/collection with 3 users
- `posts` table/collection with 4 posts linked to users

You can see the details of the sample data in the init files in the respective directory of each database.


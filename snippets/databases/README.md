# Database Code Examples

This directory contains code examples for working with various relational databases in different programming languages.

## Contents

- `sql_examples.py` - Python examples for SQLite, PostgreSQL, MySQL, and SQLAlchemy ORM
- `relational_db_examples.cs` - C# examples for SQLite, SQL Server, MySQL, PostgreSQL, and Dapper ORM

## Setup Instructions

### Environment Variables

For security reasons, all database connection credentials are loaded from environment variables. Follow these steps to set up your environment:

1. Copy the example environment file to create your own `.env` file:
   ```bash
   cp envv.example .env
   ```

2. Edit the `.env` file with your actual database credentials:
   ```
   # Example for PostgreSQL
   PG_HOST=localhost
   PG_DATABASE=yourdb
   PG_USER=yourusername
   PG_PASSWORD=yourpassword
   ```

3. Make sure your `.env` file is included in `.gitignore` to prevent committing sensitive information.

### Python Setup

To run the Python examples:

1. Install required dependencies:
   ```bash
   pip install python-dotenv
   
   # For SQLite (built into Python)
   # No additional installation needed
   
   # For PostgreSQL
   pip install psycopg2-binary
   
   # For MySQL
   pip install mysql-connector-python
   
   # For SQLAlchemy ORM
   pip install sqlalchemy
   ```

2. Run the examples:
   ```bash
   python sql_examples.py
   ```

### C# Setup

To run the C# examples:

1. Install required NuGet packages:
   ```bash
   # For SQLite
   dotnet add package Microsoft.Data.Sqlite
   
   # For SQL Server
   dotnet add package Microsoft.Data.SqlClient
   
   # For MySQL
   dotnet add package MySql.Data
   
   # For PostgreSQL
   dotnet add package Npgsql
   
   # For Dapper ORM
   dotnet add package Dapper
   ```

2. Build and run the examples:
   ```bash
   dotnet build
   dotnet run
   ```

## Usage Examples

### Python SQLite Example

```python
import sqlite3
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get database path from environment variable
db_path = os.environ.get("SQLITE_DB_PATH", ":memory:")

# Connect to SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create a table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
)
''')

# Insert data
cursor.execute('INSERT INTO users (name, email) VALUES (?, ?)', 
               ('John Doe', 'john@example.com'))
conn.commit()

# Query data
cursor.execute('SELECT * FROM users')
print(cursor.fetchall())

# Close connection
conn.close()
```

### C# SQLite Example

```csharp
using System;
using Microsoft.Data.Sqlite;

// Get connection string from environment variable
string connectionString = Environment.GetEnvironmentVariable("SQLITE_CONNECTION_STRING") 
    ?? "Data Source=:memory:";

using (var connection = new SqliteConnection(connectionString))
{
    connection.Open();
    
    // Create a table
    using (var command = connection.CreateCommand())
    {
        command.CommandText = @"
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE
            )";
        command.ExecuteNonQuery();
    }
    
    // Insert data
    using (var command = connection.CreateCommand())
    {
        command.CommandText = @"
            INSERT INTO users (name, email)
            VALUES (@name, @email)";
        command.Parameters.AddWithValue("@name", "Jane Smith");
        command.Parameters.AddWithValue("@email", "jane@example.com");
        command.ExecuteNonQuery();
    }
    
    // Query data
    using (var command = connection.CreateCommand())
    {
        command.CommandText = "SELECT * FROM users";
        using (var reader = command.ExecuteReader())
        {
            while (reader.Read())
            {
                Console.WriteLine($"ID: {reader.GetInt32(0)}, Name: {reader.GetString(1)}, Email: {reader.GetString(2)}");
            }
        }
    }
}
```

## Security Best Practices

1. Never hardcode database credentials in your source code
2. Always use parameterized queries to prevent SQL injection
3. Store connection strings and credentials in environment variables or a secure configuration system
4. Use the principle of least privilege for database users
5. Encrypt sensitive data before storing it in the database
6. Regularly update database drivers and libraries to patch security vulnerabilities 
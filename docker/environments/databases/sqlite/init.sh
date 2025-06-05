#!/bin/bash

# Create the database if it doesn't exist
if [ ! -f /data/tech_notes.db ]; then
    echo "Creating new SQLite database..."
    sqlite3 /data/tech_notes.db < /init.sql
    echo "Database created and initialized."
else
    echo "Database already exists."
fi

# Keep container running
echo "SQLite container is ready. Database is at /data/tech_notes.db"
echo "Use 'docker exec -it tech-notes-sqlite sqlite3 /data/tech_notes.db' to access the database."
tail -f /dev/null

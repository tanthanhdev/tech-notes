# Ví Dụ Mã Nguồn Cơ Sở Dữ Liệu

Thư mục này chứa các ví dụ mã nguồn để làm việc với nhiều cơ sở dữ liệu quan hệ khác nhau trong các ngôn ngữ lập trình khác nhau.

## Nội Dung

- `sql_examples.py` - Ví dụ Python cho SQLite, PostgreSQL, MySQL, và SQLAlchemy ORM
- `relational_db_examples.cs` - Ví dụ C# cho SQLite, SQL Server, MySQL, PostgreSQL, và Dapper ORM

## Hướng Dẫn Cài Đặt

### Biến Môi Trường

Vì lý do bảo mật, tất cả thông tin đăng nhập cơ sở dữ liệu được tải từ biến môi trường. Làm theo các bước sau để thiết lập môi trường của bạn:

1. Sao chép tệp môi trường mẫu để tạo tệp `.env` của riêng bạn:
   ```bash
   cp envv.example .env
   ```

2. Chỉnh sửa tệp `.env` với thông tin đăng nhập cơ sở dữ liệu thực tế của bạn:
   ```
   # Ví dụ cho PostgreSQL
   PG_HOST=localhost
   PG_DATABASE=yourdb
   PG_USER=yourusername
   PG_PASSWORD=yourpassword
   ```

3. Đảm bảo tệp `.env` của bạn được bao gồm trong `.gitignore` để tránh commit thông tin nhạy cảm.

### Cài Đặt Python

Để chạy các ví dụ Python:

1. Cài đặt các gói phụ thuộc cần thiết:
   ```bash
   pip install python-dotenv

   # Cho SQLite (đã tích hợp sẵn trong Python)
   # Không cần cài đặt thêm

   # Cho PostgreSQL
   pip install psycopg2-binary

   # Cho MySQL
   pip install mysql-connector-python

   # Cho SQLAlchemy ORM
   pip install sqlalchemy
   ```

2. Chạy các ví dụ:
   ```bash
   python sql_examples.py
   ```

### Cài Đặt C#

Để chạy các ví dụ C#:

1. Cài đặt các gói NuGet cần thiết:
   ```bash
   # Cho SQLite
   dotnet add package Microsoft.Data.Sqlite

   # Cho SQL Server
   dotnet add package Microsoft.Data.SqlClient

   # Cho MySQL
   dotnet add package MySql.Data

   # Cho PostgreSQL
   dotnet add package Npgsql

   # Cho Dapper ORM
   dotnet add package Dapper
   ```

2. Biên dịch và chạy các ví dụ:
   ```bash
   dotnet build
   dotnet run
   ```

## Ví Dụ Sử Dụng

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

## Các Phương Pháp Tốt Nhất về Bảo Mật

1. Không bao giờ mã hóa cứng thông tin đăng nhập cơ sở dữ liệu trong mã nguồn của bạn
2. Luôn sử dụng truy vấn có tham số để ngăn chặn SQL injection
3. Lưu trữ chuỗi kết nối và thông tin đăng nhập trong biến môi trường hoặc hệ thống cấu hình bảo mật
4. Áp dụng nguyên tắc đặc quyền tối thiểu cho người dùng cơ sở dữ liệu
5. Mã hóa dữ liệu nhạy cảm trước khi lưu trữ trong cơ sở dữ liệu
6. Thường xuyên cập nhật trình điều khiển và thư viện cơ sở dữ liệu để vá các lỗ hổng bảo mật
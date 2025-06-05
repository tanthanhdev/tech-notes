# Hướng Dẫn Sử Dụng Database với Docker

Hướng dẫn này giúp bạn chạy code snippets có kết nối tới các database trong môi trường Docker.

## Các Database Được Hỗ Trợ

- **MySQL** (8.0)
- **PostgreSQL** (15)
- **MongoDB** (6)
- **Redis** (7)
- **SQLite** (3.x)

## Cách Sử Dụng

### 1. Khởi động một Database cụ thể

```bash
# Sử dụng Docker Compose trực tiếp
docker-compose -f docker/environments/databases/docker-compose.yml up -d mysql

# Hoặc sử dụng Makefile
make db-start DB=mysql
```

Các giá trị hợp lệ cho DB là: `mysql`, `postgres`, `mongodb`, `redis`, `sqlite`

### 2. Chạy Code Snippet với kết nối Database

```bash
# Sử dụng script trực tiếp
./docker/run-db-snippet.sh mysql snippets/databases/mysql_example.py

# Hoặc sử dụng Makefile
make db-run-snippet DB=mysql FILE=snippets/databases/mysql_example.py
```

### 3. Tắt Database khi không sử dụng

```bash
# Sử dụng Docker Compose trực tiếp
docker-compose -f docker/environments/databases/docker-compose.yml stop mysql

# Hoặc sử dụng Makefile
make db-stop DB=mysql
```

## Thông Tin Kết Nối Database

Khi chạy code snippet với database, các biến môi trường sau sẽ được tự động truyền vào container:

- `DB_HOST`: Hostname của database
- `DB_PORT`: Port của database
- `DB_USER`: Username để kết nối
- `DB_PASS`: Password để kết nối
- `DB_NAME`: Tên database
- `DB_CONN_STR`: Connection string đầy đủ

### Các Connection String Mặc Định

- **MySQL**: `mysql://user:password@tech-notes-mysql:3306/tech_notes`
- **PostgreSQL**: `postgresql://user:password@tech-notes-postgres:5432/tech_notes`
- **MongoDB**: `mongodb://user:password@tech-notes-mongodb:27017/tech_notes`
- **Redis**: `redis://tech-notes-redis:6379`
- **SQLite**: `sqlite:///data/tech_notes.db`

### Cấu Hình Biến Môi Trường

Để thay đổi các thông tin kết nối mặc định, bạn có thể tạo một file `.env` trong thư mục `docker/environments/databases/`:

1. Sao chép file `.env.example` thành `.env`:
   ```bash
   cp docker/environments/databases/.env.example docker/environments/databases/.env
   ```

2. Chỉnh sửa file `.env` để thay đổi các thông tin kết nối (tên người dùng, mật khẩu, tên database, v.v.)

3. Khi chạy lệnh `run-db-snippet.sh` hoặc `make db-run-snippet`, các biến môi trường từ file `.env` sẽ được tự động sử dụng.

Lưu ý: File `.env` đã được thêm vào `.gitignore` để không theo dõi bởi Git, đảm bảo thông tin nhạy cảm không bị đưa lên repository.

## Ví Dụ Code Kết Nối

### Python với MySQL

```python
import os
import mysql.connector

# Lấy thông tin kết nối từ biến môi trường
db_host = os.environ.get('DB_HOST', 'localhost')
db_port = os.environ.get('DB_PORT', '3306')
db_user = os.environ.get('DB_USER', 'user')
db_pass = os.environ.get('DB_PASS', 'password')
db_name = os.environ.get('DB_NAME', 'tech_notes')

# Kết nối tới database
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

### JavaScript với MongoDB

```javascript
const { MongoClient } = require('mongodb');

// Lấy connection string từ biến môi trường
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

## Dữ Liệu Mẫu

Mỗi database đã được cấu hình với dữ liệu mẫu sau:

- Bảng/Collection `users` với 3 người dùng
- Bảng/Collection `posts` với 4 bài viết liên kết với người dùng

Bạn có thể xem chi tiết dữ liệu mẫu trong các file init trong thư mục tương ứng của mỗi database.

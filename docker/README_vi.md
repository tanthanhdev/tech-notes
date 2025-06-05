# Môi Trường Docker cho Tech Notes Hub

Thư mục này chứa các cấu hình Docker để chạy các đoạn mã trong nhiều ngôn ngữ lập trình và môi trường khác nhau.

## Cấu Trúc Thư Mục

- `environments/` - Chứa Dockerfiles và scripts cài đặt cho mỗi ngôn ngữ
  - `python/` - Môi trường Python
  - `javascript/` - Môi trường JavaScript/Node.js
  - `java/` - Môi trường Java
  - `cpp/` - Môi trường C/C++
  - `go/` - Môi trường Go
  - `rust/` - Môi trường Rust
  - `php/` - Môi trường PHP
  - `csharp/` - Môi trường C#
  - `ruby/` - Môi trường Ruby
  - `databases/` - Môi trường Cơ sở dữ liệu
    - `mysql/` - Môi trường MySQL
    - `postgresql/` - Môi trường PostgreSQL
    - `mongodb/` - Môi trường MongoDB
    - `redis/` - Môi trường Redis
    - `sqlite/` - Môi trường SQLite
  - `shell/` - Môi trường Shell cho scripts Linux và DevOps
  - `databricks/` - Môi trường Databricks/PySpark cho xử lý dữ liệu

## Cách Sử Dụng

### Chạy Một Đoạn Mã

Sử dụng script `run-snippet.sh` được cung cấp để chạy một đoạn mã trong môi trường Docker phù hợp:

```bash
./docker/run-snippet.sh snippets/algorithms/graph-traversal/graph_traversal.py
```

Script tự động phát hiện phần mở rộng tệp và sử dụng container Docker thích hợp.

### Chạy Đoạn Mã với Kết Nối Cơ Sở Dữ Liệu

Sử dụng script `run-db-snippet.sh` được cung cấp để chạy một đoạn mã với kết nối cơ sở dữ liệu:

```bash
./docker/run-db-snippet.sh mysql snippets/databases/mysql_example.py
```

Script sẽ khởi động cơ sở dữ liệu được chỉ định, kết nối nó với môi trường mã của bạn, và chạy mã với các tham số kết nối thích hợp.

Để biết thêm thông tin về việc sử dụng cơ sở dữ liệu, xem [Hướng Dẫn Cơ Sở Dữ Liệu](DATABASE_GUIDE_vi.md).

### Xây Dựng Tất Cả Các Môi Trường

Để xây dựng tất cả các môi trường Docker mà không chạy chúng:

```bash
docker-compose build
```

### Chạy Một Môi Trường Cụ Thể

Để chạy một môi trường cụ thể:

```bash
docker-compose run --rm python snippets/path/to/your/script.py
docker-compose run --rm javascript snippets/path/to/your/script.js
docker-compose run --rm java snippets/path/to/your/script.java
# v.v.
```

### Thao Tác Cơ Sở Dữ Liệu

Để khởi động một cơ sở dữ liệu cụ thể:

```bash
docker-compose -f docker/environments/databases/docker-compose.yml up -d mysql
# Hoặc sử dụng Makefile
make db-start DB=mysql
```

Để dừng một cơ sở dữ liệu:

```bash
docker-compose -f docker/environments/databases/docker-compose.yml stop mysql
# Hoặc sử dụng Makefile
make db-stop DB=mysql
```

### Biến Môi Trường Cơ Sở Dữ Liệu

Cấu hình cơ sở dữ liệu sử dụng biến môi trường cho thông tin nhạy cảm. Một file `.env.example` được cung cấp trong thư mục `docker/environments/databases/` làm mẫu.

Để sử dụng thông tin đăng nhập cơ sở dữ liệu tùy chỉnh:

1. Sao chép file mẫu để tạo file `.env`:
   ```bash
   cp docker/environments/databases/.env.example docker/environments/databases/.env
   ```

2. Chỉnh sửa file `.env` để đặt thông tin đăng nhập của riêng bạn.

3. File `.env` được bao gồm trong `.gitignore` để đảm bảo dữ liệu nhạy cảm không được commit vào repository.

## Thêm Ngôn Ngữ Mới

Để thêm hỗ trợ cho một ngôn ngữ mới:

1. Tạo một thư mục mới trong `environments/` cho ngôn ngữ của bạn
2. Thêm một `Dockerfile` cho ngôn ngữ đó
3. Nếu cần, thêm một script `entrypoint.sh` để xử lý biên dịch/thực thi
4. Cập nhật tệp `docker-compose.yml` để bao gồm dịch vụ mới của bạn
5. Cập nhật script `run-snippet.sh` để nhận diện phần mở rộng tệp mới

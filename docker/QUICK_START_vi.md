# Hướng Dẫn Nhanh Docker

Hướng dẫn này sẽ giúp bạn bắt đầu chạy các đoạn mã trong môi trường Docker.

## Yêu Cầu Tiên Quyết

1. Docker đã được cài đặt trên máy của bạn
2. Docker Compose đã được cài đặt trên máy của bạn

## Bắt Đầu

### 1. Xây Dựng Môi Trường Docker

Đầu tiên, xây dựng tất cả các môi trường Docker:

```bash
# Sử dụng Docker Compose trực tiếp
docker-compose build

# Hoặc sử dụng Makefile
make build
```

### 2. Chạy Một Đoạn Mã

Bạn có thể chạy bất kỳ đoạn mã nào từ kho lưu trữ bằng script được cung cấp:

```bash
# Sử dụng script trực tiếp
./docker/run-snippet.sh snippets/algorithms/graph-traversal/graph_traversal.py

# Hoặc sử dụng Makefile
make run-snippet FILE=snippets/algorithms/graph-traversal/graph_traversal.py
```

Script tự động phát hiện phần mở rộng tệp và sử dụng container Docker thích hợp cho ngôn ngữ đó.

### 3. Chạy Các Ngôn Ngữ Khác Nhau

Thiết lập hỗ trợ nhiều ngôn ngữ lập trình:

- **Python**: Tệp `.py`
- **JavaScript**: Tệp `.js`
- **Java**: Tệp `.java`
- **C/C++**: Tệp `.c` và `.cpp`
- **Go**: Tệp `.go`
- **Rust**: Tệp `.rs`
- **PHP**: Tệp `.php`
- **C#**: Tệp `.cs`
- **Ruby**: Tệp `.rb`

### 4. Xử Lý Sự Cố

Nếu bạn gặp bất kỳ vấn đề nào:

1. Đảm bảo Docker và Docker Compose đã được cài đặt và đang chạy
2. Xác minh rằng Docker daemon đang chạy
3. Kiểm tra đường dẫn tệp được cung cấp cho script run-snippet
4. Đảm bảo phần mở rộng tệp được hỗ trợ

Để biết thông tin chi tiết hơn, hãy xem [Docker README](README_vi.md).

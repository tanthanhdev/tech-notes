# Cơ sở dữ liệu quan hệ

Cơ sở dữ liệu quan hệ là tập hợp dữ liệu có tổ chức lưu trữ thông tin trong các bảng với hàng và cột. Chúng tuân theo mô hình quan hệ do Edgar F. Codd đề xuất vào năm 1970, nhấn mạnh mối quan hệ giữa các thực thể dữ liệu.

## Khái niệm cốt lõi

### Bảng (Relations)

Cấu trúc cơ bản trong cơ sở dữ liệu quan hệ:
- Mỗi **bảng** đại diện cho một loại thực thể (ví dụ: khách hàng, sản phẩm)
- Mỗi **hàng** (tuple) đại diện cho một thể hiện của thực thể đó
- Mỗi **cột** (thuộc tính) đại diện cho một thuộc tính của thực thể đó

### Khóa

Khóa thiết lập mối quan hệ và đảm bảo tính toàn vẹn dữ liệu:

- **Khóa chính (Primary Key)**: Xác định duy nhất mỗi bản ghi trong bảng
- **Khóa ngoại (Foreign Key)**: Tham chiếu đến khóa chính trong bảng khác, thiết lập mối quan hệ
- **Khóa tổng hợp (Composite Key)**: Kết hợp nhiều cột để tạo thành định danh duy nhất
- **Khóa ứng viên (Candidate Key)**: Cột hoặc tập hợp các cột có thể đóng vai trò làm khóa chính

### Lược đồ (Schema)

Lược đồ xác định cấu trúc của cơ sở dữ liệu:
- Định nghĩa bảng
- Kiểu dữ liệu và ràng buộc cột
- Mối quan hệ giữa các bảng

## SQL (Ngôn ngữ truy vấn có cấu trúc)

SQL là ngôn ngữ tiêu chuẩn để tương tác với cơ sở dữ liệu quan hệ.

### Các lệnh SQL cơ bản

```sql
-- Tạo bảng
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    signup_date DATE
);

-- Chèn dữ liệu
INSERT INTO customers (customer_id, name, email, signup_date)
VALUES (1, 'Nguyễn Văn A', 'nguyenvana@example.com', '2023-01-15');

-- Truy vấn dữ liệu
SELECT * FROM customers WHERE signup_date > '2023-01-01';

-- Cập nhật dữ liệu
UPDATE customers SET email = 'nguyenvana.new@example.com' WHERE customer_id = 1;

-- Xóa dữ liệu
DELETE FROM customers WHERE customer_id = 1;
```

## Chuẩn hóa

Chuẩn hóa là quá trình tổ chức dữ liệu để giảm dư thừa và cải thiện tính toàn vẹn dữ liệu:

- **Dạng chuẩn 1 (1NF)**: Loại bỏ các cột trùng lặp và tạo bảng riêng cho dữ liệu liên quan
- **Dạng chuẩn 2 (2NF)**: Đáp ứng yêu cầu 1NF và loại bỏ phụ thuộc một phần
- **Dạng chuẩn 3 (3NF)**: Đáp ứng yêu cầu 2NF và loại bỏ phụ thuộc bắc cầu

## Tính chất ACID

Các giao dịch trong cơ sở dữ liệu quan hệ tuân theo tính chất ACID:

- **Tính nguyên tử (Atomicity)**: Giao dịch là các hoạt động tất cả hoặc không có gì
- **Tính nhất quán (Consistency)**: Giao dịch đưa cơ sở dữ liệu từ trạng thái hợp lệ này sang trạng thái hợp lệ khác
- **Tính cô lập (Isolation)**: Các giao dịch đồng thời không ảnh hưởng đến nhau
- **Tính bền vững (Durability)**: Giao dịch hoàn thành vẫn tồn tại ngay cả khi hệ thống gặp sự cố

## Các hệ thống cơ sở dữ liệu quan hệ phổ biến

- **MySQL**: Mã nguồn mở, được sử dụng rộng rãi cho các ứng dụng web
- **PostgreSQL**: Cơ sở dữ liệu mã nguồn mở nâng cao với nhiều tính năng mở rộng
- **Oracle Database**: Cơ sở dữ liệu thương mại cấp doanh nghiệp
- **Microsoft SQL Server**: Giải pháp cơ sở dữ liệu thương mại của Microsoft
- **SQLite**: Động cơ cơ sở dữ liệu nhẹ, không cần máy chủ

## Chỉ mục (Indexes)

Chỉ mục tăng tốc các hoạt động truy xuất dữ liệu:
- Tương tự như chỉ mục sách
- Cải thiện hiệu suất truy vấn nhưng tạo thêm chi phí cho các hoạt động ghi
- Các loại bao gồm chỉ mục B-tree, hash, và bitmap

## Joins (Kết hợp)

Joins kết hợp các bản ghi từ hai hoặc nhiều bảng:
- **INNER JOIN**: Trả về các bản ghi có giá trị khớp trong cả hai bảng
- **LEFT JOIN**: Trả về tất cả bản ghi từ bảng bên trái và các bản ghi khớp từ bảng bên phải
- **RIGHT JOIN**: Trả về tất cả bản ghi từ bảng bên phải và các bản ghi khớp từ bảng bên trái
- **FULL JOIN**: Trả về tất cả bản ghi khi có sự khớp trong một trong hai bảng

```sql
SELECT customers.name, orders.order_date
FROM customers
INNER JOIN orders ON customers.customer_id = orders.customer_id;
```

## Khi nào sử dụng cơ sở dữ liệu quan hệ

Cơ sở dữ liệu quan hệ lý tưởng cho:
- Dữ liệu có cấu trúc với mối quan hệ rõ ràng
- Ứng dụng yêu cầu truy vấn phức tạp và giao dịch
- Hệ thống mà tính toàn vẹn dữ liệu là rất quan trọng
- Các tình huống mà tính nhất quán quan trọng hơn tốc độ

## Tài liệu tham khảo

- Codd, E.F. (1970). "A Relational Model of Data for Large Shared Data Banks"
- Date, C.J. "An Introduction to Database Systems"
- Garcia-Molina, H., Ullman, J.D., & Widom, J. "Database Systems: The Complete Book" 
# Đóng góp vào Tech Notes Hub

Trước hết, xin chân thành cảm ơn bạn đã dành thời gian đóng góp! 🎉  
Sự đóng góp của bạn giúp dự án này trở nên hữu ích hơn cho cộng đồng lập trình viên.

## 🚀 Cách bạn có thể đóng góp

Có nhiều hình thức để bạn tham gia:

- 📚 Thêm ghi chú kỹ thuật hoặc chủ đề mới
- 💡 Cải thiện các phần giải thích hoặc đoạn mã hiện có
- 🐛 Báo lỗi hoặc đề xuất cải tiến
- ✨ Dọn dẹp, chuẩn hóa định dạng nội dung
- 🌍 Dịch các ghi chú sang ngôn ngữ khác (tính năng sắp ra mắt)

## 📝 Hướng dẫn đóng góp

Vui lòng tuân theo các hướng dẫn sau để đảm bảo tính nhất quán và dễ quản lý:

### 1. Fork Repository

Nhấn nút "Fork" ở góc trên bên phải trang GitHub để tạo một bản sao của repository vào tài khoản của bạn.

### 2. Clone về máy

```bash
git clone https://github.com/ten-cua-ban/tech-notes.git
cd tech-notes-hub
```

### 3. Tạo nhánh mới

Đặt tên nhánh rõ ràng, mô tả ngắn gọn nội dung bạn sẽ thêm hoặc sửa:

```bash
git checkout -b feature/add-graph-algorithms
```

### 🧩 Quy tắc đặt tên nhánh (branch naming)

Tên nhánh nên theo cấu trúc:

```bash
<loại-thay-đổi>/<mô-tả-ngắn-gọn>
```

| Loại       | Ý nghĩa                                                  | Ví dụ                            |
| ---------- | -------------------------------------------------------- | -------------------------------- |
| `feature`  | Thêm ghi chú/mục mới                                     | `feature/add-docker-notes`       |
| `fix`      | Sửa lỗi nội dung, chính tả, ví dụ                        | `fix/typo-in-graph-note`         |
| `update`   | Cập nhật hoặc cải tiến ghi chú hiện có                   | `update/aws-ec2-note`            |
| `refactor` | Tái cấu trúc lại file/nội dung mà không thay đổi ý chính | `refactor/reorganize-folders`    |
| `remove`   | Xoá nội dung lỗi thời hoặc không còn phù hợp             | `remove/duplicate-array-example` |
| `docs`     | Cập nhật tài liệu dự án như README, CONTRIBUTING,...     | `docs/improve-readme`            |

### 4. Thực hiện thay đổi

* Tuân theo cấu trúc thư mục và file có sẵn
* Ghi chú dùng định dạng Markdown (`.md`)
* Mã nguồn nên đặt trong khối mã (fenced code block) ví dụ: \`\`\`python
* Diễn giải ngắn gọn, rõ ràng
* Có thể thêm chú thích nội tuyến nếu cần thiết

### 💬 Quy tắc viết commit message

Viết commit rõ ràng, có ý nghĩa và dễ hiểu. Cấu trúc đề xuất:

```bash
<loại-thay-đổi>:<mô tả ngắn gọn>
```

#### 📌 Ví dụ:

- `feature: add notes on HTTP Status Codes`
- `fix: correct typos in design-patterns.md`
- `update: improve binary search examples`
- `remove: delete duplicate notes in aws folder`
- `docs: add instructions for creating pull requests`

#### 🧠 Gợi ý thêm:

- Bạn chỉ có thể viết bằng **tiếng Anh**
- **Tránh commit mơ hồ** như: `update 1`, `fix bug`, `test`
- Nếu liên quan issue, thêm số vào cuối:  
  👉 `fix: typo in aws-note #12`


### 5. Commit & Push

```bash
git add .
git commit -m "Thêm ghi chú về thuật toán đồ thị"
git push origin feature/add-graph-algorithms
```

### 6. Tạo Pull Request

Quay lại repository gốc và nhấn **"Compare & Pull Request"**. Nhớ điền:

* Tiêu đề ngắn gọn, rõ ràng
* Mô tả chi tiết về nội dung bạn thêm/sửa
* Đề cập đến issue liên quan nếu có

## ✅ Kiểm tra trước khi gửi Pull Request

Trước khi gửi, hãy đảm bảo:

* [ ] Định dạng nội dung đúng và theo cấu trúc dự án
* [ ] Không có lỗi chính tả hoặc liên kết hỏng
* [ ] Đoạn mã (nếu có) hoạt động chính xác
* [ ] Không chứa thông tin nhạy cảm hoặc tài sản độc quyền

## 📁 Quy tắc đặt tên file & thư mục

* Tên file và thư mục dùng chữ thường và dấu gạch ngang: `graph-traversal.md`
* Nếu là bản dịch, thêm hậu tố ngôn ngữ: `graph-traversal_vi.md`
* Ghi chú nên được nhóm theo thư mục chuyên đề (ví dụ: `algorithms/`, `aws/`, `design-patterns/`)

## 🤝 Quy tắc ứng xử

Tôn trọng, cởi mở và xây dựng trong mọi tương tác. Chúng ta đang xây dựng một không gian học tập thân thiện và hòa nhập cho tất cả lập trình viên.

## 📩 Cần hỗ trợ?

Nếu bạn có thắc mắc hoặc ý tưởng, hãy [tạo issue mới](https://github.com/tech-notes-hub/tech-notes/issues).

Một lần nữa, cảm ơn bạn đã đóng góp cho **Tech Notes Hub**! 🙌

# Đóng góp cho Tech Notes Hub

Trước hết, cảm ơn bạn đã dành thời gian đóng góp! 🎉
Sự đóng góp của bạn giúp dự án này trở nên giá trị hơn cho cộng đồng lập trình viên.

## 🚀 Cách Đóng góp

Có nhiều cách để bạn tham gia:

- 📚 Thêm các ghi chú kỹ thuật hoặc chủ đề mới
- 💡 Cải thiện giải thích hoặc code snippets hiện có
- 🐛 Báo cáo lỗi hoặc đề xuất cải tiến
- ✨ Dọn dẹp và chuẩn hóa định dạng nội dung
- 🌍 Dịch ghi chú sang các ngôn ngữ khác

## 📝 Hướng dẫn Đóng góp

Vui lòng tuân thủ các hướng dẫn sau để đảm bảo tính nhất quán và khả năng bảo trì:

### 1. Fork Repository

Nhấp vào nút "Fork" ở góc trên bên phải của trang GitHub để tạo bản sao của repository trong tài khoản của bạn.

### 2. Clone về Máy của Bạn

```bash
git clone https://github.com/your-username/tech-notes.git
cd tech-notes-hub
```

### 3. Tạo Nhánh Mới

Đặt tên nhánh của bạn rõ ràng, mô tả ngắn gọn những gì bạn sẽ thêm hoặc sửa đổi:

```bash
git checkout -b feature/add-graph-algorithms
```

### 🧩 Quy tắc Đặt tên Nhánh

Tên nhánh nên tuân theo cấu trúc này:

```bash
<loại-thay-đổi>/<mô-tả-ngắn-gọn>
```

| Loại       | Ý nghĩa                                              | Ví dụ                             |
| ---------- | ---------------------------------------------------- | --------------------------------- |
| `feature`  | Thêm ghi chú/phần mới                               | `feature/add-docker-notes`        |
| `fix`      | Sửa lỗi nội dung, lỗi chính tả, ví dụ              | `fix/typo-in-graph-note`          |
| `update`   | Cập nhật hoặc cải thiện ghi chú hiện có            | `update/aws-ec2-note`             |
| `refactor` | Tái cấu trúc tệp/nội dung mà không thay đổi ý chính | `refactor/reorganize-folders`     |
| `remove`   | Xóa nội dung lỗi thời hoặc không phù hợp            | `remove/duplicate-array-example`  |
| `docs`     | Cập nhật tài liệu dự án như README, CONTRIBUTING    | `docs/improve-readme`             |

### 4. Thực hiện Thay đổi của Bạn

* Tuân theo cấu trúc thư mục và tệp hiện có
* Ghi chú nên sử dụng định dạng Markdown (`.md`)
* Code nên được đặt trong khối code có hàng rào, ví dụ: \`\`\`python
* Giữ các giải thích ngắn gọn và rõ ràng
* Thêm nhận xét nội tuyến nếu cần thiết

### 💬 Quy tắc Viết Commit Message

Viết các commit message rõ ràng, có ý nghĩa và dễ hiểu. Cấu trúc đề xuất:

```bash
<loại-thay-đổi>: <mô-tả-ngắn-gọn>
```

#### 📌 Ví dụ:

- `feature: thêm ghi chú về HTTP Status Codes`
- `fix: sửa lỗi chính tả trong design-patterns.md`
- `update: cải thiện ví dụ tìm kiếm nhị phân`
- `refactor: sắp xếp lại cấu trúc thư mục`
- `remove: xóa ghi chú trùng lặp trong thư mục aws`
- `docs: thêm hướng dẫn tạo pull request`

#### 🧠 Mẹo Bổ sung:

- Bạn có thể viết bằng **tiếng Anh** hoặc **tiếng Việt**
- **Tránh commit mơ hồ** như: `update 1`, `fix bug`, `test`
- Nếu liên quan đến issue, thêm số issue vào cuối:
  👉 `fix: lỗi chính tả trong aws-note #12`

### 5. Commit & Push

```bash
git add .
git commit -m "Thêm ghi chú về thuật toán đồ thị"
git push origin feature/add-graph-algorithms
```

### 6. Tạo Pull Request

Quay lại repository gốc và nhấp vào **"Compare & Pull Request"**. Hãy nhớ bao gồm:

* Tiêu đề rõ ràng, ngắn gọn
* Mô tả chi tiết về những gì bạn đã thêm/sửa đổi
* Tham chiếu đến các issue liên quan nếu có

## ✅ Danh sách kiểm tra trước khi Gửi Pull Request

Trước khi gửi, hãy đảm bảo:

* [ ] Nội dung được định dạng đúng và tuân theo cấu trúc dự án
* [ ] Không có lỗi chính tả hoặc liên kết hỏng
* [ ] Các đoạn mã (nếu có) hoạt động đúng
* [ ] Không có thông tin nhạy cảm hoặc tài sản độc quyền được đưa vào

## 📁 Quy ước Đặt tên Tệp & Thư mục

* Sử dụng chữ thường và dấu gạch ngang cho tên tệp và thư mục: `graph_traversal.md` (ngoại trừ các tệp mã như C# sử dụng PascalCase như `GraphTraversal.cs`, hoặc Java sử dụng camelCase như `GraphTraversal.java`)
* Đối với bản dịch, thêm hậu tố ngôn ngữ: `graph_traversal_vi.md`, nhưng không cần hậu tố nếu trong thư mục /i18n/[mã_ngôn_ngữ]/
* Ghi chú nên được nhóm theo các thư mục docs (ví dụ: `docs/algorithms/`, `docs/aws/`, `docs/design-patterns/`)

### 📂 Cấu trúc Code Snippets

Code snippets phải tuân theo cấu trúc thư mục này để hiển thị đúng trên website:

```
snippets/[danh-mục]/[tên-chủ-đề]/[tên-tệp].[phần-mở-rộng]
```

Ví dụ:
- `snippets/algorithms/graph-traversal/graph_traversal.py`
- `snippets/devops/ci-cd/ci-cd.sh`
- `snippets/databases/mongodb/mongodb_query.js`

Thư mục `[tên-chủ-đề]` phải khớp với slug của bài viết blog để snippets hiển thị tự động. Tất cả các tệp trong thư mục này sẽ được hiển thị dưới dạng code snippets trên trang bài viết blog tương ứng.

## 🤝 Quy tắc Ứng xử

Hãy tôn trọng, cởi mở và mang tính xây dựng trong tất cả các tương tác. Chúng tôi đang xây dựng một không gian học tập thân thiện và hòa nhập cho tất cả các lập trình viên.

## 📩 Cần Trợ giúp?

Nếu bạn có câu hỏi hoặc ý tưởng, vui lòng [tạo issue mới](https://github.com/tech-notes-hub/tech-notes/issues).

Một lần nữa, cảm ơn bạn đã đóng góp cho **Tech Notes Hub**! 🙌

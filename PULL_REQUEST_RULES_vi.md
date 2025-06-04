# 📏 Quy định Pull Request cho Tech Notes Hub

Để đảm bảo chất lượng, tính nhất quán và rõ ràng của kho kiến thức này, chúng tôi đặt ra một số quy định về **những gì được phép (✅) và không được phép (❌)** khi tạo pull request.

Vui lòng đọc kỹ trước khi gửi PR.

---

## 📝 Mẫu Pull Request

Khi gửi pull request, vui lòng bao gồm:

### Mô tả
Mô tả rõ ràng về các thay đổi bạn đã thực hiện.

### Vấn đề liên quan
Liên kết đến các vấn đề liên quan: `Fixes #(số issue)`

### Loại thay đổi
Chọn các tùy chọn thích hợp:
- [ ] Nội dung mới (ghi chú, đoạn mã)
- [ ] Cải thiện nội dung (cập nhật, sửa lỗi, mở rộng)
- [ ] Cập nhật tài liệu
- [ ] Sửa lỗi (thay đổi không gây ảnh hưởng)
- [ ] Cơ sở hạ tầng/công cụ (CI, scripts, v.v.)
- [ ] Bản dịch (i18n) - chỉ rõ ngôn ngữ: ______
- [ ] Khác (vui lòng mô tả)

### Danh sách kiểm tra
- [ ] Nội dung của tôi tuân theo hướng dẫn về phong cách của dự án
- [ ] Tôi đã tự đánh giá nội dung/mã của mình
- [ ] Tôi đã bao gồm tài liệu tham khảo/liên kết khi thích hợp
- [ ] Các thay đổi của tôi không tạo ra cảnh báo hoặc lỗi mới
- [ ] Tôi đã kiểm tra rằng tất cả các liên kết đều hợp lệ
- [ ] Đối với bản dịch: Tôi đã tuân theo cấu trúc thư mục i18n (i18n/[language_code]/...)

---

## ✅ Được phép trong Pull Request

- **Thêm nội dung mới** như:
  - Ghi chú kỹ thuật được trình bày rõ ràng
  - Các thuật toán, mẫu thiết kế, kiến trúc phần mềm
  - Ghi chú về dịch vụ AWS hoặc điện toán đám mây
  - Tài liệu ôn tập phỏng vấn hoặc tra cứu nhanh
- **Đoạn mã ví dụ**:
  - Đúng cú pháp, dễ hiểu, tối giản
  - Theo chuẩn coding style
  - Có chú thích nếu cần
- **Cải thiện nội dung**:
  - Giải thích rõ hơn, định dạng dễ đọc hơn
  - Sửa lỗi chính tả, ngữ pháp
  - Cập nhật liên kết hoặc định dạng Markdown
- **Bản dịch ghi chú**:
  - Sử dụng cấu trúc thư mục `i18n/[mã_ngôn_ngữ]/` (ví dụ: `i18n/vi/`, `i18n/fr/`)
  - Nội dung bám sát logic file gốc
  - Cập nhật trong SUMMARY.md dưới phần ngôn ngữ tương ứng

## ❌ Không được phép trong Pull Request

- ❌ **Nội dung tạo bởi AI** mà không qua chỉnh sửa thủ công hoặc kiểm duyệt
- ❌ Nội dung sơ sài, trùng lặp, sao chép từ blog/diễn đàn
- ❌ Ghi chú không liên quan đến lập trình hoặc kỹ thuật phần mềm
- ❌ Dump code dài dòng, không giải thích, không rõ mục đích
- ❌ Chèn liên kết quảng cáo, giới thiệu cá nhân, affiliate link
- ❌ File đặt tên sai quy tắc, không dùng định dạng Markdown hợp lệ
- ❌ Nội dung **sao chép có bản quyền** từ nguồn khác
- ❌ Bản dịch không tuân thủ cấu trúc thư mục i18n đúng quy định

## 🔖 Lưu ý về cấu trúc & định dạng

- Trình bày **ngắn gọn, dễ hiểu, gần gũi**
- Sử dụng đúng cấp độ tiêu đề: `#`, `##`, `###`,...
- Đặt tên file bằng chữ thường, dùng dấu gạch ngang: `binary-search.md`
- Đặt đúng thư mục chuyên đề (`algorithms/`, `design-patterns/`, `aws/`,...)
- Đối với bản dịch, sử dụng cấu trúc `i18n/[mã_ngôn_ngữ]/`, phản ánh cấu trúc thư mục chính
- Cập nhật SUMMARY.md để bao gồm nội dung mới hoặc bản dịch

## 📢 Lưu ý cuối

Cảm ơn bạn đã đóng góp cho dự án!
Tất cả pull request sẽ được review kỹ trước khi merge.
Nếu chưa chắc nội dung có phù hợp không, bạn có thể mở một issue để trao đổi trước.

Cùng nhau xây dựng một kho kiến thức chất lượng cho lập trình viên! 🚀


---
author: Tech Notes Hub
tags: 'learning, technology, programming'
update: '2025-06-06'
date: '2025-06-06'
title: Bash Scripting
description: Guide about Bash Scripting
---
# Lập Trình Bash

Bash (Bourne Again SHell) là một ngôn ngữ thông dịch lệnh được sử dụng rộng rãi trên nhiều hệ điều hành, và là shell mặc định trên hầu hết các bản phân phối Linux.

## Giới Thiệu về Lập Trình Bash

Các script Bash là các tệp văn bản chứa một chuỗi các lệnh được thực thi bởi shell Bash. Chúng cho phép bạn tự động hóa các tác vụ lặp đi lặp lại, kết hợp các lệnh phức tạp, và tạo các tiện ích tùy chỉnh.

## Cú Pháp Cơ Bản

### Tạo một Script Bash

1. Tạo một tệp với phần mở rộng `.sh`
2. Thêm dòng shebang ở đầu: `#!/bin/bash`
3. Làm cho script có thể thực thi: `chmod +x script.sh`
4. Chạy script: `./script.sh`

### Ví Dụ Hello World

```bash
#!/bin/bash
# Đây là một chú thích
echo "Xin chào, Thế giới!"
```

## Biến

### Khai Báo và Sử Dụng Biến

```bash
#!/bin/bash

# Khai báo biến
ten="Nguyen"
tuoi=30

# Sử dụng biến
echo "Tên: $ten"
echo "Tuổi: $tuoi"

# Thay thế lệnh
ngay_hien_tai=$(date)
echo "Ngày hiện tại: $ngay_hien_tai"

# Phép toán
ket_qua=$((10 + 5))
echo "10 + 5 = $ket_qua"
```

### Biến Đặc Biệt

| Biến | Mô tả |
|----------|-------------|
| `$0` | Tên của script |
| `$1` đến `$9` | 9 tham số đầu tiên được truyền vào script |
| `$#` | Số lượng tham số được truyền vào script |
| `$@` | Tất cả tham số được truyền vào script |
| `$?` | Trạng thái thoát của lệnh cuối cùng |
| `$$` | Process ID của script hiện tại |
| `$USER` | Tên người dùng đang chạy script |
| `$HOSTNAME` | Tên máy chủ |
| `$RANDOM` | Một số ngẫu nhiên |
| `$HOME` | Thư mục home của người dùng |

## Cấu Trúc Điều Khiển

### Câu Lệnh Điều Kiện

#### Câu Lệnh If-Else

```bash
#!/bin/bash

tuoi=25

if [ $tuoi -lt 18 ]; then
    echo "Bạn là trẻ vị thành niên."
elif [ $tuoi -ge 18 ] && [ $tuoi -lt 65 ]; then
    echo "Bạn là người trưởng thành."
else
    echo "Bạn là người cao tuổi."
fi
```

#### Câu Lệnh Case

```bash
#!/bin/bash

trai_cay="táo"

case $trai_cay in
    "táo")
        echo "Đây là quả táo."
        ;;
    "chuối")
        echo "Đây là quả chuối."
        ;;
    "cam")
        echo "Đây là quả cam."
        ;;
    *)
        echo "Không xác định được loại trái cây."
        ;;
esac
```

### Vòng Lặp

#### Vòng Lặp For

```bash
#!/bin/bash

# Vòng lặp for đơn giản
for i in 1 2 3 4 5; do
    echo "Số: $i"
done

# Vòng lặp for với khoảng
for i in {1..5}; do
    echo "Số: $i"
done

# Vòng lặp for với bước nhảy
for i in {1..10..2}; do
    echo "Số lẻ: $i"
done

# Vòng lặp for với đầu ra lệnh
for file in $(ls); do
    echo "Tệp: $file"
done
```

#### Vòng Lặp While

```bash
#!/bin/bash

count=1

while [ $count -le 5 ]; do
    echo "Đếm: $count"
    ((count++))
done
```

#### Vòng Lặp Until

```bash
#!/bin/bash

count=1

until [ $count -gt 5 ]; do
    echo "Đếm: $count"
    ((count++))
done
```

## Hàm

### Định Nghĩa và Sử Dụng Hàm

```bash
#!/bin/bash

# Định nghĩa hàm
chao_hoi() {
    echo "Xin chào, $1!"
}

# Hàm với giá trị trả về
cong() {
    local ket_qua=$(($1 + $2))
    echo $ket_qua
}

# Gọi hàm
chao_hoi "Nguyễn"
tong=$(cong 5 3)
echo "5 + 3 = $tong"
```

## Đầu Vào và Đầu Ra

### Đọc Đầu Vào Người Dùng

```bash
#!/bin/bash

# Đọc một giá trị
echo "Nhập tên của bạn:"
read ten
echo "Xin chào, $ten!"

# Đọc nhiều giá trị
echo "Nhập họ và tên của bạn:"
read ho ten
echo "Xin chào, $ho $ten!"

# Đọc với lời nhắc
read -p "Nhập tuổi của bạn: " tuoi
echo "Bạn $tuoi tuổi."

# Đọc mật khẩu (ẩn đầu vào)
read -sp "Nhập mật khẩu của bạn: " mat_khau
echo -e "\nĐã nhận mật khẩu."
```

### Đầu Vào/Đầu Ra Tệp

```bash
#!/bin/bash

# Ghi vào tệp
echo "Xin chào, Thế giới!" > output.txt
echo "Đây là một dòng mới." >> output.txt

# Đọc từ tệp
while IFS= read -r line; do
    echo "Dòng: $line"
done < input.txt

# Xử lý từng dòng của tệp
cat input.txt | while read line; do
    echo "Đang xử lý: $line"
done
```

## Mảng

### Thao Tác Mảng

```bash
#!/bin/bash

# Khai báo mảng
trai_cay=("táo" "chuối" "cam" "nho")

# Truy cập phần tử mảng
echo "Trái cây đầu tiên: ${trai_cay[0]}"
echo "Tất cả trái cây: ${trai_cay[@]}"
echo "Số lượng trái cây: ${#trai_cay[@]}"

# Lặp qua mảng
for trai_cay in "${trai_cay[@]}"; do
    echo "Trái cây: $trai_cay"
done

# Thêm phần tử vào mảng
trai_cay+=("kiwi")

# Xóa phần tử khỏi mảng
unset trai_cay[1]
```

## Thao Tác Chuỗi

### Thao Tác Chuỗi

```bash
#!/bin/bash

# Độ dài chuỗi
str="Xin chào, Thế giới!"
echo "Độ dài: ${#str}"

# Chuỗi con
echo "Chuỗi con: ${str:7:5}"

# Thay thế chuỗi
echo "Thay thế: ${str/Thế giới/Bash}"

# Chuyển đổi sang chữ hoa/chữ thường
echo "Chữ hoa: ${str^^}"
echo "Chữ thường: ${str,,}"
```

## Xử Lý Lỗi

### Xử Lý Lỗi Cơ Bản

```bash
#!/bin/bash

# Thoát khi có lỗi
set -e

# Xử lý lỗi tùy chỉnh
xu_ly_loi() {
    echo "Lỗi xảy ra tại dòng $1"
    exit 1
}

# Bắt lỗi
trap 'xu_ly_loi $LINENO' ERR

# Kiểm tra thành công của lệnh
if ! command -v git &> /dev/null; then
    echo "Git chưa được cài đặt."
    exit 1
fi
```

## Các Phương Pháp Tốt Nhất

1. **Sử Dụng Shebang**: Luôn bao gồm `#!/bin/bash` ở đầu script của bạn.
2. **Chú Thích**: Thêm chú thích để giải thích logic phức tạp.
3. **Xử Lý Lỗi**: Triển khai xử lý lỗi thích hợp.
4. **Thụt Lề**: Sử dụng thụt lề nhất quán để dễ đọc.
5. **Quy Ước Đặt Tên**: Sử dụng tên mô tả cho biến và hàm.
6. **Trích Dẫn Biến**: Luôn trích dẫn biến để xử lý khoảng trắng và ký tự đặc biệt.
7. **Mã Thoát**: Trả về mã thoát thích hợp.
8. **Tính Mô-đun**: Chia các script phức tạp thành các hàm.
9. **Gỡ Lỗi**: Sử dụng `set -x` để gỡ lỗi.
10. **Kiểm Tra**: Kiểm tra script của bạn với các đầu vào khác nhau.

## Tài Liệu Tham Khảo

- [Hướng Dẫn Sử Dụng GNU Bash](https://www.gnu.org/software/bash/manual/)
- [Hướng Dẫn Bash cho Người Mới Bắt Đầu](https://tldp.org/LDP/Bash-Beginners-Guide/html/)
- [Hướng Dẫn Lập Trình Bash Nâng Cao](https://tldp.org/LDP/abs/html/)
- [ShellCheck](https://www.shellcheck.net/) - Một công cụ phân tích script shell

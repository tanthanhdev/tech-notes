# Tích Hợp Liên Tục và Triển Khai Liên Tục (CI/CD)

Tích hợp liên tục và triển khai liên tục (CI/CD) là một phương pháp để thường xuyên cung cấp ứng dụng cho khách hàng bằng cách đưa tự động hóa vào các giai đoạn phát triển ứng dụng.

## CI/CD là gì?

### Tích Hợp Liên Tục (CI)
Tích hợp liên tục là một phương pháp phát triển trong đó các nhà phát triển tích hợp mã vào kho lưu trữ chung thường xuyên, tốt nhất là nhiều lần mỗi ngày. Mỗi lần tích hợp sau đó được xác minh bằng một bản dựng tự động và các bài kiểm tra tự động.

### Phân Phối Liên Tục (CD)
Phân phối liên tục là một phần mở rộng của tích hợp liên tục để đảm bảo rằng bạn có thể phát hành các thay đổi mới cho khách hàng một cách nhanh chóng và bền vững. Điều này có nghĩa là ngoài việc tự động hóa kiểm tra, bạn cũng đã tự động hóa quy trình phát hành và bạn có thể triển khai ứng dụng của mình bất kỳ lúc nào bằng cách nhấn nút.

### Triển Khai Liên Tục
Triển khai liên tục tiến xa hơn một bước so với phân phối liên tục. Với phương pháp này, mọi thay đổi vượt qua tất cả các giai đoạn của đường ống sản xuất của bạn đều được phát hành cho khách hàng của bạn. Không có sự can thiệp của con người, và chỉ có một bài kiểm tra thất bại mới ngăn chặn một thay đổi mới được triển khai lên môi trường sản xuất.

## Các Thành Phần của Đường Ống CI/CD

Một đường ống CI/CD điển hình bao gồm các giai đoạn sau:

1. **Nguồn**: Mã được commit vào hệ thống quản lý phiên bản (Git, SVN, v.v.)
2. **Xây Dựng**: Mã được biên dịch, các phụ thuộc được giải quyết
3. **Kiểm Tra**: Các bài kiểm tra tự động được chạy (kiểm tra đơn vị, kiểm tra tích hợp, v.v.)
4. **Triển Khai**: Ứng dụng được triển khai lên môi trường dàn dựng/sản xuất
5. **Giám Sát**: Hiệu suất ứng dụng và lỗi được giám sát

## Các Công Cụ CI/CD Phổ Biến

### Jenkins

Jenkins là một máy chủ tự động hóa mã nguồn mở cho phép các nhà phát triển xây dựng, kiểm tra và triển khai phần mềm của họ.

```yaml
# Ví dụ Jenkinsfile
pipeline {
    agent any

    stages {
        stage('Xây Dựng') {
            steps {
                echo 'Đang xây dựng..'
                sh 'npm install'
            }
        }
        stage('Kiểm Tra') {
            steps {
                echo 'Đang kiểm tra..'
                sh 'npm test'
            }
        }
        stage('Triển Khai') {
            steps {
                echo 'Đang triển khai....'
                sh 'npm run deploy'
            }
        }
    }
}
```

### GitHub Actions

GitHub Actions là một nền tảng CI/CD cho phép bạn tự động hóa quy trình xây dựng, kiểm tra và triển khai trực tiếp từ GitHub.

```yaml
# Ví dụ quy trình làm việc GitHub Actions
name: Node.js CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    - name: Sử dụng Node.js
      uses: actions/setup-node@v1
      with:
        node-version: '14.x'
    - name: Cài đặt phụ thuộc
      run: npm ci
    - name: Chạy kiểm tra
      run: npm test
    - name: Triển khai
      if: github.ref == 'refs/heads/main'
      run: npm run deploy
```

### GitLab CI/CD

GitLab CI/CD là một phần của GitLab cho phép bạn áp dụng tất cả các phương pháp liên tục (Tích hợp, Phân phối và Triển khai liên tục) vào phần mềm của bạn.

```yaml
# Ví dụ .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - echo "Đang xây dựng ứng dụng"
    - npm install

test:
  stage: test
  script:
    - echo "Đang chạy kiểm tra"
    - npm test

deploy:
  stage: deploy
  script:
    - echo "Đang triển khai ứng dụng"
    - npm run deploy
  only:
    - main
```

### CircleCI

CircleCI là một công cụ CI/CD dựa trên đám mây tự động hóa quy trình phát triển phần mềm.

```yaml
# Ví dụ cấu hình CircleCI
version: 2.1
jobs:
  build:
    docker:
      - image: cimg/node:14.17
    steps:
      - checkout
      - run: npm install
      - run: npm test
      - run: npm run deploy
```

## Các Phương Pháp Tốt Nhất cho CI/CD

1. **Tự Động Hóa Mọi Thứ**: Tự động hóa càng nhiều quy trình phân phối phần mềm càng tốt.
2. **Thất Bại Nhanh Chóng**: Phát hiện và giải quyết vấn đề càng sớm càng tốt trong quy trình phát triển.
3. **Giữ Bản Dựng Xanh**: Một bản dựng bị hỏng nên là ưu tiên cao nhất của nhóm để sửa chữa.
4. **Xây Dựng Chỉ Một Lần**: Xây dựng các tạo phẩm một lần và thăng cấp cùng một tạo phẩm qua đường ống.
5. **Triển Khai Theo Cùng Một Cách cho Mọi Môi Trường**: Sử dụng cùng một quy trình triển khai cho tất cả các môi trường.
6. **Kiểm Tra Khói cho Các Triển Khai**: Chạy các bài kiểm tra cơ bản sau khi triển khai để xác minh hệ thống đang chạy đúng.
7. **Giữ Đường Ống CI/CD Nhanh**: Hướng tới một đường ống hoàn thành trong vòng chưa đến 10 phút.
8. **Duy Trì Độ Phủ Kiểm Tra Tốt**: Đảm bảo các bài kiểm tra của bạn bao phủ phần lớn mã nguồn của bạn.

## Tài Liệu Tham Khảo

- [Martin Fowler về Tích Hợp Liên Tục](https://martinfowler.com/articles/continuousIntegration.html)
- [Sổ Tay DevOps](https://itrevolution.com/book/the-devops-handbook/)
- [Phân Phối Liên Tục](https://continuousdelivery.com/)
- [Tài Liệu Jenkins](https://www.jenkins.io/doc/)
- [Tài Liệu GitHub Actions](https://docs.github.com/en/actions)
- [Tài Liệu GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- [Tài Liệu CircleCI](https://circleci.com/docs/)

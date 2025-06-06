---
author: Tech Notes Hub
tags: 'learning, technology, programming'
update: '2025-06-06'
date: '2025-06-06'
title: Unit Testing
description: Guide about Unit Testing
---
# Kiểm Thử Đơn Vị

Kiểm thử đơn vị là một phương pháp kiểm thử phần mềm trong đó các đơn vị hoặc thành phần riêng lẻ của phần mềm được kiểm tra một cách cô lập với phần còn lại của hệ thống.

## Kiểm Thử Đơn Vị là gì?

Một bài kiểm thử đơn vị xác minh rằng một phần mã nhỏ, cô lập (một "đơn vị") hoạt động chính xác như mong đợi của nhà phát triển. Các đơn vị thường là:

- Các hàm hoặc phương thức riêng lẻ
- Các lớp
- Các mô-đun hoặc thành phần

Mục tiêu là xác nhận rằng mỗi đơn vị của phần mềm hoạt động như thiết kế.

## Lợi Ích của Kiểm Thử Đơn Vị

- **Phát Hiện Lỗi Sớm**: Phát hiện lỗi sớm trong chu trình phát triển
- **Tạo Điều Kiện cho Thay Đổi**: Giúp việc tái cấu trúc mã và thêm tính năng mới dễ dàng hơn
- **Tài Liệu**: Các bài kiểm thử đóng vai trò như tài liệu về cách mã nên hoạt động
- **Cải Thiện Thiết Kế**: Khuyến khích thiết kế phần mềm và tính mô-đun tốt hơn
- **Tự Tin**: Cung cấp sự tự tin rằng mã hoạt động như mong đợi
- **Giảm Chi Phí**: Rẻ hơn để sửa lỗi được phát hiện trong quá trình kiểm thử đơn vị hơn là các giai đoạn sau

## Nguyên Tắc Kiểm Thử Đơn Vị

### Nguyên Tắc FIRST

- **Fast (Nhanh)**: Các bài kiểm thử nên chạy nhanh
- **Independent (Độc lập)**: Các bài kiểm thử không nên phụ thuộc vào nhau
- **Repeatable (Lặp lại được)**: Các bài kiểm thử nên cho kết quả giống nhau mỗi lần chạy
- **Self-validating (Tự xác thực)**: Các bài kiểm thử nên tự động xác định xem chúng đã vượt qua hay thất bại
- **Timely (Kịp thời)**: Các bài kiểm thử nên được viết vào thời điểm thích hợp (lý tưởng là trước khi viết mã)

### Mẫu AAA

- **Arrange (Sắp xếp)**: Thiết lập điều kiện kiểm thử
- **Act (Hành động)**: Thực thi mã đang được kiểm thử
- **Assert (Khẳng định)**: Xác minh kết quả là như mong đợi

## Các Framework Kiểm Thử Đơn Vị

### JavaScript (Jest)

```javascript
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };

// math.test.js
const { add, subtract } = require('./math');

describe('Các hàm toán học', () => {
  test('hàm add nên cộng hai số chính xác', () => {
    // Arrange
    const a = 5;
    const b = 3;

    // Act
    const result = add(a, b);

    // Assert
    expect(result).toBe(8);
  });

  test('hàm subtract nên trừ hai số chính xác', () => {
    // Arrange
    const a = 5;
    const b = 3;

    // Act
    const result = subtract(a, b);

    // Assert
    expect(result).toBe(2);
  });
});
```

### Python (pytest)

```python
# math_utils.py
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

# test_math_utils.py
import pytest
from math_utils import add, subtract

def test_add():
    # Arrange
    a = 5
    b = 3

    # Act
    result = add(a, b)

    # Assert
    assert result == 8

def test_subtract():
    # Arrange
    a = 5
    b = 3

    # Act
    result = subtract(a, b)

    # Assert
    assert result == 2
```

### Java (JUnit)

```java
// MathUtils.java
public class MathUtils {
    public int add(int a, int b) {
        return a + b;
    }

    public int subtract(int a, int b) {
        return a - b;
    }
}

// MathUtilsTest.java
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class MathUtilsTest {

    @Test
    public void testAdd() {
        // Arrange
        MathUtils mathUtils = new MathUtils();
        int a = 5;
        int b = 3;

        // Act
        int result = mathUtils.add(a, b);

        // Assert
        assertEquals(8, result);
    }

    @Test
    public void testSubtract() {
        // Arrange
        MathUtils mathUtils = new MathUtils();
        int a = 5;
        int b = 3;

        // Act
        int result = mathUtils.subtract(a, b);

        // Assert
        assertEquals(2, result);
    }
}
```

### C# (xUnit)

```csharp
// MathUtils.cs
public class MathUtils
{
    public int Add(int a, int b)
    {
        return a + b;
    }

    public int Subtract(int a, int b)
    {
        return a - b;
    }
}

// MathUtilsTests.cs
using Xunit;

public class MathUtilsTests
{
    [Fact]
    public void Add_ShouldCorrectlyAddTwoNumbers()
    {
        // Arrange
        var mathUtils = new MathUtils();
        int a = 5;
        int b = 3;

        // Act
        int result = mathUtils.Add(a, b);

        // Assert
        Assert.Equal(8, result);
    }

    [Fact]
    public void Subtract_ShouldCorrectlySubtractTwoNumbers()
    {
        // Arrange
        var mathUtils = new MathUtils();
        int a = 5;
        int b = 3;

        // Act
        int result = mathUtils.Subtract(a, b);

        // Assert
        Assert.Equal(2, result);
    }
}
```

## Test Doubles

Test doubles là các đối tượng thay thế các thành phần thực trong các bài kiểm thử để cô lập mã đang được kiểm thử.

### Các Loại Test Doubles

#### Dummy

Các đối tượng được truyền qua nhưng không bao giờ thực sự được sử dụng.

```javascript
// Ví dụ JavaScript
function createUser(user, logger) {
  // logger không được sử dụng trong bài kiểm thử này
  return { id: 123, ...user };
}

test('createUser nên thêm một ID vào user', () => {
  // Arrange
  const dummyLogger = {}; // Đối tượng giả không bao giờ được sử dụng
  const user = { name: 'John' };

  // Act
  const result = createUser(user, dummyLogger);

  // Assert
  expect(result.id).toBeDefined();
  expect(result.name).toBe('John');
});
```

#### Stub

Các đối tượng cung cấp câu trả lời được định nghĩa trước cho các lời gọi được thực hiện trong quá trình kiểm thử.

```java
// Ví dụ Java
public interface WeatherService {
    int getCurrentTemperature(String city);
}

// Triển khai stub
public class WeatherServiceStub implements WeatherService {
    @Override
    public int getCurrentTemperature(String city) {
        return 25; // Luôn trả về 25°C bất kể thành phố nào
    }
}

@Test
public void testWeatherReporter() {
    // Arrange
    WeatherService stubService = new WeatherServiceStub();
    WeatherReporter reporter = new WeatherReporter(stubService);

    // Act
    String report = reporter.generateReport("London");

    // Assert
    assertEquals("Nhiệt độ hiện tại ở London: 25°C", report);
}
```

#### Spy

Các đối tượng ghi lại các lời gọi được thực hiện đến chúng.

```python
# Ví dụ Python
class EmailServiceSpy:
    def __init__(self):
        self.emails_sent = []

    def send_email(self, to, subject, body):
        self.emails_sent.append({
            'to': to,
            'subject': subject,
            'body': body
        })

def test_user_registration_sends_welcome_email():
    # Arrange
    email_service = EmailServiceSpy()
    user_service = UserService(email_service)

    # Act
    user_service.register("john@example.com", "password123")

    # Assert
    assert len(email_service.emails_sent) == 1
    assert email_service.emails_sent[0]['to'] == "john@example.com"
    assert "Chào mừng" in email_service.emails_sent[0]['subject']
```

#### Mock

Các đối tượng xác minh rằng các phương thức cụ thể đã được gọi với các đối số cụ thể.

```csharp
// Ví dụ C# với Moq
[Fact]
public void Register_ShouldSendWelcomeEmail()
{
    // Arrange
    var mockEmailService = new Mock<IEmailService>();
    var userService = new UserService(mockEmailService.Object);

    // Act
    userService.Register("john@example.com", "password123");

    // Assert
    mockEmailService.Verify(
        x => x.SendEmail(
            "john@example.com",
            It.Is<string>(s => s.Contains("Chào mừng")),
            It.IsAny<string>()
        ),
        Times.Once
    );
}
```

#### Fake

Các đối tượng có triển khai hoạt động nhưng không phù hợp cho môi trường sản xuất.

```javascript
// Ví dụ JavaScript
class FakeUserRepository {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  create(userData) {
    const user = { id: this.nextId++, ...userData };
    this.users.push(user);
    return user;
  }

  findById(id) {
    return this.users.find(user => user.id === id);
  }
}

test('UserService nên tạo một người dùng', () => {
  // Arrange
  const fakeRepo = new FakeUserRepository();
  const userService = new UserService(fakeRepo);

  // Act
  const user = userService.createUser('John', 'john@example.com');

  // Assert
  expect(user.id).toBe(1);
  expect(user.name).toBe('John');
  expect(fakeRepo.findById(1)).toEqual(user);
});
```

## Độ Phủ Kiểm Thử

Độ phủ kiểm thử đo lường bao nhiêu mã của bạn được thực thi trong quá trình kiểm thử.

### Các Số Liệu Độ Phủ

- **Độ Phủ Dòng**: Phần trăm dòng được thực thi trong quá trình kiểm thử
- **Độ Phủ Nhánh**: Phần trăm nhánh (if/else, switch) được thực thi trong quá trình kiểm thử
- **Độ Phủ Hàm**: Phần trăm hàm được gọi trong quá trình kiểm thử
- **Độ Phủ Câu Lệnh**: Phần trăm câu lệnh được thực thi trong quá trình kiểm thử

### Ví Dụ Báo Cáo Độ Phủ (Jest)

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   85.71 |    66.67 |     100 |   85.71 |
 math.js            |     100 |      100 |     100 |     100 |
 string-utils.js    |   71.43 |    33.33 |     100 |   71.43 | 15-18
--------------------|---------|----------|---------|---------|-------------------
```

## Các Phương Pháp Tốt Nhất cho Kiểm Thử Đơn Vị

1. **Kiểm Thử Một Thứ Tại Một Thời Điểm**: Mỗi bài kiểm thử nên xác minh một hành vi cụ thể.
2. **Giữ Các Bài Kiểm Thử Đơn Giản**: Các bài kiểm thử nên dễ hiểu và duy trì.
3. **Sử Dụng Tên Bài Kiểm Thử Mô Tả**: Tên nên mô tả rõ ràng những gì đang được kiểm thử.
4. **Cô Lập Đơn Vị**: Sử dụng test doubles để cô lập đơn vị khỏi các phụ thuộc của nó.
5. **Kiểm Thử Các Trường Hợp Biên**: Bao gồm các bài kiểm thử cho điều kiện biên và trường hợp lỗi.
6. **Không Kiểm Thử Framework**: Tập trung vào việc kiểm thử mã của bạn, không phải framework hoặc ngôn ngữ.
7. **Duy Trì Tính Độc Lập của Bài Kiểm Thử**: Các bài kiểm thử không nên phụ thuộc vào nhau hoặc chạy theo một thứ tự cụ thể.
8. **Tránh Logic trong Bài Kiểm Thử**: Các bài kiểm thử nên đơn giản với logic tối thiểu.
9. **Viết Bài Kiểm Thử Trước (TDD)**: Cân nhắc viết bài kiểm thử trước khi triển khai mã.
10. **Tái Cấu Trúc Bài Kiểm Thử**: Giữ bài kiểm thử sạch sẽ và có thể bảo trì, giống như mã sản xuất.

## Phát Triển Hướng Kiểm Thử (TDD)

TDD là một quy trình phát triển trong đó các bài kiểm thử được viết trước mã. Chu kỳ là:

1. **Red (Đỏ)**: Viết một bài kiểm thử thất bại
2. **Green (Xanh)**: Viết mã tối thiểu để làm cho bài kiểm thử vượt qua
3. **Refactor (Tái cấu trúc)**: Cải thiện mã trong khi giữ cho các bài kiểm thử vượt qua

### Ví Dụ TDD (JavaScript)

```javascript
// Bước 1: Viết một bài kiểm thử thất bại
test('isPalindrome nên trả về true cho các chuỗi đối xứng', () => {
  expect(isPalindrome('racecar')).toBe(true);
});

// Bước 2: Viết mã tối thiểu để làm cho nó vượt qua
function isPalindrome(str) {
  return str === str.split('').reverse().join('');
}

// Bước 3: Thêm nhiều bài kiểm thử
test('isPalindrome nên trả về false cho các chuỗi không đối xứng', () => {
  expect(isPalindrome('hello')).toBe(false);
});

test('isPalindrome nên không phân biệt chữ hoa chữ thường', () => {
  expect(isPalindrome('Racecar')).toBe(true);
});

// Bước 4: Tái cấu trúc mã
function isPalindrome(str) {
  const normalized = str.toLowerCase();
  return normalized === normalized.split('').reverse().join('');
}
```

## Tài Liệu Tham Khảo

- [Martin Fowler về Kiểm Thử Đơn Vị](https://martinfowler.com/bliki/UnitTest.html)
- [Phát Triển Hướng Kiểm Thử bởi Ví Dụ](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
- [Tài Liệu Jest](https://jestjs.io/docs/getting-started)
- [Tài Liệu pytest](https://docs.pytest.org/)
- [Tài Liệu JUnit](https://junit.org/junit5/docs/current/user-guide/)
- [Tài Liệu xUnit](https://xunit.net/docs/getting-started/netcore/cmdline)

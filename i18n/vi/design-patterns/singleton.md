---
author: Tech Notes Hub
tags: 'learning, technology, programming'
update: '2025-06-06'
date: '2025-06-06'
title: Singleton
description: Guide about Singleton
---
# Mẫu thiết kế Singleton

Singleton là một mẫu thiết kế tạo đối tượng đảm bảo rằng một lớp chỉ có một thể hiện duy nhất và cung cấp một điểm truy cập toàn cục đến thể hiện đó.

## Mục đích

- Đảm bảo một lớp chỉ có một thể hiện duy nhất.
- Cung cấp một điểm truy cập toàn cục đến thể hiện đó.
- Kiểm soát truy cập đồng thời đến tài nguyên được chia sẻ.

## Vấn đề

Khi nào bạn nên sử dụng mẫu Singleton?

- Khi bạn cần chính xác một thể hiện của lớp để điều phối các hành động trong hệ thống
- Khi bạn muốn hạn chế việc khởi tạo của một lớp thành chỉ một đối tượng
- Khi bạn cần kiểm soát chặt chẽ hơn đối với biến toàn cục

## Cấu trúc

```
+----------------+
| Singleton      |
+----------------+
| -instance      |
+----------------+
| +getInstance() |
| -constructor() |
+----------------+
```

![Cấu trúc mẫu Singleton](https://refactoring.guru/images/patterns/diagrams/singleton/structure-en.png)

## Triển khai

### Triển khai cơ bản

```java
public class Singleton {
    // Thể hiện tĩnh riêng tư của lớp
    private static Singleton instance;

    // Constructor riêng tư ngăn việc khởi tạo từ các lớp khác
    private Singleton() { }

    // Phương thức tĩnh công khai để lấy thể hiện
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }

    // Các phương thức và trường khác
    public void doSomething() {
        System.out.println("Singleton đang thực hiện một việc gì đó");
    }
}
```

### Triển khai an toàn với đa luồng

```java
public class ThreadSafeSingleton {
    private static volatile ThreadSafeSingleton instance;

    private ThreadSafeSingleton() { }

    public static ThreadSafeSingleton getInstance() {
        // Kiểm tra khóa hai lần (Double-checked locking)
        if (instance == null) {
            synchronized (ThreadSafeSingleton.class) {
                if (instance == null) {
                    instance = new ThreadSafeSingleton();
                }
            }
        }
        return instance;
    }
}
```

### Khởi tạo sớm

```java
public class EagerSingleton {
    // Thể hiện được tạo tại thời điểm tải
    private static final EagerSingleton INSTANCE = new EagerSingleton();

    private EagerSingleton() { }

    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
}
```

### Sử dụng Enum (Java)

```java
public enum EnumSingleton {
    INSTANCE;

    public void doSomething() {
        System.out.println("Singleton enum đang thực hiện một việc gì đó");
    }
}
```

## Ví dụ trong các ngôn ngữ khác nhau

### JavaScript

```javascript
class Singleton {
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }

        // Khởi tạo singleton
        this.data = [];
        Singleton.instance = this;
    }

    add(item) {
        this.data.push(item);
    }

    get(index) {
        return this.data[index];
    }
}

// Sử dụng
const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true
```

### Python

```python
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Singleton, cls).__new__(cls)
            # Khởi tạo singleton của bạn tại đây
            cls._instance.value = 0
        return cls._instance

# Sử dụng
s1 = Singleton()
s2 = Singleton()
print(s1 is s2)  # True
```

### C#

```csharp
public sealed class Singleton
{
    private static Singleton instance = null;
    private static readonly object padlock = new object();

    Singleton() {}

    public static Singleton Instance
    {
        get
        {
            lock(padlock)
            {
                if (instance == null)
                {
                    instance = new Singleton();
                }
                return instance;
            }
        }
    }
}
```

## Trường hợp sử dụng

- **Kết nối cơ sở dữ liệu**: Quản lý một pool kết nối
- **Logger**: Tạo một thể hiện ghi log duy nhất cho ứng dụng
- **Cài đặt cấu hình**: Lưu trữ cài đặt ứng dụng
- **Cache**: Tạo một trình quản lý cache duy nhất
- **Thread pools**: Quản lý việc tạo và gán thread

## Ưu và nhược điểm

### Ưu điểm

- Đảm bảo một lớp chỉ có một thể hiện duy nhất
- Cung cấp một điểm truy cập toàn cục đến thể hiện đó
- Đối tượng singleton chỉ được khởi tạo khi nó được yêu cầu lần đầu tiên

### Nhược điểm

- Vi phạm Nguyên lý trách nhiệm đơn lẻ (lớp quản lý việc tạo ra chính nó)
- Có thể che giấu thiết kế không tốt, ví dụ, khi các thành phần biết quá nhiều về nhau
- Yêu cầu xử lý đặc biệt trong môi trường đa luồng
- Làm cho việc kiểm thử đơn vị khó khăn hơn

## Mối quan hệ với các mẫu khác

- Một **Facade** có thể trông giống như một Singleton nếu nó chỉ ẩn một đối tượng, nhưng chúng có mục đích khác nhau
- **Abstract Factories**, **Builders**, và **Prototypes** đều có thể được triển khai như Singletons

## Ví dụ thực tế

- Lớp `java.lang.Runtime` trong Java
- Các trình quản lý UI trong nhiều framework GUI
- Windows Registry
- Đối tượng window trong trình duyệt

## Tài liệu tham khảo

- "Design Patterns: Elements of Reusable Object-Oriented Software" của Gang of Four (GoF)
- [Refactoring Guru - Singleton Pattern](https://refactoring.guru/design-patterns/singleton)
- [SourceMaking - Singleton Pattern](https://sourcemaking.com/design_patterns/singleton)

---
author: Tech Notes Hub
tags: 'learning, technology, programming'
update: '2025-06-06'
date: '2025-06-06'
title: Factory
description: Guide about Factory
---
# Mẫu thiết kế Factory

Mẫu Factory là một mẫu thiết kế tạo đối tượng cung cấp giao diện để tạo đối tượng trong lớp cha, nhưng cho phép các lớp con thay đổi loại đối tượng sẽ được tạo.

## Mục đích

- Tạo đối tượng mà không để lộ logic khởi tạo cho client
- Tham chiếu đến các đối tượng mới tạo thông qua một giao diện chung
- Tách biệt việc triển khai đối tượng khỏi việc sử dụng nó

## Vấn đề

Khi nào bạn nên sử dụng mẫu Factory?

- Khi một lớp không thể dự đoán trước loại đối tượng mà nó cần tạo
- Khi một lớp muốn các lớp con của nó chỉ định đối tượng mà nó tạo ra
- Khi bạn muốn tập trung kiến thức về việc lớp nào được tạo

## Các loại mẫu Factory

Có một số biến thể của mẫu Factory:

1. **Simple Factory** - Không phải là một mẫu chính thức, nhưng là một cách đơn giản để tách biệt việc tạo đối tượng
2. **Factory Method** - Định nghĩa một giao diện để tạo đối tượng, nhưng để các lớp con quyết định lớp nào sẽ được khởi tạo
3. **Abstract Factory** - Cung cấp một giao diện để tạo ra các họ đối tượng liên quan hoặc phụ thuộc

## Cấu trúc

### Mẫu Factory Method

![Cấu trúc mẫu Factory Method](https://refactoring.guru/images/patterns/diagrams/factory-method/structure.png)

### Mẫu Abstract Factory

![Cấu trúc mẫu Abstract Factory](https://refactoring.guru/images/patterns/diagrams/abstract-factory/structure.png)

## Triển khai

### Ví dụ về Simple Factory

```java
// Giao diện Product
interface Product {
    void operation();
}

// Các sản phẩm cụ thể
class ConcreteProductA implements Product {
    @Override
    public void operation() {
        System.out.println("Thao tác của ConcreteProductA");
    }
}

class ConcreteProductB implements Product {
    @Override
    public void operation() {
        System.out.println("Thao tác của ConcreteProductB");
    }
}

// Simple factory
class SimpleFactory {
    public Product createProduct(String type) {
        if (type.equals("A")) {
            return new ConcreteProductA();
        } else if (type.equals("B")) {
            return new ConcreteProductB();
        }
        throw new IllegalArgumentException("Loại sản phẩm không hợp lệ: " + type);
    }
}

// Client code
class Client {
    public static void main(String[] args) {
        SimpleFactory factory = new SimpleFactory();
        
        Product productA = factory.createProduct("A");
        productA.operation();
        
        Product productB = factory.createProduct("B");
        productB.operation();
    }
}
```

### Ví dụ về Factory Method

```java
// Giao diện Product
interface Product {
    void operation();
}

// Các sản phẩm cụ thể
class ConcreteProductA implements Product {
    @Override
    public void operation() {
        System.out.println("Thao tác của ConcreteProductA");
    }
}

class ConcreteProductB implements Product {
    @Override
    public void operation() {
        System.out.println("Thao tác của ConcreteProductB");
    }
}

// Lớp trừu tượng Creator với factory method
abstract class Creator {
    public abstract Product createProduct();
    
    // Creator cũng có thể bao gồm một số logic nghiệp vụ
    public void someOperation() {
        // Gọi factory method để tạo một đối tượng Product
        Product product = createProduct();
        // Sử dụng sản phẩm
        product.operation();
    }
}

// Các creator cụ thể ghi đè factory method
class ConcreteCreatorA extends Creator {
    @Override
    public Product createProduct() {
        return new ConcreteProductA();
    }
}

class ConcreteCreatorB extends Creator {
    @Override
    public Product createProduct() {
        return new ConcreteProductB();
    }
}

// Client code
class Client {
    public static void main(String[] args) {
        Creator creatorA = new ConcreteCreatorA();
        creatorA.someOperation();
        
        Creator creatorB = new ConcreteCreatorB();
        creatorB.someOperation();
    }
}
```

### Ví dụ về Abstract Factory

```java
// Các sản phẩm trừu tượng
interface ProductA {
    void operationA();
}

interface ProductB {
    void operationB();
}

// Các sản phẩm cụ thể cho họ 1
class ConcreteProductA1 implements ProductA {
    @Override
    public void operationA() {
        System.out.println("Thao tác của sản phẩm A1");
    }
}

class ConcreteProductB1 implements ProductB {
    @Override
    public void operationB() {
        System.out.println("Thao tác của sản phẩm B1");
    }
}

// Các sản phẩm cụ thể cho họ 2
class ConcreteProductA2 implements ProductA {
    @Override
    public void operationA() {
        System.out.println("Thao tác của sản phẩm A2");
    }
}

class ConcreteProductB2 implements ProductB {
    @Override
    public void operationB() {
        System.out.println("Thao tác của sản phẩm B2");
    }
}

// Giao diện Abstract factory
interface AbstractFactory {
    ProductA createProductA();
    ProductB createProductB();
}

// Các factory cụ thể
class ConcreteFactory1 implements AbstractFactory {
    @Override
    public ProductA createProductA() {
        return new ConcreteProductA1();
    }
    
    @Override
    public ProductB createProductB() {
        return new ConcreteProductB1();
    }
}

class ConcreteFactory2 implements AbstractFactory {
    @Override
    public ProductA createProductA() {
        return new ConcreteProductA2();
    }
    
    @Override
    public ProductB createProductB() {
        return new ConcreteProductB2();
    }
}

// Client code
class Client {
    private ProductA productA;
    private ProductB productB;
    
    public Client(AbstractFactory factory) {
        productA = factory.createProductA();
        productB = factory.createProductB();
    }
    
    public void executeOperations() {
        productA.operationA();
        productB.operationB();
    }
}
```

## Ví dụ trong các ngôn ngữ khác nhau

### JavaScript

```javascript
// Factory Method trong JavaScript

// Giao diện Product ngầm định trong JavaScript
class Dog {
    speak() {
        return "Gâu gâu!";
    }
}

class Cat {
    speak() {
        return "Meo meo!";
    }
}

// Creator
class AnimalFactory {
    // Factory method
    createAnimal(type) {
        switch(type) {
            case 'dog':
                return new Dog();
            case 'cat':
                return new Cat();
            default:
                throw new Error(`Loại động vật ${type} không được hỗ trợ.`);
        }
    }
}

// Sử dụng
const factory = new AnimalFactory();
const dog = factory.createAnimal('dog');
const cat = factory.createAnimal('cat');

console.log(dog.speak()); // Đầu ra: Gâu gâu!
console.log(cat.speak()); // Đầu ra: Meo meo!
```

### Python

```python
from abc import ABC, abstractmethod

# Abstract Product
class Button(ABC):
    @abstractmethod
    def render(self):
        pass
    
    @abstractmethod
    def on_click(self):
        pass

# Concrete Products
class HTMLButton(Button):
    def render(self):
        return "<button>Nút HTML</button>"
    
    def on_click(self):
        return "Nút HTML đã được nhấp!"

class WindowsButton(Button):
    def render(self):
        return "Nút Windows"
    
    def on_click(self):
        return "Nút Windows đã được nhấp!"

# Abstract Creator
class Dialog(ABC):
    @abstractmethod
    def create_button(self) -> Button:
        pass
    
    def render(self):
        # Gọi factory method để tạo đối tượng button
        button = self.create_button()
        # Bây giờ sử dụng sản phẩm
        return f"Dialog hiển thị với {button.render()}"

# Concrete Creators
class HTMLDialog(Dialog):
    def create_button(self) -> Button:
        return HTMLButton()

class WindowsDialog(Dialog):
    def create_button(self) -> Button:
        return WindowsButton()

# Client code
def client_code(dialog: Dialog):
    print(dialog.render())

# Dựa vào môi trường, chúng ta chọn dialog phù hợp
import sys
if sys.platform.startswith('win'):
    dialog = WindowsDialog()
else:
    dialog = HTMLDialog()

client_code(dialog)
```

### C#

```csharp
using System;

// Abstract Product
public interface IVehicle
{
    void Drive();
}

// Concrete Products
public class Car : IVehicle
{
    public void Drive()
    {
        Console.WriteLine("Đang lái xe ô tô...");
    }
}

public class Motorcycle : IVehicle
{
    public void Drive()
    {
        Console.WriteLine("Đang lái xe máy...");
    }
}

// Abstract Creator
public abstract class VehicleFactory
{
    // Factory Method
    public abstract IVehicle CreateVehicle();
    
    public void DeliverVehicle()
    {
        IVehicle vehicle = CreateVehicle();
        Console.WriteLine("Đang giao phương tiện...");
        vehicle.Drive();
    }
}

// Concrete Creators
public class CarFactory : VehicleFactory
{
    public override IVehicle CreateVehicle()
    {
        return new Car();
    }
}

public class MotorcycleFactory : VehicleFactory
{
    public override IVehicle CreateVehicle()
    {
        return new Motorcycle();
    }
}

// Client code
public class Program
{
    public static void Main()
    {
        VehicleFactory factory = GetFactory("car");
        factory.DeliverVehicle();
        
        factory = GetFactory("motorcycle");
        factory.DeliverVehicle();
    }
    
    private static VehicleFactory GetFactory(string vehicleType)
    {
        switch (vehicleType.ToLower())
        {
            case "car":
                return new CarFactory();
            case "motorcycle":
                return new MotorcycleFactory();
            default:
                throw new ArgumentException($"Loại phương tiện {vehicleType} không được hỗ trợ.");
        }
    }
}
```

## Trường hợp sử dụng

- **Tạo thành phần UI**: Tạo các thành phần UI khác nhau dựa trên tùy chọn của người dùng hoặc nền tảng
- **Kết nối cơ sở dữ liệu**: Tạo kết nối cơ sở dữ liệu phù hợp dựa trên cấu hình
- **Tạo tài liệu**: Tạo các loại tài liệu khác nhau (PDF, Word, v.v.)
- **Sản xuất phương tiện**: Tạo các loại phương tiện khác nhau trong một mô phỏng
- **Xử lý thanh toán**: Tạo các phương thức thanh toán khác nhau trong ứng dụng thương mại điện tử

## Ưu và nhược điểm

### Ưu điểm

- Tránh sự kết hợp chặt chẽ giữa creator và các sản phẩm cụ thể
- Nguyên tắc trách nhiệm đơn lẻ: Di chuyển mã tạo sản phẩm đến một nơi
- Nguyên tắc mở/đóng: Các sản phẩm mới có thể được thêm vào mà không phá vỡ mã hiện có
- Tạo đối tượng theo yêu cầu, thay vì tại thời điểm khởi tạo

### Nhược điểm

- Mã có thể trở nên phức tạp hơn do việc giới thiệu nhiều lớp con mới
- Client có thể bị giới hạn về các sản phẩm được hiển thị bởi giao diện factory

## Mối quan hệ với các mẫu khác

- Các lớp **Abstract Factory** thường được triển khai với Factory Methods
- **Factory Methods** thường được sử dụng trong Template Methods
- **Prototype** có thể là một giải pháp thay thế cho Factory khi mục tiêu là giảm việc tạo lớp con
- **Builder** tập trung vào việc xây dựng các đối tượng phức tạp từng bước một, trong khi Factory Method là một lệnh gọi duy nhất

## Ví dụ thực tế

- `Calendar.getInstance()` trong Java
- Các factory widget trong các framework UI
- Các factory kết nối cơ sở dữ liệu
- Các trình tạo tài liệu trong bộ ứng dụng văn phòng

## Tài liệu tham khảo

- "Design Patterns: Elements of Reusable Object-Oriented Software" của Gang of Four (GoF)
- [Refactoring Guru - Mẫu Factory Method](https://refactoring.guru/design-patterns/factory-method)
- [Refactoring Guru - Mẫu Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory) 

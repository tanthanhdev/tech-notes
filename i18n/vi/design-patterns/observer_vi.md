# Mẫu thiết kế Observer

Mẫu Observer là một mẫu thiết kế hành vi trong đó một đối tượng, gọi là chủ thể (subject), duy trì danh sách các phụ thuộc của nó, gọi là Observer, và thông báo cho họ tự động về bất kỳ thay đổi trạng thái nào, thường bằng cách gọi một trong các phương thức của họ.

## Mục đích

- Định nghĩa một mối quan hệ một-nhiều giữa các đối tượng để khi một đối tượng thay đổi trạng thái, tất cả các đối tượng phụ thuộc của nó được thông báo và cập nhật tự động.
- Đóng gói các thành phần cốt lõi trong một lớp Subject trừu tượng, và các thành phần biến đổi trong một phân cấp Observer.
- Các lớp Subject và Observer có thể thay đổi độc lập với nhau.

## Vấn đề

Trong nhiều ứng dụng, một số loại đối tượng cụ thể cần được thông báo về những thay đổi trong các đối tượng khác. Tuy nhiên, chúng ta không muốn kết nối quá chặt chẽ các loại đối tượng khác nhau này để duy trì tính linh hoạt và khả năng tái sử dụng.

Bạn cần một cách để một đối tượng thông báo cho một số lượng không xác định trước các đối tượng khác về những thay đổi, mà không cần các đối tượng đó kết nối chặt chẽ với nhau.

## Cấu trúc

![Cấu trúc mẫu Observer](https://refactoring.guru/images/patterns/diagrams/observer/structure.png)

- **Subject (Chủ thể)**: Giao diện hoặc lớp trừu tượng định nghĩa các hoạt động để gắn, tách, và thông báo cho Observer.
- **ConcreteSubject (Chủ thể cụ thể)**: Duy trì trạng thái mà Observer quan tâm và gửi thông báo khi trạng thái thay đổi.
- **Observer (Observer)**: Giao diện hoặc lớp trừu tượng với phương thức cập nhật được gọi khi trạng thái của chủ thể thay đổi.
- **ConcreteObserver (Observer cụ thể)**: Triển khai giao diện Observer để giữ trạng thái của nó nhất quán với trạng thái của chủ thể.

## Triển khai

### Triển khai cơ bản

```java
// Giao diện Observer
interface Observer {
    void update(Subject subject);
}

// Giao diện Subject
interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers();
}

// ConcreteSubject
class ConcreteSubject implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private int state;

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
        notifyObservers();
    }

    @Override
    public void attach(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void detach(Observer observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update(this);
        }
    }
}

// ConcreteObserver
class ConcreteObserver implements Observer {
    private int observerState;

    @Override
    public void update(Subject subject) {
        if (subject instanceof ConcreteSubject) {
            observerState = ((ConcreteSubject) subject).getState();
            System.out.println("Trạng thái Observer được cập nhật thành: " + observerState);
        }
    }
}
```

### Mô hình Push và Pull

#### Mô hình Push

Trong mô hình push, Chủ thể gửi thông tin chi tiết về thay đổi đến tất cả Observer, bất kể họ có cần hay không:

```java
// Trong ConcreteSubject
public void notifyObservers(int state) {
    for (Observer observer : observers) {
        observer.update(state);
    }
}

// Trong giao diện Observer
void update(int state);
```

#### Mô hình Pull

Trong mô hình pull, Chủ thể chỉ đơn giản thông báo cho Observer rằng có thay đổi xảy ra, và Observer chịu trách nhiệm lấy dữ liệu cần thiết:

```java
// Trong ConcreteSubject
public void notifyObservers() {
    for (Observer observer : observers) {
        observer.update(this);
    }
}

// Trong giao diện Observer
void update(Subject subject);
```

## Ví dụ trong các ngôn ngữ khác nhau

### JavaScript

```javascript
// Sử dụng lớp ES6
class Subject {
    constructor() {
        this.observers = [];
    }

    attach(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    detach(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    notify() {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
}

class WeatherStation extends Subject {
    constructor() {
        super();
        this.temperature = 0;
        this.humidity = 0;
    }

    setMeasurements(temperature, humidity) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.notify();
    }

    getTemperature() {
        return this.temperature;
    }

    getHumidity() {
        return this.humidity;
    }
}

class Observer {
    update(subject) {}
}

class DisplayDevice extends Observer {
    constructor(name) {
        super();
        this.name = name;
    }

    update(weatherStation) {
        console.log(`Màn hình ${this.name}: Nhiệt độ ${weatherStation.getTemperature()}°C, Độ ẩm ${weatherStation.getHumidity()}%`);
    }
}

// Cách sử dụng
const weatherStation = new WeatherStation();
const phoneDisplay = new DisplayDevice('Điện thoại');
const laptopDisplay = new DisplayDevice('Laptop');

weatherStation.attach(phoneDisplay);
weatherStation.attach(laptopDisplay);

weatherStation.setMeasurements(25, 60); // Cả hai màn hình cập nhật
weatherStation.detach(laptopDisplay);
weatherStation.setMeasurements(26, 70); // Chỉ màn hình điện thoại cập nhật
```

### Python

```python
from abc import ABC, abstractmethod

# Giao diện Observer
class Observer(ABC):
    @abstractmethod
    def update(self, subject):
        pass

# Giao diện Subject
class Subject(ABC):
    @abstractmethod
    def attach(self, observer):
        pass

    @abstractmethod
    def detach(self, observer):
        pass

    @abstractmethod
    def notify(self):
        pass

# ConcreteSubject
class NewsPublisher(Subject):
    def __init__(self):
        self._observers = []
        self._latest_news = None

    def attach(self, observer):
        self._observers.append(observer)

    def detach(self, observer):
        self._observers.remove(observer)

    def notify(self):
        for observer in self._observers:
            observer.update(self)

    def add_news(self, news):
        self._latest_news = news
        self.notify()

    @property
    def latest_news(self):
        return self._latest_news

# ConcreteObserver
class NewsSubscriber(Observer):
    def __init__(self, name):
        self._name = name

    def update(self, subject):
        print(f"{self._name} nhận được tin tức: {subject.latest_news}")

# Cách sử dụng
if __name__ == "__main__":
    publisher = NewsPublisher()

    subscriber1 = NewsSubscriber("Người đăng ký 1")
    subscriber2 = NewsSubscriber("Người đăng ký 2")

    publisher.attach(subscriber1)
    publisher.attach(subscriber2)

    publisher.add_news("Tin nóng: Mẫu Observer đang hoạt động!")

    publisher.detach(subscriber1)

    publisher.add_news("Cập nhật mới: Người đăng ký 1 đã hủy đăng ký!")
```

### C#

```csharp
using System;
using System.Collections.Generic;

// Giao diện Observer
public interface IObserver
{
    void Update(ISubject subject);
}

// Giao diện Subject
public interface ISubject
{
    void Attach(IObserver observer);
    void Detach(IObserver observer);
    void Notify();
}

// ConcreteSubject
public class StockMarket : ISubject
{
    private List<IObserver> _observers = new List<IObserver>();
    private Dictionary<string, double> _stocks = new Dictionary<string, double>();

    public void Attach(IObserver observer)
    {
        Console.WriteLine("Thị trường chứng khoán: Đã gắn một Observer.");
        _observers.Add(observer);
    }

    public void Detach(IObserver observer)
    {
        _observers.Remove(observer);
        Console.WriteLine("Thị trường chứng khoán: Đã tách một Observer.");
    }

    public void Notify()
    {
        Console.WriteLine("Thị trường chứng khoán: Đang thông báo cho Observer...");

        foreach (var observer in _observers)
        {
            observer.Update(this);
        }
    }

    public void UpdateStockPrice(string stockSymbol, double price)
    {
        Console.WriteLine($"Thị trường chứng khoán: Giá {stockSymbol} cập nhật thành {price}");
        _stocks[stockSymbol] = price;
        Notify();
    }

    public Dictionary<string, double> GetStocks()
    {
        return _stocks;
    }
}

// ConcreteObserver
public class Investor : IObserver
{
    private string _name;
    private Dictionary<string, double> _watchlist = new Dictionary<string, double>();

    public Investor(string name)
    {
        _name = name;
    }

    public void Update(ISubject subject)
    {
        if (subject is StockMarket stockMarket)
        {
            var stocks = stockMarket.GetStocks();
            foreach (var stock in stocks)
            {
                if (_watchlist.ContainsKey(stock.Key) && _watchlist[stock.Key] != stock.Value)
                {
                    Console.WriteLine($"{_name}: Nhận thấy giá {stock.Key} thay đổi từ {_watchlist[stock.Key]} thành {stock.Value}");
                }
                _watchlist[stock.Key] = stock.Value;
            }
        }
    }
}
```

## Trường hợp sử dụng thực tế

1. **Hệ thống xử lý sự kiện**: Các framework UI sử dụng mẫu Observer để xử lý hành động của người dùng.
2. **Dịch vụ đăng ký tin tức**: Người dùng đăng ký các chủ đề và nhận cập nhật.
3. **Theo dõi thị trường chứng khoán**: Nhà đầu tư theo dõi thay đổi giá cổ phiếu.
4. **Thông báo mạng xã hội**: Người dùng nhận thông báo về các hoạt động liên quan đến tài khoản của họ.
5. **Hệ thống hàng đợi tin nhắn**: Nhà xuất bản gửi tin nhắn đến người tiêu dùng đã đăng ký.
6. **Hệ thống giám sát**: Ứng dụng giám sát tài nguyên hệ thống hoặc dịch vụ.

## Ưu và nhược điểm

### Ưu điểm

- **Nguyên tắc Mở/Đóng**: Bạn có thể giới thiệu các lớp người đăng ký mới mà không cần thay đổi mã của nhà xuất bản.
- **Liên kết lỏng lẻo**: Nhà xuất bản không cần biết bất cứ điều gì về người đăng ký.
- **Mối quan hệ động**: Mối quan hệ giữa nhà xuất bản và người đăng ký có thể được thiết lập trong thời gian chạy.
- **Xử lý sự kiện**: Hiệu quả cho việc triển khai hệ thống xử lý sự kiện.

### Nhược điểm

- **Cập nhật không mong đợi**: Người đăng ký có thể được thông báo theo thứ tự không thể dự đoán.
- **Rò rỉ bộ nhớ**: Nếu Observer quên hủy đăng ký, họ có thể không được thu gom rác.
- **Chi phí hiệu suất**: Thông báo có thể tốn kém nếu có nhiều Observer hoặc thay đổi trạng thái thường xuyên.
- **Độ phức tạp**: Gỡ lỗi có thể gặp thách thức vì luồng điều khiển ít rõ ràng hơn.

## Mối quan hệ với các mẫu khác

- **Mediator (Người trung gian)**: Trong khi Observer phân phối giao tiếp bằng cách giới thiệu đối tượng người đăng ký và nhà xuất bản, Mediator đóng gói giao tiếp giữa các đối tượng.
- **Command (Lệnh)**: Commands có thể được sử dụng để triển khai mẫu Observer bằng cách chuyển yêu cầu thành đối tượng.
- **Memento (Bản ghi nhớ)**: Có thể được sử dụng với Observer để hoàn tác các hoạt động sau khi thông báo cho Observer về các thay đổi.
- **Mẫu MVC**: Mẫu Observer thường được sử dụng trong kiến trúc MVC nơi View quan sát các thay đổi trong Model.

## Tài liệu tham khảo

- "Design Patterns: Elements of Reusable Object-Oriented Software" của Gang of Four (GoF)
- [Refactoring Guru - Observer Pattern](https://refactoring.guru/design-patterns/observer)
- [SourceMaking - Observer Pattern](https://sourcemaking.com/design_patterns/observer)
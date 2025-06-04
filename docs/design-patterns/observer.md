# Observer Design Pattern

The Observer pattern is a behavioral design pattern where an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods.

## Intent

- Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
- Encapsulate the core components in a Subject abstraction, and the variable components in an Observer hierarchy.
- The Subject and Observer classes can vary independently.

## Problem

In many applications, specific types of objects need to be informed about changes in other objects. However, we don't want to couple these different types of objects too tightly to maintain flexibility and reusability.

You need a way for an object to notify an open-ended number of other objects about changes, without having those objects tightly coupled to each other.

## Structure

![Observer Pattern Structure](https://refactoring.guru/images/patterns/diagrams/observer/structure.png)

- **Subject**: Interface or abstract class defining operations for attaching, detaching, and notifying observers.
- **ConcreteSubject**: Maintains state of interest to observers and sends notifications when state changes.
- **Observer**: Interface or abstract class with an update method that gets called when the subject's state changes.
- **ConcreteObserver**: Implements the Observer interface to keep its state consistent with the subject's state.

## Implementation

### Basic Implementation

```java
// Observer interface
interface Observer {
    void update(Subject subject);
}

// Subject interface
interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers();
}

// Concrete Subject
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

// Concrete Observer
class ConcreteObserver implements Observer {
    private int observerState;
    
    @Override
    public void update(Subject subject) {
        if (subject instanceof ConcreteSubject) {
            observerState = ((ConcreteSubject) subject).getState();
            System.out.println("Observer state updated to: " + observerState);
        }
    }
}
```

### Push vs. Pull Models

#### Push Model

In the push model, the Subject sends detailed information about the change to all Observers, whether they need it or not:

```java
// In ConcreteSubject
public void notifyObservers(int state) {
    for (Observer observer : observers) {
        observer.update(state);
    }
}

// In Observer interface
void update(int state);
```

#### Pull Model

In the pull model, the Subject simply notifies Observers that a change occurred, and Observers are responsible for pulling the needed data:

```java
// In ConcreteSubject
public void notifyObservers() {
    for (Observer observer : observers) {
        observer.update(this);
    }
}

// In Observer interface
void update(Subject subject);
```

## Examples in Different Languages

### JavaScript

```javascript
// Using ES6 classes
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
        console.log(`${this.name} Display: Temperature ${weatherStation.getTemperature()}°C, Humidity ${weatherStation.getHumidity()}%`);
    }
}

// Usage
const weatherStation = new WeatherStation();
const phoneDisplay = new DisplayDevice('Phone');
const laptopDisplay = new DisplayDevice('Laptop');

weatherStation.attach(phoneDisplay);
weatherStation.attach(laptopDisplay);

weatherStation.setMeasurements(25, 60); // Both displays update
weatherStation.detach(laptopDisplay);
weatherStation.setMeasurements(26, 70); // Only phone display updates
```

### Python

```python
from abc import ABC, abstractmethod

# Observer interface
class Observer(ABC):
    @abstractmethod
    def update(self, subject):
        pass

# Subject interface
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

# Concrete Subject
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

# Concrete Observer
class NewsSubscriber(Observer):
    def __init__(self, name):
        self._name = name
    
    def update(self, subject):
        print(f"{self._name} received news: {subject.latest_news}")

# Usage
if __name__ == "__main__":
    publisher = NewsPublisher()
    
    subscriber1 = NewsSubscriber("Subscriber 1")
    subscriber2 = NewsSubscriber("Subscriber 2")
    
    publisher.attach(subscriber1)
    publisher.attach(subscriber2)
    
    publisher.add_news("Breaking News: Observer Pattern in Action!")
    
    publisher.detach(subscriber1)
    
    publisher.add_news("Another Update: Subscriber 1 has unsubscribed!")
```

### C#

```csharp
using System;
using System.Collections.Generic;

// Observer interface
public interface IObserver
{
    void Update(ISubject subject);
}

// Subject interface
public interface ISubject
{
    void Attach(IObserver observer);
    void Detach(IObserver observer);
    void Notify();
}

// Concrete Subject
public class StockMarket : ISubject
{
    private List<IObserver> _observers = new List<IObserver>();
    private Dictionary<string, double> _stocks = new Dictionary<string, double>();
    
    public void Attach(IObserver observer)
    {
        Console.WriteLine("StockMarket: Attached an observer.");
        _observers.Add(observer);
    }
    
    public void Detach(IObserver observer)
    {
        _observers.Remove(observer);
        Console.WriteLine("StockMarket: Detached an observer.");
    }
    
    public void Notify()
    {
        Console.WriteLine("StockMarket: Notifying observers...");
        
        foreach (var observer in _observers)
        {
            observer.Update(this);
        }
    }
    
    public void UpdateStockPrice(string stockSymbol, double price)
    {
        Console.WriteLine($"StockMarket: {stockSymbol} price updated to {price}");
        _stocks[stockSymbol] = price;
        Notify();
    }
    
    public Dictionary<string, double> GetStocks()
    {
        return _stocks;
    }
}

// Concrete Observer
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
                    Console.WriteLine($"{_name}: Noticed {stock.Key} price changed from {_watchlist[stock.Key]} to {stock.Value}");
                }
                _watchlist[stock.Key] = stock.Value;
            }
        }
    }
}
```

## Real-World Use Cases

1. **Event Handling Systems**: UI frameworks use Observer pattern to handle user actions.
2. **News Subscription Services**: Users subscribe to topics and receive updates.
3. **Stock Market Monitoring**: Investors monitor stock price changes.
4. **Social Media Notifications**: Users get notified about activities related to their account.
5. **Message Queue Systems**: Publishers send messages to subscribed consumers.
6. **Monitoring Systems**: Applications monitor system resources or services.

## Pros and Cons

### Pros

- **Open/Closed Principle**: You can introduce new subscriber classes without changing the publisher's code.
- **Loose Coupling**: Publishers don't need to know anything about subscribers.
- **Dynamic Relationships**: Relationships between publishers and subscribers can be established at runtime.
- **Event Handling**: Effective for implementing event handling systems.

### Cons

- **Unexpected Updates**: Subscribers can be notified in an unpredictable order.
- **Memory Leaks**: If observers forget to unsubscribe, they might not be garbage collected.
- **Performance Overhead**: Notification can be costly if there are many observers or frequent state changes.
- **Complexity**: Debugging can be challenging because the flow of control is less obvious.

## Relations with Other Patterns

- **Mediator**: While Observer distributes communication by introducing subscriber and publisher objects, Mediator encapsulates the communication between objects.
- **Command**: Commands can be used to implement the Observer pattern by turning requests into objects.
- **Memento**: Can be used with Observer to undo operations after notifying observers about the changes.
- **MVC Pattern**: The Observer pattern is often used in MVC architectures where the View observes changes in the Model.

## References

- "Design Patterns: Elements of Reusable Object-Oriented Software" by Gang of Four (GoF)
- [Refactoring Guru - Observer Pattern](https://refactoring.guru/design-patterns/observer)
- [SourceMaking - Observer Pattern](https://sourcemaking.com/design_patterns/observer) 
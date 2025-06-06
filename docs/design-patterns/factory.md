---
author: Tech Notes Hub
tags: 'learning, technology, programming'
update: '2025-06-06'
date: '2025-06-06'
title: Factory
description: Guide about Factory
---
# Factory Design Pattern

The Factory pattern is a creational design pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.

## Intent

- Create objects without exposing the instantiation logic to the client
- Refer to newly created objects using a common interface
- Decouple the implementation of an object from its use

## Problem

When should you use the Factory pattern?

- When a class cannot anticipate the type of objects it needs to create
- When a class wants its subclasses to specify the objects it creates
- When you want to localize the knowledge of which class gets created

## Types of Factory Patterns

There are several variations of the Factory pattern:

1. **Simple Factory** - Not a formal pattern, but a simple way to separate object creation
2. **Factory Method** - Defines an interface for creating objects, but lets subclasses decide which classes to instantiate
3. **Abstract Factory** - Provides an interface for creating families of related or dependent objects

## Structure

### Factory Method Pattern

![Factory Method Pattern Structure](https://refactoring.guru/images/patterns/diagrams/factory-method/structure.png)

### Abstract Factory Pattern

![Abstract Factory Pattern Structure](https://refactoring.guru/images/patterns/diagrams/abstract-factory/structure.png)

## Implementation

### Simple Factory Example

```java
// Product interface
interface Product {
    void operation();
}

// Concrete products
class ConcreteProductA implements Product {
    @Override
    public void operation() {
        System.out.println("ConcreteProductA operation");
    }
}

class ConcreteProductB implements Product {
    @Override
    public void operation() {
        System.out.println("ConcreteProductB operation");
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
        throw new IllegalArgumentException("Invalid product type: " + type);
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

### Factory Method Example

```java
// Product interface
interface Product {
    void operation();
}

// Concrete products
class ConcreteProductA implements Product {
    @Override
    public void operation() {
        System.out.println("ConcreteProductA operation");
    }
}

class ConcreteProductB implements Product {
    @Override
    public void operation() {
        System.out.println("ConcreteProductB operation");
    }
}

// Creator abstract class with factory method
abstract class Creator {
    public abstract Product createProduct();
    
    // The creator can also include some business logic
    public void someOperation() {
        // Call the factory method to create a Product object
        Product product = createProduct();
        // Use the product
        product.operation();
    }
}

// Concrete creators override factory method
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

### Abstract Factory Example

```java
// Abstract products
interface ProductA {
    void operationA();
}

interface ProductB {
    void operationB();
}

// Concrete products for family 1
class ConcreteProductA1 implements ProductA {
    @Override
    public void operationA() {
        System.out.println("Product A1 operation");
    }
}

class ConcreteProductB1 implements ProductB {
    @Override
    public void operationB() {
        System.out.println("Product B1 operation");
    }
}

// Concrete products for family 2
class ConcreteProductA2 implements ProductA {
    @Override
    public void operationA() {
        System.out.println("Product A2 operation");
    }
}

class ConcreteProductB2 implements ProductB {
    @Override
    public void operationB() {
        System.out.println("Product B2 operation");
    }
}

// Abstract factory interface
interface AbstractFactory {
    ProductA createProductA();
    ProductB createProductB();
}

// Concrete factories
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

## Examples in Different Languages

### JavaScript

```javascript
// Factory Method in JavaScript

// Product interface is implicit in JavaScript
class Dog {
    speak() {
        return "Woof!";
    }
}

class Cat {
    speak() {
        return "Meow!";
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
                throw new Error(`Animal type ${type} is not supported.`);
        }
    }
}

// Usage
const factory = new AnimalFactory();
const dog = factory.createAnimal('dog');
const cat = factory.createAnimal('cat');

console.log(dog.speak()); // Outputs: Woof!
console.log(cat.speak()); // Outputs: Meow!
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
        return "<button>HTML Button</button>"
    
    def on_click(self):
        return "HTML Button clicked!"

class WindowsButton(Button):
    def render(self):
        return "Windows Button"
    
    def on_click(self):
        return "Windows Button clicked!"

# Abstract Creator
class Dialog(ABC):
    @abstractmethod
    def create_button(self) -> Button:
        pass
    
    def render(self):
        # Call the factory method to create a button object
        button = self.create_button()
        # Now use the product
        return f"Dialog rendering with {button.render()}"

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

# Based on environment, we select the appropriate dialog
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
        Console.WriteLine("Driving a car...");
    }
}

public class Motorcycle : IVehicle
{
    public void Drive()
    {
        Console.WriteLine("Driving a motorcycle...");
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
        Console.WriteLine("Delivering the vehicle...");
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
                throw new ArgumentException($"Vehicle type {vehicleType} is not supported.");
        }
    }
}
```

## Use Cases

- **UI Component Creation**: Creating different UI components based on user preferences or platform
- **Database Connections**: Creating the right database connection based on configuration
- **Document Generation**: Creating different document types (PDF, Word, etc.)
- **Vehicle Manufacturing**: Creating different types of vehicles in a simulation
- **Payment Processing**: Creating different payment methods in an e-commerce application

## Pros and Cons

### Pros

- Avoids tight coupling between creator and concrete products
- Single Responsibility Principle: Move product creation code to one place
- Open/Closed Principle: New products can be added without breaking existing code
- Creates objects on demand, rather than at initialization time

### Cons

- Code may become more complicated due to introduction of many new subclasses
- Client might be limited to the products exposed by the factory interface

## Relations with Other Patterns

- **Abstract Factory** classes are often implemented with Factory Methods
- **Factory Methods** are often used in Template Methods
- **Prototype** can be an alternative to Factory when the goal is to reduce subclassing
- **Builder** focuses on constructing complex objects step by step, while Factory Method is a single method call

## Real-World Examples

- Java's `Calendar.getInstance()`
- UI frameworks' widget factories
- Database connection factories
- Document generators in office suites

## References

- "Design Patterns: Elements of Reusable Object-Oriented Software" by Gang of Four (GoF)
- [Refactoring Guru - Factory Method Pattern](https://refactoring.guru/design-patterns/factory-method)
- [Refactoring Guru - Abstract Factory Pattern](https://refactoring.guru/design-patterns/abstract-factory) 

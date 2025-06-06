---
author: Tech Notes Hub
tags: 'learning, technology, programming'
update: '2025-06-06'
date: '2025-06-06'
title: Singleton
description: Guide about Singleton
---
# Singleton Design Pattern

The Singleton pattern is a creational design pattern that ensures a class has only one instance and provides a global point of access to that instance.

## Intent

- Ensure a class has only one instance.
- Provide a global access point to that instance.
- Control concurrent access to shared resources.

## Problem

When should you use the Singleton pattern?

- When you need exactly one instance of a class to coordinate actions across the system
- When you want to restrict the instantiation of a class to just one object
- When you need stricter control over global variables

## Structure

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

![Singleton Pattern Structure](https://refactoring.guru/images/patterns/diagrams/singleton/structure-en.png)

## Implementation

### Basic Implementation

```java
public class Singleton {
    // The private static instance of the class
    private static Singleton instance;

    // Private constructor prevents instantiation from other classes
    private Singleton() { }

    // The public static method to get the instance
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }

    // Other methods and fields
    public void doSomething() {
        System.out.println("Singleton is doing something");
    }
}
```

### Thread-Safe Implementation

```java
public class ThreadSafeSingleton {
    private static volatile ThreadSafeSingleton instance;

    private ThreadSafeSingleton() { }

    public static ThreadSafeSingleton getInstance() {
        // Double-checked locking
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

### Eager Initialization

```java
public class EagerSingleton {
    // Instance is created at load time
    private static final EagerSingleton INSTANCE = new EagerSingleton();

    private EagerSingleton() { }

    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
}
```

### Using Enum (Java)

```java
public enum EnumSingleton {
    INSTANCE;

    public void doSomething() {
        System.out.println("Singleton enum is doing something");
    }
}
```

## Examples in Different Languages

### JavaScript

```javascript
class Singleton {
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }

        // Initialize the singleton
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

// Usage
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
            # Initialize your singleton here
            cls._instance.value = 0
        return cls._instance

# Usage
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

## Use Cases

- **Database connections**: Manage a connection pool
- **Logger**: Create a single logging instance for an application
- **Configuration settings**: Store application settings
- **Cache**: Create a single cache manager
- **Thread pools**: Manage thread creation and assignment

## Pros and Cons

### Pros

- Ensures a class has just a single instance
- Provides a global access point to that instance
- The singleton object is initialized only when it's requested for the first time

### Cons

- Violates the Single Responsibility Principle (the class manages its own creation)
- Can mask bad design, for instance, when components know too much about each other
- Requires special treatment in a multithreaded environment
- Makes unit testing more difficult

## Relations with Other Patterns

- A **Facade** might look like a Singleton if it only hides one object, but they have different purposes
- **Abstract Factories**, **Builders**, and **Prototypes** can all be implemented as Singletons

## Real-World Examples

- Java's `java.lang.Runtime` class
- UI Managers in many GUI frameworks
- Windows Registry
- Browser's window object

## References

- "Design Patterns: Elements of Reusable Object-Oriented Software" by Gang of Four (GoF)
- [Refactoring Guru - Singleton Pattern](https://refactoring.guru/design-patterns/singleton)
- [SourceMaking - Singleton Pattern](https://sourcemaking.com/design_patterns/singleton)

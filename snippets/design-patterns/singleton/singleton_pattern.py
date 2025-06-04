#!/usr/bin/env python3
"""
Singleton Pattern Implementation in Python

This demonstrates various implementations of the Singleton pattern in Python.
"""


# Method 1: Classic Implementation (Not Thread-Safe)
class ClassicSingleton:
    """
    Classic implementation of the Singleton pattern.
    Not thread-safe, but simple and effective for single-threaded applications.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            print("Creating new instance of ClassicSingleton")
            cls._instance = super(ClassicSingleton, cls).__new__(cls)
            cls._instance.initialize()
        return cls._instance
    
    def initialize(self):
        """Initialize the singleton instance"""
        self.value = 0
    
    def increment(self):
        """Increment the value and return it"""
        self.value += 1
        return self.value


# Method 2: Decorator-based implementation
def singleton(cls):
    """
    Singleton decorator.
    Makes any class a Singleton by replacing its __new__ method.
    """
    instances = {}
    
    def get_instance(*args, **kwargs):
        if cls not in instances:
            print(f"Creating new instance of {cls.__name__} via decorator")
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    
    return get_instance


@singleton
class DecoratedSingleton:
    """Singleton class implemented using a decorator"""
    
    def __init__(self):
        self.value = 0
    
    def increment(self):
        """Increment the value and return it"""
        self.value += 1
        return self.value


# Method 3: Metaclass-based implementation
class SingletonMeta(type):
    """
    Metaclass for implementing the Singleton pattern.
    More advanced and flexible than other implementations.
    """
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            print(f"Creating new instance of {cls.__name__} via metaclass")
            cls._instances[cls] = super(SingletonMeta, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class MetaclassSingleton(metaclass=SingletonMeta):
    """Singleton class implemented using a metaclass"""
    
    def __init__(self):
        self.value = 0
    
    def increment(self):
        """Increment the value and return it"""
        self.value += 1
        return self.value


# Method 4: Module-level Singleton
# This approach leverages Python's module import system to create singletons
# Since modules are imported only once, objects defined at module level are singletons

class _ModuleSingleton:
    """
    Private class for module-level singleton.
    The actual instance is exposed as a module-level variable.
    """
    def __init__(self):
        print("Creating module-level Singleton")
        self.value = 0
    
    def increment(self):
        """Increment the value and return it"""
        self.value += 1
        return self.value


# The single instance that will be imported elsewhere
module_singleton = _ModuleSingleton()


# Method 5: Borg pattern (Monostate)
# All instances share state, but are not the same object
class BorgSingleton:
    """
    Implementation of the Borg pattern.
    All instances share state but are not the same object.
    """
    _shared_state = {}
    
    def __init__(self):
        # Share the __dict__ (state) among all instances
        self.__dict__ = self._shared_state
        if not self._shared_state:
            print("Initializing Borg Singleton shared state")
            self.value = 0
    
    def increment(self):
        """Increment the value and return it"""
        self.value += 1
        return self.value


# Method 6: Thread-safe Singleton with double-checked locking
import threading

class ThreadSafeSingleton:
    """
    Thread-safe implementation of the Singleton pattern.
    Uses a lock to prevent race conditions.
    """
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        # Double-checked locking pattern
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:  # Check again after acquiring the lock
                    print("Creating thread-safe Singleton instance")
                    cls._instance = super(ThreadSafeSingleton, cls).__new__(cls)
                    cls._instance.initialize()
        return cls._instance
    
    def initialize(self):
        """Initialize the singleton instance"""
        self.value = 0
    
    def increment(self):
        """Increment the value and return it"""
        self.value += 1
        return self.value


# Example usage
def demonstrate_classic_singleton():
    """Demonstrate classic singleton pattern"""
    print("\n=== Classic Singleton ===")
    s1 = ClassicSingleton()
    s2 = ClassicSingleton()
    
    print(f"s1 is s2: {s1 is s2}")
    print(f"s1.increment(): {s1.increment()}")
    print(f"s2.increment(): {s2.increment()}")
    print(f"s1.value: {s1.value}, s2.value: {s2.value}")


def demonstrate_decorated_singleton():
    """Demonstrate decorator-based singleton pattern"""
    print("\n=== Decorated Singleton ===")
    s1 = DecoratedSingleton()
    s2 = DecoratedSingleton()
    
    print(f"s1 is s2: {s1 is s2}")
    print(f"s1.increment(): {s1.increment()}")
    print(f"s2.increment(): {s2.increment()}")
    print(f"s1.value: {s1.value}, s2.value: {s2.value}")


def demonstrate_metaclass_singleton():
    """Demonstrate metaclass-based singleton pattern"""
    print("\n=== Metaclass Singleton ===")
    s1 = MetaclassSingleton()
    s2 = MetaclassSingleton()
    
    print(f"s1 is s2: {s1 is s2}")
    print(f"s1.increment(): {s1.increment()}")
    print(f"s2.increment(): {s2.increment()}")
    print(f"s1.value: {s1.value}, s2.value: {s2.value}")


def demonstrate_module_singleton():
    """Demonstrate module-level singleton pattern"""
    print("\n=== Module Singleton ===")
    # We would normally import this, but here we use the one defined above
    s1 = module_singleton
    s2 = module_singleton
    
    print(f"s1 is s2: {s1 is s2}")
    print(f"s1.increment(): {s1.increment()}")
    print(f"s2.increment(): {s2.increment()}")
    print(f"s1.value: {s1.value}, s2.value: {s2.value}")


def demonstrate_borg_singleton():
    """Demonstrate Borg pattern (monostate)"""
    print("\n=== Borg Singleton (Monostate) ===")
    s1 = BorgSingleton()
    s2 = BorgSingleton()
    
    print(f"s1 is s2: {s1 is s2}")  # Will be False!
    print(f"s1.increment(): {s1.increment()}")
    print(f"s2.increment(): {s2.increment()}")
    print(f"s1.value: {s1.value}, s2.value: {s2.value}")


def demonstrate_thread_safe_singleton():
    """Demonstrate thread-safe singleton pattern"""
    print("\n=== Thread-Safe Singleton ===")
    s1 = ThreadSafeSingleton()
    s2 = ThreadSafeSingleton()
    
    print(f"s1 is s2: {s1 is s2}")
    print(f"s1.increment(): {s1.increment()}")
    print(f"s2.increment(): {s2.increment()}")
    print(f"s1.value: {s1.value}, s2.value: {s2.value}")


def main():
    """Run demonstrations of all singleton implementations"""
    print("Singleton Pattern Demonstrations")
    print("===============================")
    
    demonstrate_classic_singleton()
    demonstrate_decorated_singleton()
    demonstrate_metaclass_singleton()
    demonstrate_module_singleton()
    demonstrate_borg_singleton()
    demonstrate_thread_safe_singleton()


if __name__ == "__main__":
    main() 
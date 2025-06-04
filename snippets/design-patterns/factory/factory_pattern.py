#!/usr/bin/env python3
"""
Factory Pattern Implementation in Python

This demonstrates three variations of the Factory Pattern:
1. Simple Factory
2. Factory Method
3. Abstract Factory
"""

from abc import ABC, abstractmethod
import sys

# ============= SIMPLE FACTORY EXAMPLE =============

class Product(ABC):
    """Product interface"""
    @abstractmethod
    def operation(self):
        pass

class ConcreteProductA(Product):
    """Concrete product A"""
    def operation(self):
        return "Result of ConcreteProductA operation"

class ConcreteProductB(Product):
    """Concrete product B"""
    def operation(self):
        return "Result of ConcreteProductB operation"

class SimpleFactory:
    """Simple Factory implementation"""
    @staticmethod
    def create_product(product_type):
        """Creates a product based on type"""
        if product_type == "A":
            return ConcreteProductA()
        elif product_type == "B":
            return ConcreteProductB()
        else:
            raise ValueError(f"Product type {product_type} not recognized")

# Client code for Simple Factory
def simple_factory_client():
    """Demo of Simple Factory Pattern"""
    print("\n=== Simple Factory Example ===")
    factory = SimpleFactory()
    
    # Create and use product A
    product_a = factory.create_product("A")
    print(product_a.operation())
    
    # Create and use product B
    product_b = factory.create_product("B")
    print(product_b.operation())

# ============= FACTORY METHOD EXAMPLE =============

class Creator(ABC):
    """Creator class with factory method"""
    @abstractmethod
    def factory_method(self):
        """Factory method to be implemented by subclasses"""
        pass
    
    def some_operation(self):
        """Business logic that uses the factory method"""
        # Call the factory method to create a Product object
        product = self.factory_method()
        
        # Use the product
        result = f"Creator: The same creator's code has just worked with {product.operation()}"
        return result

class ConcreteCreator1(Creator):
    """Concrete creator that returns ConcreteProductA"""
    def factory_method(self):
        return ConcreteProductA()

class ConcreteCreator2(Creator):
    """Concrete creator that returns ConcreteProductB"""
    def factory_method(self):
        return ConcreteProductB()

# Client code for Factory Method
def factory_method_client():
    """Demo of Factory Method Pattern"""
    print("\n=== Factory Method Example ===")
    
    print("App: Launched with ConcreteCreator1")
    client_code(ConcreteCreator1())
    
    print("\nApp: Launched with ConcreteCreator2")
    client_code(ConcreteCreator2())

def client_code(creator):
    """Client code that works with any creator subclass"""
    print(f"Client: I'm not aware of the creator's class, but it still works.\n"
          f"{creator.some_operation()}")

# ============= ABSTRACT FACTORY EXAMPLE =============

class AbstractProductA(ABC):
    """Abstract product A interface"""
    @abstractmethod
    def useful_function_a(self):
        pass

class ConcreteProductA1(AbstractProductA):
    """Concrete product A1 - Family 1"""
    def useful_function_a(self):
        return "The result of the product A1."

class ConcreteProductA2(AbstractProductA):
    """Concrete product A2 - Family 2"""
    def useful_function_a(self):
        return "The result of the product A2."

class AbstractProductB(ABC):
    """Abstract product B interface"""
    @abstractmethod
    def useful_function_b(self):
        pass
    
    @abstractmethod
    def another_useful_function_b(self, collaborator: AbstractProductA):
        """
        B products can work with A products
        """
        pass

class ConcreteProductB1(AbstractProductB):
    """Concrete product B1 - Family 1"""
    def useful_function_b(self):
        return "The result of the product B1."
    
    def another_useful_function_b(self, collaborator: AbstractProductA):
        result = collaborator.useful_function_a()
        return f"The result of B1 collaborating with ({result})"

class ConcreteProductB2(AbstractProductB):
    """Concrete product B2 - Family 2"""
    def useful_function_b(self):
        return "The result of the product B2."
    
    def another_useful_function_b(self, collaborator: AbstractProductA):
        result = collaborator.useful_function_a()
        return f"The result of B2 collaborating with ({result})"

class AbstractFactory(ABC):
    """Abstract Factory Interface"""
    @abstractmethod
    def create_product_a(self) -> AbstractProductA:
        pass
    
    @abstractmethod
    def create_product_b(self) -> AbstractProductB:
        pass

class ConcreteFactory1(AbstractFactory):
    """Concrete Factory for Family 1 products"""
    def create_product_a(self) -> AbstractProductA:
        return ConcreteProductA1()
    
    def create_product_b(self) -> AbstractProductB:
        return ConcreteProductB1()

class ConcreteFactory2(AbstractFactory):
    """Concrete Factory for Family 2 products"""
    def create_product_a(self) -> AbstractProductA:
        return ConcreteProductA2()
    
    def create_product_b(self) -> AbstractProductB:
        return ConcreteProductB2()

def abstract_factory_client():
    """Demo of Abstract Factory Pattern"""
    print("\n=== Abstract Factory Example ===")
    
    print("Client: Testing client code with the first factory type:")
    client_abstract_factory_code(ConcreteFactory1())
    
    print("\nClient: Testing the same client code with the second factory type:")
    client_abstract_factory_code(ConcreteFactory2())

def client_abstract_factory_code(factory: AbstractFactory):
    """
    Client code that works with factories and products through abstract interfaces
    """
    product_a = factory.create_product_a()
    product_b = factory.create_product_b()
    
    print(f"{product_b.useful_function_b()}")
    print(f"{product_b.another_useful_function_b(product_a)}")


# ============= REAL-WORLD EXAMPLE: UI COMPONENTS =============

# Abstract products
class Button(ABC):
    @abstractmethod
    def render(self):
        pass
    
    @abstractmethod
    def on_click(self):
        pass

class Checkbox(ABC):
    @abstractmethod
    def render(self):
        pass
    
    @abstractmethod
    def toggle(self):
        pass

# Concrete products for Windows
class WindowsButton(Button):
    def render(self):
        return "Rendering a Windows button"
    
    def on_click(self):
        return "Windows button clicked!"

class WindowsCheckbox(Checkbox):
    def render(self):
        return "Rendering a Windows checkbox"
    
    def toggle(self):
        return "Windows checkbox toggled!"

# Concrete products for Web
class WebButton(Button):
    def render(self):
        return "Rendering a button in HTML"
    
    def on_click(self):
        return "JavaScript click event triggered!"

class WebCheckbox(Checkbox):
    def render(self):
        return "Rendering a checkbox in HTML"
    
    def toggle(self):
        return "JavaScript toggle event triggered!"

# Abstract factory
class GUIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button:
        pass
    
    @abstractmethod
    def create_checkbox(self) -> Checkbox:
        pass

# Concrete factories
class WindowsFactory(GUIFactory):
    def create_button(self) -> Button:
        return WindowsButton()
    
    def create_checkbox(self) -> Checkbox:
        return WindowsCheckbox()

class WebFactory(GUIFactory):
    def create_button(self) -> Button:
        return WebButton()
    
    def create_checkbox(self) -> Checkbox:
        return WebCheckbox()

# Client code
class Application:
    def __init__(self, factory: GUIFactory):
        self._factory = factory
        self._button = None
        self._checkbox = None
    
    def create_ui(self):
        self._button = self._factory.create_button()
        self._checkbox = self._factory.create_checkbox()
        
        print("Creating UI:")
        print(self._button.render())
        print(self._checkbox.render())
    
    def click_button(self):
        print(self._button.on_click())
    
    def toggle_checkbox(self):
        print(self._checkbox.toggle())

def real_world_example():
    """Demo of a real-world Abstract Factory example"""
    print("\n=== Real-World UI Factory Example ===")
    
    # Determine which factory to use based on configuration or environment
    if sys.platform.startswith('win'):
        print("\nRunning on Windows, using Windows UI components")
        factory = WindowsFactory()
    else:
        print("\nRunning on a non-Windows platform, using Web UI components")
        factory = WebFactory()
    
    # Create and use the application
    app = Application(factory)
    app.create_ui()
    app.click_button()
    app.toggle_checkbox()


if __name__ == "__main__":
    print("Factory Pattern Demonstrations")
    print("==============================")
    
    # Run the Simple Factory example
    simple_factory_client()
    
    # Run the Factory Method example
    factory_method_client()
    
    # Run the Abstract Factory example
    abstract_factory_client()
    
    # Run the real-world example
    real_world_example() 
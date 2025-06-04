/**
 * Factory Pattern Implementation in Java
 * 
 * This demonstrates three variations of the Factory Pattern:
 * 1. Simple Factory
 * 2. Factory Method
 * 3. Abstract Factory
 */

// ============= SIMPLE FACTORY EXAMPLE =============

// Product interface
interface Product {
    void operation();
}

// Concrete products
class ConcreteProductA implements Product {
    @Override
    public void operation() {
        System.out.println("Operation of ConcreteProductA");
    }
}

class ConcreteProductB implements Product {
    @Override
    public void operation() {
        System.out.println("Operation of ConcreteProductB");
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

// Client for Simple Factory
class SimpleFactoryClient {
    public void run() {
        System.out.println("\n=== Simple Factory Example ===");
        SimpleFactory factory = new SimpleFactory();
        
        Product productA = factory.createProduct("A");
        productA.operation();
        
        Product productB = factory.createProduct("B");
        productB.operation();
    }
}

// ============= FACTORY METHOD EXAMPLE =============

// Product interface for Factory Method
interface Transport {
    void deliver();
}

// Concrete products
class Truck implements Transport {
    @Override
    public void deliver() {
        System.out.println("Delivering by land in a truck");
    }
}

class Ship implements Transport {
    @Override
    public void deliver() {
        System.out.println("Delivering by sea in a ship");
    }
}

// Creator abstract class with factory method
abstract class Logistics {
    // Factory method
    public abstract Transport createTransport();
    
    // Business logic that uses the factory method
    public void planDelivery() {
        System.out.println("Preparing for delivery...");
        Transport transport = createTransport();
        System.out.println("Planning route...");
        transport.deliver();
        System.out.println("Delivery complete!");
    }
}

// Concrete creators override factory method
class RoadLogistics extends Logistics {
    @Override
    public Transport createTransport() {
        return new Truck();
    }
}

class SeaLogistics extends Logistics {
    @Override
    public Transport createTransport() {
        return new Ship();
    }
}

// Client for Factory Method
class FactoryMethodClient {
    public void run() {
        System.out.println("\n=== Factory Method Example ===");
        
        System.out.println("\nRoad delivery:");
        Logistics roadLogistics = new RoadLogistics();
        roadLogistics.planDelivery();
        
        System.out.println("\nSea delivery:");
        Logistics seaLogistics = new SeaLogistics();
        seaLogistics.planDelivery();
    }
}

// ============= ABSTRACT FACTORY EXAMPLE =============

// Abstract products
interface Button {
    void render();
    void click();
}

interface Checkbox {
    void render();
    void toggle();
}

// Concrete products for Windows
class WindowsButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering a Windows button");
    }
    
    @Override
    public void click() {
        System.out.println("Windows button clicked");
    }
}

class WindowsCheckbox implements Checkbox {
    @Override
    public void render() {
        System.out.println("Rendering a Windows checkbox");
    }
    
    @Override
    public void toggle() {
        System.out.println("Windows checkbox toggled");
    }
}

// Concrete products for macOS
class MacOSButton implements Button {
    @Override
    public void render() {
        System.out.println("Rendering a macOS button");
    }
    
    @Override
    public void click() {
        System.out.println("macOS button clicked");
    }
}

class MacOSCheckbox implements Checkbox {
    @Override
    public void render() {
        System.out.println("Rendering a macOS checkbox");
    }
    
    @Override
    public void toggle() {
        System.out.println("macOS checkbox toggled");
    }
}

// Abstract factory interface
interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

// Concrete factories
class WindowsFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new WindowsButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new WindowsCheckbox();
    }
}

class MacOSFactory implements GUIFactory {
    @Override
    public Button createButton() {
        return new MacOSButton();
    }
    
    @Override
    public Checkbox createCheckbox() {
        return new MacOSCheckbox();
    }
}

// Client code that works with factories and products
class Application {
    private Button button;
    private Checkbox checkbox;
    
    public Application(GUIFactory factory) {
        button = factory.createButton();
        checkbox = factory.createCheckbox();
    }
    
    public void createUI() {
        System.out.println("Creating UI components...");
        button.render();
        checkbox.render();
    }
    
    public void clickButton() {
        button.click();
    }
    
    public void toggleCheckbox() {
        checkbox.toggle();
    }
}

// Client for Abstract Factory
class AbstractFactoryClient {
    public void run() {
        System.out.println("\n=== Abstract Factory Example ===");
        
        // Simulate different OS environments
        createApplicationFor("Windows");
        createApplicationFor("macOS");
    }
    
    private void createApplicationFor(String os) {
        System.out.println("\nCreating app for " + os);
        
        GUIFactory factory;
        if (os.equals("Windows")) {
            factory = new WindowsFactory();
        } else if (os.equals("macOS")) {
            factory = new MacOSFactory();
        } else {
            throw new IllegalArgumentException("Unknown OS: " + os);
        }
        
        Application app = new Application(factory);
        app.createUI();
        app.clickButton();
        app.toggleCheckbox();
    }
}

// Main class to run all examples
public class FactoryPattern {
    public static void main(String[] args) {
        System.out.println("Factory Pattern Demonstrations");
        System.out.println("==============================");
        
        // Run Simple Factory example
        new SimpleFactoryClient().run();
        
        // Run Factory Method example
        new FactoryMethodClient().run();
        
        // Run Abstract Factory example
        new AbstractFactoryClient().run();
    }
} 
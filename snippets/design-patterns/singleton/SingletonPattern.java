/**
 * Singleton Pattern Implementation in Java
 * 
 * This demonstrates various implementations of the Singleton pattern in Java.
 */

import java.util.concurrent.atomic.AtomicReference;

// Method 1: Eager Initialization
class EagerSingleton {
    // Instance is created when class is loaded
    private static final EagerSingleton INSTANCE = new EagerSingleton();
    
    private int value = 0;
    
    // Private constructor prevents instantiation from other classes
    private EagerSingleton() {
        System.out.println("EagerSingleton instance created");
    }
    
    // Public static method to provide access to the instance
    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
    
    public int increment() {
        return ++value;
    }
    
    public int getValue() {
        return value;
    }
}

// Method 2: Lazy Initialization (not thread-safe)
class LazySingleton {
    // Instance is not created until getInstance() is called
    private static LazySingleton instance;
    
    private int value = 0;
    
    private LazySingleton() {
        System.out.println("LazySingleton instance created");
    }
    
    // Not thread-safe!
    public static LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton();
        }
        return instance;
    }
    
    public int increment() {
        return ++value;
    }
    
    public int getValue() {
        return value;
    }
}

// Method 3: Thread-safe Lazy Initialization with synchronized method
class ThreadSafeSingleton {
    private static ThreadSafeSingleton instance;
    
    private int value = 0;
    
    private ThreadSafeSingleton() {
        System.out.println("ThreadSafeSingleton instance created");
    }
    
    // Thread-safe but has performance overhead
    public static synchronized ThreadSafeSingleton getInstance() {
        if (instance == null) {
            instance = new ThreadSafeSingleton();
        }
        return instance;
    }
    
    public int increment() {
        return ++value;
    }
    
    public int getValue() {
        return value;
    }
}

// Method 4: Double-checked Locking
class DCLSingleton {
    // volatile ensures visibility across threads
    private static volatile DCLSingleton instance;
    
    private int value = 0;
    
    private DCLSingleton() {
        System.out.println("DCLSingleton instance created");
    }
    
    // Thread-safe with better performance
    public static DCLSingleton getInstance() {
        // First check without synchronization
        if (instance == null) {
            // Synchronize only when instance is null
            synchronized (DCLSingleton.class) {
                // Double-check inside synchronized block
                if (instance == null) {
                    instance = new DCLSingleton();
                }
            }
        }
        return instance;
    }
    
    public int increment() {
        return ++value;
    }
    
    public int getValue() {
        return value;
    }
}

// Method 5: Initialization on Demand Holder idiom
class HolderSingleton {
    private int value = 0;
    
    private HolderSingleton() {
        System.out.println("HolderSingleton instance created");
    }
    
    // Static holder class is only initialized when getInstance() is called
    private static class Holder {
        private static final HolderSingleton INSTANCE = new HolderSingleton();
    }
    
    // Thread-safe without synchronization overhead
    public static HolderSingleton getInstance() {
        return Holder.INSTANCE;
    }
    
    public int increment() {
        return ++value;
    }
    
    public int getValue() {
        return value;
    }
}

// Method 6: Enum-based Singleton (serialization-safe and reflection-proof)
enum EnumSingleton {
    INSTANCE;
    
    private int value = 0;
    
    EnumSingleton() {
        System.out.println("EnumSingleton instance created");
    }
    
    public int increment() {
        return ++value;
    }
    
    public int getValue() {
        return value;
    }
}

// Method 7: Using CAS (Compare-And-Swap) operations with AtomicReference
class CASSingleton {
    private static final AtomicReference<CASSingleton> INSTANCE = new AtomicReference<>();
    
    private int value = 0;
    
    private CASSingleton() {
        System.out.println("CASSingleton instance created");
    }
    
    // Thread-safe using non-blocking synchronization
    public static CASSingleton getInstance() {
        CASSingleton instance = INSTANCE.get();
        if (instance == null) {
            CASSingleton newInstance = new CASSingleton();
            if (INSTANCE.compareAndSet(null, newInstance)) {
                instance = newInstance;
            } else {
                // Another thread beat us to it
                instance = INSTANCE.get();
            }
        }
        return instance;
    }
    
    public int increment() {
        return ++value;
    }
    
    public int getValue() {
        return value;
    }
}

// Main class to demonstrate various singleton implementations
public class SingletonPattern {
    public static void main(String[] args) {
        System.out.println("Singleton Pattern Demonstrations");
        System.out.println("===============================");
        
        demonstrateEagerSingleton();
        demonstrateLazySingleton();
        demonstrateThreadSafeSingleton();
        demonstrateDCLSingleton();
        demonstrateHolderSingleton();
        demonstrateEnumSingleton();
        demonstrateCASSingleton();
    }
    
    private static void demonstrateEagerSingleton() {
        System.out.println("\n=== Eager Singleton ===");
        EagerSingleton s1 = EagerSingleton.getInstance();
        EagerSingleton s2 = EagerSingleton.getInstance();
        
        System.out.println("s1 == s2: " + (s1 == s2));
        System.out.println("s1.increment(): " + s1.increment());
        System.out.println("s2.increment(): " + s2.increment());
        System.out.println("s1.getValue(): " + s1.getValue() + ", s2.getValue(): " + s2.getValue());
    }
    
    private static void demonstrateLazySingleton() {
        System.out.println("\n=== Lazy Singleton (not thread-safe) ===");
        LazySingleton s1 = LazySingleton.getInstance();
        LazySingleton s2 = LazySingleton.getInstance();
        
        System.out.println("s1 == s2: " + (s1 == s2));
        System.out.println("s1.increment(): " + s1.increment());
        System.out.println("s2.increment(): " + s2.increment());
        System.out.println("s1.getValue(): " + s1.getValue() + ", s2.getValue(): " + s2.getValue());
    }
    
    private static void demonstrateThreadSafeSingleton() {
        System.out.println("\n=== Thread-Safe Singleton ===");
        ThreadSafeSingleton s1 = ThreadSafeSingleton.getInstance();
        ThreadSafeSingleton s2 = ThreadSafeSingleton.getInstance();
        
        System.out.println("s1 == s2: " + (s1 == s2));
        System.out.println("s1.increment(): " + s1.increment());
        System.out.println("s2.increment(): " + s2.increment());
        System.out.println("s1.getValue(): " + s1.getValue() + ", s2.getValue(): " + s2.getValue());
    }
    
    private static void demonstrateDCLSingleton() {
        System.out.println("\n=== Double-Checked Locking Singleton ===");
        DCLSingleton s1 = DCLSingleton.getInstance();
        DCLSingleton s2 = DCLSingleton.getInstance();
        
        System.out.println("s1 == s2: " + (s1 == s2));
        System.out.println("s1.increment(): " + s1.increment());
        System.out.println("s2.increment(): " + s2.increment());
        System.out.println("s1.getValue(): " + s1.getValue() + ", s2.getValue(): " + s2.getValue());
    }
    
    private static void demonstrateHolderSingleton() {
        System.out.println("\n=== Initialization-on-demand Holder Singleton ===");
        HolderSingleton s1 = HolderSingleton.getInstance();
        HolderSingleton s2 = HolderSingleton.getInstance();
        
        System.out.println("s1 == s2: " + (s1 == s2));
        System.out.println("s1.increment(): " + s1.increment());
        System.out.println("s2.increment(): " + s2.increment());
        System.out.println("s1.getValue(): " + s1.getValue() + ", s2.getValue(): " + s2.getValue());
    }
    
    private static void demonstrateEnumSingleton() {
        System.out.println("\n=== Enum Singleton ===");
        EnumSingleton s1 = EnumSingleton.INSTANCE;
        EnumSingleton s2 = EnumSingleton.INSTANCE;
        
        System.out.println("s1 == s2: " + (s1 == s2));
        System.out.println("s1.increment(): " + s1.increment());
        System.out.println("s2.increment(): " + s2.increment());
        System.out.println("s1.getValue(): " + s1.getValue() + ", s2.getValue(): " + s2.getValue());
    }
    
    private static void demonstrateCASSingleton() {
        System.out.println("\n=== CAS (AtomicReference) Singleton ===");
        CASSingleton s1 = CASSingleton.getInstance();
        CASSingleton s2 = CASSingleton.getInstance();
        
        System.out.println("s1 == s2: " + (s1 == s2));
        System.out.println("s1.increment(): " + s1.increment());
        System.out.println("s2.increment(): " + s2.increment());
        System.out.println("s1.getValue(): " + s1.getValue() + ", s2.getValue(): " + s2.getValue());
    }
} 
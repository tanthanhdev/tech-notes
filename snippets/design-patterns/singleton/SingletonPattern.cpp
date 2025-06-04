/**
 * Singleton Pattern Implementation in C++
 *
 * The Singleton Pattern is a creational design pattern that ensures a class has only one instance
 * and provides a global point of access to it. This is useful when exactly one object is needed
 * to coordinate actions across the system.
 *
 * This file demonstrates several ways to implement the Singleton pattern in C++.
 */

#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <mutex>
#include <map>
#include <chrono>

// ========== Classic Singleton Implementation ==========

/**
 * Classic Singleton implementation with lazy initialization
 */
class ClassicSingleton {
private:
    // Private constructor to prevent direct instantiation
    ClassicSingleton() {
        timestamp_ = std::chrono::system_clock::now();
        std::cout << "ClassicSingleton instance created." << std::endl;
    }

    // Delete copy constructor and assignment operator
    ClassicSingleton(const ClassicSingleton&) = delete;
    ClassicSingleton& operator=(const ClassicSingleton&) = delete;

    // Static instance pointer
    static ClassicSingleton* instance_;

    // Member variables
    std::chrono::system_clock::time_point timestamp_;
    std::map<std::string, std::string> config_ = {
        {"api_url", "https://api.example.com"},
        {"timeout", "3000"},
        {"retries", "3"}
    };

public:
    // Static method to get the singleton instance
    static ClassicSingleton* getInstance() {
        if (instance_ == nullptr) {
            instance_ = new ClassicSingleton();
        }
        return instance_;
    }

    // Clean up the singleton instance
    static void destroyInstance() {
        delete instance_;
        instance_ = nullptr;
    }

    // Get configuration
    std::map<std::string, std::string> getConfig() const {
        return config_;
    }

    // Update configuration
    void updateConfig(const std::string& key, const std::string& value) {
        config_[key] = value;
        std::cout << "Configuration updated: " << key << " = " << value << std::endl;
    }

    // Get creation timestamp
    std::chrono::system_clock::time_point getTimestamp() const {
        return timestamp_;
    }
};

// Initialize the static instance pointer
ClassicSingleton* ClassicSingleton::instance_ = nullptr;

// ========== Thread-Safe Singleton Implementation ==========

/**
 * Thread-safe Singleton implementation with double-checked locking
 */
class ThreadSafeSingleton {
private:
    // Private constructor to prevent direct instantiation
    ThreadSafeSingleton() {
        std::cout << "ThreadSafeSingleton instance created." << std::endl;
    }

    // Delete copy constructor and assignment operator
    ThreadSafeSingleton(const ThreadSafeSingleton&) = delete;
    ThreadSafeSingleton& operator=(const ThreadSafeSingleton&) = delete;

    // Static instance pointer
    static ThreadSafeSingleton* instance_;
    static std::mutex mutex_;

    // Member variables
    std::vector<std::string> logs_;

public:
    // Static method to get the singleton instance (thread-safe)
    static ThreadSafeSingleton* getInstance() {
        if (instance_ == nullptr) {
            std::lock_guard<std::mutex> lock(mutex_);
            if (instance_ == nullptr) {
                instance_ = new ThreadSafeSingleton();
            }
        }
        return instance_;
    }

    // Clean up the singleton instance
    static void destroyInstance() {
        std::lock_guard<std::mutex> lock(mutex_);
        delete instance_;
        instance_ = nullptr;
    }

    // Log a message
    void log(const std::string& message) {
        std::lock_guard<std::mutex> lock(mutex_);
        auto now = std::chrono::system_clock::now();
        auto now_c = std::chrono::system_clock::to_time_t(now);
        std::string timestamp = std::ctime(&now_c);
        timestamp.pop_back(); // Remove trailing newline

        std::string logEntry = timestamp + ": " + message;
        logs_.push_back(logEntry);
        std::cout << logEntry << std::endl;
    }

    // Get all logs
    std::vector<std::string> getLogs() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return logs_;
    }

    // Clear logs
    void clearLogs() {
        std::lock_guard<std::mutex> lock(mutex_);
        logs_.clear();
        std::cout << "Logs cleared." << std::endl;
    }
};

// Initialize static members
ThreadSafeSingleton* ThreadSafeSingleton::instance_ = nullptr;
std::mutex ThreadSafeSingleton::mutex_;

// ========== Modern C++ Singleton Implementation (Meyers Singleton) ==========

/**
 * Modern C++ Singleton implementation using static local variable (Scott Meyers Singleton)
 * This is thread-safe in C++11 and later
 */
class MeyersSingleton {
private:
    // Private constructor to prevent direct instantiation
    MeyersSingleton() {
        std::cout << "MeyersSingleton instance created." << std::endl;
    }

    // Delete copy constructor and assignment operator
    MeyersSingleton(const MeyersSingleton&) = delete;
    MeyersSingleton& operator=(const MeyersSingleton&) = delete;

    // Member variables
    struct DatabaseConnection {
        bool connected = false;
        std::string connectionString;
        int connectionCount = 0;
    };

    DatabaseConnection db_;

public:
    // Static method to get the singleton instance
    static MeyersSingleton& getInstance() {
        // Static local variable is initialized only once in a thread-safe way
        static MeyersSingleton instance;
        return instance;
    }

    // Connect to database
    bool connect(const std::string& connectionString) {
        if (db_.connected) {
            db_.connectionCount++;
            std::cout << "Already connected to database. Connection count: " << db_.connectionCount << std::endl;
            return true;
        }

        // Simulate connection
        db_.connectionString = connectionString;
        db_.connected = true;
        db_.connectionCount = 1;
        std::cout << "Connected to database: " << connectionString << std::endl;
        return true;
    }

    // Disconnect from database
    bool disconnect() {
        if (!db_.connected) {
            std::cout << "Not connected to any database." << std::endl;
            return false;
        }

        db_.connectionCount--;
        if (db_.connectionCount == 0) {
            db_.connected = false;
            std::cout << "Disconnected from database: " << db_.connectionString << std::endl;
        } else {
            std::cout << "Connection count decreased. Remaining connections: " << db_.connectionCount << std::endl;
        }

        return true;
    }

    // Get connection status
    bool isConnected() const {
        return db_.connected;
    }

    // Get connection count
    int getConnectionCount() const {
        return db_.connectionCount;
    }
};

// ========== Singleton with Shared Pointer ==========

/**
 * Singleton implementation using std::shared_ptr for automatic memory management
 */
class SharedPtrSingleton {
private:
    // Private constructor to prevent direct instantiation
    SharedPtrSingleton() {
        std::cout << "SharedPtrSingleton instance created." << std::endl;
    }

    // Delete copy constructor and assignment operator
    SharedPtrSingleton(const SharedPtrSingleton&) = delete;
    SharedPtrSingleton& operator=(const SharedPtrSingleton&) = delete;

    // Static instance pointer
    static std::shared_ptr<SharedPtrSingleton> instance_;
    static std::mutex mutex_;

    // Member variables
    std::map<std::string, bool> featureFlags_ = {
        {"dark_mode", false},
        {"beta_features", false},
        {"analytics", true},
        {"notifications", true}
    };

public:
    // Static method to get the singleton instance
    static std::shared_ptr<SharedPtrSingleton> getInstance() {
        std::lock_guard<std::mutex> lock(mutex_);
        if (!instance_) {
            instance_ = std::shared_ptr<SharedPtrSingleton>(new SharedPtrSingleton());
        }
        return instance_;
    }

    // Enable a feature
    void enableFeature(const std::string& featureName) {
        featureFlags_[featureName] = true;
        std::cout << "Feature enabled: " << featureName << std::endl;
    }

    // Disable a feature
    void disableFeature(const std::string& featureName) {
        featureFlags_[featureName] = false;
        std::cout << "Feature disabled: " << featureName << std::endl;
    }

    // Check if a feature is enabled
    bool isFeatureEnabled(const std::string& featureName) const {
        auto it = featureFlags_.find(featureName);
        if (it != featureFlags_.end()) {
            return it->second;
        }
        return false;
    }

    // Get all feature flags
    std::map<std::string, bool> getAllFeatureFlags() const {
        return featureFlags_;
    }
};

// Initialize static members
std::shared_ptr<SharedPtrSingleton> SharedPtrSingleton::instance_ = nullptr;
std::mutex SharedPtrSingleton::mutex_;

// ========== Demo Code ==========

void demonstrateSingletons() {
    std::cout << "===== Classic Singleton Demo =====" << std::endl;
    ClassicSingleton* singleton1 = ClassicSingleton::getInstance();
    ClassicSingleton* singleton2 = ClassicSingleton::getInstance();

    std::cout << "Are instances the same? " << (singleton1 == singleton2 ? "Yes" : "No") << std::endl;

    auto config = singleton1->getConfig();
    std::cout << "Original config: api_url = " << config["api_url"] << std::endl;

    singleton2->updateConfig("timeout", "5000");
    config = singleton1->getConfig();
    std::cout << "Updated config from singleton1: timeout = " << config["timeout"] << std::endl;

    std::cout << "\n===== Thread-Safe Singleton Demo =====" << std::endl;
    ThreadSafeSingleton* logger1 = ThreadSafeSingleton::getInstance();
    ThreadSafeSingleton* logger2 = ThreadSafeSingleton::getInstance();

    std::cout << "Are instances the same? " << (logger1 == logger2 ? "Yes" : "No") << std::endl;

    logger1->log("Application started");
    logger1->log("Processing data");
    logger2->log("Operation completed");

    auto logs = logger1->getLogs();
    std::cout << "Log count: " << logs.size() << std::endl;

    std::cout << "\n===== Meyers Singleton Demo =====" << std::endl;
    MeyersSingleton& db1 = MeyersSingleton::getInstance();
    MeyersSingleton& db2 = MeyersSingleton::getInstance();

    std::cout << "Are instances the same? " << (&db1 == &db2 ? "Yes" : "No") << std::endl;

    db1.connect("mysql://localhost:3306/mydb");
    db2.connect("mysql://localhost:3306/mydb");
    std::cout << "Connection count: " << db1.getConnectionCount() << std::endl;

    db1.disconnect();
    std::cout << "Is still connected? " << (db2.isConnected() ? "Yes" : "No") << std::endl;

    std::cout << "\n===== Shared Pointer Singleton Demo =====" << std::endl;
    auto featureManager1 = SharedPtrSingleton::getInstance();
    auto featureManager2 = SharedPtrSingleton::getInstance();

    std::cout << "Are instances the same? " << (featureManager1 == featureManager2 ? "Yes" : "No") << std::endl;

    std::cout << "Dark mode enabled: " << (featureManager1->isFeatureEnabled("dark_mode") ? "Yes" : "No") << std::endl;

    featureManager2->enableFeature("dark_mode");
    std::cout << "Dark mode enabled after update: " << (featureManager1->isFeatureEnabled("dark_mode") ? "Yes" : "No") << std::endl;

    // Clean up classic singleton
    ClassicSingleton::destroyInstance();
    ThreadSafeSingleton::destroyInstance();
    // No need to clean up Meyers Singleton or SharedPtrSingleton
}

// Main function
int main() {
    std::cout << "Singleton Pattern Demonstration in C++\n";
    std::cout << "====================================\n\n";

    demonstrateSingletons();
    return 0;
}
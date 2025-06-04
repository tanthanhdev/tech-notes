<?php
/**
 * Singleton Pattern Implementation in PHP
 *
 * The Singleton Pattern is a creational design pattern that ensures a class has only one instance
 * and provides a global point of access to it. This is useful when exactly one object is needed
 * to coordinate actions across the system.
 *
 * This file demonstrates several ways to implement the Singleton pattern in PHP.
 */

// ========== Classic Singleton Implementation ==========

/**
 * Classic Singleton implementation using a static instance property
 */
class ClassicSingleton {
    private static $instance = null;
    private $timestamp;
    private $config;

    // Private constructor to prevent direct instantiation
    private function __construct() {
        $this->timestamp = time();
        $this->config = [
            'api_url' => 'https://api.example.com',
            'timeout' => 3000,
            'retries' => 3
        ];
    }

    // Prevent cloning of the instance
    private function __clone() {}

    // Prevent unserialization of the instance
    private function __wakeup() {}

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConfig() {
        return $this->config;
    }

    public function updateConfig($key, $value) {
        $this->config[$key] = $value;
        echo "Configuration updated: {$key} = {$value}\n";
    }

    public function getTimestamp() {
        return $this->timestamp;
    }
}

// ========== Database Connection Singleton ==========

/**
 * Singleton implementation for database connection
 */
class DatabaseConnection {
    private static $instance = null;
    private $isConnected = false;
    private $connectionString = '';
    private $connectionCount = 0;

    // Private constructor to prevent direct instantiation
    private function __construct() {}

    // Prevent cloning of the instance
    private function __clone() {}

    // Prevent unserialization of the instance
    private function __wakeup() {}

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function connect($connectionString) {
        if ($this->isConnected) {
            $this->connectionCount++;
            echo "Already connected to database. Connection count: {$this->connectionCount}\n";
            return true;
        }

        // Simulate connection
        $this->connectionString = $connectionString;
        $this->isConnected = true;
        $this->connectionCount = 1;
        echo "Connected to database: {$connectionString}\n";
        return true;
    }

    public function disconnect() {
        if (!$this->isConnected) {
            echo "Not connected to any database.\n";
            return false;
        }

        $this->connectionCount--;
        if ($this->connectionCount === 0) {
            $this->isConnected = false;
            echo "Disconnected from database: {$this->connectionString}\n";
        } else {
            echo "Connection count decreased. Remaining connections: {$this->connectionCount}\n";
        }

        return true;
    }

    public function isConnected() {
        return $this->isConnected;
    }

    public function getConnectionCount() {
        return $this->connectionCount;
    }
}

// ========== Logger Singleton ==========

/**
 * Singleton implementation for logging
 */
class Logger {
    private static $instance = null;
    private $logs = [];

    // Private constructor to prevent direct instantiation
    private function __construct() {}

    // Prevent cloning of the instance
    private function __clone() {}

    // Prevent unserialization of the instance
    private function __wakeup() {}

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function log($message) {
        $timestamp = date('Y-m-d H:i:s');
        $logEntry = "{$timestamp}: {$message}";
        $this->logs[] = $logEntry;
        echo $logEntry . PHP_EOL;
        return $logEntry;
    }

    public function warn($message) {
        return $this->log("WARNING: {$message}");
    }

    public function error($message) {
        return $this->log("ERROR: {$message}");
    }

    public function getLogs() {
        return $this->logs;
    }

    public function clearLogs() {
        $this->logs = [];
        echo "Logs cleared" . PHP_EOL;
        return 'Logs cleared';
    }
}

// ========== Configuration Manager Singleton ==========

/**
 * Singleton implementation for configuration management
 */
class ConfigManager {
    private static $instance = null;
    private $config;

    // Private constructor to prevent direct instantiation
    private function __construct() {
        $this->config = [
            'theme' => 'light',
            'language' => 'en',
            'notifications' => true,
            'auto_save' => true
        ];
    }

    // Prevent cloning of the instance
    private function __clone() {}

    // Prevent unserialization of the instance
    private function __wakeup() {}

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConfig() {
        return $this->config;
    }

    public function setConfig($key, $value) {
        $this->config[$key] = $value;
        echo "Configuration updated: {$key} = {$value}" . PHP_EOL;
        return $this->config;
    }

    public function resetConfig() {
        $this->config = [
            'theme' => 'light',
            'language' => 'en',
            'notifications' => true,
            'auto_save' => true
        ];
        echo "Configuration reset to defaults" . PHP_EOL;
        return $this->config;
    }
}

// ========== User Manager Singleton ==========

/**
 * Singleton implementation for user management
 */
class UserManager {
    private static $instance = null;
    private $users = [];

    // Private constructor to prevent direct instantiation
    private function __construct() {}

    // Prevent cloning of the instance
    private function __clone() {}

    // Prevent unserialization of the instance
    private function __wakeup() {}

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function addUser($id, $userData) {
        if (isset($this->users[$id])) {
            throw new Exception("User with ID {$id} already exists");
        }

        $this->users[$id] = array_merge($userData, [
            'created_at' => date('Y-m-d H:i:s')
        ]);

        return true;
    }

    public function getUser($id) {
        if (!isset($this->users[$id])) {
            return null;
        }

        return $this->users[$id];
    }

    public function updateUser($id, $userData) {
        if (!isset($this->users[$id])) {
            throw new Exception("User with ID {$id} does not exist");
        }

        $this->users[$id] = array_merge($this->users[$id], $userData, [
            'updated_at' => date('Y-m-d H:i:s')
        ]);

        return true;
    }

    public function deleteUser($id) {
        if (!isset($this->users[$id])) {
            throw new Exception("User with ID {$id} does not exist");
        }

        unset($this->users[$id]);
        return true;
    }

    public function getAllUsers() {
        $result = [];
        foreach ($this->users as $id => $userData) {
            $result[] = array_merge(['id' => $id], $userData);
        }
        return $result;
    }

    public function getUserCount() {
        return count($this->users);
    }
}

// ========== Demo Code ==========

function demonstrateSingletons() {
    echo "===== Classic Singleton Demo =====" . PHP_EOL;
    $singleton1 = ClassicSingleton::getInstance();
    $singleton2 = ClassicSingleton::getInstance();

    echo "Are instances the same? " . ($singleton1 === $singleton2 ? "Yes" : "No") . PHP_EOL;
    echo "Instance timestamp: " . date('Y-m-d H:i:s', $singleton1->getTimestamp()) . PHP_EOL;

    $config = $singleton1->getConfig();
    echo "Original config: api_url = " . $config['api_url'] . PHP_EOL;

    $singleton2->updateConfig('timeout', 5000);
    $config = $singleton1->getConfig();
    echo "Updated config from singleton1: timeout = " . $config['timeout'] . PHP_EOL;

    echo PHP_EOL . "===== Database Connection Singleton Demo =====" . PHP_EOL;
    $db1 = DatabaseConnection::getInstance();
    $db2 = DatabaseConnection::getInstance();

    echo "Are instances the same? " . ($db1 === $db2 ? "Yes" : "No") . PHP_EOL;

    $db1->connect("mysql://localhost:3306/mydb");
    $db2->connect("mysql://localhost:3306/mydb");
    echo "Connection count: " . $db1->getConnectionCount() . PHP_EOL;

    $db1->disconnect();
    echo "Still connected? " . ($db2->isConnected() ? "Yes" : "No") . PHP_EOL;

    echo PHP_EOL . "===== Logger Singleton Demo =====" . PHP_EOL;
    $logger1 = Logger::getInstance();
    $logger2 = Logger::getInstance();

    echo "Are instances the same? " . ($logger1 === $logger2 ? "Yes" : "No") . PHP_EOL;

    $logger1->log("Application started");
    $logger1->warn("Resource usage is high");
    $logger2->error("Failed to connect to service");

    $logs = $logger1->getLogs();
    echo "Log entries: " . count($logs) . PHP_EOL;

    echo PHP_EOL . "===== Config Manager Singleton Demo =====" . PHP_EOL;
    $config1 = ConfigManager::getInstance();
    $config2 = ConfigManager::getInstance();

    echo "Are instances the same? " . ($config1 === $config2 ? "Yes" : "No") . PHP_EOL;

    $configSettings = $config1->getConfig();
    echo "Config value: theme = " . $configSettings['theme'] . PHP_EOL;

    $config2->setConfig('theme', 'dark');
    $configSettings = $config1->getConfig();
    echo "Updated config from config1: theme = " . $configSettings['theme'] . PHP_EOL;

    echo PHP_EOL . "===== User Manager Singleton Demo =====" . PHP_EOL;
    $userManager1 = UserManager::getInstance();
    $userManager2 = UserManager::getInstance();

    echo "Are instances the same? " . ($userManager1 === $userManager2 ? "Yes" : "No") . PHP_EOL;

    $userManager1->addUser(1, ['name' => 'Alice', 'email' => 'alice@example.com']);
    $userManager1->addUser(2, ['name' => 'Bob', 'email' => 'bob@example.com']);

    echo "User count: " . $userManager2->getUserCount() . PHP_EOL;

    $user = $userManager2->getUser(1);
    echo "User #1: " . $user['name'] . ", " . $user['email'] . PHP_EOL;

    $userManager2->updateUser(1, ['role' => 'admin']);
    $user = $userManager1->getUser(1);
    echo "Updated User #1: " . $user['name'] . ", " . $user['email'] . ", " . $user['role'] . PHP_EOL;
}

// Run the demo
demonstrateSingletons();

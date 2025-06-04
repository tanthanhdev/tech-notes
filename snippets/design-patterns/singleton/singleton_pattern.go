/**
 * Singleton Pattern Implementation in Go
 *
 * The Singleton Pattern is a creational design pattern that ensures a class has only one instance
 * and provides a global point of access to it. This is useful when exactly one object is needed
 * to coordinate actions across the system.
 *
 * This file demonstrates several ways to implement the Singleton pattern in Go.
 */

package main

import (
	"fmt"
	"sync"
	"time"
)

// ========== Simple Singleton Implementation ==========

// Singleton is a simple singleton instance
type Singleton struct {
	data        map[string]interface{}
	createdTime time.Time
}

var (
	instance *Singleton
	once     sync.Once
)

// GetInstance returns the singleton instance
func GetInstance() *Singleton {
	once.Do(func() {
		instance = &Singleton{
			data: make(map[string]interface{}),
			createdTime: time.Now(),
		}
		fmt.Println("Singleton instance created")
	})
	return instance
}

// SetData sets data in the singleton
func (s *Singleton) SetData(key string, value interface{}) {
	s.data[key] = value
}

// GetData gets data from the singleton
func (s *Singleton) GetData(key string) (interface{}, bool) {
	val, exists := s.data[key]
	return val, exists
}

// GetCreationTime returns the time when the singleton was created
func (s *Singleton) GetCreationTime() time.Time {
	return s.createdTime
}

// ========== Thread-Safe Database Connection Singleton ==========

// DatabaseConnection represents a database connection singleton
type DatabaseConnection struct {
	isConnected     bool
	connectionStr   string
	connectionCount int
	mu              sync.Mutex
}

var (
	dbInstance *DatabaseConnection
	dbOnce     sync.Once
)

// GetDatabaseInstance returns the database connection singleton instance
func GetDatabaseInstance() *DatabaseConnection {
	dbOnce.Do(func() {
		dbInstance = &DatabaseConnection{
			isConnected:     false,
			connectionStr:   "",
			connectionCount: 0,
		}
		fmt.Println("Database connection instance created")
	})
	return dbInstance
}

// Connect connects to the database
func (db *DatabaseConnection) Connect(connectionStr string) bool {
	db.mu.Lock()
	defer db.mu.Unlock()

	if db.isConnected {
		db.connectionCount++
		fmt.Printf("Already connected to database. Connection count: %d\n", db.connectionCount)
		return true
	}

	// Simulate connection
	db.connectionStr = connectionStr
	db.isConnected = true
	db.connectionCount = 1
	fmt.Printf("Connected to database: %s\n", connectionStr)
	return true
}

// Disconnect disconnects from the database
func (db *DatabaseConnection) Disconnect() bool {
	db.mu.Lock()
	defer db.mu.Unlock()

	if !db.isConnected {
		fmt.Println("Not connected to any database")
		return false
	}

	db.connectionCount--
	if db.connectionCount == 0 {
		db.isConnected = false
		fmt.Printf("Disconnected from database: %s\n", db.connectionStr)
	} else {
		fmt.Printf("Connection count decreased. Remaining connections: %d\n", db.connectionCount)
	}

	return true
}

// IsConnected returns whether the database is connected
func (db *DatabaseConnection) IsConnected() bool {
	db.mu.Lock()
	defer db.mu.Unlock()
	return db.isConnected
}

// GetConnectionCount returns the number of active connections
func (db *DatabaseConnection) GetConnectionCount() int {
	db.mu.Lock()
	defer db.mu.Unlock()
	return db.connectionCount
}

// ========== Configuration Manager Singleton ==========

// ConfigManager represents a configuration manager singleton
type ConfigManager struct {
	config map[string]interface{}
	mu     sync.RWMutex
}

var (
	configInstance *ConfigManager
	configOnce     sync.Once
)

// GetConfigManager returns the configuration manager singleton instance
func GetConfigManager() *ConfigManager {
	configOnce.Do(func() {
		configInstance = &ConfigManager{
			config: map[string]interface{}{
				"app_name":    "Singleton Demo",
				"version":     "1.0.0",
				"debug_mode":  false,
				"max_retries": 3,
				"timeout":     30,
			},
		}
		fmt.Println("Configuration manager instance created")
	})
	return configInstance
}

// GetConfig returns the entire configuration
func (cm *ConfigManager) GetConfig() map[string]interface{} {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	// Return a copy to prevent direct modification
	configCopy := make(map[string]interface{})
	for k, v := range cm.config {
		configCopy[k] = v
	}
	return configCopy
}

// GetValue returns a specific configuration value
func (cm *ConfigManager) GetValue(key string) (interface{}, bool) {
	cm.mu.RLock()
	defer cm.mu.RUnlock()

	val, exists := cm.config[key]
	return val, exists
}

// SetValue sets a specific configuration value
func (cm *ConfigManager) SetValue(key string, value interface{}) {
	cm.mu.Lock()
	defer cm.mu.Unlock()

	cm.config[key] = value
	fmt.Printf("Configuration updated: %s = %v\n", key, value)
}

// ========== Logger Singleton ==========

// LogLevel represents the level of a log message
type LogLevel int

const (
	DEBUG LogLevel = iota
	INFO
	WARNING
	ERROR
)

// LogEntry represents a log entry
type LogEntry struct {
	Timestamp time.Time
	Level     LogLevel
	Message   string
}

// Logger represents a logger singleton
type Logger struct {
	logs []LogEntry
	mu   sync.Mutex
}

var (
	loggerInstance *Logger
	loggerOnce     sync.Once
)

// GetLogger returns the logger singleton instance
func GetLogger() *Logger {
	loggerOnce.Do(func() {
		loggerInstance = &Logger{
			logs: make([]LogEntry, 0),
		}
		fmt.Println("Logger instance created")
	})
	return loggerInstance
}

// Log logs a message with the specified level
func (l *Logger) Log(level LogLevel, message string) {
	l.mu.Lock()
	defer l.mu.Unlock()

	entry := LogEntry{
		Timestamp: time.Now(),
		Level:     level,
		Message:   message,
	}
	l.logs = append(l.logs, entry)

	// Print to console
	levelStr := "UNKNOWN"
	switch level {
	case DEBUG:
		levelStr = "DEBUG"
	case INFO:
		levelStr = "INFO"
	case WARNING:
		levelStr = "WARNING"
	case ERROR:
		levelStr = "ERROR"
	}

	fmt.Printf("[%s] %s: %s\n", entry.Timestamp.Format("2006-01-02 15:04:05"), levelStr, message)
}

// Debug logs a debug message
func (l *Logger) Debug(message string) {
	l.Log(DEBUG, message)
}

// Info logs an info message
func (l *Logger) Info(message string) {
	l.Log(INFO, message)
}

// Warning logs a warning message
func (l *Logger) Warning(message string) {
	l.Log(WARNING, message)
}

// Error logs an error message
func (l *Logger) Error(message string) {
	l.Log(ERROR, message)
}

// GetLogs returns all log entries
func (l *Logger) GetLogs() []LogEntry {
	l.mu.Lock()
	defer l.mu.Unlock()

	// Return a copy to prevent direct modification
	logsCopy := make([]LogEntry, len(l.logs))
	copy(logsCopy, l.logs)
	return logsCopy
}

// ClearLogs clears all log entries
func (l *Logger) ClearLogs() {
	l.mu.Lock()
	defer l.mu.Unlock()

	l.logs = make([]LogEntry, 0)
	fmt.Println("Logs cleared")
}

// ========== Demo Code ==========

func demonstrateSingletons() {
	fmt.Println("===== Simple Singleton Demo =====")
	singleton1 := GetInstance()
	singleton2 := GetInstance()

	fmt.Printf("Are instances the same? %v\n", singleton1 == singleton2)
	fmt.Printf("Creation time: %v\n", singleton1.GetCreationTime().Format("2006-01-02 15:04:05"))

	singleton1.SetData("name", "Singleton Pattern")
	singleton1.SetData("language", "Go")

	name, exists := singleton2.GetData("name")
	if exists {
		fmt.Printf("Data retrieved from singleton2: name = %v\n", name)
	}

	fmt.Println("\n===== Database Connection Singleton Demo =====")
	db1 := GetDatabaseInstance()
	db2 := GetDatabaseInstance()

	fmt.Printf("Are instances the same? %v\n", db1 == db2)

	db1.Connect("postgres://localhost:5432/mydb")
	db2.Connect("postgres://localhost:5432/mydb")
	fmt.Printf("Connection count: %d\n", db1.GetConnectionCount())

	db1.Disconnect()
	fmt.Printf("Still connected? %v\n", db2.IsConnected())

	fmt.Println("\n===== Configuration Manager Demo =====")
	config1 := GetConfigManager()
	config2 := GetConfigManager()

	fmt.Printf("Are instances the same? %v\n", config1 == config2)

	if val, exists := config1.GetValue("app_name"); exists {
		fmt.Printf("Config value: app_name = %v\n", val)
	}

	config2.SetValue("debug_mode", true)
	if val, exists := config1.GetValue("debug_mode"); exists {
		fmt.Printf("Updated config from config1: debug_mode = %v\n", val)
	}

	fmt.Println("\n===== Logger Demo =====")
	logger1 := GetLogger()
	logger2 := GetLogger()

	fmt.Printf("Are instances the same? %v\n", logger1 == logger2)

	logger1.Info("Application started")
	logger1.Debug("Initializing components")
	logger2.Warning("Resource usage is high")
	logger1.Error("Failed to connect to service")

	logs := logger2.GetLogs()
	fmt.Printf("Log entries: %d\n", len(logs))
}

func main() {
	// Run the demo
	demonstrateSingletons()
}

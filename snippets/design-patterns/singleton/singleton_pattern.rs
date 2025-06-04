/**
 * Singleton Pattern Implementation in Rust
 *
 * The Singleton Pattern is a creational design pattern that ensures a class has only one instance
 * and provides a global point of access to it. This is useful when exactly one object is needed
 * to coordinate actions across the system.
 *
 * This file demonstrates several ways to implement the Singleton pattern in Rust.
 */

use std::collections::HashMap;
use std::sync::{Arc, Mutex, Once};
use std::time::{SystemTime, UNIX_EPOCH};
use std::fmt;

// ========== Lazy Static Singleton Implementation ==========

// Lazy static is a common way to implement singletons in Rust
// This requires the lazy_static crate
#[cfg(feature = "lazy_static")]
mod lazy_static_singleton {
    use super::*;
    use lazy_static::lazy_static;

    #[derive(Debug)]
    pub struct ClassicSingleton {
        timestamp: SystemTime,
        config: Mutex<HashMap<String, String>>,
    }

    impl ClassicSingleton {
        fn new() -> Self {
            let mut config = HashMap::new();
            config.insert("api_url".to_string(), "https://api.example.com".to_string());
            config.insert("timeout".to_string(), "3000".to_string());
            config.insert("retries".to_string(), "3".to_string());

            ClassicSingleton {
                timestamp: SystemTime::now(),
                config: Mutex::new(config),
            }
        }

        pub fn get_config(&self) -> HashMap<String, String> {
            let config = self.config.lock().unwrap();
            config.clone()
        }

        pub fn update_config(&self, key: &str, value: &str) {
            let mut config = self.config.lock().unwrap();
            config.insert(key.to_string(), value.to_string());
            println!("Configuration updated: {} = {}", key, value);
        }

        pub fn get_timestamp(&self) -> SystemTime {
            self.timestamp
        }
    }

    lazy_static! {
        pub static ref INSTANCE: ClassicSingleton = ClassicSingleton::new();
    }
}

// ========== Once Cell Singleton Implementation ==========

// Once Cell is a more modern approach in Rust's standard library
mod once_cell_singleton {
    use super::*;
    use std::sync::OnceLock;

    #[derive(Debug)]
    pub struct DatabaseConnection {
        connection_count: Mutex<i32>,
        is_connected: Mutex<bool>,
        connection_string: Mutex<String>,
    }

    impl DatabaseConnection {
        fn new() -> Self {
            DatabaseConnection {
                connection_count: Mutex::new(0),
                is_connected: Mutex::new(false),
                connection_string: Mutex::new(String::new()),
            }
        }

        pub fn connect(&self, connection_string: &str) -> bool {
            let mut is_connected = self.is_connected.lock().unwrap();
            let mut count = self.connection_count.lock().unwrap();
            let mut conn_str = self.connection_string.lock().unwrap();

            if *is_connected {
                *count += 1;
                println!("Already connected to database. Connection count: {}", *count);
                return true;
            }

            // Simulate connection
            *conn_str = connection_string.to_string();
            *is_connected = true;
            *count = 1;
            println!("Connected to database: {}", connection_string);
            true
        }

        pub fn disconnect(&self) -> bool {
            let mut is_connected = self.is_connected.lock().unwrap();
            let mut count = self.connection_count.lock().unwrap();
            let conn_str = self.connection_string.lock().unwrap();

            if !*is_connected {
                println!("Not connected to any database.");
                return false;
            }

            *count -= 1;
            if *count == 0 {
                *is_connected = false;
                println!("Disconnected from database: {}", *conn_str);
            } else {
                println!("Connection count decreased. Remaining connections: {}", *count);
            }

            true
        }

        pub fn is_connected(&self) -> bool {
            let is_connected = self.is_connected.lock().unwrap();
            *is_connected
        }

        pub fn connection_count(&self) -> i32 {
            let count = self.connection_count.lock().unwrap();
            *count
        }
    }

    pub fn instance() -> &'static DatabaseConnection {
        static INSTANCE: OnceLock<DatabaseConnection> = OnceLock::new();
        INSTANCE.get_or_init(|| DatabaseConnection::new())
    }
}

// ========== Thread-Safe Singleton with Once ==========

// Traditional thread-safe singleton using Once
mod thread_safe_singleton {
    use super::*;

    pub struct Logger {
        logs: Mutex<Vec<String>>,
    }

    impl Logger {
        fn new() -> Self {
            Logger {
                logs: Mutex::new(Vec::new()),
            }
        }

        pub fn log(&self, message: &str) -> String {
            let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
            let log_entry = format!("{}: {}", timestamp, message);

            let mut logs = self.logs.lock().unwrap();
            logs.push(log_entry.clone());
            println!("{}", log_entry);

            log_entry
        }

        pub fn warn(&self, message: &str) -> String {
            self.log(&format!("WARNING: {}", message))
        }

        pub fn error(&self, message: &str) -> String {
            self.log(&format!("ERROR: {}", message))
        }

        pub fn get_logs(&self) -> Vec<String> {
            let logs = self.logs.lock().unwrap();
            logs.clone()
        }

        pub fn clear_logs(&self) -> &str {
            let mut logs = self.logs.lock().unwrap();
            logs.clear();
            println!("Logs cleared");
            "Logs cleared"
        }
    }

    // Static instance with Once initialization
    pub fn get_instance() -> &'static Logger {
        static mut INSTANCE: Option<Logger> = None;
        static ONCE: Once = Once::new();

        unsafe {
            ONCE.call_once(|| {
                INSTANCE = Some(Logger::new());
            });

            INSTANCE.as_ref().unwrap()
        }
    }
}

// ========== Arc-Mutex Singleton Implementation ==========

// A more idiomatic Rust approach using Arc and Mutex
mod arc_mutex_singleton {
    use super::*;

    #[derive(Debug, Clone)]
    pub struct ConfigManager {
        config: Arc<Mutex<HashMap<String, String>>>,
    }

    impl ConfigManager {
        fn new() -> Self {
            let mut config = HashMap::new();
            config.insert("theme".to_string(), "light".to_string());
            config.insert("language".to_string(), "en".to_string());
            config.insert("notifications".to_string(), "true".to_string());
            config.insert("auto_save".to_string(), "true".to_string());

            ConfigManager {
                config: Arc::new(Mutex::new(config)),
            }
        }

        pub fn get_config(&self) -> HashMap<String, String> {
            let config = self.config.lock().unwrap();
            config.clone()
        }

        pub fn set_config(&self, key: &str, value: &str) -> HashMap<String, String> {
            let mut config = self.config.lock().unwrap();
            config.insert(key.to_string(), value.to_string());
            println!("Configuration updated: {} = {}", key, value);
            config.clone()
        }

        pub fn reset_config(&self) -> HashMap<String, String> {
            let mut config = self.config.lock().unwrap();
            config.clear();
            config.insert("theme".to_string(), "light".to_string());
            config.insert("language".to_string(), "en".to_string());
            config.insert("notifications".to_string(), "true".to_string());
            config.insert("auto_save".to_string(), "true".to_string());
            println!("Configuration reset to defaults");
            config.clone()
        }
    }

    // Singleton instance using lazy_static or once_cell
    use std::sync::OnceLock;

    pub fn instance() -> &'static ConfigManager {
        static INSTANCE: OnceLock<ConfigManager> = OnceLock::new();
        INSTANCE.get_or_init(|| ConfigManager::new())
    }
}

// ========== User Manager Singleton ==========

// User Manager Singleton implementation
mod user_manager_singleton {
    use super::*;
    use std::collections::HashMap;
    use chrono::{DateTime, Local};

    #[derive(Debug, Clone)]
    pub struct UserData {
        pub name: String,
        pub email: String,
        pub role: Option<String>,
        pub created_at: DateTime<Local>,
        pub updated_at: Option<DateTime<Local>>,
    }

    impl fmt::Display for UserData {
        fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
            write!(f, "User {{ name: {}, email: {}, role: {:?} }}",
                self.name, self.email, self.role)
        }
    }

    #[derive(Debug)]
    pub struct UserManager {
        users: Mutex<HashMap<i32, UserData>>,
    }

    impl UserManager {
        fn new() -> Self {
            UserManager {
                users: Mutex::new(HashMap::new()),
            }
        }

        pub fn add_user(&self, id: i32, name: &str, email: &str) -> Result<(), String> {
            let mut users = self.users.lock().unwrap();

            if users.contains_key(&id) {
                return Err(format!("User with ID {} already exists", id));
            }

            users.insert(id, UserData {
                name: name.to_string(),
                email: email.to_string(),
                role: None,
                created_at: Local::now(),
                updated_at: None,
            });

            Ok(())
        }

        pub fn get_user(&self, id: i32) -> Option<UserData> {
            let users = self.users.lock().unwrap();
            users.get(&id).cloned()
        }

        pub fn update_user(&self, id: i32, name: Option<&str>, email: Option<&str>, role: Option<&str>) -> Result<(), String> {
            let mut users = self.users.lock().unwrap();

            if !users.contains_key(&id) {
                return Err(format!("User with ID {} does not exist", id));
            }

            let user = users.get_mut(&id).unwrap();

            if let Some(name_val) = name {
                user.name = name_val.to_string();
            }

            if let Some(email_val) = email {
                user.email = email_val.to_string();
            }

            if let Some(role_val) = role {
                user.role = Some(role_val.to_string());
            }

            user.updated_at = Some(Local::now());

            Ok(())
        }

        pub fn delete_user(&self, id: i32) -> Result<(), String> {
            let mut users = self.users.lock().unwrap();

            if !users.contains_key(&id) {
                return Err(format!("User with ID {} does not exist", id));
            }

            users.remove(&id);
            Ok(())
        }

        pub fn get_all_users(&self) -> Vec<(i32, UserData)> {
            let users = self.users.lock().unwrap();
            users.iter().map(|(&id, user)| (id, user.clone())).collect()
        }

        pub fn user_count(&self) -> usize {
            let users = self.users.lock().unwrap();
            users.len()
        }
    }

    // Singleton instance using OnceLock
    use std::sync::OnceLock;

    pub fn instance() -> &'static UserManager {
        static INSTANCE: OnceLock<UserManager> = OnceLock::new();
        INSTANCE.get_or_init(|| UserManager::new())
    }
}

// ========== Demo Code ==========

fn demonstrate_singletons() {
    // Note: In a real application, you'd need to add the lazy_static crate
    // to your Cargo.toml and uncomment this section
    /*
    println!("===== Classic Singleton Demo =====");
    let singleton1 = &lazy_static_singleton::INSTANCE;
    let singleton2 = &lazy_static_singleton::INSTANCE;

    println!("Are instances the same? {}", std::ptr::eq(singleton1, singleton2));
    println!("Instance timestamp: {:?}", singleton1.get_timestamp());

    let config = singleton1.get_config();
    println!("Original config: api_url = {}", config.get("api_url").unwrap());

    singleton2.update_config("timeout", "5000");
    let config = singleton1.get_config();
    println!("Updated config from singleton1: timeout = {}", config.get("timeout").unwrap());
    */

    println!("\n===== Once Cell Singleton Demo =====");
    let db1 = once_cell_singleton::instance();
    let db2 = once_cell_singleton::instance();

    println!("Are instances the same? {}", std::ptr::eq(db1, db2));

    db1.connect("mysql://localhost:3306/mydb");
    db2.connect("mysql://localhost:3306/mydb");
    println!("Connection count: {}", db1.connection_count());

    db1.disconnect();
    println!("Still connected? {}", db2.is_connected());

    println!("\n===== Thread-Safe Singleton Demo =====");
    let logger1 = thread_safe_singleton::get_instance();
    let logger2 = thread_safe_singleton::get_instance();

    println!("Are instances the same? {}", std::ptr::eq(logger1, logger2));

    logger1.log("Application started");
    logger1.warn("Resource usage is high");
    logger2.error("Failed to connect to service");

    let logs = logger2.get_logs();
    println!("Log entries: {}", logs.len());

    println!("\n===== Arc-Mutex Singleton Demo =====");
    let config1 = arc_mutex_singleton::instance();
    let config2 = arc_mutex_singleton::instance();

    println!("Are instances the same? {}", std::ptr::eq(config1, config2));

    let config_settings = config1.get_config();
    println!("Config value: theme = {}", config_settings.get("theme").unwrap());

    config2.set_config("theme", "dark");
    let config_settings = config1.get_config();
    println!("Updated config from config1: theme = {}", config_settings.get("theme").unwrap());

    println!("\n===== User Manager Singleton Demo =====");
    let user_manager1 = user_manager_singleton::instance();
    let user_manager2 = user_manager_singleton::instance();

    println!("Are instances the same? {}", std::ptr::eq(user_manager1, user_manager2));

    user_manager1.add_user(1, "Alice", "alice@example.com").unwrap();
    user_manager1.add_user(2, "Bob", "bob@example.com").unwrap();

    println!("User count: {}", user_manager2.user_count());

    if let Some(user) = user_manager2.get_user(1) {
        println!("User #1: {}, {}", user.name, user.email);
    }

    user_manager2.update_user(1, None, None, Some("admin")).unwrap();
    if let Some(user) = user_manager1.get_user(1) {
        println!("Updated User #1: {}, {}, {:?}", user.name, user.email, user.role);
    }
}

fn main() {
    // Run the demo
    demonstrate_singletons();
}

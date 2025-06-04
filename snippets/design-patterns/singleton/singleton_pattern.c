/**
 * Singleton Pattern Implementation in C
 *
 * The Singleton Pattern is a creational design pattern that ensures a class has only one instance
 * and provides a global point of access to it. This is useful when exactly one object is needed
 * to coordinate actions across the system.
 *
 * This file demonstrates several ways to implement the Singleton pattern in C.
 * Note: Since C is not an object-oriented language, we use structs with function pointers
 * to simulate classes and objects.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <pthread.h>
#include <stdbool.h>

// ========== Classic Singleton Implementation ==========

// Configuration Manager Singleton
typedef struct {
    char api_url[100];
    int timeout;
    int retries;
    time_t timestamp;
} ConfigManager;

// Global static instance
static ConfigManager* config_manager_instance = NULL;
static pthread_mutex_t config_manager_mutex = PTHREAD_MUTEX_INITIALIZER;

// Get singleton instance
ConfigManager* get_config_manager() {
    if (config_manager_instance == NULL) {
        pthread_mutex_lock(&config_manager_mutex);
        if (config_manager_instance == NULL) {
            config_manager_instance = (ConfigManager*)malloc(sizeof(ConfigManager));
            if (config_manager_instance == NULL) {
                pthread_mutex_unlock(&config_manager_mutex);
                return NULL;
            }

            // Initialize default values
            strcpy(config_manager_instance->api_url, "https://api.example.com");
            config_manager_instance->timeout = 3000;
            config_manager_instance->retries = 3;
            config_manager_instance->timestamp = time(NULL);
        }
        pthread_mutex_unlock(&config_manager_mutex);
    }

    return config_manager_instance;
}

// Get config values
void config_manager_get_config(ConfigManager* cm, char* api_url, int* timeout, int* retries) {
    pthread_mutex_lock(&config_manager_mutex);
    if (api_url != NULL) {
        strcpy(api_url, cm->api_url);
    }
    if (timeout != NULL) {
        *timeout = cm->timeout;
    }
    if (retries != NULL) {
        *retries = cm->retries;
    }
    pthread_mutex_unlock(&config_manager_mutex);
}

// Update config value
void config_manager_update_config(ConfigManager* cm, const char* key, const void* value) {
    pthread_mutex_lock(&config_manager_mutex);
    if (strcmp(key, "api_url") == 0 && value != NULL) {
        strcpy(cm->api_url, (const char*)value);
        printf("Configuration updated: api_url = %s\n", cm->api_url);
    } else if (strcmp(key, "timeout") == 0 && value != NULL) {
        cm->timeout = *((int*)value);
        printf("Configuration updated: timeout = %d\n", cm->timeout);
    } else if (strcmp(key, "retries") == 0 && value != NULL) {
        cm->retries = *((int*)value);
        printf("Configuration updated: retries = %d\n", cm->retries);
    }
    pthread_mutex_unlock(&config_manager_mutex);
}

// Get timestamp
time_t config_manager_get_timestamp(ConfigManager* cm) {
    return cm->timestamp;
}

// Clean up resources
void config_manager_destroy() {
    pthread_mutex_lock(&config_manager_mutex);
    if (config_manager_instance != NULL) {
        free(config_manager_instance);
        config_manager_instance = NULL;
    }
    pthread_mutex_unlock(&config_manager_mutex);
}

// ========== Database Connection Singleton ==========

// Database Connection Singleton
typedef struct {
    char connection_string[200];
    int connection_count;
    bool is_connected;
} DatabaseConnection;

// Global static instance
static DatabaseConnection* db_connection_instance = NULL;
static pthread_mutex_t db_connection_mutex = PTHREAD_MUTEX_INITIALIZER;

// Get singleton instance
DatabaseConnection* get_database_connection() {
    if (db_connection_instance == NULL) {
        pthread_mutex_lock(&db_connection_mutex);
        if (db_connection_instance == NULL) {
            db_connection_instance = (DatabaseConnection*)malloc(sizeof(DatabaseConnection));
            if (db_connection_instance == NULL) {
                pthread_mutex_unlock(&db_connection_mutex);
                return NULL;
            }

            // Initialize default values
            db_connection_instance->connection_string[0] = '\0';
            db_connection_instance->connection_count = 0;
            db_connection_instance->is_connected = false;
        }
        pthread_mutex_unlock(&db_connection_mutex);
    }

    return db_connection_instance;
}

// Connect to database
bool database_connection_connect(DatabaseConnection* db, const char* connection_string) {
    pthread_mutex_lock(&db_connection_mutex);
    if (db->is_connected) {
        db->connection_count++;
        printf("Already connected to database. Connection count: %d\n", db->connection_count);
        pthread_mutex_unlock(&db_connection_mutex);
        return true;
    }

    // Simulate connection
    strcpy(db->connection_string, connection_string);
    db->is_connected = true;
    db->connection_count = 1;
    printf("Connected to database: %s\n", connection_string);
    pthread_mutex_unlock(&db_connection_mutex);
    return true;
}

// Disconnect from database
bool database_connection_disconnect(DatabaseConnection* db) {
    pthread_mutex_lock(&db_connection_mutex);
    if (!db->is_connected) {
        printf("Not connected to any database.\n");
        pthread_mutex_unlock(&db_connection_mutex);
        return false;
    }

    db->connection_count--;
    if (db->connection_count == 0) {
        db->is_connected = false;
        printf("Disconnected from database: %s\n", db->connection_string);
    } else {
        printf("Connection count decreased. Remaining connections: %d\n", db->connection_count);
    }
    pthread_mutex_unlock(&db_connection_mutex);
    return true;
}

// Check if connected
bool database_connection_is_connected(DatabaseConnection* db) {
    pthread_mutex_lock(&db_connection_mutex);
    bool result = db->is_connected;
    pthread_mutex_unlock(&db_connection_mutex);
    return result;
}

// Get connection count
int database_connection_get_count(DatabaseConnection* db) {
    pthread_mutex_lock(&db_connection_mutex);
    int result = db->connection_count;
    pthread_mutex_unlock(&db_connection_mutex);
    return result;
}

// Clean up resources
void database_connection_destroy() {
    pthread_mutex_lock(&db_connection_mutex);
    if (db_connection_instance != NULL) {
        free(db_connection_instance);
        db_connection_instance = NULL;
    }
    pthread_mutex_unlock(&db_connection_mutex);
}

// ========== Logger Singleton ==========

// Log entry structure
typedef struct LogEntry {
    char message[256];
    time_t timestamp;
    struct LogEntry* next;
} LogEntry;

// Logger Singleton
typedef struct {
    LogEntry* head;
    int log_count;
} Logger;

// Global static instance
static Logger* logger_instance = NULL;
static pthread_mutex_t logger_mutex = PTHREAD_MUTEX_INITIALIZER;

// Get singleton instance
Logger* get_logger() {
    if (logger_instance == NULL) {
        pthread_mutex_lock(&logger_mutex);
        if (logger_instance == NULL) {
            logger_instance = (Logger*)malloc(sizeof(Logger));
            if (logger_instance == NULL) {
                pthread_mutex_unlock(&logger_mutex);
                return NULL;
            }

            // Initialize default values
            logger_instance->head = NULL;
            logger_instance->log_count = 0;
        }
        pthread_mutex_unlock(&logger_mutex);
    }

    return logger_instance;
}

// Add log entry
void logger_log(Logger* logger, const char* message) {
    time_t now = time(NULL);
    struct tm* tm_info = localtime(&now);
    char timestamp[26];
    strftime(timestamp, 26, "%Y-%m-%d %H:%M:%S", tm_info);

    LogEntry* new_entry = (LogEntry*)malloc(sizeof(LogEntry));
    if (new_entry == NULL) {
        return;
    }

    snprintf(new_entry->message, sizeof(new_entry->message), "%s: %s", timestamp, message);
    new_entry->timestamp = now;
    new_entry->next = NULL;

    pthread_mutex_lock(&logger_mutex);
    if (logger->head == NULL) {
        logger->head = new_entry;
    } else {
        LogEntry* current = logger->head;
        while (current->next != NULL) {
            current = current->next;
        }
        current->next = new_entry;
    }
    logger->log_count++;
    pthread_mutex_unlock(&logger_mutex);

    printf("%s\n", new_entry->message);
}

// Add warning log entry
void logger_warn(Logger* logger, const char* message) {
    char warning_message[256];
    snprintf(warning_message, sizeof(warning_message), "WARNING: %s", message);
    logger_log(logger, warning_message);
}

// Add error log entry
void logger_error(Logger* logger, const char* message) {
    char error_message[256];
    snprintf(error_message, sizeof(error_message), "ERROR: %s", message);
    logger_log(logger, error_message);
}

// Get log count
int logger_get_count(Logger* logger) {
    pthread_mutex_lock(&logger_mutex);
    int result = logger->log_count;
    pthread_mutex_unlock(&logger_mutex);
    return result;
}

// Clear logs
void logger_clear(Logger* logger) {
    pthread_mutex_lock(&logger_mutex);
    LogEntry* current = logger->head;
    while (current != NULL) {
        LogEntry* next = current->next;
        free(current);
        current = next;
    }
    logger->head = NULL;
    logger->log_count = 0;
    pthread_mutex_unlock(&logger_mutex);
    printf("Logs cleared\n");
}

// Clean up resources
void logger_destroy() {
    pthread_mutex_lock(&logger_mutex);
    if (logger_instance != NULL) {
        LogEntry* current = logger_instance->head;
        while (current != NULL) {
            LogEntry* next = current->next;
            free(current);
            current = next;
        }
        free(logger_instance);
        logger_instance = NULL;
    }
    pthread_mutex_unlock(&logger_mutex);
}

// ========== User Manager Singleton ==========

// User structure
typedef struct {
    int id;
    char name[100];
    char email[100];
    char role[50];
    time_t created_at;
    time_t updated_at;
    bool has_role;
} User;

// User Manager Singleton
typedef struct {
    User* users;
    int capacity;
    int count;
} UserManager;

// Global static instance
static UserManager* user_manager_instance = NULL;
static pthread_mutex_t user_manager_mutex = PTHREAD_MUTEX_INITIALIZER;

// Get singleton instance
UserManager* get_user_manager() {
    if (user_manager_instance == NULL) {
        pthread_mutex_lock(&user_manager_mutex);
        if (user_manager_instance == NULL) {
            user_manager_instance = (UserManager*)malloc(sizeof(UserManager));
            if (user_manager_instance == NULL) {
                pthread_mutex_unlock(&user_manager_mutex);
                return NULL;
            }

            // Initialize with capacity for 10 users
            user_manager_instance->capacity = 10;
            user_manager_instance->users = (User*)malloc(user_manager_instance->capacity * sizeof(User));
            if (user_manager_instance->users == NULL) {
                free(user_manager_instance);
                user_manager_instance = NULL;
                pthread_mutex_unlock(&user_manager_mutex);
                return NULL;
            }
            user_manager_instance->count = 0;
        }
        pthread_mutex_unlock(&user_manager_mutex);
    }

    return user_manager_instance;
}

// Find user by ID
int user_manager_find_user(UserManager* um, int id) {
    for (int i = 0; i < um->count; i++) {
        if (um->users[i].id == id) {
            return i;
        }
    }
    return -1;
}

// Add user
bool user_manager_add_user(UserManager* um, int id, const char* name, const char* email) {
    pthread_mutex_lock(&user_manager_mutex);

    // Check if user already exists
    if (user_manager_find_user(um, id) != -1) {
        printf("User with ID %d already exists\n", id);
        pthread_mutex_unlock(&user_manager_mutex);
        return false;
    }

    // Check if we need to resize the array
    if (um->count >= um->capacity) {
        int new_capacity = um->capacity * 2;
        User* new_users = (User*)realloc(um->users, new_capacity * sizeof(User));
        if (new_users == NULL) {
            pthread_mutex_unlock(&user_manager_mutex);
            return false;
        }
        um->users = new_users;
        um->capacity = new_capacity;
    }

    // Add the new user
    User* new_user = &um->users[um->count];
    new_user->id = id;
    strncpy(new_user->name, name, sizeof(new_user->name) - 1);
    new_user->name[sizeof(new_user->name) - 1] = '\0';
    strncpy(new_user->email, email, sizeof(new_user->email) - 1);
    new_user->email[sizeof(new_user->email) - 1] = '\0';
    new_user->role[0] = '\0';
    new_user->has_role = false;
    new_user->created_at = time(NULL);
    new_user->updated_at = 0;

    um->count++;
    pthread_mutex_unlock(&user_manager_mutex);
    return true;
}

// Get user
User* user_manager_get_user(UserManager* um, int id) {
    pthread_mutex_lock(&user_manager_mutex);
    int index = user_manager_find_user(um, id);
    if (index == -1) {
        pthread_mutex_unlock(&user_manager_mutex);
        return NULL;
    }

    static User user_copy;
    memcpy(&user_copy, &um->users[index], sizeof(User));
    pthread_mutex_unlock(&user_manager_mutex);
    return &user_copy;
}

// Update user
bool user_manager_update_user(UserManager* um, int id, const char* name, const char* email, const char* role) {
    pthread_mutex_lock(&user_manager_mutex);
    int index = user_manager_find_user(um, id);
    if (index == -1) {
        printf("User with ID %d does not exist\n", id);
        pthread_mutex_unlock(&user_manager_mutex);
        return false;
    }

    User* user = &um->users[index];
    if (name != NULL) {
        strncpy(user->name, name, sizeof(user->name) - 1);
        user->name[sizeof(user->name) - 1] = '\0';
    }
    if (email != NULL) {
        strncpy(user->email, email, sizeof(user->email) - 1);
        user->email[sizeof(user->email) - 1] = '\0';
    }
    if (role != NULL) {
        strncpy(user->role, role, sizeof(user->role) - 1);
        user->role[sizeof(user->role) - 1] = '\0';
        user->has_role = true;
    }

    user->updated_at = time(NULL);
    pthread_mutex_unlock(&user_manager_mutex);
    return true;
}

// Delete user
bool user_manager_delete_user(UserManager* um, int id) {
    pthread_mutex_lock(&user_manager_mutex);
    int index = user_manager_find_user(um, id);
    if (index == -1) {
        printf("User with ID %d does not exist\n", id);
        pthread_mutex_unlock(&user_manager_mutex);
        return false;
    }

    // Remove user by shifting all users after it
    for (int i = index; i < um->count - 1; i++) {
        um->users[i] = um->users[i + 1];
    }

    um->count--;
    pthread_mutex_unlock(&user_manager_mutex);
    return true;
}

// Get user count
int user_manager_get_count(UserManager* um) {
    pthread_mutex_lock(&user_manager_mutex);
    int result = um->count;
    pthread_mutex_unlock(&user_manager_mutex);
    return result;
}

// Clean up resources
void user_manager_destroy() {
    pthread_mutex_lock(&user_manager_mutex);
    if (user_manager_instance != NULL) {
        if (user_manager_instance->users != NULL) {
            free(user_manager_instance->users);
        }
        free(user_manager_instance);
        user_manager_instance = NULL;
    }
    pthread_mutex_unlock(&user_manager_mutex);
}

// ========== Demo Code ==========

void demonstrate_singletons() {
    printf("===== Config Manager Singleton Demo =====\n");
    ConfigManager* config1 = get_config_manager();
    ConfigManager* config2 = get_config_manager();

    printf("Are instances the same? %s\n", (config1 == config2) ? "Yes" : "No");
    printf("Instance timestamp: %ld\n", config_manager_get_timestamp(config1));

    char api_url[100];
    int timeout;
    int retries;
    config_manager_get_config(config1, api_url, &timeout, &retries);
    printf("Original config: api_url = %s, timeout = %d, retries = %d\n", api_url, timeout, retries);

    int new_timeout = 5000;
    config_manager_update_config(config2, "timeout", &new_timeout);

    config_manager_get_config(config1, api_url, &timeout, &retries);
    printf("Updated config from config1: timeout = %d\n", timeout);

    printf("\n===== Database Connection Singleton Demo =====\n");
    DatabaseConnection* db1 = get_database_connection();
    DatabaseConnection* db2 = get_database_connection();

    printf("Are instances the same? %s\n", (db1 == db2) ? "Yes" : "No");

    database_connection_connect(db1, "mysql://localhost:3306/mydb");
    database_connection_connect(db2, "mysql://localhost:3306/mydb");
    printf("Connection count: %d\n", database_connection_get_count(db1));

    database_connection_disconnect(db1);
    printf("Still connected? %s\n", database_connection_is_connected(db2) ? "Yes" : "No");

    printf("\n===== Logger Singleton Demo =====\n");
    Logger* logger1 = get_logger();
    Logger* logger2 = get_logger();

    printf("Are instances the same? %s\n", (logger1 == logger2) ? "Yes" : "No");

    logger_log(logger1, "Application started");
    logger_warn(logger1, "Resource usage is high");
    logger_error(logger2, "Failed to connect to service");

    printf("Log entries: %d\n", logger_get_count(logger2));

    printf("\n===== User Manager Singleton Demo =====\n");
    UserManager* user_manager1 = get_user_manager();
    UserManager* user_manager2 = get_user_manager();

    printf("Are instances the same? %s\n", (user_manager1 == user_manager2) ? "Yes" : "No");

    user_manager_add_user(user_manager1, 1, "Alice", "alice@example.com");
    user_manager_add_user(user_manager1, 2, "Bob", "bob@example.com");

    printf("User count: %d\n", user_manager_get_count(user_manager2));

    User* user = user_manager_get_user(user_manager2, 1);
    if (user != NULL) {
        printf("User #1: %s, %s\n", user->name, user->email);
    }

    user_manager_update_user(user_manager2, 1, NULL, NULL, "admin");
    user = user_manager_get_user(user_manager1, 1);
    if (user != NULL) {
        printf("Updated User #1: %s, %s, %s\n", user->name, user->email, user->role);
    }
}

// Clean up all resources
void cleanup_all() {
    config_manager_destroy();
    database_connection_destroy();
    logger_destroy();
    user_manager_destroy();
}

int main() {
    // Run the demo
    demonstrate_singletons();
    cleanup_all();
    return 0;
}

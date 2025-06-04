/**
 * Singleton Pattern Implementation in JavaScript
 *
 * The Singleton Pattern is a creational design pattern that ensures a class has only one instance
 * and provides a global point of access to it. This is useful when exactly one object is needed
 * to coordinate actions across the system.
 *
 * This file demonstrates several ways to implement the Singleton pattern in JavaScript.
 */

// ========== Classic Singleton Implementation ==========

/**
 * Classic Singleton implementation using a class with a static instance property
 */
class ClassicSingleton {
  constructor() {
    if (ClassicSingleton._instance) {
      return ClassicSingleton._instance;
    }

    this.timestamp = new Date().getTime();
    this.config = {
      apiUrl: 'https://api.example.com',
      timeout: 3000,
      retries: 3
    };

    ClassicSingleton._instance = this;
  }

  getConfig() {
    return this.config;
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('Configuration updated:', this.config);
    return this.config;
  }

  getTimestamp() {
    return this.timestamp;
  }

  static getInstance() {
    if (!ClassicSingleton._instance) {
      ClassicSingleton._instance = new ClassicSingleton();
    }
    return ClassicSingleton._instance;
  }
}

// Initialize the static property
ClassicSingleton._instance = null;

// ========== Module Pattern Singleton Implementation ==========

/**
 * Singleton implementation using the Module pattern with an IIFE
 * (Immediately Invoked Function Expression)
 */
const DatabaseConnection = (function() {
  // Private variables and methods
  let instance;
  let connectionCount = 0;

  function createConnection() {
    // Private methods
    function connect() {
      connectionCount++;
      return `Connected to database (Connection #${connectionCount})`;
    }

    function disconnect() {
      if (connectionCount > 0) {
        connectionCount--;
        return `Disconnected from database (Remaining connections: ${connectionCount})`;
      }
      return 'No active connections to disconnect';
    }

    // Public interface
    return {
      connect,
      disconnect,
      getConnectionStatus: () => connectionCount > 0 ? 'Connected' : 'Disconnected',
      getConnectionCount: () => connectionCount
    };
  }

  return {
    // Public method to get the instance
    getInstance: function() {
      if (!instance) {
        instance = createConnection();
      }
      return instance;
    }
  };
})();

// ========== ES6 Module Singleton Implementation ==========

/**
 * Singleton implementation using ES6 module pattern
 * In a real application, this would be in its own file and imported where needed
 */
class Logger {
  constructor() {
    this.logs = [];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
    return logEntry;
  }

  warn(message) {
    return this.log(`WARNING: ${message}`);
  }

  error(message) {
    return this.log(`ERROR: ${message}`);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    return 'Logs cleared';
  }
}

// Create the singleton instance
const loggerInstance = new Logger();

// Export the instance (not the class)
// In a real ES6 module, we would use:
// export default loggerInstance;

// ========== Lazy Initialization Singleton ==========

/**
 * Singleton with lazy initialization using a closure
 */
const ConfigManager = (function() {
  let instance;

  // Private constructor function
  function ConfigManagerConstructor() {
    let config = {
      theme: 'light',
      language: 'en',
      notifications: true,
      autoSave: true
    };

    return {
      getConfig: () => ({ ...config }),
      setConfig: (newConfig) => {
        config = { ...config, ...newConfig };
        return config;
      },
      resetConfig: () => {
        config = {
          theme: 'light',
          language: 'en',
          notifications: true,
          autoSave: true
        };
        return config;
      }
    };
  }

  return {
    // This is the public method to get the singleton instance
    getInstance: function() {
      if (!instance) {
        instance = new ConfigManagerConstructor();
      }
      return instance;
    }
  };
})();

// ========== Singleton with Object Literal ==========

/**
 * Simplest singleton implementation using an object literal
 * This is a singleton by nature as objects are passed by reference in JavaScript
 */
const AppState = {
  user: null,
  isLoggedIn: false,
  preferences: {},

  login(userData) {
    this.user = userData;
    this.isLoggedIn = true;
    console.log(`User ${userData.name} logged in`);
  },

  logout() {
    const username = this.user ? this.user.name : 'Unknown';
    this.user = null;
    this.isLoggedIn = false;
    console.log(`User ${username} logged out`);
  },

  updatePreferences(prefs) {
    this.preferences = { ...this.preferences, ...prefs };
    console.log('Preferences updated:', this.preferences);
  },

  getState() {
    return {
      user: this.user,
      isLoggedIn: this.isLoggedIn,
      preferences: { ...this.preferences }
    };
  }
};

// ========== Thread-Safe Singleton with Symbol ==========

/**
 * A more advanced singleton implementation using Symbol to make the instance truly private
 */
const UserManager = (function() {
  // Using Symbol to create a truly private instance holder
  const _instance = Symbol('UserManagerInstance');

  // Private data store
  const _users = Symbol('users');

  class UserManagerClass {
    constructor() {
      // Initialize private data
      this[_users] = new Map();
    }

    addUser(id, userData) {
      if (this[_users].has(id)) {
        throw new Error(`User with ID ${id} already exists`);
      }

      this[_users].set(id, {
        ...userData,
        createdAt: new Date()
      });

      return true;
    }

    getUser(id) {
      if (!this[_users].has(id)) {
        return null;
      }

      return { ...this[_users].get(id) };
    }

    updateUser(id, userData) {
      if (!this[_users].has(id)) {
        throw new Error(`User with ID ${id} does not exist`);
      }

      const existingUser = this[_users].get(id);
      this[_users].set(id, {
        ...existingUser,
        ...userData,
        updatedAt: new Date()
      });

      return true;
    }

    deleteUser(id) {
      if (!this[_users].has(id)) {
        throw new Error(`User with ID ${id} does not exist`);
      }

      return this[_users].delete(id);
    }

    getAllUsers() {
      return Array.from(this[_users].entries()).map(([id, userData]) => ({
        id,
        ...userData
      }));
    }

    getUserCount() {
      return this[_users].size;
    }
  }

  // Create a container for the singleton instance
  const SingletonContainer = {
    [_instance]: null,

    getInstance() {
      if (!this[_instance]) {
        this[_instance] = new UserManagerClass();
      }

      return this[_instance];
    }
  };

  return SingletonContainer;
})();

// ========== Demo Code ==========

function demonstrateSingletons() {
  console.log('===== Classic Singleton Demo =====');
  const singleton1 = ClassicSingleton.getInstance();
  const singleton2 = ClassicSingleton.getInstance();

  console.log('Are instances the same?', singleton1 === singleton2);
  console.log('Instance timestamp:', singleton1.getTimestamp());
  console.log('Original config:', singleton1.getConfig());

  singleton2.updateConfig({ timeout: 5000 });
  console.log('Updated config from singleton1:', singleton1.getConfig());

  console.log('\n===== Database Connection Singleton Demo =====');
  const db1 = DatabaseConnection.getInstance();
  const db2 = DatabaseConnection.getInstance();

  console.log('Are instances the same?', db1 === db2);
  console.log(db1.connect());
  console.log(db1.connect());
  console.log('Connection count:', db2.getConnectionCount());
  console.log(db2.disconnect());
  console.log('Connection status:', db1.getConnectionStatus());

  console.log('\n===== Logger Singleton Demo =====');
  loggerInstance.log('Application started');
  loggerInstance.warn('Resource usage is high');
  loggerInstance.error('Failed to connect to service');
  console.log('Log entries:', loggerInstance.getLogs().length);

  console.log('\n===== Config Manager Singleton Demo =====');
  const config1 = ConfigManager.getInstance();
  const config2 = ConfigManager.getInstance();

  console.log('Are instances the same?', config1 === config2);
  console.log('Original config:', config1.getConfig());

  config2.setConfig({ theme: 'dark', autoSave: false });
  console.log('Updated config from config1:', config1.getConfig());

  console.log('\n===== App State Singleton Demo =====');
  console.log('Initial state:', AppState.getState());

  AppState.login({ name: 'John Doe', email: 'john@example.com' });
  AppState.updatePreferences({ theme: 'dark', notifications: false });
  console.log('Updated state:', AppState.getState());

  console.log('\n===== User Manager Singleton Demo =====');
  const userManager1 = UserManager.getInstance();
  const userManager2 = UserManager.getInstance();

  console.log('Are instances the same?', userManager1 === userManager2);

  userManager1.addUser(1, { name: 'Alice', email: 'alice@example.com' });
  userManager1.addUser(2, { name: 'Bob', email: 'bob@example.com' });

  console.log('User count:', userManager2.getUserCount());
  console.log('User #1:', userManager2.getUser(1));

  userManager2.updateUser(1, { role: 'admin' });
  console.log('Updated User #1:', userManager1.getUser(1));
}

// Run the demo
demonstrateSingletons();

// Export the singleton classes and instances for use in other modules
module.exports = {
  ClassicSingleton,
  DatabaseConnection,
  Logger: loggerInstance,
  ConfigManager,
  AppState,
  UserManager
};

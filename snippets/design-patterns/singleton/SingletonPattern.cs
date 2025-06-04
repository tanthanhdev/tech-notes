/**
 * Singleton Pattern Implementation in C#
 *
 * The Singleton Pattern is a creational design pattern that ensures a class has only one instance
 * and provides a global point of access to it. This is useful when exactly one object is needed
 * to coordinate actions across the system.
 *
 * This file demonstrates several ways to implement the Singleton pattern in C#.
 */

using System;
using System.Collections.Generic;
using System.Threading;

namespace DesignPatterns.Singleton
{
    // ========== Classic Singleton Implementation ==========

    /// <summary>
    /// Classic Singleton implementation using a static instance field and lazy initialization
    /// </summary>
    public sealed class ClassicSingleton
    {
        private static ClassicSingleton _instance;
        private static readonly object _lock = new object();

        private DateTime _timestamp;
        private Dictionary<string, object> _config;

        // Private constructor to prevent direct instantiation
        private ClassicSingleton()
        {
            _timestamp = DateTime.Now;
            _config = new Dictionary<string, object>
            {
                { "ApiUrl", "https://api.example.com" },
                { "Timeout", 3000 },
                { "Retries", 3 }
            };
        }

        public static ClassicSingleton Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_lock)
                    {
                        if (_instance == null)
                        {
                            _instance = new ClassicSingleton();
                        }
                    }
                }
                return _instance;
            }
        }

        public Dictionary<string, object> GetConfig()
        {
            return new Dictionary<string, object>(_config);
        }

        public void UpdateConfig(string key, object value)
        {
            lock (_lock)
            {
                _config[key] = value;
                Console.WriteLine($"Configuration updated: {key} = {value}");
            }
        }

        public DateTime GetTimestamp()
        {
            return _timestamp;
        }
    }

    // ========== Singleton with Static Initialization ==========

    /// <summary>
    /// Singleton implementation using static initialization
    /// This implementation is thread-safe without explicit synchronization
    /// </summary>
    public sealed class StaticSingleton
    {
        // Static initialization is thread-safe in C#
        private static readonly StaticSingleton _instance = new StaticSingleton();

        private int _connectionCount;
        private bool _isConnected;
        private string _connectionString;

        // Static constructor to tell C# compiler not to mark type as beforefieldinit
        static StaticSingleton()
        {
        }

        // Private constructor to prevent direct instantiation
        private StaticSingleton()
        {
            _connectionCount = 0;
            _isConnected = false;
            _connectionString = string.Empty;
        }

        public static StaticSingleton Instance
        {
            get { return _instance; }
        }

        public bool Connect(string connectionString)
        {
            if (_isConnected)
            {
                _connectionCount++;
                Console.WriteLine($"Already connected to database. Connection count: {_connectionCount}");
                return true;
            }

            // Simulate connection
            _connectionString = connectionString;
            _isConnected = true;
            _connectionCount = 1;
            Console.WriteLine($"Connected to database: {connectionString}");
            return true;
        }

        public bool Disconnect()
        {
            if (!_isConnected)
            {
                Console.WriteLine("Not connected to any database.");
                return false;
            }

            _connectionCount--;
            if (_connectionCount == 0)
            {
                _isConnected = false;
                Console.WriteLine($"Disconnected from database: {_connectionString}");
            }
            else
            {
                Console.WriteLine($"Connection count decreased. Remaining connections: {_connectionCount}");
            }

            return true;
        }

        public bool IsConnected => _isConnected;

        public int ConnectionCount => _connectionCount;
    }

    // ========== Singleton with Lazy<T> ==========

    /// <summary>
    /// Modern Singleton implementation using Lazy<T>
    /// This implementation is thread-safe and uses .NET's built-in lazy initialization
    /// </summary>
    public sealed class LazySingleton
    {
        private static readonly Lazy<LazySingleton> _lazy =
            new Lazy<LazySingleton>(() => new LazySingleton());

        private List<string> _logs;

        private LazySingleton()
        {
            _logs = new List<string>();
        }

        public static LazySingleton Instance => _lazy.Value;

        public void Log(string message)
        {
            string timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            string logEntry = $"{timestamp}: {message}";
            _logs.Add(logEntry);
            Console.WriteLine(logEntry);
        }

        public void Warn(string message)
        {
            Log($"WARNING: {message}");
        }

        public void Error(string message)
        {
            Log($"ERROR: {message}");
        }

        public List<string> GetLogs()
        {
            return new List<string>(_logs);
        }

        public void ClearLogs()
        {
            _logs.Clear();
            Console.WriteLine("Logs cleared");
        }
    }

    // ========== Singleton with Dependency Injection ==========

    /// <summary>
    /// Singleton implementation that can be used with dependency injection
    /// This is a more modern approach that allows for better testability
    /// </summary>
    public interface IConfigManager
    {
        Dictionary<string, object> GetConfig();
        void SetConfig(string key, object value);
        void ResetConfig();
    }

    public sealed class ConfigManager : IConfigManager
    {
        private Dictionary<string, object> _config;

        public ConfigManager()
        {
            _config = new Dictionary<string, object>
            {
                { "Theme", "light" },
                { "Language", "en" },
                { "Notifications", true },
                { "AutoSave", true }
            };
        }

        public Dictionary<string, object> GetConfig()
        {
            return new Dictionary<string, object>(_config);
        }

        public void SetConfig(string key, object value)
        {
            _config[key] = value;
            Console.WriteLine($"Configuration updated: {key} = {value}");
        }

        public void ResetConfig()
        {
            _config = new Dictionary<string, object>
            {
                { "Theme", "light" },
                { "Language", "en" },
                { "Notifications", true },
                { "AutoSave", true }
            };
            Console.WriteLine("Configuration reset to defaults");
        }
    }

    // ========== Thread-Safe Singleton with Double-Check Locking ==========

    /// <summary>
    /// Thread-safe Singleton implementation using double-check locking
    /// </summary>
    public sealed class UserManager
    {
        private static volatile UserManager _instance;
        private static readonly object _lock = new object();

        private readonly Dictionary<int, UserData> _users;

        // Private constructor to prevent direct instantiation
        private UserManager()
        {
            _users = new Dictionary<int, UserData>();
        }

        public static UserManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_lock)
                    {
                        if (_instance == null)
                        {
                            _instance = new UserManager();
                        }
                    }
                }
                return _instance;
            }
        }

        public bool AddUser(int id, UserData userData)
        {
            lock (_lock)
            {
                if (_users.ContainsKey(id))
                {
                    throw new InvalidOperationException($"User with ID {id} already exists");
                }

                _users[id] = new UserData
                {
                    Name = userData.Name,
                    Email = userData.Email,
                    CreatedAt = DateTime.Now
                };

                return true;
            }
        }

        public UserData GetUser(int id)
        {
            lock (_lock)
            {
                if (!_users.ContainsKey(id))
                {
                    return null;
                }

                // Return a copy to prevent modification
                return new UserData
                {
                    Name = _users[id].Name,
                    Email = _users[id].Email,
                    Role = _users[id].Role,
                    CreatedAt = _users[id].CreatedAt,
                    UpdatedAt = _users[id].UpdatedAt
                };
            }
        }

        public bool UpdateUser(int id, UserData userData)
        {
            lock (_lock)
            {
                if (!_users.ContainsKey(id))
                {
                    throw new InvalidOperationException($"User with ID {id} does not exist");
                }

                var existingUser = _users[id];
                _users[id] = new UserData
                {
                    Name = userData.Name ?? existingUser.Name,
                    Email = userData.Email ?? existingUser.Email,
                    Role = userData.Role ?? existingUser.Role,
                    CreatedAt = existingUser.CreatedAt,
                    UpdatedAt = DateTime.Now
                };

                return true;
            }
        }

        public bool DeleteUser(int id)
        {
            lock (_lock)
            {
                if (!_users.ContainsKey(id))
                {
                    throw new InvalidOperationException($"User with ID {id} does not exist");
                }

                return _users.Remove(id);
            }
        }

        public List<UserData> GetAllUsers()
        {
            lock (_lock)
            {
                var result = new List<UserData>();
                foreach (var kvp in _users)
                {
                    result.Add(new UserData
                    {
                        Id = kvp.Key,
                        Name = kvp.Value.Name,
                        Email = kvp.Value.Email,
                        Role = kvp.Value.Role,
                        CreatedAt = kvp.Value.CreatedAt,
                        UpdatedAt = kvp.Value.UpdatedAt
                    });
                }
                return result;
            }
        }

        public int UserCount
        {
            get
            {
                lock (_lock)
                {
                    return _users.Count;
                }
            }
        }
    }

    public class UserData
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    // ========== Demo Code ==========

    public class SingletonDemo
    {
        public static void DemonstrateSingletons()
        {
            Console.WriteLine("===== Classic Singleton Demo =====");
            ClassicSingleton singleton1 = ClassicSingleton.Instance;
            ClassicSingleton singleton2 = ClassicSingleton.Instance;

            Console.WriteLine($"Are instances the same? {object.ReferenceEquals(singleton1, singleton2)}");
            Console.WriteLine($"Instance timestamp: {singleton1.GetTimestamp()}");

            var config = singleton1.GetConfig();
            Console.WriteLine($"Original config: ApiUrl = {config["ApiUrl"]}");

            singleton2.UpdateConfig("Timeout", 5000);
            config = singleton1.GetConfig();
            Console.WriteLine($"Updated config from singleton1: Timeout = {config["Timeout"]}");

            Console.WriteLine("\n===== Static Singleton Demo =====");
            StaticSingleton db1 = StaticSingleton.Instance;
            StaticSingleton db2 = StaticSingleton.Instance;

            Console.WriteLine($"Are instances the same? {object.ReferenceEquals(db1, db2)}");

            db1.Connect("mysql://localhost:3306/mydb");
            db2.Connect("mysql://localhost:3306/mydb");
            Console.WriteLine($"Connection count: {db1.ConnectionCount}");

            db1.Disconnect();
            Console.WriteLine($"Still connected? {db2.IsConnected}");

            Console.WriteLine("\n===== Lazy Singleton Demo =====");
            LazySingleton logger1 = LazySingleton.Instance;
            LazySingleton logger2 = LazySingleton.Instance;

            Console.WriteLine($"Are instances the same? {object.ReferenceEquals(logger1, logger2)}");

            logger1.Log("Application started");
            logger1.Warn("Resource usage is high");
            logger2.Error("Failed to connect to service");

            var logs = logger2.GetLogs();
            Console.WriteLine($"Log entries: {logs.Count}");

            Console.WriteLine("\n===== Config Manager Demo =====");
            IConfigManager configManager = new ConfigManager();

            var configSettings = configManager.GetConfig();
            Console.WriteLine($"Config value: Theme = {configSettings["Theme"]}");

            configManager.SetConfig("Theme", "dark");
            configSettings = configManager.GetConfig();
            Console.WriteLine($"Updated config: Theme = {configSettings["Theme"]}");

            Console.WriteLine("\n===== User Manager Singleton Demo =====");
            UserManager userManager1 = UserManager.Instance;
            UserManager userManager2 = UserManager.Instance;

            Console.WriteLine($"Are instances the same? {object.ReferenceEquals(userManager1, userManager2)}");

            userManager1.AddUser(1, new UserData { Name = "Alice", Email = "alice@example.com" });
            userManager1.AddUser(2, new UserData { Name = "Bob", Email = "bob@example.com" });

            Console.WriteLine($"User count: {userManager2.UserCount}");

            var user = userManager2.GetUser(1);
            Console.WriteLine($"User #1: {user.Name}, {user.Email}");

            userManager2.UpdateUser(1, new UserData { Role = "admin" });
            user = userManager1.GetUser(1);
            Console.WriteLine($"Updated User #1: {user.Name}, {user.Email}, {user.Role}");
        }
    }

    // Main program, run the example
    class Program
    {
        static void Main(string[] args)
        {
            SingletonDemo.DemonstrateSingletons();
            Console.ReadLine();
        }
    }
}

using System;
using System.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
// Requires NuGet packages:
// Microsoft.Data.SqlClient
// Microsoft.Data.Sqlite
// MySql.Data
// Npgsql
// Dapper
// Microsoft.Extensions.Configuration.EnvironmentVariables (for .NET environment variables)

namespace RelationalDatabaseExamples
{
    /// <summary>
    /// Examples of working with relational databases in C#
    /// </summary>
    class Program
    {
        // Configuration for environment variables
        private static readonly EnvironmentVariableManager _env = new EnvironmentVariableManager();

        static async Task Main(string[] args)
        {
            Console.WriteLine("C# Relational Database Examples");
            Console.WriteLine("===============================");

            try
            {
                // SQLite example (works without additional setup)
                await SQLiteExample();
                
                // The following examples require database servers to be running
                // Uncomment them if you have the necessary databases set up
                
                // await SqlServerExample();
                // await MySqlExample();
                // await PostgreSqlExample();
                // await DapperExample();
                
                Console.WriteLine("\nAll examples completed successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }

        /// <summary>
        /// Example using SQLite
        /// </summary>
        static async Task SQLiteExample()
        {
            Console.WriteLine("\n=== SQLite Example ===");
            
            // Make sure you have the Microsoft.Data.Sqlite NuGet package installed
            var connectionString = _env.GetValue("SQLITE_CONNECTION_STRING", "Data Source=:memory:");
            
            using (var connection = new Microsoft.Data.Sqlite.SqliteConnection(connectionString))
            {
                await connection.OpenAsync();
                Console.WriteLine("Connected to SQLite database");
                
                // Create a table
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        CREATE TABLE Employees (
                            Id INTEGER PRIMARY KEY,
                            Name TEXT NOT NULL,
                            Department TEXT NOT NULL,
                            Salary REAL,
                            HireDate TEXT
                        )";
                    await command.ExecuteNonQueryAsync();
                    Console.WriteLine("Created Employees table");
                }
                
                // Insert data using parameters
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        INSERT INTO Employees (Name, Department, Salary, HireDate)
                        VALUES (@name, @department, @salary, @hireDate)";
                    
                    command.Parameters.AddWithValue("@name", "John Smith");
                    command.Parameters.AddWithValue("@department", "Engineering");
                    command.Parameters.AddWithValue("@salary", 85000.00);
                    command.Parameters.AddWithValue("@hireDate", DateTime.Now.ToString("yyyy-MM-dd"));
                    
                    await command.ExecuteNonQueryAsync();
                    Console.WriteLine("Inserted employee: John Smith");
                    
                    // Insert another employee
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@name", "Jane Doe");
                    command.Parameters.AddWithValue("@department", "Marketing");
                    command.Parameters.AddWithValue("@salary", 75000.00);
                    command.Parameters.AddWithValue("@hireDate", DateTime.Now.AddDays(-90).ToString("yyyy-MM-dd"));
                    
                    await command.ExecuteNonQueryAsync();
                    Console.WriteLine("Inserted employee: Jane Doe");
                    
                    // One more employee
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@name", "Bob Johnson");
                    command.Parameters.AddWithValue("@department", "Engineering");
                    command.Parameters.AddWithValue("@salary", 82000.00);
                    command.Parameters.AddWithValue("@hireDate", DateTime.Now.AddDays(-180).ToString("yyyy-MM-dd"));
                    
                    await command.ExecuteNonQueryAsync();
                    Console.WriteLine("Inserted employee: Bob Johnson");
                }
                
                // Query all employees
                Console.WriteLine("\nAll employees:");
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT Id, Name, Department, Salary FROM Employees";
                    
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            Console.WriteLine($"ID: {reader.GetInt32(0)}, Name: {reader.GetString(1)}, " +
                                              $"Department: {reader.GetString(2)}, Salary: ${reader.GetDouble(3):N2}");
                        }
                    }
                }
                
                // Filtered query with parameters
                Console.WriteLine("\nEngineering department employees:");
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT Name, Salary FROM Employees WHERE Department = @department";
                    command.Parameters.AddWithValue("@department", "Engineering");
                    
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            Console.WriteLine($"{reader.GetString(0)}: ${reader.GetDouble(1):N2}");
                        }
                    }
                }
                
                // Aggregate query
                Console.WriteLine("\nDepartment statistics:");
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        SELECT Department, 
                               COUNT(*) as EmployeeCount, 
                               AVG(Salary) as AvgSalary,
                               SUM(Salary) as TotalSalary
                        FROM Employees
                        GROUP BY Department";
                    
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            Console.WriteLine($"{reader.GetString(0)}: " +
                                             $"{reader.GetInt32(1)} employees, " +
                                             $"Avg: ${reader.GetDouble(2):N2}, " +
                                             $"Total: ${reader.GetDouble(3):N2}");
                        }
                    }
                }
                
                // Transaction example
                await using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // Update salary in a transaction
                        using (var command = connection.CreateCommand())
                        {
                            command.Transaction = transaction;
                            command.CommandText = "UPDATE Employees SET Salary = Salary * 1.1 WHERE Department = @department";
                            command.Parameters.AddWithValue("@department", "Engineering");
                            
                            var rowsAffected = await command.ExecuteNonQueryAsync();
                            Console.WriteLine($"\nGave 10% raise to {rowsAffected} engineering employees");
                        }
                        
                        // Verify the changes
                        using (var command = connection.CreateCommand())
                        {
                            command.Transaction = transaction;
                            command.CommandText = "SELECT Name, Salary FROM Employees WHERE Department = @department";
                            command.Parameters.AddWithValue("@department", "Engineering");
                            
                            Console.WriteLine("Updated engineering salaries:");
                            using (var reader = await command.ExecuteReaderAsync())
                            {
                                while (await reader.ReadAsync())
                                {
                                    Console.WriteLine($"{reader.GetString(0)}: ${reader.GetDouble(1):N2}");
                                }
                            }
                        }
                        
                        // Commit the transaction
                        await transaction.CommitAsync();
                        Console.WriteLine("Transaction committed");
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        Console.WriteLine($"Transaction rolled back: {ex.Message}");
                    }
                }
            }
        }
        
        /// <summary>
        /// Example using SQL Server
        /// </summary>
        static async Task SqlServerExample()
        {
            Console.WriteLine("\n=== SQL Server Example ===");
            Console.WriteLine("To run this example, you need SQL Server and the Microsoft.Data.SqlClient NuGet package.");
            
            // Connection string for SQL Server from environment variables
            var connectionString = _env.GetValue("SQLSERVER_CONNECTION_STRING", 
                "Server=localhost;Database=TestDB;Trusted_Connection=True;");
            
            Console.WriteLine($"Using connection info from environment: {GetSanitizedConnectionString(connectionString)}");
            
            using (var connection = new Microsoft.Data.SqlClient.SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                Console.WriteLine("Connected to SQL Server");
                
                // Create a table with SQL Server specific features
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
                        BEGIN
                            CREATE TABLE Products (
                                Id INT IDENTITY(1,1) PRIMARY KEY,
                                Name NVARCHAR(100) NOT NULL,
                                Description NVARCHAR(MAX),
                                Price DECIMAL(10,2) NOT NULL,
                                Category NVARCHAR(50),
                                CreatedAt DATETIME2 DEFAULT GETDATE(),
                                UpdatedAt DATETIME2,
                                IsActive BIT DEFAULT 1
                            );
                            
                            CREATE INDEX IX_Products_Category ON Products(Category);
                        END";
                    
                    await command.ExecuteNonQueryAsync();
                    Console.WriteLine("Created Products table");
                }
                
                // Insert with output parameter to get the identity value
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        INSERT INTO Products (Name, Description, Price, Category)
                        OUTPUT INSERTED.Id
                        VALUES (@name, @description, @price, @category)";
                    
                    command.Parameters.AddWithValue("@name", "Laptop");
                    command.Parameters.AddWithValue("@description", "High-performance laptop");
                    command.Parameters.AddWithValue("@price", 1299.99);
                    command.Parameters.AddWithValue("@category", "Electronics");
                    
                    var productId = (int)await command.ExecuteScalarAsync();
                    Console.WriteLine($"Inserted product with ID: {productId}");
                }
                
                // SQL Server specific features: CTE, ROW_NUMBER
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        WITH RankedProducts AS (
                            SELECT 
                                Name, 
                                Price, 
                                Category,
                                ROW_NUMBER() OVER (PARTITION BY Category ORDER BY Price DESC) AS PriceRank
                            FROM 
                                Products
                        )
                        SELECT Name, Price, Category, PriceRank
                        FROM RankedProducts
                        WHERE PriceRank <= 3";
                    
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        Console.WriteLine("\nTop 3 most expensive products per category:");
                        while (await reader.ReadAsync())
                        {
                            Console.WriteLine($"{reader.GetString(0)} - ${reader.GetDecimal(1):N2} - " +
                                             $"{reader.GetString(2)} (Rank: {reader.GetInt64(3)})");
                        }
                    }
                }
                
                // Using stored procedure
                using (var command = connection.CreateCommand())
                {
                    // First create the stored procedure
                    command.CommandText = @"
                        IF NOT EXISTS (SELECT * FROM sys.procedures WHERE name = 'GetProductsByCategory')
                        BEGIN
                            EXEC('
                                CREATE PROCEDURE GetProductsByCategory
                                    @CategoryName NVARCHAR(50),
                                    @MinPrice DECIMAL(10,2) = 0
                                AS
                                BEGIN
                                    SELECT Id, Name, Price
                                    FROM Products
                                    WHERE Category = @CategoryName
                                      AND Price >= @MinPrice
                                    ORDER BY Price DESC;
                                END
                            ')
                        END";
                    
                    await command.ExecuteNonQueryAsync();
                    Console.WriteLine("Created stored procedure");
                    
                    // Use the stored procedure
                    command.CommandText = "GetProductsByCategory";
                    command.CommandType = CommandType.StoredProcedure;
                    
                    command.Parameters.Clear();
                    command.Parameters.AddWithValue("@CategoryName", "Electronics");
                    command.Parameters.AddWithValue("@MinPrice", 500);
                    
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        Console.WriteLine("\nElectronics products over $500:");
                        while (await reader.ReadAsync())
                        {
                            Console.WriteLine($"ID: {reader.GetInt32(0)}, Name: {reader.GetString(1)}, " +
                                             $"Price: ${reader.GetDecimal(2):N2}");
                        }
                    }
                }
            }
        }
        
        /// <summary>
        /// Example using MySQL
        /// </summary>
        static async Task MySqlExample()
        {
            Console.WriteLine("\n=== MySQL Example ===");
            Console.WriteLine("To run this example, you need MySQL and the MySql.Data NuGet package.");
            
            // Connection string for MySQL from environment variables
            var connectionString = _env.GetValue("MYSQL_CONNECTION_STRING", 
                "Server=localhost;Database=testdb;Uid=root;Pwd=password;");
            
            Console.WriteLine($"Using connection info from environment: {GetSanitizedConnectionString(connectionString)}");
            
            using (var connection = new MySql.Data.MySqlClient.MySqlConnection(connectionString))
            {
                await connection.OpenAsync();
                Console.WriteLine("Connected to MySQL");
                
                // Create a table with MySQL specific features
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        CREATE TABLE IF NOT EXISTS Orders (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            customer_name VARCHAR(100) NOT NULL,
                            total DECIMAL(10,2) NOT NULL,
                            status ENUM('pending', 'shipped', 'delivered') NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            INDEX idx_status (status),
                            INDEX idx_created_at (created_at)
                        ) ENGINE=InnoDB";
                    
                    await command.ExecuteNonQueryAsync();
                    Console.WriteLine("Created Orders table");
                }
                
                // Insert with MySQL-specific AUTO_INCREMENT handling
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        INSERT INTO Orders (customer_name, total, status)
                        VALUES (@customerName, @total, @status)";
                    
                    command.Parameters.AddWithValue("@customerName", "John Doe");
                    command.Parameters.AddWithValue("@total", 123.45);
                    command.Parameters.AddWithValue("@status", "pending");
                    
                    await command.ExecuteNonQueryAsync();
                    Console.WriteLine($"Inserted order, ID: {command.LastInsertedId}");
                }
                
                // MySQL specific functions
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        SELECT 
                            id, 
                            customer_name,
                            total,
                            status,
                            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS formatted_date,
                            DATEDIFF(NOW(), created_at) AS days_since_creation
                        FROM 
                            Orders
                        WHERE 
                            created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)";
                    
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        Console.WriteLine("\nRecent orders:");
                        while (await reader.ReadAsync())
                        {
                            Console.WriteLine($"ID: {reader.GetInt32(0)}, " +
                                             $"Customer: {reader.GetString(1)}, " +
                                             $"Total: ${reader.GetDecimal(2):N2}, " +
                                             $"Status: {reader.GetString(3)}, " +
                                             $"Created: {reader.GetString(4)} " +
                                             $"({reader.GetInt32(5)} days ago)");
                        }
                    }
                }
            }
        }
        
        /// <summary>
        /// Example using PostgreSQL
        /// </summary>
        static async Task PostgreSqlExample()
        {
            Console.WriteLine("\n=== PostgreSQL Example ===");
            Console.WriteLine("To run this example, you need PostgreSQL and the Npgsql NuGet package.");
            
            // Connection string for PostgreSQL from environment variables
            var connectionString = _env.GetValue("POSTGRES_CONNECTION_STRING", 
                "Host=localhost;Database=testdb;Username=postgres;Password=password");
            
            Console.WriteLine($"Using connection info from environment: {GetSanitizedConnectionString(connectionString)}");
            
            using (var connection = new Npgsql.NpgsqlConnection(connectionString))
            {
                await connection.OpenAsync();
                Console.WriteLine("Connected to PostgreSQL");
                
                // Create a table with PostgreSQL-specific features
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        CREATE TABLE IF NOT EXISTS products (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            description TEXT,
                            price DECIMAL(10,2) NOT NULL,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            tags TEXT[],
                            metadata JSONB
                        )";
                    
                    await command.ExecuteNonQueryAsync();
                    Console.WriteLine("Created products table");
                }
                
                // Insert with PostgreSQL-specific data types
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        INSERT INTO products (name, description, price, tags, metadata)
                        VALUES (@name, @description, @price, @tags, @metadata)
                        RETURNING id";
                    
                    command.Parameters.AddWithValue("@name", "Laptop");
                    command.Parameters.AddWithValue("@description", "High-performance laptop");
                    command.Parameters.AddWithValue("@price", 999.99);
                    command.Parameters.AddWithValue("@tags", new string[] { "electronics", "computers" });
                    command.Parameters.AddWithValue("@metadata", "{""brand"": ""TechBrand"", ""warranty"": ""2 years"", ""specs"": {""cpu"": ""i7"", ""ram"": ""16GB""}}");
                    
                    var productId = (int)await command.ExecuteScalarAsync();
                    Console.WriteLine($"Inserted product with ID: {productId}");
                }
                
                // PostgreSQL-specific features: JSONB, arrays
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        SELECT 
                            name, 
                            price,
                            metadata->>'brand' AS brand,
                            metadata->'specs'->>'cpu' AS cpu,
                            array_length(tags, 1) AS tag_count,
                            extract(year from created_at) AS year
                        FROM 
                            products
                        WHERE 
                            'electronics' = ANY(tags)";
                    
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        Console.WriteLine("\nElectronics products:");
                        while (await reader.ReadAsync())
                        {
                            Console.WriteLine($"{reader.GetString(0)} - ${reader.GetDecimal(1):N2} - " +
                                             $"Brand: {reader.GetString(2)}, CPU: {reader.GetString(3)}, " +
                                             $"Tag count: {reader.GetInt32(4)}, Year: {reader.GetDouble(5)}");
                        }
                    }
                }
            }
        }
        
        /// <summary>
        /// Example using Dapper micro-ORM
        /// </summary>
        static async Task DapperExample()
        {
            Console.WriteLine("\n=== Dapper Example ===");
            Console.WriteLine("To run this example, you need the Dapper NuGet package and a database connection.");
            
            // Connection string from environment variables
            var connectionString = _env.GetValue("DAPPER_CONNECTION_STRING", "Data Source=:memory:");
            
            using (var connection = new Microsoft.Data.Sqlite.SqliteConnection(connectionString))
            {
                await connection.OpenAsync();
                Console.WriteLine("Connected to SQLite for Dapper example");
                
                // Set up database
                await connection.ExecuteAsync(@"
                    CREATE TABLE Customers (
                        Id INTEGER PRIMARY KEY,
                        Name TEXT NOT NULL,
                        Email TEXT NOT NULL
                    );
                    
                    CREATE TABLE Orders (
                        Id INTEGER PRIMARY KEY,
                        CustomerId INTEGER NOT NULL,
                        Amount REAL NOT NULL,
                        OrderDate TEXT NOT NULL,
                        FOREIGN KEY (CustomerId) REFERENCES Customers (Id)
                    );
                    
                    CREATE TABLE OrderItems (
                        Id INTEGER PRIMARY KEY,
                        OrderId INTEGER NOT NULL,
                        ProductName TEXT NOT NULL,
                        Quantity INTEGER NOT NULL,
                        UnitPrice REAL NOT NULL,
                        FOREIGN KEY (OrderId) REFERENCES Orders (Id)
                    );
                ");
                
                // Insert customers
                var customerIds = await connection.ExecuteAsync(@"
                    INSERT INTO Customers (Name, Email) VALUES 
                    (@Name, @Email)",
                    new[] {
                        new { Name = "Alice Smith", Email = "alice@example.com" },
                        new { Name = "Bob Jones", Email = "bob@example.com" }
                    });
                
                Console.WriteLine($"Inserted {customerIds} customers");
                
                // Insert orders
                var orderDate = DateTime.Now;
                var order1Id = await connection.QuerySingleAsync<int>(@"
                    INSERT INTO Orders (CustomerId, Amount, OrderDate)
                    VALUES (@CustomerId, @Amount, @OrderDate)
                    RETURNING Id",
                    new { CustomerId = 1, Amount = 125.50, OrderDate = orderDate.ToString("yyyy-MM-dd") });
                
                // Insert order items
                await connection.ExecuteAsync(@"
                    INSERT INTO OrderItems (OrderId, ProductName, Quantity, UnitPrice)
                    VALUES (@OrderId, @ProductName, @Quantity, @UnitPrice)",
                    new[] {
                        new { OrderId = order1Id, ProductName = "Keyboard", Quantity = 1, UnitPrice = 75.50 },
                        new { OrderId = order1Id, ProductName = "Mouse", Quantity = 1, UnitPrice = 50.00 }
                    });
                
                // Query with Dapper
                var customers = await connection.QueryAsync<Customer>("SELECT * FROM Customers");
                
                Console.WriteLine("\nAll customers:");
                foreach (var customer in customers)
                {
                    Console.WriteLine($"ID: {customer.Id}, Name: {customer.Name}, Email: {customer.Email}");
                }
                
                // Query with join and multi-mapping
                Console.WriteLine("\nOrders with customer info:");
                var orders = await connection.QueryAsync<Order, Customer, Order>(
                    @"SELECT o.Id, o.Amount, o.OrderDate, c.Id, c.Name, c.Email
                      FROM Orders o
                      JOIN Customers c ON o.CustomerId = c.Id",
                    (order, customer) => {
                        order.Customer = customer;
                        return order;
                    },
                    splitOn: "Id"
                );
                
                foreach (var order in orders)
                {
                    Console.WriteLine($"Order #{order.Id} - ${order.Amount:N2} on {order.OrderDate} " +
                                      $"by {order.Customer.Name} ({order.Customer.Email})");
                }
                
                // Query order details with complex mapping
                Console.WriteLine("\nOrder details:");
                var orderWithItems = await connection.QueryAsync<Order, OrderItem, Order>(
                    @"SELECT o.Id, o.Amount, o.OrderDate, i.Id, i.ProductName, i.Quantity, i.UnitPrice
                      FROM Orders o
                      JOIN OrderItems i ON o.Id = i.OrderId
                      WHERE o.Id = @OrderId",
                    (order, item) => {
                        if (order.Items == null)
                            order.Items = new List<OrderItem>();
                        order.Items.Add(item);
                        return order;
                    },
                    new { OrderId = order1Id },
                    splitOn: "Id"
                );
                
                var orderDetail = orderWithItems.GroupBy(o => o.Id).Select(g => {
                    var order = g.First();
                    order.Items = g.Select(o => o.Items.Single()).ToList();
                    return order;
                }).First();
                
                Console.WriteLine($"Order #{orderDetail.Id} - ${orderDetail.Amount:N2} on {orderDetail.OrderDate}");
                foreach (var item in orderDetail.Items)
                {
                    Console.WriteLine($"  {item.ProductName}: {item.Quantity} x ${item.UnitPrice:N2} = ${item.Quantity * item.UnitPrice:N2}");
                }
                
                // Execute scalar
                var totalSales = await connection.ExecuteScalarAsync<double>(
                    "SELECT SUM(Amount) FROM Orders");
                
                Console.WriteLine($"\nTotal sales: ${totalSales:N2}");
            }
        }
        
        /// <summary>
        /// Sanitizes a connection string by hiding the password
        /// </summary>
        private static string GetSanitizedConnectionString(string connectionString)
        {
            // Simple sanitization to hide password/credentials
            if (string.IsNullOrEmpty(connectionString))
                return connectionString;
            
            // Handle different formats for different database providers
            return connectionString
                .Replace(GetPasswordPart(connectionString, "Password="), "Password=*****")
                .Replace(GetPasswordPart(connectionString, "Pwd="), "Pwd=*****")
                .Replace(GetPasswordPart(connectionString, "password="), "password=*****");
        }
        
        private static string GetPasswordPart(string connectionString, string passwordPrefix)
        {
            int pwdIndex = connectionString.IndexOf(passwordPrefix, StringComparison.OrdinalIgnoreCase);
            if (pwdIndex < 0)
                return string.Empty;
            
            int startIndex = pwdIndex + passwordPrefix.Length;
            int endIndex = connectionString.IndexOf(';', startIndex);
            if (endIndex < 0)
                endIndex = connectionString.Length;
            
            return connectionString.Substring(pwdIndex, endIndex - pwdIndex);
        }
        
        // Model classes for Dapper example
        public class Customer
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public List<Order> Orders { get; set; }
        }
        
        public class Order
        {
            public int Id { get; set; }
            public int CustomerId { get; set; }
            public double Amount { get; set; }
            public string OrderDate { get; set; }
            public Customer Customer { get; set; }
            public List<OrderItem> Items { get; set; }
        }
        
        public class OrderItem
        {
            public int Id { get; set; }
            public int OrderId { get; set; }
            public string ProductName { get; set; }
            public int Quantity { get; set; }
            public double UnitPrice { get; set; }
        }
    }
    
    /// <summary>
    /// Helper class to manage environment variables with fallback values
    /// </summary>
    public class EnvironmentVariableManager
    {
        /// <summary>
        /// Gets a value from environment variables with a fallback default
        /// </summary>
        public string GetValue(string key, string defaultValue)
        {
            var value = Environment.GetEnvironmentVariable(key);
            return string.IsNullOrWhiteSpace(value) ? defaultValue : value;
        }
    }
}

// Extensions method for Dapper (to simulate Dapper behavior)
public static class DapperExtensions
{
    public static Task<int> ExecuteAsync(this IDbConnection connection, string sql, object param = null)
    {
        // Simplified for the example
        using (var command = connection.CreateCommand())
        {
            command.CommandText = sql;
            if (param is IEnumerable<object> enumerable)
            {
                int totalRows = 0;
                foreach (var p in enumerable)
                {
                    // This is highly simplified and doesn't handle parameters correctly
                    totalRows++;
                }
                return Task.FromResult(totalRows);
            }
            
            return Task.FromResult(command.ExecuteNonQuery());
        }
    }
    
    public static Task<T> QuerySingleAsync<T>(this IDbConnection connection, string sql, object param = null)
    {
        // Simplified for the example
        using (var command = connection.CreateCommand())
        {
            command.CommandText = sql;
            // This is highly simplified
            return Task.FromResult((T)(object)1);
        }
    }
    
    public static Task<IEnumerable<T>> QueryAsync<T>(this IDbConnection connection, string sql, object param = null)
    {
        // Simplified for the example
        if (typeof(T) == typeof(Customer))
        {
            var customers = new List<Customer>
            {
                new Customer { Id = 1, Name = "Alice Smith", Email = "alice@example.com" },
                new Customer { Id = 2, Name = "Bob Jones", Email = "bob@example.com" }
            };
            return Task.FromResult((IEnumerable<T>)(object)customers);
        }
        
        return Task.FromResult((IEnumerable<T>)new List<T>());
    }
    
    public static Task<IEnumerable<TResult>> QueryAsync<T1, T2, TResult>(
        this IDbConnection connection, 
        string sql, 
        Func<T1, T2, TResult> map, 
        object param = null, 
        string splitOn = "Id")
    {
        // Simplified for the example
        if (typeof(T1) == typeof(Order) && typeof(T2) == typeof(Customer))
        {
            var customer = new Customer { Id = 1, Name = "Alice Smith", Email = "alice@example.com" };
            var order = new Order { Id = 1, CustomerId = 1, Amount = 125.50, OrderDate = DateTime.Now.ToString("yyyy-MM-dd") };
            
            var result = new List<TResult>
            {
                map((T1)(object)order, (T2)(object)customer)
            };
            
            return Task.FromResult((IEnumerable<TResult>)result);
        }
        else if (typeof(T1) == typeof(Order) && typeof(T2) == typeof(OrderItem))
        {
            var order = new Order { Id = 1, CustomerId = 1, Amount = 125.50, OrderDate = DateTime.Now.ToString("yyyy-MM-dd") };
            var items = new List<OrderItem>
            {
                new OrderItem { Id = 1, OrderId = 1, ProductName = "Keyboard", Quantity = 1, UnitPrice = 75.50 },
                new OrderItem { Id = 2, OrderId = 1, ProductName = "Mouse", Quantity = 1, UnitPrice = 50.00 }
            };
            
            var result = new List<TResult>();
            foreach (var item in items)
            {
                result.Add(map((T1)(object)order, (T2)(object)item));
            }
            
            return Task.FromResult((IEnumerable<TResult>)result);
        }
        
        return Task.FromResult((IEnumerable<TResult>)new List<TResult>());
    }
    
    public static Task<T> ExecuteScalarAsync<T>(this IDbConnection connection, string sql, object param = null)
    {
        // Simplified for the example
        return Task.FromResult((T)(object)125.50);
    }
} 
#!/usr/bin/env python3
"""
SQL Examples for Relational Databases in Python

This file demonstrates using SQL with different database engines in Python.
It includes examples for SQLite, PostgreSQL, and MySQL.
"""

import sqlite3
import os
from datetime import datetime

# Try to import optional database libraries
try:
    import psycopg2
    POSTGRESQL_AVAILABLE = True
except ImportError:
    POSTGRESQL_AVAILABLE = False

try:
    import mysql.connector
    MYSQL_AVAILABLE = True
except ImportError:
    MYSQL_AVAILABLE = False

# Try to import dotenv for environment variables
try:
    from dotenv import load_dotenv
    DOTENV_AVAILABLE = True
    # Load environment variables from .env file
    load_dotenv()
except ImportError:
    DOTENV_AVAILABLE = False
    print("python-dotenv is not installed. Install it with: pip install python-dotenv")
    print("Continuing with default/example values for database credentials.")


# Function to get environment variables with fallback to default values
def get_env(key, default):
    """Get environment variable with a default fallback value"""
    return os.environ.get(key, default)


# ============= SQLite Examples =============

def sqlite_basic_example():
    """Basic SQLite database operations"""
    print("\n=== SQLite Basic Example ===")
    
    # Connect to SQLite database (creates file if it doesn't exist)
    db_path = get_env("SQLITE_DB_PATH", ":memory:")  # Default to in-memory database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create a table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        age INTEGER,
        created_at TEXT
    )
    ''')
    
    # Insert data
    users = [
        ('Alice', 'alice@example.com', 28, datetime.now().isoformat()),
        ('Bob', 'bob@example.com', 35, datetime.now().isoformat()),
        ('Charlie', 'charlie@example.com', 42, datetime.now().isoformat()),
    ]
    
    cursor.executemany(
        'INSERT INTO users (name, email, age, created_at) VALUES (?, ?, ?, ?)',
        users
    )
    
    # Commit the changes
    conn.commit()
    
    # Query the database
    print("All users:")
    cursor.execute('SELECT * FROM users')
    for row in cursor.fetchall():
        print(row)
    
    # Filtered query
    print("\nUsers older than 30:")
    cursor.execute('SELECT name, age FROM users WHERE age > ?', (30,))
    for name, age in cursor.fetchall():
        print(f"{name}: {age} years old")
    
    # Update data
    cursor.execute(
        'UPDATE users SET age = ? WHERE name = ?',
        (29, 'Alice')
    )
    conn.commit()
    
    # Delete data
    cursor.execute('DELETE FROM users WHERE name = ?', ('Charlie',))
    conn.commit()
    
    # Check the results
    print("\nAfter update and delete:")
    cursor.execute('SELECT * FROM users')
    for row in cursor.fetchall():
        print(row)
    
    # Close the connection
    conn.close()


def sqlite_advanced_example():
    """Advanced SQLite operations including JOINs, transactions, and more"""
    print("\n=== SQLite Advanced Example ===")
    
    # Connect to SQLite database
    db_path = get_env("SQLITE_DB_PATH", ":memory:")  # Default to in-memory database
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # Return rows as dictionary-like objects
    cursor = conn.cursor()
    
    # Create tables for a blog application
    cursor.executescript('''
    CREATE TABLE IF NOT EXISTS authors (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        published_at TEXT NOT NULL,
        FOREIGN KEY (author_id) REFERENCES authors (id),
        FOREIGN KEY (category_id) REFERENCES categories (id)
    );
    
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY,
        post_id INTEGER NOT NULL,
        author_name TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts (id)
    );
    ''')
    
    # Insert data using a transaction
    try:
        conn.execute('BEGIN TRANSACTION')
        
        # Insert authors
        cursor.executemany(
            'INSERT INTO authors (name, email) VALUES (?, ?)',
            [
                ('John Smith', 'john@example.com'),
                ('Jane Doe', 'jane@example.com')
            ]
        )
        
        # Insert categories
        cursor.executemany(
            'INSERT INTO categories (name) VALUES (?)',
            [('Technology',), ('Travel',), ('Food',)]
        )
        
        # Insert posts
        now = datetime.now().isoformat()
        cursor.executemany(
            'INSERT INTO posts (title, content, author_id, category_id, published_at) VALUES (?, ?, ?, ?, ?)',
            [
                ('Python Tips', 'Content about Python...', 1, 1, now),
                ('Trip to Paris', 'My journey to Paris...', 2, 2, now),
                ('Best Pizza Recipes', 'How to make pizza...', 1, 3, now)
            ]
        )
        
        # Insert comments
        cursor.executemany(
            'INSERT INTO comments (post_id, author_name, content, created_at) VALUES (?, ?, ?, ?)',
            [
                (1, 'Anonymous', 'Great tips!', now),
                (1, 'Coder123', 'I learned a lot!', now),
                (2, 'Traveler', 'Paris is amazing!', now)
            ]
        )
        
        conn.commit()
        print("Transaction committed successfully")
        
    except Exception as e:
        conn.rollback()
        print(f"Transaction failed: {e}")
    
    # Perform a JOIN query to get posts with author and category information
    print("\nPosts with author and category:")
    query = '''
    SELECT 
        p.title,
        a.name AS author,
        c.name AS category,
        p.published_at
    FROM 
        posts p
    JOIN 
        authors a ON p.author_id = a.id
    JOIN 
        categories c ON p.category_id = c.id
    ORDER BY 
        p.published_at DESC
    '''
    
    cursor.execute(query)
    for row in cursor:
        print(f"'{row['title']}' by {row['author']} in {row['category']} ({row['published_at']})")
    
    # Count comments per post
    print("\nComment count per post:")
    query = '''
    SELECT 
        p.title,
        COUNT(c.id) AS comment_count
    FROM 
        posts p
    LEFT JOIN 
        comments c ON p.id = c.post_id
    GROUP BY 
        p.id
    ORDER BY 
        comment_count DESC
    '''
    
    cursor.execute(query)
    for row in cursor:
        print(f"'{row['title']}': {row['comment_count']} comments")
    
    # Aggregate functions
    print("\nAuthor statistics:")
    query = '''
    SELECT 
        a.name,
        COUNT(p.id) AS post_count,
        COUNT(c.id) AS comment_count
    FROM 
        authors a
    LEFT JOIN 
        posts p ON a.id = p.author_id
    LEFT JOIN 
        comments c ON p.id = c.post_id
    GROUP BY 
        a.id
    '''
    
    cursor.execute(query)
    for row in cursor:
        print(f"{row['name']}: {row['post_count']} posts, {row['comment_count']} comments")
    
    # Using subqueries
    print("\nPosts with more than 1 comment:")
    query = '''
    SELECT 
        p.title,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
    FROM 
        posts p
    WHERE 
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) > 1
    '''
    
    cursor.execute(query)
    for row in cursor:
        print(f"'{row['title']}': {row['comment_count']} comments")
    
    # Close the connection
    conn.close()


# ============= PostgreSQL Examples =============

def postgresql_example():
    """PostgreSQL database operations"""
    if not POSTGRESQL_AVAILABLE:
        print("\n=== PostgreSQL Example ===")
        print("psycopg2 module is not installed. Install it with: pip install psycopg2-binary")
        return
    
    # This code won't run unless psycopg2 is installed
    print("\n=== PostgreSQL Example ===")
    print("To run this example, you need a PostgreSQL server, the psycopg2 module, and proper environment variables.")
    print("Normally, this would use credentials from .env. Sample code:")
    
    # Connection parameters from environment variables
    params = {
        'host': get_env('PG_HOST', 'localhost'),
        'database': get_env('PG_DATABASE', 'mydb'),
        'user': get_env('PG_USER', 'postgres'),
        'password': get_env('PG_PASSWORD', 'password')  # In real code, no default should be provided
    }
    
    print(f"Would connect to: {params['host']}/{params['database']} as {params['user']}")
    print("The actual implementation would execute:")
    
    """
    # Connect to PostgreSQL server
    conn = psycopg2.connect(**params)
    cursor = conn.cursor()
    
    # Create a table with PostgreSQL-specific features
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        tags TEXT[],
        metadata JSONB
    )
    ''')
    conn.commit()
    
    # Insert data with PostgreSQL-specific data types
    cursor.execute('''
    INSERT INTO products (name, description, price, tags, metadata)
    VALUES (%s, %s, %s, %s, %s)
    ''', (
        'Laptop',
        'High-performance laptop',
        999.99,
        ['electronics', 'computers'],
        {'brand': 'TechBrand', 'warranty': '2 years', 'specs': {'cpu': 'i7', 'ram': '16GB'}}
    ))
    conn.commit()
    
    # Query with PostgreSQL-specific features
    cursor.execute('''
    SELECT 
        name, 
        price,
        metadata->>'brand' AS brand,
        metadata->'specs'->>'cpu' AS cpu
    FROM 
        products
    WHERE 
        'electronics' = ANY(tags)
    ''')
    
    for row in cursor.fetchall():
        print(row)
    
    # Using PostgreSQL-specific functions
    cursor.execute('''
    SELECT 
        name,
        price,
        extract(year from created_at) AS year,
        array_length(tags, 1) AS tag_count
    FROM 
        products
    ''')
    
    for row in cursor.fetchall():
        print(row)
    
    conn.close()
    """


# ============= MySQL Examples =============

def mysql_example():
    """MySQL database operations"""
    if not MYSQL_AVAILABLE:
        print("\n=== MySQL Example ===")
        print("mysql-connector-python module is not installed. Install it with: pip install mysql-connector-python")
        return
    
    # This code won't run unless mysql-connector is installed
    print("\n=== MySQL Example ===")
    print("To run this example, you need a MySQL server, the mysql-connector-python module, and proper environment variables.")
    print("Normally, this would use credentials from .env. Sample code:")
    
    # Connection parameters from environment variables
    config = {
        'host': get_env('MYSQL_HOST', 'localhost'),
        'database': get_env('MYSQL_DATABASE', 'mydb'),
        'user': get_env('MYSQL_USER', 'root'),
        'password': get_env('MYSQL_PASSWORD', 'password')  # In real code, no default should be provided
    }
    
    print(f"Would connect to: {config['host']}/{config['database']} as {config['user']}")
    print("The actual implementation would execute:")
    
    """
    # Connect to MySQL server
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    
    # Create a table with MySQL-specific features
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'shipped', 'delivered') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB
    ''')
    conn.commit()
    
    # Insert data
    cursor.execute('''
    INSERT INTO orders (customer_name, total, status)
    VALUES (%s, %s, %s)
    ''', ('John Doe', 123.45, 'pending'))
    
    last_id = cursor.lastrowid
    print(f"Inserted order with ID: {last_id}")
    conn.commit()
    
    # MySQL-specific date functions
    cursor.execute('''
    SELECT 
        id, 
        customer_name,
        total,
        status,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS formatted_date,
        DATEDIFF(NOW(), created_at) AS days_since_creation
    FROM 
        orders
    WHERE 
        created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
    ''')
    
    for row in cursor:
        print(row)
    
    conn.close()
    """


# ============= ORM Example with SQLAlchemy =============

def sqlalchemy_example():
    """Example of using SQLAlchemy ORM"""
    try:
        from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, func
        from sqlalchemy.ext.declarative import declarative_base
        from sqlalchemy.orm import sessionmaker, relationship
    except ImportError:
        print("\n=== SQLAlchemy ORM Example ===")
        print("SQLAlchemy is not installed. Install it with: pip install sqlalchemy")
        return
    
    print("\n=== SQLAlchemy ORM Example ===")
    
    # Database URL from environment variables
    # Example: postgresql://user:password@localhost/dbname
    db_url = get_env('SQLALCHEMY_DATABASE_URL', 'sqlite:///:memory:')
    print(f"Using database URL: {db_url}")
    
    # Create engine and base
    engine = create_engine(db_url)
    Base = declarative_base()
    
    # Define models
    class Customer(Base):
        __tablename__ = 'customers'
        
        id = Column(Integer, primary_key=True)
        name = Column(String(100), nullable=False)
        email = Column(String(100), unique=True, nullable=False)
        
        # Relationship
        orders = relationship("Order", back_populates="customer")
        
        def __repr__(self):
            return f"<Customer(name='{self.name}', email='{self.email}')>"
    
    class Product(Base):
        __tablename__ = 'products'
        
        id = Column(Integer, primary_key=True)
        name = Column(String(100), nullable=False)
        price = Column(Float, nullable=False)
        
        # Relationship
        order_items = relationship("OrderItem", back_populates="product")
        
        def __repr__(self):
            return f"<Product(name='{self.name}', price={self.price})>"
    
    class Order(Base):
        __tablename__ = 'orders'
        
        id = Column(Integer, primary_key=True)
        customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
        created_at = Column(DateTime, default=datetime.now)
        
        # Relationships
        customer = relationship("Customer", back_populates="orders")
        items = relationship("OrderItem", back_populates="order")
        
        def __repr__(self):
            return f"<Order(id={self.id}, customer_id={self.customer_id})>"
    
    class OrderItem(Base):
        __tablename__ = 'order_items'
        
        id = Column(Integer, primary_key=True)
        order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
        product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
        quantity = Column(Integer, default=1)
        
        # Relationships
        order = relationship("Order", back_populates="items")
        product = relationship("Product", back_populates="order_items")
        
        def __repr__(self):
            return f"<OrderItem(order_id={self.order_id}, product_id={self.product_id}, quantity={self.quantity})>"
    
    # Create tables
    Base.metadata.create_all(engine)
    
    # Create session
    Session = sessionmaker(bind=engine)
    session = Session()
    
    # Add data
    try:
        # Add customers
        customer1 = Customer(name="Alice Smith", email="alice@example.com")
        customer2 = Customer(name="Bob Johnson", email="bob@example.com")
        session.add_all([customer1, customer2])
        
        # Add products
        product1 = Product(name="Laptop", price=999.99)
        product2 = Product(name="Smartphone", price=499.99)
        product3 = Product(name="Headphones", price=99.99)
        session.add_all([product1, product2, product3])
        
        # Commit to get IDs
        session.commit()
        
        # Create orders
        order1 = Order(customer_id=customer1.id)
        session.add(order1)
        session.commit()
        
        # Add items to order
        item1 = OrderItem(order_id=order1.id, product_id=product1.id, quantity=1)
        item2 = OrderItem(order_id=order1.id, product_id=product3.id, quantity=2)
        session.add_all([item1, item2])
        
        order2 = Order(customer_id=customer2.id)
        session.add(order2)
        session.commit()
        
        item3 = OrderItem(order_id=order2.id, product_id=product2.id, quantity=1)
        session.add(item3)
        
        session.commit()
        
        print("Data inserted successfully")
        
    except Exception as e:
        session.rollback()
        print(f"Error: {e}")
    
    # Query with ORM
    print("\nAll customers:")
    customers = session.query(Customer).all()
    for customer in customers:
        print(customer)
    
    print("\nAll products:")
    products = session.query(Product).all()
    for product in products:
        print(product)
    
    print("\nOrders with customer info:")
    orders = session.query(Order, Customer.name).join(Customer).all()
    for order, customer_name in orders:
        print(f"Order {order.id} by {customer_name}")
    
    print("\nOrder details:")
    order_details = session.query(
        Order.id.label('order_id'),
        Customer.name.label('customer'),
        Product.name.label('product'),
        OrderItem.quantity,
        (Product.price * OrderItem.quantity).label('subtotal')
    ).join(Customer).join(OrderItem).join(Product).all()
    
    for detail in order_details:
        print(f"Order #{detail.order_id}: {detail.customer} ordered {detail.quantity}x {detail.product} (${detail.subtotal:.2f})")
    
    print("\nOrder totals:")
    order_totals = session.query(
        Order.id,
        func.sum(Product.price * OrderItem.quantity).label('total')
    ).join(OrderItem).join(Product).group_by(Order.id).all()
    
    for order_id, total in order_totals:
        print(f"Order #{order_id} total: ${total:.2f}")
    
    # Close session
    session.close()


if __name__ == "__main__":
    # SQLite examples
    sqlite_basic_example()
    sqlite_advanced_example()
    
    # PostgreSQL example (requires psycopg2)
    postgresql_example()
    
    # MySQL example (requires mysql-connector-python)
    mysql_example()
    
    # SQLAlchemy ORM example (requires sqlalchemy)
    sqlalchemy_example() 
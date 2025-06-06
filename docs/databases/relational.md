---
author: Tech Notes Hub
tags: 'learning, technology, programming'
update: '2025-06-06'
date: '2025-06-06'
title: Relational
description: Guide about Relational
---
# Relational Databases

Relational databases are organized collections of data that store information in tables with rows and columns. They follow the relational model proposed by Edgar F. Codd in 1970, which emphasizes relationships between data entities.

## Core Concepts

### Tables (Relations)

The fundamental structure in relational databases:
- Each **table** represents an entity type (e.g., customers, products)
- Each **row** (tuple) represents an instance of that entity
- Each **column** (attribute) represents a property of that entity

### Keys

Keys establish relationships and ensure data integrity:

- **Primary Key**: Uniquely identifies each record in a table
- **Foreign Key**: References a primary key in another table, establishing relationships
- **Composite Key**: Combines multiple columns to form a unique identifier
- **Candidate Key**: A column or set of columns that could serve as a primary key

### Schema

A schema defines the structure of the database:
- Table definitions
- Column data types and constraints
- Relationships between tables

## SQL (Structured Query Language)

SQL is the standard language for interacting with relational databases.

### Basic SQL Commands

```sql
-- Create a table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    signup_date DATE
);

-- Insert data
INSERT INTO customers (customer_id, name, email, signup_date)
VALUES (1, 'John Smith', 'john@example.com', '2023-01-15');

-- Query data
SELECT * FROM customers WHERE signup_date > '2023-01-01';

-- Update data
UPDATE customers SET email = 'john.smith@example.com' WHERE customer_id = 1;

-- Delete data
DELETE FROM customers WHERE customer_id = 1;
```

## Normalization

Normalization is the process of organizing data to reduce redundancy and improve data integrity:

- **First Normal Form (1NF)**: Eliminate duplicate columns and create separate tables for related data
- **Second Normal Form (2NF)**: Meet 1NF requirements and remove partial dependencies
- **Third Normal Form (3NF)**: Meet 2NF requirements and remove transitive dependencies

## ACID Properties

Transactions in relational databases follow ACID properties:

- **Atomicity**: Transactions are all-or-nothing operations
- **Consistency**: Transactions bring the database from one valid state to another
- **Isolation**: Concurrent transactions don't interfere with each other
- **Durability**: Completed transactions persist even in case of system failure

## Popular Relational Database Systems

- **MySQL**: Open-source, widely used for web applications
- **PostgreSQL**: Advanced open-source database with extensive features
- **Oracle Database**: Enterprise-level commercial database
- **Microsoft SQL Server**: Microsoft's commercial database solution
- **SQLite**: Lightweight, serverless database engine

## Indexes

Indexes speed up data retrieval operations:
- Similar to a book index
- Improves query performance but adds overhead for write operations
- Types include B-tree, hash, and bitmap indexes

## Joins

Joins combine records from two or more tables:
- **INNER JOIN**: Returns records with matching values in both tables
- **LEFT JOIN**: Returns all records from the left table and matching records from the right
- **RIGHT JOIN**: Returns all records from the right table and matching records from the left
- **FULL JOIN**: Returns all records when there's a match in either table

```sql
SELECT customers.name, orders.order_date
FROM customers
INNER JOIN orders ON customers.customer_id = orders.customer_id;
```

## When to Use Relational Databases

Relational databases are ideal for:
- Structured data with clear relationships
- Applications requiring complex queries and transactions
- Systems where data integrity is critical
- Scenarios where consistency is more important than speed

## References

- Codd, E.F. (1970). "A Relational Model of Data for Large Shared Data Banks"
- Date, C.J. "An Introduction to Database Systems"
- Garcia-Molina, H., Ullman, J.D., & Widom, J. "Database Systems: The Complete Book" 

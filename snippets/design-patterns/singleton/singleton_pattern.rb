#!/usr/bin/env ruby

# Singleton Pattern Implementation in Ruby
#
# The Singleton Pattern is a creational design pattern that ensures a class has only one instance
# and provides a global point of access to it. This is useful when exactly one object is needed
# to coordinate actions across the system.
#
# This file demonstrates several ways to implement the Singleton pattern in Ruby.

require 'singleton'
require 'time'

# ========== Classic Singleton Implementation ==========

# Classic Singleton implementation using Ruby's built-in Singleton module
class ClassicSingleton
  include Singleton

  attr_reader :timestamp

  def initialize
    @timestamp = Time.now
    @config = {
      'api_url' => 'https://api.example.com',
      'timeout' => 3000,
      'retries' => 3
    }
  end

  def get_config
    @config.clone
  end

  def update_config(key, value)
    @config[key] = value
    puts "Configuration updated: #{key} = #{value}"
  end
end

# ========== Thread-Safe Singleton Implementation ==========

# Thread-safe Singleton implementation using a mutex for synchronization
class ThreadSafeSingleton
  # Class variable to store the singleton instance
  @@instance = nil
  @@mutex = Mutex.new

  # Private class method to create the instance
  def self.instance
    return @@instance if @@instance

    @@mutex.synchronize do
      # Check again in case another thread created the instance while we were waiting
      @@instance ||= new
    end

    @@instance
  end

  # Make new and clone private to prevent creating new instances
  private_class_method :new
  private :clone

  attr_reader :connection_count, :connected
  alias_method :connected?, :connected

  def initialize
    @connection_count = 0
    @connected = false
    @connection_string = ''
  end

  def connect(connection_string)
    if @connected
      @connection_count += 1
      puts "Already connected to database. Connection count: #{@connection_count}"
      return true
    end

    # Simulate connection
    @connection_string = connection_string
    @connected = true
    @connection_count = 1
    puts "Connected to database: #{connection_string}"
    true
  end

  def disconnect
    unless @connected
      puts "Not connected to any database."
      return false
    end

    @connection_count -= 1
    if @connection_count == 0
      @connected = false
      puts "Disconnected from database: #{@connection_string}"
    else
      puts "Connection count decreased. Remaining connections: #{@connection_count}"
    end

    true
  end
end

# ========== Logger Singleton ==========

# Logger Singleton implementation
class Logger
  # Class variable to store the singleton instance
  @@instance = nil

  # Class method to access the singleton instance
  def self.instance
    @@instance ||= new
  end

  # Make new private to prevent creating new instances
  private_class_method :new

  def initialize
    @logs = []
  end

  def log(message)
    timestamp = Time.now.strftime("%Y-%m-%d %H:%M:%S")
    log_entry = "#{timestamp}: #{message}"
    @logs << log_entry
    puts log_entry
    log_entry
  end

  def warn(message)
    log("WARNING: #{message}")
  end

  def error(message)
    log("ERROR: #{message}")
  end

  def get_logs
    @logs.clone
  end

  def clear_logs
    @logs = []
    puts "Logs cleared"
    "Logs cleared"
  end
end

# ========== Configuration Manager Singleton ==========

# Configuration Manager Singleton implementation
class ConfigManager
  # Class variable to store the singleton instance
  @@instance = nil

  # Class method to access the singleton instance
  def self.instance
    @@instance ||= new
  end

  # Make new private to prevent creating new instances
  private_class_method :new

  def initialize
    @config = {
      'theme' => 'light',
      'language' => 'en',
      'notifications' => true,
      'auto_save' => true
    }
  end

  def get_config
    @config.clone
  end

  def set_config(key, value)
    @config[key] = value
    puts "Configuration updated: #{key} = #{value}"
    @config
  end

  def reset_config
    @config = {
      'theme' => 'light',
      'language' => 'en',
      'notifications' => true,
      'auto_save' => true
    }
    puts "Configuration reset to defaults"
    @config
  end
end

# ========== User Manager Singleton ==========

# User Manager Singleton implementation
class UserManager
  # Class variable to store the singleton instance
  @@instance = nil
  @@mutex = Mutex.new

  # Class method to access the singleton instance
  def self.instance
    return @@instance if @@instance

    @@mutex.synchronize do
      @@instance ||= new
    end

    @@instance
  end

  # Make new private to prevent creating new instances
  private_class_method :new

  def initialize
    @users = {}
  end

  def add_user(id, user_data)
    @@mutex.synchronize do
      if @users.key?(id)
        raise "User with ID #{id} already exists"
      end

      @users[id] = user_data.merge({
        'created_at' => Time.now
      })

      true
    end
  end

  def get_user(id)
    @@mutex.synchronize do
      return nil unless @users.key?(id)
      @users[id].clone
    end
  end

  def update_user(id, user_data)
    @@mutex.synchronize do
      unless @users.key?(id)
        raise "User with ID #{id} does not exist"
      end

      @users[id] = @users[id].merge(user_data).merge({
        'updated_at' => Time.now
      })

      true
    end
  end

  def delete_user(id)
    @@mutex.synchronize do
      unless @users.key?(id)
        raise "User with ID #{id} does not exist"
      end

      @users.delete(id)
      true
    end
  end

  def get_all_users
    @@mutex.synchronize do
      result = []
      @users.each do |id, user_data|
        result << { 'id' => id }.merge(user_data)
      end
      result
    end
  end

  def user_count
    @@mutex.synchronize do
      @users.size
    end
  end
end

# ========== Demo Code ==========

def demonstrate_singletons
  puts "===== Classic Singleton Demo ====="
  singleton1 = ClassicSingleton.instance
  singleton2 = ClassicSingleton.instance

  puts "Are instances the same? #{singleton1.equal?(singleton2) ? 'Yes' : 'No'}"
  puts "Instance timestamp: #{singleton1.timestamp}"

  config = singleton1.get_config
  puts "Original config: api_url = #{config['api_url']}"

  singleton2.update_config('timeout', 5000)
  config = singleton1.get_config
  puts "Updated config from singleton1: timeout = #{config['timeout']}"

  puts "\n===== Thread-Safe Singleton Demo ====="
  db1 = ThreadSafeSingleton.instance
  db2 = ThreadSafeSingleton.instance

  puts "Are instances the same? #{db1.equal?(db2) ? 'Yes' : 'No'}"

  db1.connect("mysql://localhost:3306/mydb")
  db2.connect("mysql://localhost:3306/mydb")
  puts "Connection count: #{db1.connection_count}"

  db1.disconnect
  puts "Still connected? #{db2.connected? ? 'Yes' : 'No'}"

  puts "\n===== Logger Singleton Demo ====="
  logger1 = Logger.instance
  logger2 = Logger.instance

  puts "Are instances the same? #{logger1.equal?(logger2) ? 'Yes' : 'No'}"

  logger1.log("Application started")
  logger1.warn("Resource usage is high")
  logger2.error("Failed to connect to service")

  logs = logger2.get_logs
  puts "Log entries: #{logs.size}"

  puts "\n===== Config Manager Singleton Demo ====="
  config1 = ConfigManager.instance
  config2 = ConfigManager.instance

  puts "Are instances the same? #{config1.equal?(config2) ? 'Yes' : 'No'}"

  config_settings = config1.get_config
  puts "Config value: theme = #{config_settings['theme']}"

  config2.set_config('theme', 'dark')
  config_settings = config1.get_config
  puts "Updated config from config1: theme = #{config_settings['theme']}"

  puts "\n===== User Manager Singleton Demo ====="
  user_manager1 = UserManager.instance
  user_manager2 = UserManager.instance

  puts "Are instances the same? #{user_manager1.equal?(user_manager2) ? 'Yes' : 'No'}"

  user_manager1.add_user(1, { 'name' => 'Alice', 'email' => 'alice@example.com' })
  user_manager1.add_user(2, { 'name' => 'Bob', 'email' => 'bob@example.com' })

  puts "User count: #{user_manager2.user_count}"

  user = user_manager2.get_user(1)
  puts "User #1: #{user['name']}, #{user['email']}"

  user_manager2.update_user(1, { 'role' => 'admin' })
  user = user_manager1.get_user(1)
  puts "Updated User #1: #{user['name']}, #{user['email']}, #{user['role']}"
end

# Run the demo
demonstrate_singletons

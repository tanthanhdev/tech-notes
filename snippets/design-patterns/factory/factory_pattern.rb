#!/usr/bin/env ruby

# Factory Pattern Implementation in Ruby
#
# The Factory Pattern is a creational design pattern that provides an interface for creating
# objects in a superclass, but allows subclasses to alter the type of objects that will be created.
#
# This example demonstrates a Vehicle Factory that can create different types of vehicles
# (Car, Motorcycle, Truck) based on the client's requirements.

# Abstract Product - Vehicle
class Vehicle
  attr_reader :make, :model, :year

  def initialize(make, model, year)
    @make = make
    @model = model
    @year = year
  end

  def get_info
    "#{@year} #{@make} #{@model}"
  end

  def start
    "#{get_info} is starting..."
  end

  def stop
    "#{get_info} is stopping..."
  end
end

# Concrete Products
class Car < Vehicle
  attr_reader :doors

  def initialize(make, model, year, doors = 4)
    super(make, model, year)
    @doors = doors
  end

  def get_info
    "#{super} (#{@doors}-door car)"
  end

  def drive
    "#{get_info} is driving on the road."
  end
end

class Motorcycle < Vehicle
  attr_reader :engine_size

  def initialize(make, model, year, engine_size)
    super(make, model, year)
    @engine_size = engine_size
  end

  def get_info
    "#{super} (#{@engine_size}cc motorcycle)"
  end

  def ride
    "#{get_info} is riding at high speed."
  end
end

class Truck < Vehicle
  attr_reader :capacity

  def initialize(make, model, year, capacity)
    super(make, model, year)
    @capacity = capacity
  end

  def get_info
    "#{super} (#{@capacity} ton truck)"
  end

  def haul
    "#{get_info} is hauling cargo."
  end
end

# Simple Factory
class VehicleFactory
  CAR = 'car'
  MOTORCYCLE = 'motorcycle'
  TRUCK = 'truck'

  def self.create_vehicle(type, make, model, year, options = {})
    case type.downcase
    when CAR
      doors = options[:doors] || 4
      Car.new(make, model, year, doors)
    when MOTORCYCLE
      engine_size = options[:engine_size] || 250
      Motorcycle.new(make, model, year, engine_size)
    when TRUCK
      capacity = options[:capacity] || 5.0
      Truck.new(make, model, year, capacity)
    else
      raise "Vehicle type #{type} is not supported."
    end
  end
end

# Factory Method Pattern Implementation
class VehicleFactoryMethod
  def create_vehicle(make, model, year, options = {})
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end

  def register_vehicle(make, model, year, options = {})
    # Common operations for all vehicles
    vehicle = create_vehicle(make, model, year, options)
    puts "Registering #{vehicle.get_info}"
    puts "Assigning license plate"
    vehicle
  end
end

# Concrete Factories
class CarFactory < VehicleFactoryMethod
  def create_vehicle(make, model, year, options = {})
    doors = options[:doors] || 4
    Car.new(make, model, year, doors)
  end
end

class MotorcycleFactory < VehicleFactoryMethod
  def create_vehicle(make, model, year, options = {})
    engine_size = options[:engine_size] || 250
    Motorcycle.new(make, model, year, engine_size)
  end
end

class TruckFactory < VehicleFactoryMethod
  def create_vehicle(make, model, year, options = {})
    capacity = options[:capacity] || 5.0
    Truck.new(make, model, year, capacity)
  end
end

# Abstract Factory Pattern Implementation
# Parts
class Engine
  attr_reader :type, :horsepower

  def initialize(type, horsepower)
    @type = type
    @horsepower = horsepower
  end

  def get_specs
    "#{@type} engine with #{@horsepower}hp"
  end
end

class Transmission
  attr_reader :type, :gears

  def initialize(type, gears)
    @type = type
    @gears = gears
  end

  def get_specs
    "#{@type} transmission with #{@gears} gears"
  end
end

class Chassis
  attr_reader :material, :weight

  def initialize(material, weight)
    @material = material
    @weight = weight
  end

  def get_specs
    "#{@material} chassis weighing #{@weight}kg"
  end
end

# Abstract Factory
class VehiclePartsFactory
  def create_engine
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end

  def create_transmission
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end

  def create_chassis
    raise NotImplementedError, "#{self.class} has not implemented method '#{__method__}'"
  end
end

# Concrete Abstract Factories
class SportVehiclePartsFactory < VehiclePartsFactory
  def create_engine
    Engine.new("V8", 450)
  end

  def create_transmission
    Transmission.new("Manual", 6)
  end

  def create_chassis
    Chassis.new("Carbon Fiber", 120)
  end
end

class EconomyVehiclePartsFactory < VehiclePartsFactory
  def create_engine
    Engine.new("Inline-4", 180)
  end

  def create_transmission
    Transmission.new("Automatic", 5)
  end

  def create_chassis
    Chassis.new("Steel", 300)
  end
end

class HeavyDutyVehiclePartsFactory < VehiclePartsFactory
  def create_engine
    Engine.new("Diesel V6", 350)
  end

  def create_transmission
    Transmission.new("Manual", 8)
  end

  def create_chassis
    Chassis.new("Reinforced Steel", 800)
  end
end

# Vehicle Assembler - Uses the Abstract Factory
class VehicleAssembler
  def initialize(parts_factory)
    @parts_factory = parts_factory
  end

  def assemble_vehicle
    engine = @parts_factory.create_engine
    transmission = @parts_factory.create_transmission
    chassis = @parts_factory.create_chassis

    puts "Assembling vehicle with:"
    puts "- #{engine.get_specs}"
    puts "- #{transmission.get_specs}"
    puts "- #{chassis.get_specs}"
  end
end

# Client code demonstration
def client_code
  puts "===== Simple Factory Pattern ====="

  car = VehicleFactory.create_vehicle(VehicleFactory::CAR, "Toyota", "Camry", 2023, { doors: 4 })
  motorcycle = VehicleFactory.create_vehicle(VehicleFactory::MOTORCYCLE, "Honda", "CBR", 2023, { engine_size: 600 })
  truck = VehicleFactory.create_vehicle(VehicleFactory::TRUCK, "Ford", "F-150", 2023, { capacity: 3.0 })

  puts car.get_info
  puts car.drive

  puts motorcycle.get_info
  puts motorcycle.ride

  puts truck.get_info
  puts truck.haul

  puts "\n===== Factory Method Pattern ====="

  car_factory = CarFactory.new
  motorcycle_factory = MotorcycleFactory.new
  truck_factory = TruckFactory.new

  new_car = car_factory.register_vehicle("BMW", "3 Series", 2023, { doors: 2 })
  new_motorcycle = motorcycle_factory.register_vehicle("Ducati", "Monster", 2023, { engine_size: 821 })
  new_truck = truck_factory.register_vehicle("Volvo", "VNL", 2023, { capacity: 20.0 })

  puts new_car.drive
  puts new_motorcycle.ride
  puts new_truck.haul

  puts "\n===== Abstract Factory Pattern ====="

  puts "Building a sports car:"
  sport_car_assembler = VehicleAssembler.new(SportVehiclePartsFactory.new)
  sport_car_assembler.assemble_vehicle

  puts "\nBuilding an economy car:"
  economy_car_assembler = VehicleAssembler.new(EconomyVehiclePartsFactory.new)
  economy_car_assembler.assemble_vehicle

  puts "\nBuilding a heavy duty truck:"
  heavy_duty_truck_assembler = VehicleAssembler.new(HeavyDutyVehiclePartsFactory.new)
  heavy_duty_truck_assembler.assemble_vehicle
end

# Run the example
client_code

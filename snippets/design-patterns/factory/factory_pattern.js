/**
 * Factory Pattern Implementation in JavaScript
 *
 * The Factory Pattern is a creational design pattern that provides an interface for creating
 * objects in a superclass, but allows subclasses to alter the type of objects that will be created.
 *
 * This example demonstrates a Vehicle Factory that can create different types of vehicles
 * (Car, Motorcycle, Truck) based on the client's requirements.
 */

// Abstract Product - Vehicle
class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }

  getInfo() {
    return `${this.year} ${this.make} ${this.model}`;
  }

  start() {
    return `${this.getInfo()} is starting...`;
  }

  stop() {
    return `${this.getInfo()} is stopping...`;
  }
}

// Concrete Products
class Car extends Vehicle {
  constructor(make, model, year, doors = 4) {
    super(make, model, year);
    this.doors = doors;
    this.type = 'Car';
  }

  getInfo() {
    return `${super.getInfo()} (${this.doors}-door car)`;
  }

  drive() {
    return `${this.getInfo()} is driving on the road.`;
  }
}

class Motorcycle extends Vehicle {
  constructor(make, model, year, engineSize) {
    super(make, model, year);
    this.engineSize = engineSize;
    this.type = 'Motorcycle';
  }

  getInfo() {
    return `${super.getInfo()} (${this.engineSize}cc motorcycle)`;
  }

  ride() {
    return `${this.getInfo()} is riding at high speed.`;
  }
}

class Truck extends Vehicle {
  constructor(make, model, year, capacity) {
    super(make, model, year);
    this.capacity = capacity;
    this.type = 'Truck';
  }

  getInfo() {
    return `${super.getInfo()} (${this.capacity} ton truck)`;
  }

  haul() {
    return `${this.getInfo()} is hauling cargo.`;
  }
}

// Simple Factory
class VehicleFactory {
  static createVehicle(type, make, model, year, options = {}) {
    switch (type.toLowerCase()) {
      case 'car':
        return new Car(make, model, year, options.doors);
      case 'motorcycle':
        return new Motorcycle(make, model, year, options.engineSize);
      case 'truck':
        return new Truck(make, model, year, options.capacity);
      default:
        throw new Error(`Vehicle type ${type} is not supported.`);
    }
  }
}

// Factory Method Pattern Implementation
class VehicleFactoryMethod {
  createVehicle(make, model, year, options = {}) {
    // This method will be implemented by concrete factories
    throw new Error('createVehicle method must be implemented by subclasses');
  }

  registerVehicle(make, model, year, options = {}) {
    // Common operations for all vehicles
    const vehicle = this.createVehicle(make, model, year, options);
    console.log(`Registering ${vehicle.getInfo()}`);
    console.log(`Assigning license plate to ${vehicle.type}`);
    return vehicle;
  }
}

// Concrete Factories
class CarFactory extends VehicleFactoryMethod {
  createVehicle(make, model, year, options = {}) {
    return new Car(make, model, year, options.doors || 4);
  }
}

class MotorcycleFactory extends VehicleFactoryMethod {
  createVehicle(make, model, year, options = {}) {
    return new Motorcycle(make, model, year, options.engineSize || 250);
  }
}

class TruckFactory extends VehicleFactoryMethod {
  createVehicle(make, model, year, options = {}) {
    return new Truck(make, model, year, options.capacity || 5);
  }
}

// Abstract Factory Pattern Implementation
class VehiclePartsFactory {
  createEngine() {
    throw new Error('Method not implemented');
  }

  createTransmission() {
    throw new Error('Method not implemented');
  }

  createChassis() {
    throw new Error('Method not implemented');
  }
}

// Parts
class Engine {
  constructor(type, horsepower) {
    this.type = type;
    this.horsepower = horsepower;
  }

  getSpecs() {
    return `${this.type} engine with ${this.horsepower}hp`;
  }
}

class Transmission {
  constructor(type, gears) {
    this.type = type;
    this.gears = gears;
  }

  getSpecs() {
    return `${this.type} transmission with ${this.gears} gears`;
  }
}

class Chassis {
  constructor(material, weight) {
    this.material = material;
    this.weight = weight;
  }

  getSpecs() {
    return `${this.material} chassis weighing ${this.weight}kg`;
  }
}

// Concrete Abstract Factories
class SportVehiclePartsFactory extends VehiclePartsFactory {
  createEngine() {
    return new Engine('V8', 450);
  }

  createTransmission() {
    return new Transmission('Manual', 6);
  }

  createChassis() {
    return new Chassis('Carbon Fiber', 120);
  }
}

class EconomyVehiclePartsFactory extends VehiclePartsFactory {
  createEngine() {
    return new Engine('Inline-4', 180);
  }

  createTransmission() {
    return new Transmission('Automatic', 5);
  }

  createChassis() {
    return new Chassis('Steel', 300);
  }
}

class HeavyDutyVehiclePartsFactory extends VehiclePartsFactory {
  createEngine() {
    return new Engine('Diesel V6', 350);
  }

  createTransmission() {
    return new Transmission('Manual', 8);
  }

  createChassis() {
    return new Chassis('Reinforced Steel', 800);
  }
}

// Vehicle Assembler - Uses the Abstract Factory
class VehicleAssembler {
  constructor(partsFactory) {
    this.partsFactory = partsFactory;
  }

  assembleVehicle() {
    const engine = this.partsFactory.createEngine();
    const transmission = this.partsFactory.createTransmission();
    const chassis = this.partsFactory.createChassis();

    console.log('Assembling vehicle with:');
    console.log(`- ${engine.getSpecs()}`);
    console.log(`- ${transmission.getSpecs()}`);
    console.log(`- ${chassis.getSpecs()}`);

    return {
      engine,
      transmission,
      chassis
    };
  }
}

// Client code demonstration
function clientCode() {
  console.log('===== Simple Factory Pattern =====');

  const car = VehicleFactory.createVehicle('car', 'Toyota', 'Camry', 2023, { doors: 4 });
  const motorcycle = VehicleFactory.createVehicle('motorcycle', 'Honda', 'CBR', 2023, { engineSize: 600 });
  const truck = VehicleFactory.createVehicle('truck', 'Ford', 'F-150', 2023, { capacity: 3 });

  console.log(car.getInfo());
  console.log(car.drive());

  console.log(motorcycle.getInfo());
  console.log(motorcycle.ride());

  console.log(truck.getInfo());
  console.log(truck.haul());

  console.log('\n===== Factory Method Pattern =====');

  const carFactory = new CarFactory();
  const motorcycleFactory = new MotorcycleFactory();
  const truckFactory = new TruckFactory();

  const newCar = carFactory.registerVehicle('BMW', '3 Series', 2023, { doors: 2 });
  const newMotorcycle = motorcycleFactory.registerVehicle('Ducati', 'Monster', 2023, { engineSize: 821 });
  const newTruck = truckFactory.registerVehicle('Volvo', 'VNL', 2023, { capacity: 20 });

  console.log(newCar.drive());
  console.log(newMotorcycle.ride());
  console.log(newTruck.haul());

  console.log('\n===== Abstract Factory Pattern =====');

  const sportPartsFactory = new SportVehiclePartsFactory();
  const economyPartsFactory = new EconomyVehiclePartsFactory();
  const heavyDutyPartsFactory = new HeavyDutyVehiclePartsFactory();

  console.log('Building a sports car:');
  const sportCarAssembler = new VehicleAssembler(sportPartsFactory);
  const sportCarParts = sportCarAssembler.assembleVehicle();

  console.log('\nBuilding an economy car:');
  const economyCarAssembler = new VehicleAssembler(economyPartsFactory);
  const economyCarParts = economyCarAssembler.assembleVehicle();

  console.log('\nBuilding a heavy duty truck:');
  const heavyDutyTruckAssembler = new VehicleAssembler(heavyDutyPartsFactory);
  const heavyDutyTruckParts = heavyDutyTruckAssembler.assembleVehicle();
}

// Execute the client code
// Run the example
clientCode();

// Export classes for use in other modules
module.exports = {
  // Simple Factory
  VehicleFactory,

  // Factory Method
  VehicleFactoryMethod,
  CarFactory,
  MotorcycleFactory,
  TruckFactory,

  // Abstract Factory
  VehiclePartsFactory,
  SportVehiclePartsFactory,
  EconomyVehiclePartsFactory,
  HeavyDutyVehiclePartsFactory,
  VehicleAssembler,

  // Products
  Vehicle,
  Car,
  Motorcycle,
  Truck,
  Engine,
  Transmission,
  Chassis
};

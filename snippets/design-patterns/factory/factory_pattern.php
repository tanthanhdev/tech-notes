<?php
/**
 * Factory Pattern Implementation in PHP
 *
 * The Factory Pattern is a creational design pattern that provides an interface for creating
 * objects in a superclass, but allows subclasses to alter the type of objects that will be created.
 *
 * This example demonstrates a Vehicle Factory that can create different types of vehicles
 * (Car, Motorcycle, Truck) based on the client's requirements.
 */

// Abstract Product - Vehicle
abstract class Vehicle {
    protected $make;
    protected $model;
    protected $year;

    public function __construct($make, $model, $year) {
        $this->make = $make;
        $this->model = $model;
        $this->year = $year;
    }

    public function getInfo() {
        return "{$this->year} {$this->make} {$this->model}";
    }

    public function start() {
        return $this->getInfo() . " is starting...";
    }

    public function stop() {
        return $this->getInfo() . " is stopping...";
    }
}

// Concrete Products
class Car extends Vehicle {
    protected $doors;

    public function __construct($make, $model, $year, $doors = 4) {
        parent::__construct($make, $model, $year);
        $this->doors = $doors;
    }

    public function getInfo() {
        return parent::getInfo() . " ({$this->doors}-door car)";
    }

    public function drive() {
        return $this->getInfo() . " is driving on the road.";
    }
}

class Motorcycle extends Vehicle {
    protected $engineSize;

    public function __construct($make, $model, $year, $engineSize) {
        parent::__construct($make, $model, $year);
        $this->engineSize = $engineSize;
    }

    public function getInfo() {
        return parent::getInfo() . " ({$this->engineSize}cc motorcycle)";
    }

    public function ride() {
        return $this->getInfo() . " is riding at high speed.";
    }
}

class Truck extends Vehicle {
    protected $capacity;

    public function __construct($make, $model, $year, $capacity) {
        parent::__construct($make, $model, $year);
        $this->capacity = $capacity;
    }

    public function getInfo() {
        return parent::getInfo() . " ({$this->capacity} ton truck)";
    }

    public function haul() {
        return $this->getInfo() . " is hauling cargo.";
    }
}

// Simple Factory
class VehicleFactory {
    const CAR = 'car';
    const MOTORCYCLE = 'motorcycle';
    const TRUCK = 'truck';

    public static function createVehicle($type, $make, $model, $year, $options = []) {
        switch (strtolower($type)) {
            case self::CAR:
                $doors = isset($options['doors']) ? $options['doors'] : 4;
                return new Car($make, $model, $year, $doors);
            case self::MOTORCYCLE:
                $engineSize = isset($options['engineSize']) ? $options['engineSize'] : 250;
                return new Motorcycle($make, $model, $year, $engineSize);
            case self::TRUCK:
                $capacity = isset($options['capacity']) ? $options['capacity'] : 5.0;
                return new Truck($make, $model, $year, $capacity);
            default:
                throw new Exception("Vehicle type {$type} is not supported.");
        }
    }
}

// Factory Method Pattern Implementation
abstract class VehicleFactoryMethod {
    abstract public function createVehicle($make, $model, $year, $options = []);

    public function registerVehicle($make, $model, $year, $options = []) {
        // Common operations for all vehicles
        $vehicle = $this->createVehicle($make, $model, $year, $options);
        echo "Registering " . $vehicle->getInfo() . PHP_EOL;
        echo "Assigning license plate" . PHP_EOL;
        return $vehicle;
    }
}

// Concrete Factories
class CarFactory extends VehicleFactoryMethod {
    public function createVehicle($make, $model, $year, $options = []) {
        $doors = isset($options['doors']) ? $options['doors'] : 4;
        return new Car($make, $model, $year, $doors);
    }
}

class MotorcycleFactory extends VehicleFactoryMethod {
    public function createVehicle($make, $model, $year, $options = []) {
        $engineSize = isset($options['engineSize']) ? $options['engineSize'] : 250;
        return new Motorcycle($make, $model, $year, $engineSize);
    }
}

class TruckFactory extends VehicleFactoryMethod {
    public function createVehicle($make, $model, $year, $options = []) {
        $capacity = isset($options['capacity']) ? $options['capacity'] : 5.0;
        return new Truck($make, $model, $year, $capacity);
    }
}

// Abstract Factory Pattern Implementation
// Parts
class Engine {
    protected $type;
    protected $horsepower;

    public function __construct($type, $horsepower) {
        $this->type = $type;
        $this->horsepower = $horsepower;
    }

    public function getSpecs() {
        return "{$this->type} engine with {$this->horsepower}hp";
    }
}

class Transmission {
    protected $type;
    protected $gears;

    public function __construct($type, $gears) {
        $this->type = $type;
        $this->gears = $gears;
    }

    public function getSpecs() {
        return "{$this->type} transmission with {$this->gears} gears";
    }
}

class Chassis {
    protected $material;
    protected $weight;

    public function __construct($material, $weight) {
        $this->material = $material;
        $this->weight = $weight;
    }

    public function getSpecs() {
        return "{$this->material} chassis weighing {$this->weight}kg";
    }
}

// Abstract Factory
interface VehiclePartsFactory {
    public function createEngine();
    public function createTransmission();
    public function createChassis();
}

// Concrete Abstract Factories
class SportVehiclePartsFactory implements VehiclePartsFactory {
    public function createEngine() {
        return new Engine("V8", 450);
    }

    public function createTransmission() {
        return new Transmission("Manual", 6);
    }

    public function createChassis() {
        return new Chassis("Carbon Fiber", 120);
    }
}

class EconomyVehiclePartsFactory implements VehiclePartsFactory {
    public function createEngine() {
        return new Engine("Inline-4", 180);
    }

    public function createTransmission() {
        return new Transmission("Automatic", 5);
    }

    public function createChassis() {
        return new Chassis("Steel", 300);
    }
}

class HeavyDutyVehiclePartsFactory implements VehiclePartsFactory {
    public function createEngine() {
        return new Engine("Diesel V6", 350);
    }

    public function createTransmission() {
        return new Transmission("Manual", 8);
    }

    public function createChassis() {
        return new Chassis("Reinforced Steel", 800);
    }
}

// Vehicle Assembler - Uses the Abstract Factory
class VehicleAssembler {
    protected $partsFactory;

    public function __construct(VehiclePartsFactory $partsFactory) {
        $this->partsFactory = $partsFactory;
    }

    public function assembleVehicle() {
        $engine = $this->partsFactory->createEngine();
        $transmission = $this->partsFactory->createTransmission();
        $chassis = $this->partsFactory->createChassis();

        echo "Assembling vehicle with:" . PHP_EOL;
        echo "- " . $engine->getSpecs() . PHP_EOL;
        echo "- " . $transmission->getSpecs() . PHP_EOL;
        echo "- " . $chassis->getSpecs() . PHP_EOL;
    }
}

// Client code demonstration
function clientCode() {
    echo "===== Simple Factory Pattern =====" . PHP_EOL;

    $car = VehicleFactory::createVehicle(VehicleFactory::CAR, "Toyota", "Camry", 2023, ['doors' => 4]);
    $motorcycle = VehicleFactory::createVehicle(VehicleFactory::MOTORCYCLE, "Honda", "CBR", 2023, ['engineSize' => 600]);
    $truck = VehicleFactory::createVehicle(VehicleFactory::TRUCK, "Ford", "F-150", 2023, ['capacity' => 3.0]);

    echo $car->getInfo() . PHP_EOL;
    echo $car->drive() . PHP_EOL;

    echo $motorcycle->getInfo() . PHP_EOL;
    echo $motorcycle->ride() . PHP_EOL;

    echo $truck->getInfo() . PHP_EOL;
    echo $truck->haul() . PHP_EOL;

    echo PHP_EOL . "===== Factory Method Pattern =====" . PHP_EOL;

    $carFactory = new CarFactory();
    $motorcycleFactory = new MotorcycleFactory();
    $truckFactory = new TruckFactory();

    $newCar = $carFactory->registerVehicle("BMW", "3 Series", 2023, ['doors' => 2]);
    $newMotorcycle = $motorcycleFactory->registerVehicle("Ducati", "Monster", 2023, ['engineSize' => 821]);
    $newTruck = $truckFactory->registerVehicle("Volvo", "VNL", 2023, ['capacity' => 20.0]);

    echo $newCar->drive() . PHP_EOL;
    echo $newMotorcycle->ride() . PHP_EOL;
    echo $newTruck->haul() . PHP_EOL;

    echo PHP_EOL . "===== Abstract Factory Pattern =====" . PHP_EOL;

    echo "Building a sports car:" . PHP_EOL;
    $sportCarAssembler = new VehicleAssembler(new SportVehiclePartsFactory());
    $sportCarAssembler->assembleVehicle();

    echo PHP_EOL . "Building an economy car:" . PHP_EOL;
    $economyCarAssembler = new VehicleAssembler(new EconomyVehiclePartsFactory());
    $economyCarAssembler->assembleVehicle();

    echo PHP_EOL . "Building a heavy duty truck:" . PHP_EOL;
    $heavyDutyTruckAssembler = new VehicleAssembler(new HeavyDutyVehiclePartsFactory());
    $heavyDutyTruckAssembler->assembleVehicle();
}

// Run the example
clientCode();

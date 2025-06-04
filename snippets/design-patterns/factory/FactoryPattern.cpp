/**
 * Factory Pattern Implementation in C++
 *
 * The Factory Pattern is a creational design pattern that provides an interface for creating
 * objects in a superclass, but allows subclasses to alter the type of objects that will be created.
 *
 * This example demonstrates a Vehicle Factory that can create different types of vehicles
 * (Car, Motorcycle, Truck) based on the client's requirements.
 */

#include <iostream>
#include <memory>
#include <string>
#include <vector>

// Abstract Product - Vehicle
class Vehicle {
public:
    Vehicle(const std::string& make, const std::string& model, int year)
        : make_(make), model_(model), year_(year) {}

    virtual ~Vehicle() = default;

    virtual std::string getInfo() const {
        return std::to_string(year_) + " " + make_ + " " + model_;
    }

    virtual std::string start() const {
        return getInfo() + " is starting...";
    }

    virtual std::string stop() const {
        return getInfo() + " is stopping...";
    }

protected:
    std::string make_;
    std::string model_;
    int year_;
};

// Concrete Products
class Car : public Vehicle {
public:
    Car(const std::string& make, const std::string& model, int year, int doors = 4)
        : Vehicle(make, model, year), doors_(doors) {}

    std::string getInfo() const override {
        return Vehicle::getInfo() + " (" + std::to_string(doors_) + "-door car)";
    }

    std::string drive() const {
        return getInfo() + " is driving on the road.";
    }

private:
    int doors_;
};

class Motorcycle : public Vehicle {
public:
    Motorcycle(const std::string& make, const std::string& model, int year, int engineSize)
        : Vehicle(make, model, year), engineSize_(engineSize) {}

    std::string getInfo() const override {
        return Vehicle::getInfo() + " (" + std::to_string(engineSize_) + "cc motorcycle)";
    }

    std::string ride() const {
        return getInfo() + " is riding at high speed.";
    }

private:
    int engineSize_;
};

class Truck : public Vehicle {
public:
    Truck(const std::string& make, const std::string& model, int year, double capacity)
        : Vehicle(make, model, year), capacity_(capacity) {}

    std::string getInfo() const override {
        return Vehicle::getInfo() + " (" + std::to_string(capacity_) + " ton truck)";
    }

    std::string haul() const {
        return getInfo() + " is hauling cargo.";
    }

private:
    double capacity_;
};

// Simple Factory
class VehicleFactory {
public:
    enum VehicleType {
        CAR,
        MOTORCYCLE,
        TRUCK
    };

    static std::unique_ptr<Vehicle> createVehicle(VehicleType type,
                                                  const std::string& make,
                                                  const std::string& model,
                                                  int year,
                                                  const std::vector<double>& options = {}) {
        switch (type) {
            case CAR:
                return std::make_unique<Car>(make, model, year,
                                            options.size() > 0 ? static_cast<int>(options[0]) : 4);
            case MOTORCYCLE:
                return std::make_unique<Motorcycle>(make, model, year,
                                                  options.size() > 0 ? static_cast<int>(options[0]) : 250);
            case TRUCK:
                return std::make_unique<Truck>(make, model, year,
                                              options.size() > 0 ? options[0] : 5.0);
            default:
                throw std::invalid_argument("Unknown vehicle type");
        }
    }
};

// Factory Method Pattern Implementation
class VehicleFactoryMethod {
public:
    virtual ~VehicleFactoryMethod() = default;

    virtual std::unique_ptr<Vehicle> createVehicle(const std::string& make,
                                                 const std::string& model,
                                                 int year,
                                                 const std::vector<double>& options = {}) = 0;

    std::unique_ptr<Vehicle> registerVehicle(const std::string& make,
                                           const std::string& model,
                                           int year,
                                           const std::vector<double>& options = {}) {
        // Common operations for all vehicles
        auto vehicle = createVehicle(make, model, year, options);
        std::cout << "Registering " << vehicle->getInfo() << std::endl;
        std::cout << "Assigning license plate" << std::endl;
        return vehicle;
    }
};

// Concrete Factories
class CarFactory : public VehicleFactoryMethod {
public:
    std::unique_ptr<Vehicle> createVehicle(const std::string& make,
                                         const std::string& model,
                                         int year,
                                         const std::vector<double>& options = {}) override {
        return std::make_unique<Car>(make, model, year,
                                    options.size() > 0 ? static_cast<int>(options[0]) : 4);
    }
};

class MotorcycleFactory : public VehicleFactoryMethod {
public:
    std::unique_ptr<Vehicle> createVehicle(const std::string& make,
                                         const std::string& model,
                                         int year,
                                         const std::vector<double>& options = {}) override {
        return std::make_unique<Motorcycle>(make, model, year,
                                          options.size() > 0 ? static_cast<int>(options[0]) : 250);
    }
};

class TruckFactory : public VehicleFactoryMethod {
public:
    std::unique_ptr<Vehicle> createVehicle(const std::string& make,
                                         const std::string& model,
                                         int year,
                                         const std::vector<double>& options = {}) override {
        return std::make_unique<Truck>(make, model, year,
                                      options.size() > 0 ? options[0] : 5.0);
    }
};

// Abstract Factory Pattern Implementation
// Parts interfaces
class Engine {
public:
    Engine(const std::string& type, int horsepower)
        : type_(type), horsepower_(horsepower) {}

    virtual ~Engine() = default;

    std::string getSpecs() const {
        return type_ + " engine with " + std::to_string(horsepower_) + "hp";
    }

private:
    std::string type_;
    int horsepower_;
};

class Transmission {
public:
    Transmission(const std::string& type, int gears)
        : type_(type), gears_(gears) {}

    virtual ~Transmission() = default;

    std::string getSpecs() const {
        return type_ + " transmission with " + std::to_string(gears_) + " gears";
    }

private:
    std::string type_;
    int gears_;
};

class Chassis {
public:
    Chassis(const std::string& material, double weight)
        : material_(material), weight_(weight) {}

    virtual ~Chassis() = default;

    std::string getSpecs() const {
        return material_ + " chassis weighing " + std::to_string(weight_) + "kg";
    }

private:
    std::string material_;
    double weight_;
};

// Abstract Factory
class VehiclePartsFactory {
public:
    virtual ~VehiclePartsFactory() = default;
    virtual std::unique_ptr<Engine> createEngine() = 0;
    virtual std::unique_ptr<Transmission> createTransmission() = 0;
    virtual std::unique_ptr<Chassis> createChassis() = 0;
};

// Concrete Abstract Factories
class SportVehiclePartsFactory : public VehiclePartsFactory {
public:
    std::unique_ptr<Engine> createEngine() override {
        return std::make_unique<Engine>("V8", 450);
    }

    std::unique_ptr<Transmission> createTransmission() override {
        return std::make_unique<Transmission>("Manual", 6);
    }

    std::unique_ptr<Chassis> createChassis() override {
        return std::make_unique<Chassis>("Carbon Fiber", 120);
    }
};

class EconomyVehiclePartsFactory : public VehiclePartsFactory {
public:
    std::unique_ptr<Engine> createEngine() override {
        return std::make_unique<Engine>("Inline-4", 180);
    }

    std::unique_ptr<Transmission> createTransmission() override {
        return std::make_unique<Transmission>("Automatic", 5);
    }

    std::unique_ptr<Chassis> createChassis() override {
        return std::make_unique<Chassis>("Steel", 300);
    }
};

class HeavyDutyVehiclePartsFactory : public VehiclePartsFactory {
public:
    std::unique_ptr<Engine> createEngine() override {
        return std::make_unique<Engine>("Diesel V6", 350);
    }

    std::unique_ptr<Transmission> createTransmission() override {
        return std::make_unique<Transmission>("Manual", 8);
    }

    std::unique_ptr<Chassis> createChassis() override {
        return std::make_unique<Chassis>("Reinforced Steel", 800);
    }
};

// Vehicle Assembler - Uses the Abstract Factory
class VehicleAssembler {
public:
    VehicleAssembler(std::unique_ptr<VehiclePartsFactory> factory)
        : partsFactory_(std::move(factory)) {}

    void assembleVehicle() {
        auto engine = partsFactory_->createEngine();
        auto transmission = partsFactory_->createTransmission();
        auto chassis = partsFactory_->createChassis();

        std::cout << "Assembling vehicle with:" << std::endl;
        std::cout << "- " << engine->getSpecs() << std::endl;
        std::cout << "- " << transmission->getSpecs() << std::endl;
        std::cout << "- " << chassis->getSpecs() << std::endl;
    }

private:
    std::unique_ptr<VehiclePartsFactory> partsFactory_;
};

// Client code demonstration
void clientCode() {
    std::cout << "===== Simple Factory Pattern =====" << std::endl;

    auto car = VehicleFactory::createVehicle(VehicleFactory::CAR, "Toyota", "Camry", 2023, {4});
    auto motorcycle = VehicleFactory::createVehicle(VehicleFactory::MOTORCYCLE, "Honda", "CBR", 2023, {600});
    auto truck = VehicleFactory::createVehicle(VehicleFactory::TRUCK, "Ford", "F-150", 2023, {3.0});

    std::cout << car->getInfo() << std::endl;
    std::cout << static_cast<Car*>(car.get())->drive() << std::endl;

    std::cout << motorcycle->getInfo() << std::endl;
    std::cout << static_cast<Motorcycle*>(motorcycle.get())->ride() << std::endl;

    std::cout << truck->getInfo() << std::endl;
    std::cout << static_cast<Truck*>(truck.get())->haul() << std::endl;

    std::cout << "\n===== Factory Method Pattern =====" << std::endl;

    CarFactory carFactory;
    MotorcycleFactory motorcycleFactory;
    TruckFactory truckFactory;

    auto newCar = carFactory.registerVehicle("BMW", "3 Series", 2023, {2});
    auto newMotorcycle = motorcycleFactory.registerVehicle("Ducati", "Monster", 2023, {821});
    auto newTruck = truckFactory.registerVehicle("Volvo", "VNL", 2023, {20.0});

    std::cout << static_cast<Car*>(newCar.get())->drive() << std::endl;
    std::cout << static_cast<Motorcycle*>(newMotorcycle.get())->ride() << std::endl;
    std::cout << static_cast<Truck*>(newTruck.get())->haul() << std::endl;

    std::cout << "\n===== Abstract Factory Pattern =====" << std::endl;

    std::cout << "Building a sports car:" << std::endl;
    VehicleAssembler sportCarAssembler(std::make_unique<SportVehiclePartsFactory>());
    sportCarAssembler.assembleVehicle();

    std::cout << "\nBuilding an economy car:" << std::endl;
    VehicleAssembler economyCarAssembler(std::make_unique<EconomyVehiclePartsFactory>());
    economyCarAssembler.assembleVehicle();

    std::cout << "\nBuilding a heavy duty truck:" << std::endl;
    VehicleAssembler heavyDutyTruckAssembler(std::make_unique<HeavyDutyVehiclePartsFactory>());
    heavyDutyTruckAssembler.assembleVehicle();
}

// Main function, run the example
int main() {
    try {
        clientCode();
    } catch (const std::exception& e) {
        std::cerr << "Exception: " << e.what() << std::endl;
        return 1;
    }
    return 0;
}


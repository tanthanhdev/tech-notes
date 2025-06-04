/**
 * Factory Pattern Implementation in C
 *
 * The Factory Pattern is a creational design pattern that provides an interface for creating
 * objects in a superclass, but allows subclasses to alter the type of objects that will be created.
 *
 * This example demonstrates a Vehicle Factory that can create different types of vehicles
 * (Car, Motorcycle, Truck) based on the client's requirements.
 *
 * Note: Since C is not an object-oriented language, we use structs with function pointers
 * to simulate classes and polymorphism.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>

// Define vehicle types
typedef enum {
    VEHICLE_TYPE_CAR,
    VEHICLE_TYPE_MOTORCYCLE,
    VEHICLE_TYPE_TRUCK
} VehicleType;

// Forward declarations
typedef struct Vehicle Vehicle;
typedef struct Car Car;
typedef struct Motorcycle Motorcycle;
typedef struct Truck Truck;

// Function pointer types for common vehicle methods
typedef char* (*GetInfoFunc)(const void*);
typedef char* (*StartFunc)(const void*);
typedef char* (*StopFunc)(const void*);

// Base "class" for vehicles
struct Vehicle {
    char make[50];
    char model[50];
    int year;

    // Virtual functions (function pointers)
    GetInfoFunc getInfo;
    StartFunc start;
    StopFunc stop;
};

// Car "class"
struct Car {
    Vehicle base;  // "Inherit" from Vehicle
    int doors;

    // Car-specific method
    char* (*drive)(const Car*);
};

// Motorcycle "class"
struct Motorcycle {
    Vehicle base;  // "Inherit" from Vehicle
    int engineSize;

    // Motorcycle-specific method
    char* (*ride)(const Motorcycle*);
};

// Truck "class"
struct Truck {
    Vehicle base;  // "Inherit" from Vehicle
    double capacity;

    // Truck-specific method
    char* (*haul)(const Truck*);
};

// Helper function to create a string (caller must free)
char* createString(const char* format, ...) {
    char* buffer = NULL;
    va_list args;
    int length;

    va_start(args, format);
    length = vsnprintf(NULL, 0, format, args);
    va_end(args);

    buffer = (char*)malloc(length + 1);
    if (buffer == NULL) {
        return NULL;
    }

    va_start(args, format);
    vsnprintf(buffer, length + 1, format, args);
    va_end(args);

    return buffer;
}

// Vehicle method implementations
char* vehicle_getInfo(const Vehicle* vehicle) {
    return createString("%d %s %s", vehicle->year, vehicle->make, vehicle->model);
}

char* vehicle_start(const Vehicle* vehicle) {
    char* info = vehicle->getInfo(vehicle);
    char* result = createString("%s is starting...", info);
    free(info);
    return result;
}

char* vehicle_stop(const Vehicle* vehicle) {
    char* info = vehicle->getInfo(vehicle);
    char* result = createString("%s is stopping...", info);
    free(info);
    return result;
}

// Car method implementations
char* car_getInfo(const Car* car) {
    char* baseInfo = vehicle_getInfo((Vehicle*)car);
    char* result = createString("%s (%d-door car)", baseInfo, car->doors);
    free(baseInfo);
    return result;
}

char* car_drive(const Car* car) {
    char* info = car_getInfo(car);
    char* result = createString("%s is driving on the road.", info);
    free(info);
    return result;
}

// Motorcycle method implementations
char* motorcycle_getInfo(const Motorcycle* motorcycle) {
    char* baseInfo = vehicle_getInfo((Vehicle*)motorcycle);
    char* result = createString("%s (%dcc motorcycle)", baseInfo, motorcycle->engineSize);
    free(baseInfo);
    return result;
}

char* motorcycle_ride(const Motorcycle* motorcycle) {
    char* info = motorcycle_getInfo(motorcycle);
    char* result = createString("%s is riding at high speed.", info);
    free(info);
    return result;
}

// Truck method implementations
char* truck_getInfo(const Truck* truck) {
    char* baseInfo = vehicle_getInfo((Vehicle*)truck);
    char* result = createString("%s (%.1f ton truck)", baseInfo, truck->capacity);
    free(baseInfo);
    return result;
}

char* truck_haul(const Truck* truck) {
    char* info = truck_getInfo(truck);
    char* result = createString("%s is hauling cargo.", info);
    free(info);
    return result;
}

// Factory functions to create vehicles
Car* createCar(const char* make, const char* model, int year, int doors) {
    Car* car = (Car*)malloc(sizeof(Car));
    if (car == NULL) {
        return NULL;
    }

    // Initialize base vehicle
    strncpy(car->base.make, make, sizeof(car->base.make) - 1);
    strncpy(car->base.model, model, sizeof(car->base.model) - 1);
    car->base.year = year;

    // Set function pointers for virtual methods
    car->base.getInfo = (GetInfoFunc)car_getInfo;
    car->base.start = (StartFunc)vehicle_start;
    car->base.stop = (StopFunc)vehicle_stop;

    // Set car-specific properties and methods
    car->doors = doors;
    car->drive = car_drive;

    return car;
}

Motorcycle* createMotorcycle(const char* make, const char* model, int year, int engineSize) {
    Motorcycle* motorcycle = (Motorcycle*)malloc(sizeof(Motorcycle));
    if (motorcycle == NULL) {
        return NULL;
    }

    // Initialize base vehicle
    strncpy(motorcycle->base.make, make, sizeof(motorcycle->base.make) - 1);
    strncpy(motorcycle->base.model, model, sizeof(motorcycle->base.model) - 1);
    motorcycle->base.year = year;

    // Set function pointers for virtual methods
    motorcycle->base.getInfo = (GetInfoFunc)motorcycle_getInfo;
    motorcycle->base.start = (StartFunc)vehicle_start;
    motorcycle->base.stop = (StopFunc)vehicle_stop;

    // Set motorcycle-specific properties and methods
    motorcycle->engineSize = engineSize;
    motorcycle->ride = motorcycle_ride;

    return motorcycle;
}

Truck* createTruck(const char* make, const char* model, int year, double capacity) {
    Truck* truck = (Truck*)malloc(sizeof(Truck));
    if (truck == NULL) {
        return NULL;
    }

    // Initialize base vehicle
    strncpy(truck->base.make, make, sizeof(truck->base.make) - 1);
    strncpy(truck->base.model, model, sizeof(truck->base.model) - 1);
    truck->base.year = year;

    // Set function pointers for virtual methods
    truck->base.getInfo = (GetInfoFunc)truck_getInfo;
    truck->base.start = (StartFunc)vehicle_start;
    truck->base.stop = (StopFunc)vehicle_stop;

    // Set truck-specific properties and methods
    truck->capacity = capacity;
    truck->haul = truck_haul;

    return truck;
}

// Simple Factory
void* vehicleFactory_createVehicle(VehicleType type, const char* make, const char* model, int year, void* options) {
    switch (type) {
        case VEHICLE_TYPE_CAR: {
            int doors = options ? *(int*)options : 4;
            return createCar(make, model, year, doors);
        }
        case VEHICLE_TYPE_MOTORCYCLE: {
            int engineSize = options ? *(int*)options : 250;
            return createMotorcycle(make, model, year, engineSize);
        }
        case VEHICLE_TYPE_TRUCK: {
            double capacity = options ? *(double*)options : 5.0;
            return createTruck(make, model, year, capacity);
        }
        default:
            return NULL;
    }
}

// Factory Method Pattern Implementation
// In C, we would typically use function pointers to implement this pattern
typedef void* (*CreateVehicleFunc)(const char* make, const char* model, int year, void* options);
typedef void* (*RegisterVehicleFunc)(CreateVehicleFunc createFunc, const char* make, const char* model, int year, void* options);

// Common register vehicle implementation
void* registerVehicle(CreateVehicleFunc createFunc, const char* make, const char* model, int year, void* options) {
    void* vehicle = createFunc(make, model, year, options);

    // Common operations for all vehicles
    Vehicle* baseVehicle = (Vehicle*)vehicle;
    char* info = baseVehicle->getInfo(baseVehicle);
    printf("Registering %s\n", info);
    printf("Assigning license plate\n");
    free(info);

    return vehicle;
}

// Concrete factory functions
void* createCarFactory(const char* make, const char* model, int year, void* options) {
    int doors = options ? *(int*)options : 4;
    return createCar(make, model, year, doors);
}

void* createMotorcycleFactory(const char* make, const char* model, int year, void* options) {
    int engineSize = options ? *(int*)options : 250;
    return createMotorcycle(make, model, year, engineSize);
}

void* createTruckFactory(const char* make, const char* model, int year, void* options) {
    double capacity = options ? *(double*)options : 5.0;
    return createTruck(make, model, year, capacity);
}

// Abstract Factory Pattern Implementation
// Parts
typedef struct {
    char type[50];
    int horsepower;
} Engine;

typedef struct {
    char type[50];
    int gears;
} Transmission;

typedef struct {
    char material[50];
    double weight;
} Chassis;

// Function to get engine specs
char* engine_getSpecs(const Engine* engine) {
    return createString("%s engine with %dhp", engine->type, engine->horsepower);
}

// Function to get transmission specs
char* transmission_getSpecs(const Transmission* transmission) {
    return createString("%s transmission with %d gears", transmission->type, transmission->gears);
}

// Function to get chassis specs
char* chassis_getSpecs(const Chassis* chassis) {
    return createString("%s chassis weighing %.1fkg", chassis->material, chassis->weight);
}

// Abstract Factory interface
typedef struct {
    Engine* (*createEngine)();
    Transmission* (*createTransmission)();
    Chassis* (*createChassis)();
} VehiclePartsFactory;

// Concrete Abstract Factories
Engine* sportVehiclePartsFactory_createEngine() {
    Engine* engine = (Engine*)malloc(sizeof(Engine));
    strncpy(engine->type, "V8", sizeof(engine->type) - 1);
    engine->horsepower = 450;
    return engine;
}

Transmission* sportVehiclePartsFactory_createTransmission() {
    Transmission* transmission = (Transmission*)malloc(sizeof(Transmission));
    strncpy(transmission->type, "Manual", sizeof(transmission->type) - 1);
    transmission->gears = 6;
    return transmission;
}

Chassis* sportVehiclePartsFactory_createChassis() {
    Chassis* chassis = (Chassis*)malloc(sizeof(Chassis));
    strncpy(chassis->material, "Carbon Fiber", sizeof(chassis->material) - 1);
    chassis->weight = 120.0;
    return chassis;
}

Engine* economyVehiclePartsFactory_createEngine() {
    Engine* engine = (Engine*)malloc(sizeof(Engine));
    strncpy(engine->type, "Inline-4", sizeof(engine->type) - 1);
    engine->horsepower = 180;
    return engine;
}

Transmission* economyVehiclePartsFactory_createTransmission() {
    Transmission* transmission = (Transmission*)malloc(sizeof(Transmission));
    strncpy(transmission->type, "Automatic", sizeof(transmission->type) - 1);
    transmission->gears = 5;
    return transmission;
}

Chassis* economyVehiclePartsFactory_createChassis() {
    Chassis* chassis = (Chassis*)malloc(sizeof(Chassis));
    strncpy(chassis->material, "Steel", sizeof(chassis->material) - 1);
    chassis->weight = 300.0;
    return chassis;
}

Engine* heavyDutyVehiclePartsFactory_createEngine() {
    Engine* engine = (Engine*)malloc(sizeof(Engine));
    strncpy(engine->type, "Diesel V6", sizeof(engine->type) - 1);
    engine->horsepower = 350;
    return engine;
}

Transmission* heavyDutyVehiclePartsFactory_createTransmission() {
    Transmission* transmission = (Transmission*)malloc(sizeof(Transmission));
    strncpy(transmission->type, "Manual", sizeof(transmission->type) - 1);
    transmission->gears = 8;
    return transmission;
}

Chassis* heavyDutyVehiclePartsFactory_createChassis() {
    Chassis* chassis = (Chassis*)malloc(sizeof(Chassis));
    strncpy(chassis->material, "Reinforced Steel", sizeof(chassis->material) - 1);
    chassis->weight = 800.0;
    return chassis;
}

// Create concrete factories
VehiclePartsFactory createSportVehiclePartsFactory() {
    VehiclePartsFactory factory = {
        .createEngine = sportVehiclePartsFactory_createEngine,
        .createTransmission = sportVehiclePartsFactory_createTransmission,
        .createChassis = sportVehiclePartsFactory_createChassis
    };
    return factory;
}

VehiclePartsFactory createEconomyVehiclePartsFactory() {
    VehiclePartsFactory factory = {
        .createEngine = economyVehiclePartsFactory_createEngine,
        .createTransmission = economyVehiclePartsFactory_createTransmission,
        .createChassis = economyVehiclePartsFactory_createChassis
    };
    return factory;
}

VehiclePartsFactory createHeavyDutyVehiclePartsFactory() {
    VehiclePartsFactory factory = {
        .createEngine = heavyDutyVehiclePartsFactory_createEngine,
        .createTransmission = heavyDutyVehiclePartsFactory_createTransmission,
        .createChassis = heavyDutyVehiclePartsFactory_createChassis
    };
    return factory;
}

// Vehicle Assembler - Uses the Abstract Factory
void assembleVehicle(const VehiclePartsFactory* factory) {
    Engine* engine = factory->createEngine();
    Transmission* transmission = factory->createTransmission();
    Chassis* chassis = factory->createChassis();

    char* engineSpecs = engine_getSpecs(engine);
    char* transmissionSpecs = transmission_getSpecs(transmission);
    char* chassisSpecs = chassis_getSpecs(chassis);

    printf("Assembling vehicle with:\n");
    printf("- %s\n", engineSpecs);
    printf("- %s\n", transmissionSpecs);
    printf("- %s\n", chassisSpecs);

    free(engineSpecs);
    free(transmissionSpecs);
    free(chassisSpecs);
    free(engine);
    free(transmission);
    free(chassis);
}

// Free memory functions
void freeCar(Car* car) {
    if (car) {
        free(car);
    }
}

void freeMotorcycle(Motorcycle* motorcycle) {
    if (motorcycle) {
        free(motorcycle);
    }
}

void freeTruck(Truck* truck) {
    if (truck) {
        free(truck);
    }
}

// Client code demonstration
void clientCode() {
    printf("===== Simple Factory Pattern =====\n");

    int carDoors = 4;
    int motorcycleEngineSize = 600;
    double truckCapacity = 3.0;

    Car* car = vehicleFactory_createVehicle(VEHICLE_TYPE_CAR, "Toyota", "Camry", 2023, &carDoors);
    Motorcycle* motorcycle = vehicleFactory_createVehicle(VEHICLE_TYPE_MOTORCYCLE, "Honda", "CBR", 2023, &motorcycleEngineSize);
    Truck* truck = vehicleFactory_createVehicle(VEHICLE_TYPE_TRUCK, "Ford", "F-150", 2023, &truckCapacity);

    char* carInfo = car->base.getInfo(car);
    char* carDriveResult = car->drive(car);

    char* motorcycleInfo = motorcycle->base.getInfo(motorcycle);
    char* motorcycleRideResult = motorcycle->ride(motorcycle);

    char* truckInfo = truck->base.getInfo(truck);
    char* truckHaulResult = truck->haul(truck);

    printf("%s\n", carInfo);
    printf("%s\n", carDriveResult);

    printf("%s\n", motorcycleInfo);
    printf("%s\n", motorcycleRideResult);

    printf("%s\n", truckInfo);
    printf("%s\n", truckHaulResult);

    free(carInfo);
    free(carDriveResult);
    free(motorcycleInfo);
    free(motorcycleRideResult);
    free(truckInfo);
    free(truckHaulResult);

    printf("\n===== Factory Method Pattern =====\n");

    int bmwDoors = 2;
    int ducatiEngineSize = 821;
    double volvoCapacity = 20.0;

    Car* newCar = registerVehicle(createCarFactory, "BMW", "3 Series", 2023, &bmwDoors);
    Motorcycle* newMotorcycle = registerVehicle(createMotorcycleFactory, "Ducati", "Monster", 2023, &ducatiEngineSize);
    Truck* newTruck = registerVehicle(createTruckFactory, "Volvo", "VNL", 2023, &volvoCapacity);

    char* newCarDriveResult = newCar->drive(newCar);
    char* newMotorcycleRideResult = newMotorcycle->ride(newMotorcycle);
    char* newTruckHaulResult = newTruck->haul(newTruck);

    printf("%s\n", newCarDriveResult);
    printf("%s\n", newMotorcycleRideResult);
    printf("%s\n", newTruckHaulResult);

    free(newCarDriveResult);
    free(newMotorcycleRideResult);
    free(newTruckHaulResult);

    printf("\n===== Abstract Factory Pattern =====\n");

    VehiclePartsFactory sportFactory = createSportVehiclePartsFactory();
    VehiclePartsFactory economyFactory = createEconomyVehiclePartsFactory();
    VehiclePartsFactory heavyDutyFactory = createHeavyDutyVehiclePartsFactory();

    printf("Building a sports car:\n");
    assembleVehicle(&sportFactory);

    printf("\nBuilding an economy car:\n");
    assembleVehicle(&economyFactory);

    printf("\nBuilding a heavy duty truck:\n");
    assembleVehicle(&heavyDutyFactory);

    // Free memory
    freeCar(car);
    freeMotorcycle(motorcycle);
    freeTruck(truck);
    freeCar(newCar);
    freeMotorcycle(newMotorcycle);
    freeTruck(newTruck);
}

int main() {
    // Run the example
    clientCode();
    return 0;
}

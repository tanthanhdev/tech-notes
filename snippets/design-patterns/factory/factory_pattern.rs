/**
 * Factory Pattern Implementation in Rust
 *
 * The Factory Pattern is a creational design pattern that provides an interface for creating
 * objects in a superclass, but allows subclasses to alter the type of objects that will be created.
 *
 * This example demonstrates a Vehicle Factory that can create different types of vehicles
 * (Car, Motorcycle, Truck) based on the client's requirements.
 */

use std::fmt;

// Abstract Product - Vehicle Trait
trait Vehicle {
    fn get_info(&self) -> String;
    fn start(&self) -> String {
        format!("{} is starting...", self.get_info())
    }
    fn stop(&self) -> String {
        format!("{} is stopping...", self.get_info())
    }
}

// Concrete Products
struct Car {
    make: String,
    model: String,
    year: u32,
    doors: u32,
}

impl Car {
    fn new(make: &str, model: &str, year: u32, doors: u32) -> Self {
        Car {
            make: make.to_string(),
            model: model.to_string(),
            year,
            doors,
        }
    }

    fn drive(&self) -> String {
        format!("{} is driving on the road.", self.get_info())
    }
}

impl Vehicle for Car {
    fn get_info(&self) -> String {
        format!("{} {} {} ({}-door car)", self.year, self.make, self.model, self.doors)
    }
}

struct Motorcycle {
    make: String,
    model: String,
    year: u32,
    engine_size: u32,
}

impl Motorcycle {
    fn new(make: &str, model: &str, year: u32, engine_size: u32) -> Self {
        Motorcycle {
            make: make.to_string(),
            model: model.to_string(),
            year,
            engine_size,
        }
    }

    fn ride(&self) -> String {
        format!("{} is riding at high speed.", self.get_info())
    }
}

impl Vehicle for Motorcycle {
    fn get_info(&self) -> String {
        format!(
            "{} {} {} ({}cc motorcycle)",
            self.year, self.make, self.model, self.engine_size
        )
    }
}

struct Truck {
    make: String,
    model: String,
    year: u32,
    capacity: f64,
}

impl Truck {
    fn new(make: &str, model: &str, year: u32, capacity: f64) -> Self {
        Truck {
            make: make.to_string(),
            model: model.to_string(),
            year,
            capacity,
        }
    }

    fn haul(&self) -> String {
        format!("{} is hauling cargo.", self.get_info())
    }
}

impl Vehicle for Truck {
    fn get_info(&self) -> String {
        format!(
            "{} {} {} ({} ton truck)",
            self.year, self.make, self.model, self.capacity
        )
    }
}

// Simple Factory
enum VehicleType {
    Car,
    Motorcycle,
    Truck,
}

struct VehicleFactory;

impl VehicleFactory {
    fn create_car(make: &str, model: &str, year: u32, doors: u32) -> Box<dyn Vehicle> {
        Box::new(Car::new(make, model, year, doors))
    }

    fn create_motorcycle(make: &str, model: &str, year: u32, engine_size: u32) -> Box<dyn Vehicle> {
        Box::new(Motorcycle::new(make, model, year, engine_size))
    }

    fn create_truck(make: &str, model: &str, year: u32, capacity: f64) -> Box<dyn Vehicle> {
        Box::new(Truck::new(make, model, year, capacity))
    }

    fn create_vehicle(
        vehicle_type: VehicleType,
        make: &str,
        model: &str,
        year: u32,
        options: &[f64],
    ) -> Box<dyn Vehicle> {
        match vehicle_type {
            VehicleType::Car => {
                let doors = if options.is_empty() { 4 } else { options[0] as u32 };
                Self::create_car(make, model, year, doors)
            }
            VehicleType::Motorcycle => {
                let engine_size = if options.is_empty() { 250 } else { options[0] as u32 };
                Self::create_motorcycle(make, model, year, engine_size)
            }
            VehicleType::Truck => {
                let capacity = if options.is_empty() { 5.0 } else { options[0] };
                Self::create_truck(make, model, year, capacity)
            }
        }
    }
}

// Factory Method Pattern Implementation
trait VehicleFactoryMethod {
    fn create_vehicle(&self, make: &str, model: &str, year: u32, options: &[f64]) -> Box<dyn Vehicle>;

    fn register_vehicle(&self, make: &str, model: &str, year: u32, options: &[f64]) -> Box<dyn Vehicle> {
        // Common operations for all vehicles
        let vehicle = self.create_vehicle(make, model, year, options);
        println!("Registering {}", vehicle.get_info());
        println!("Assigning license plate");
        vehicle
    }
}

// Concrete Factories
struct CarFactory;

impl VehicleFactoryMethod for CarFactory {
    fn create_vehicle(&self, make: &str, model: &str, year: u32, options: &[f64]) -> Box<dyn Vehicle> {
        let doors = if options.is_empty() { 4 } else { options[0] as u32 };
        Box::new(Car::new(make, model, year, doors))
    }
}

struct MotorcycleFactory;

impl VehicleFactoryMethod for MotorcycleFactory {
    fn create_vehicle(&self, make: &str, model: &str, year: u32, options: &[f64]) -> Box<dyn Vehicle> {
        let engine_size = if options.is_empty() { 250 } else { options[0] as u32 };
        Box::new(Motorcycle::new(make, model, year, engine_size))
    }
}

struct TruckFactory;

impl VehicleFactoryMethod for TruckFactory {
    fn create_vehicle(&self, make: &str, model: &str, year: u32, options: &[f64]) -> Box<dyn Vehicle> {
        let capacity = if options.is_empty() { 5.0 } else { options[0] };
        Box::new(Truck::new(make, model, year, capacity))
    }
}

// Abstract Factory Pattern Implementation
// Parts
struct Engine {
    engine_type: String,
    horsepower: u32,
}

impl Engine {
    fn new(engine_type: &str, horsepower: u32) -> Self {
        Engine {
            engine_type: engine_type.to_string(),
            horsepower,
        }
    }

    fn get_specs(&self) -> String {
        format!("{} engine with {}hp", self.engine_type, self.horsepower)
    }
}

struct Transmission {
    transmission_type: String,
    gears: u32,
}

impl Transmission {
    fn new(transmission_type: &str, gears: u32) -> Self {
        Transmission {
            transmission_type: transmission_type.to_string(),
            gears,
        }
    }

    fn get_specs(&self) -> String {
        format!(
            "{} transmission with {} gears",
            self.transmission_type, self.gears
        )
    }
}

struct Chassis {
    material: String,
    weight: f64,
}

impl Chassis {
    fn new(material: &str, weight: f64) -> Self {
        Chassis {
            material: material.to_string(),
            weight,
        }
    }

    fn get_specs(&self) -> String {
        format!("{} chassis weighing {}kg", self.material, self.weight)
    }
}

// Abstract Factory
trait VehiclePartsFactory {
    fn create_engine(&self) -> Engine;
    fn create_transmission(&self) -> Transmission;
    fn create_chassis(&self) -> Chassis;
}

// Concrete Abstract Factories
struct SportVehiclePartsFactory;

impl VehiclePartsFactory for SportVehiclePartsFactory {
    fn create_engine(&self) -> Engine {
        Engine::new("V8", 450)
    }

    fn create_transmission(&self) -> Transmission {
        Transmission::new("Manual", 6)
    }

    fn create_chassis(&self) -> Chassis {
        Chassis::new("Carbon Fiber", 120.0)
    }
}

struct EconomyVehiclePartsFactory;

impl VehiclePartsFactory for EconomyVehiclePartsFactory {
    fn create_engine(&self) -> Engine {
        Engine::new("Inline-4", 180)
    }

    fn create_transmission(&self) -> Transmission {
        Transmission::new("Automatic", 5)
    }

    fn create_chassis(&self) -> Chassis {
        Chassis::new("Steel", 300.0)
    }
}

struct HeavyDutyVehiclePartsFactory;

impl VehiclePartsFactory for HeavyDutyVehiclePartsFactory {
    fn create_engine(&self) -> Engine {
        Engine::new("Diesel V6", 350)
    }

    fn create_transmission(&self) -> Transmission {
        Transmission::new("Manual", 8)
    }

    fn create_chassis(&self) -> Chassis {
        Chassis::new("Reinforced Steel", 800.0)
    }
}

// Vehicle Assembler - Uses the Abstract Factory
struct VehicleAssembler<T: VehiclePartsFactory> {
    parts_factory: T,
}

impl<T: VehiclePartsFactory> VehicleAssembler<T> {
    fn new(parts_factory: T) -> Self {
        VehicleAssembler { parts_factory }
    }

    fn assemble_vehicle(&self) {
        let engine = self.parts_factory.create_engine();
        let transmission = self.parts_factory.create_transmission();
        let chassis = self.parts_factory.create_chassis();

        println!("Assembling vehicle with:");
        println!("- {}", engine.get_specs());
        println!("- {}", transmission.get_specs());
        println!("- {}", chassis.get_specs());
    }
}

// Client code demonstration
fn client_code() {
    println!("===== Simple Factory Pattern =====");

    let car = VehicleFactory::create_vehicle(
        VehicleType::Car,
        "Toyota",
        "Camry",
        2023,
        &[4.0],
    );
    let motorcycle = VehicleFactory::create_vehicle(
        VehicleType::Motorcycle,
        "Honda",
        "CBR",
        2023,
        &[600.0],
    );
    let truck = VehicleFactory::create_vehicle(
        VehicleType::Truck,
        "Ford",
        "F-150",
        2023,
        &[3.0],
    );

    println!("{}", car.get_info());
    // We need to downcast to call specific methods
    if let Some(car) = car.as_any().downcast_ref::<Car>() {
        println!("{}", car.drive());
    }

    println!("{}", motorcycle.get_info());
    if let Some(motorcycle) = motorcycle.as_any().downcast_ref::<Motorcycle>() {
        println!("{}", motorcycle.ride());
    }

    println!("{}", truck.get_info());
    if let Some(truck) = truck.as_any().downcast_ref::<Truck>() {
        println!("{}", truck.haul());
    }

    println!("\n===== Factory Method Pattern =====");

    let car_factory = CarFactory;
    let motorcycle_factory = MotorcycleFactory;
    let truck_factory = TruckFactory;

    let new_car = car_factory.register_vehicle("BMW", "3 Series", 2023, &[2.0]);
    let new_motorcycle = motorcycle_factory.register_vehicle("Ducati", "Monster", 2023, &[821.0]);
    let new_truck = truck_factory.register_vehicle("Volvo", "VNL", 2023, &[20.0]);

    if let Some(car) = new_car.as_any().downcast_ref::<Car>() {
        println!("{}", car.drive());
    }
    if let Some(motorcycle) = new_motorcycle.as_any().downcast_ref::<Motorcycle>() {
        println!("{}", motorcycle.ride());
    }
    if let Some(truck) = new_truck.as_any().downcast_ref::<Truck>() {
        println!("{}", truck.haul());
    }

    println!("\n===== Abstract Factory Pattern =====");

    println!("Building a sports car:");
    let sport_car_assembler = VehicleAssembler::new(SportVehiclePartsFactory);
    sport_car_assembler.assemble_vehicle();

    println!("\nBuilding an economy car:");
    let economy_car_assembler = VehicleAssembler::new(EconomyVehiclePartsFactory);
    economy_car_assembler.assemble_vehicle();

    println!("\nBuilding a heavy duty truck:");
    let heavy_duty_truck_assembler = VehicleAssembler::new(HeavyDutyVehiclePartsFactory);
    heavy_duty_truck_assembler.assemble_vehicle();
}

// Extension trait to allow downcasting
trait AsAny {
    fn as_any(&self) -> &dyn std::any::Any;
}

impl<T: 'static> AsAny for T {
    fn as_any(&self) -> &dyn std::any::Any {
        self
    }
}

// Extend Vehicle trait to include AsAny
trait VehicleExt: Vehicle + AsAny {}

// Implement VehicleExt for all types that implement Vehicle
impl<T: Vehicle + AsAny> VehicleExt for T {}

// Update the Vehicle trait to include AsAny functionality
trait Vehicle: AsAny {
    fn get_info(&self) -> String;
    fn start(&self) -> String {
        format!("{} is starting...", self.get_info())
    }
    fn stop(&self) -> String {
        format!("{} is stopping...", self.get_info())
    }
}

fn main() {
    // Run the example
    client_code();
}

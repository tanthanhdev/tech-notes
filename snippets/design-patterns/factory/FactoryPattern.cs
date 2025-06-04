/**
 * Factory Pattern Implementation in C#
 *
 * The Factory Pattern is a creational design pattern that provides an interface for creating
 * objects in a superclass, but allows subclasses to alter the type of objects that will be created.
 *
 * This example demonstrates a Vehicle Factory that can create different types of vehicles
 * (Car, Motorcycle, Truck) based on the client's requirements.
 */

using System;
using System.Collections.Generic;

namespace DesignPatterns.Factory
{
    // Abstract Product - Vehicle
    public abstract class Vehicle
    {
        protected string Make { get; }
        protected string Model { get; }
        protected int Year { get; }

        protected Vehicle(string make, string model, int year)
        {
            Make = make;
            Model = model;
            Year = year;
        }

        public virtual string GetInfo()
        {
            return $"{Year} {Make} {Model}";
        }

        public virtual string Start()
        {
            return $"{GetInfo()} is starting...";
        }

        public virtual string Stop()
        {
            return $"{GetInfo()} is stopping...";
        }
    }

    // Concrete Products
    public class Car : Vehicle
    {
        public int Doors { get; }

        public Car(string make, string model, int year, int doors = 4)
            : base(make, model, year)
        {
            Doors = doors;
        }

        public override string GetInfo()
        {
            return $"{base.GetInfo()} ({Doors}-door car)";
        }

        public string Drive()
        {
            return $"{GetInfo()} is driving on the road.";
        }
    }

    public class Motorcycle : Vehicle
    {
        public int EngineSize { get; }

        public Motorcycle(string make, string model, int year, int engineSize)
            : base(make, model, year)
        {
            EngineSize = engineSize;
        }

        public override string GetInfo()
        {
            return $"{base.GetInfo()} ({EngineSize}cc motorcycle)";
        }

        public string Ride()
        {
            return $"{GetInfo()} is riding at high speed.";
        }
    }

    public class Truck : Vehicle
    {
        public double Capacity { get; }

        public Truck(string make, string model, int year, double capacity)
            : base(make, model, year)
        {
            Capacity = capacity;
        }

        public override string GetInfo()
        {
            return $"{base.GetInfo()} ({Capacity} ton truck)";
        }

        public string Haul()
        {
            return $"{GetInfo()} is hauling cargo.";
        }
    }

    // Simple Factory
    public class VehicleFactory
    {
        public enum VehicleType
        {
            Car,
            Motorcycle,
            Truck
        }

        public static Vehicle CreateVehicle(VehicleType type, string make, string model, int year, object options = null)
        {
            switch (type)
            {
                case VehicleType.Car:
                    int doors = 4;
                    if (options is int doorsOption)
                    {
                        doors = doorsOption;
                    }
                    return new Car(make, model, year, doors);

                case VehicleType.Motorcycle:
                    int engineSize = 250;
                    if (options is int engineSizeOption)
                    {
                        engineSize = engineSizeOption;
                    }
                    return new Motorcycle(make, model, year, engineSize);

                case VehicleType.Truck:
                    double capacity = 5.0;
                    if (options is double capacityOption)
                    {
                        capacity = capacityOption;
                    }
                    return new Truck(make, model, year, capacity);

                default:
                    throw new ArgumentException($"Vehicle type {type} is not supported.");
            }
        }
    }

    // Factory Method Pattern Implementation
    public abstract class VehicleFactoryMethod
    {
        public abstract Vehicle CreateVehicle(string make, string model, int year, object options = null);

        public Vehicle RegisterVehicle(string make, string model, int year, object options = null)
        {
            // Common operations for all vehicles
            Vehicle vehicle = CreateVehicle(make, model, year, options);
            Console.WriteLine($"Registering {vehicle.GetInfo()}");
            Console.WriteLine("Assigning license plate");
            return vehicle;
        }
    }

    // Concrete Factories
    public class CarFactory : VehicleFactoryMethod
    {
        public override Vehicle CreateVehicle(string make, string model, int year, object options = null)
        {
            int doors = 4;
            if (options is int doorsOption)
            {
                doors = doorsOption;
            }
            return new Car(make, model, year, doors);
        }
    }

    public class MotorcycleFactory : VehicleFactoryMethod
    {
        public override Vehicle CreateVehicle(string make, string model, int year, object options = null)
        {
            int engineSize = 250;
            if (options is int engineSizeOption)
            {
                engineSize = engineSizeOption;
            }
            return new Motorcycle(make, model, year, engineSize);
        }
    }

    public class TruckFactory : VehicleFactoryMethod
    {
        public override Vehicle CreateVehicle(string make, string model, int year, object options = null)
        {
            double capacity = 5.0;
            if (options is double capacityOption)
            {
                capacity = capacityOption;
            }
            return new Truck(make, model, year, capacity);
        }
    }

    // Abstract Factory Pattern Implementation
    // Parts
    public class Engine
    {
        public string Type { get; }
        public int Horsepower { get; }

        public Engine(string type, int horsepower)
        {
            Type = type;
            Horsepower = horsepower;
        }

        public string GetSpecs()
        {
            return $"{Type} engine with {Horsepower}hp";
        }
    }

    public class Transmission
    {
        public string Type { get; }
        public int Gears { get; }

        public Transmission(string type, int gears)
        {
            Type = type;
            Gears = gears;
        }

        public string GetSpecs()
        {
            return $"{Type} transmission with {Gears} gears";
        }
    }

    public class Chassis
    {
        public string Material { get; }
        public double Weight { get; }

        public Chassis(string material, double weight)
        {
            Material = material;
            Weight = weight;
        }

        public string GetSpecs()
        {
            return $"{Material} chassis weighing {Weight}kg";
        }
    }

    // Abstract Factory
    public interface IVehiclePartsFactory
    {
        Engine CreateEngine();
        Transmission CreateTransmission();
        Chassis CreateChassis();
    }

    // Concrete Abstract Factories
    public class SportVehiclePartsFactory : IVehiclePartsFactory
    {
        public Engine CreateEngine()
        {
            return new Engine("V8", 450);
        }

        public Transmission CreateTransmission()
        {
            return new Transmission("Manual", 6);
        }

        public Chassis CreateChassis()
        {
            return new Chassis("Carbon Fiber", 120);
        }
    }

    public class EconomyVehiclePartsFactory : IVehiclePartsFactory
    {
        public Engine CreateEngine()
        {
            return new Engine("Inline-4", 180);
        }

        public Transmission CreateTransmission()
        {
            return new Transmission("Automatic", 5);
        }

        public Chassis CreateChassis()
        {
            return new Chassis("Steel", 300);
        }
    }

    public class HeavyDutyVehiclePartsFactory : IVehiclePartsFactory
    {
        public Engine CreateEngine()
        {
            return new Engine("Diesel V6", 350);
        }

        public Transmission CreateTransmission()
        {
            return new Transmission("Manual", 8);
        }

        public Chassis CreateChassis()
        {
            return new Chassis("Reinforced Steel", 800);
        }
    }

    // Vehicle Assembler - Uses the Abstract Factory
    public class VehicleAssembler
    {
        private readonly IVehiclePartsFactory _partsFactory;

        public VehicleAssembler(IVehiclePartsFactory partsFactory)
        {
            _partsFactory = partsFactory;
        }

        public void AssembleVehicle()
        {
            Engine engine = _partsFactory.CreateEngine();
            Transmission transmission = _partsFactory.CreateTransmission();
            Chassis chassis = _partsFactory.CreateChassis();

            Console.WriteLine("Assembling vehicle with:");
            Console.WriteLine($"- {engine.GetSpecs()}");
            Console.WriteLine($"- {transmission.GetSpecs()}");
            Console.WriteLine($"- {chassis.GetSpecs()}");
        }
    }

    // Client code demonstration
    public class Client
    {
        public static void DemonstrateFactoryPattern()
        {
            Console.WriteLine("===== Simple Factory Pattern =====");

            Vehicle car = VehicleFactory.CreateVehicle(VehicleFactory.VehicleType.Car, "Toyota", "Camry", 2023, 4);
            Vehicle motorcycle = VehicleFactory.CreateVehicle(VehicleFactory.VehicleType.Motorcycle, "Honda", "CBR", 2023, 600);
            Vehicle truck = VehicleFactory.CreateVehicle(VehicleFactory.VehicleType.Truck, "Ford", "F-150", 2023, 3.0);

            Console.WriteLine(car.GetInfo());
            Console.WriteLine(((Car)car).Drive());

            Console.WriteLine(motorcycle.GetInfo());
            Console.WriteLine(((Motorcycle)motorcycle).Ride());

            Console.WriteLine(truck.GetInfo());
            Console.WriteLine(((Truck)truck).Haul());

            Console.WriteLine("\n===== Factory Method Pattern =====");

            CarFactory carFactory = new CarFactory();
            MotorcycleFactory motorcycleFactory = new MotorcycleFactory();
            TruckFactory truckFactory = new TruckFactory();

            Vehicle newCar = carFactory.RegisterVehicle("BMW", "3 Series", 2023, 2);
            Vehicle newMotorcycle = motorcycleFactory.RegisterVehicle("Ducati", "Monster", 2023, 821);
            Vehicle newTruck = truckFactory.RegisterVehicle("Volvo", "VNL", 2023, 20.0);

            Console.WriteLine(((Car)newCar).Drive());
            Console.WriteLine(((Motorcycle)newMotorcycle).Ride());
            Console.WriteLine(((Truck)newTruck).Haul());

            Console.WriteLine("\n===== Abstract Factory Pattern =====");

            Console.WriteLine("Building a sports car:");
            VehicleAssembler sportCarAssembler = new VehicleAssembler(new SportVehiclePartsFactory());
            sportCarAssembler.AssembleVehicle();

            Console.WriteLine("\nBuilding an economy car:");
            VehicleAssembler economyCarAssembler = new VehicleAssembler(new EconomyVehiclePartsFactory());
            economyCarAssembler.AssembleVehicle();

            Console.WriteLine("\nBuilding a heavy duty truck:");
            VehicleAssembler heavyDutyTruckAssembler = new VehicleAssembler(new HeavyDutyVehiclePartsFactory());
            heavyDutyTruckAssembler.AssembleVehicle();
        }
    }

    // Main program, run the example
    class Program
    {
        static void Main(string[] args)
        {
            Client.DemonstrateFactoryPattern();
            Console.ReadLine();
        }
    }
}

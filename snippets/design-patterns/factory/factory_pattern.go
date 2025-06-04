/**
 * Factory Pattern Implementation in Go
 *
 * The Factory Pattern is a creational design pattern that provides an interface for creating
 * objects in a superclass, but allows subclasses to alter the type of objects that will be created.
 *
 * This example demonstrates a Vehicle Factory that can create different types of vehicles
 * (Car, Motorcycle, Truck) based on the client's requirements.
 */

package main

import (
	"fmt"
	"strconv"
)

// Vehicle is the abstract product interface
type Vehicle interface {
	GetInfo() string
	Start() string
	Stop() string
}

// Car is a concrete product
type Car struct {
	Make  string
	Model string
	Year  int
	Doors int
}

func NewCar(make, model string, year, doors int) *Car {
	return &Car{
		Make:  make,
		Model: model,
		Year:  year,
		Doors: doors,
	}
}

func (c *Car) GetInfo() string {
	return strconv.Itoa(c.Year) + " " + c.Make + " " + c.Model + " (" + strconv.Itoa(c.Doors) + "-door car)"
}

func (c *Car) Start() string {
	return c.GetInfo() + " is starting..."
}

func (c *Car) Stop() string {
	return c.GetInfo() + " is stopping..."
}

func (c *Car) Drive() string {
	return c.GetInfo() + " is driving on the road."
}

// Motorcycle is a concrete product
type Motorcycle struct {
	Make       string
	Model      string
	Year       int
	EngineSize int
}

func NewMotorcycle(make, model string, year, engineSize int) *Motorcycle {
	return &Motorcycle{
		Make:       make,
		Model:      model,
		Year:       year,
		EngineSize: engineSize,
	}
}

func (m *Motorcycle) GetInfo() string {
	return strconv.Itoa(m.Year) + " " + m.Make + " " + m.Model + " (" + strconv.Itoa(m.EngineSize) + "cc motorcycle)"
}

func (m *Motorcycle) Start() string {
	return m.GetInfo() + " is starting..."
}

func (m *Motorcycle) Stop() string {
	return m.GetInfo() + " is stopping..."
}

func (m *Motorcycle) Ride() string {
	return m.GetInfo() + " is riding at high speed."
}

// Truck is a concrete product
type Truck struct {
	Make     string
	Model    string
	Year     int
	Capacity float64
}

func NewTruck(make, model string, year int, capacity float64) *Truck {
	return &Truck{
		Make:     make,
		Model:    model,
		Year:     year,
		Capacity: capacity,
	}
}

func (t *Truck) GetInfo() string {
	return strconv.Itoa(t.Year) + " " + t.Make + " " + t.Model + " (" + fmt.Sprintf("%.1f", t.Capacity) + " ton truck)"
}

func (t *Truck) Start() string {
	return t.GetInfo() + " is starting..."
}

func (t *Truck) Stop() string {
	return t.GetInfo() + " is stopping..."
}

func (t *Truck) Haul() string {
	return t.GetInfo() + " is hauling cargo."
}

// VehicleType defines the type of vehicle to create
type VehicleType string

const (
	CarType        VehicleType = "car"
	MotorcycleType VehicleType = "motorcycle"
	TruckType      VehicleType = "truck"
)

// SimpleVehicleFactory is a simple factory implementation
type SimpleVehicleFactory struct{}

// CreateVehicle creates a vehicle based on the given type
func (f *SimpleVehicleFactory) CreateVehicle(vehicleType VehicleType, make, model string, year int, options map[string]interface{}) (Vehicle, error) {
	switch vehicleType {
	case CarType:
		doors := 4 // default value
		if val, ok := options["doors"]; ok {
			if doorsVal, ok := val.(int); ok {
				doors = doorsVal
			}
		}
		return NewCar(make, model, year, doors), nil

	case MotorcycleType:
		engineSize := 250 // default value
		if val, ok := options["engineSize"]; ok {
			if engineSizeVal, ok := val.(int); ok {
				engineSize = engineSizeVal
			}
		}
		return NewMotorcycle(make, model, year, engineSize), nil

	case TruckType:
		capacity := 5.0 // default value
		if val, ok := options["capacity"]; ok {
			if capacityVal, ok := val.(float64); ok {
				capacity = capacityVal
			}
		}
		return NewTruck(make, model, year, capacity), nil

	default:
		return nil, fmt.Errorf("unknown vehicle type: %s", vehicleType)
	}
}

// VehicleFactoryMethod is the factory method interface
type VehicleFactoryMethod interface {
	CreateVehicle(make, model string, year int, options map[string]interface{}) Vehicle
	RegisterVehicle(make, model string, year int, options map[string]interface{}) Vehicle
}

// CarFactory is a concrete factory implementation
type CarFactory struct{}

func (f *CarFactory) CreateVehicle(make, model string, year int, options map[string]interface{}) Vehicle {
	doors := 4 // default value
	if val, ok := options["doors"]; ok {
		if doorsVal, ok := val.(int); ok {
			doors = doorsVal
		}
	}
	return NewCar(make, model, year, doors)
}

func (f *CarFactory) RegisterVehicle(make, model string, year int, options map[string]interface{}) Vehicle {
	vehicle := f.CreateVehicle(make, model, year, options)
	fmt.Printf("Registering %s\n", vehicle.GetInfo())
	fmt.Println("Assigning license plate to car")
	return vehicle
}

// MotorcycleFactory is a concrete factory implementation
type MotorcycleFactory struct{}

func (f *MotorcycleFactory) CreateVehicle(make, model string, year int, options map[string]interface{}) Vehicle {
	engineSize := 250 // default value
	if val, ok := options["engineSize"]; ok {
		if engineSizeVal, ok := val.(int); ok {
			engineSize = engineSizeVal
		}
	}
	return NewMotorcycle(make, model, year, engineSize)
}

func (f *MotorcycleFactory) RegisterVehicle(make, model string, year int, options map[string]interface{}) Vehicle {
	vehicle := f.CreateVehicle(make, model, year, options)
	fmt.Printf("Registering %s\n", vehicle.GetInfo())
	fmt.Println("Assigning license plate to motorcycle")
	return vehicle
}

// TruckFactory is a concrete factory implementation
type TruckFactory struct{}

func (f *TruckFactory) CreateVehicle(make, model string, year int, options map[string]interface{}) Vehicle {
	capacity := 5.0 // default value
	if val, ok := options["capacity"]; ok {
		if capacityVal, ok := val.(float64); ok {
			capacity = capacityVal
		}
	}
	return NewTruck(make, model, year, capacity)
}

func (f *TruckFactory) RegisterVehicle(make, model string, year int, options map[string]interface{}) Vehicle {
	vehicle := f.CreateVehicle(make, model, year, options)
	fmt.Printf("Registering %s\n", vehicle.GetInfo())
	fmt.Println("Assigning license plate to truck")
	return vehicle
}

// Abstract Factory Pattern Implementation

// Engine represents a vehicle engine
type Engine struct {
	Type       string
	Horsepower int
}

func (e *Engine) GetSpecs() string {
	return e.Type + " engine with " + strconv.Itoa(e.Horsepower) + "hp"
}

// Transmission represents a vehicle transmission
type Transmission struct {
	Type  string
	Gears int
}

func (t *Transmission) GetSpecs() string {
	return t.Type + " transmission with " + strconv.Itoa(t.Gears) + " gears"
}

// Chassis represents a vehicle chassis
type Chassis struct {
	Material string
	Weight   float64
}

func (c *Chassis) GetSpecs() string {
	return c.Material + " chassis weighing " + fmt.Sprintf("%.1f", c.Weight) + "kg"
}

// VehiclePartsFactory is the abstract factory interface
type VehiclePartsFactory interface {
	CreateEngine() *Engine
	CreateTransmission() *Transmission
	CreateChassis() *Chassis
}

// SportVehiclePartsFactory creates parts for sport vehicles
type SportVehiclePartsFactory struct{}

func (f *SportVehiclePartsFactory) CreateEngine() *Engine {
	return &Engine{Type: "V8", Horsepower: 450}
}

func (f *SportVehiclePartsFactory) CreateTransmission() *Transmission {
	return &Transmission{Type: "Manual", Gears: 6}
}

func (f *SportVehiclePartsFactory) CreateChassis() *Chassis {
	return &Chassis{Material: "Carbon Fiber", Weight: 120.0}
}

// EconomyVehiclePartsFactory creates parts for economy vehicles
type EconomyVehiclePartsFactory struct{}

func (f *EconomyVehiclePartsFactory) CreateEngine() *Engine {
	return &Engine{Type: "Inline-4", Horsepower: 180}
}

func (f *EconomyVehiclePartsFactory) CreateTransmission() *Transmission {
	return &Transmission{Type: "Automatic", Gears: 5}
}

func (f *EconomyVehiclePartsFactory) CreateChassis() *Chassis {
	return &Chassis{Material: "Steel", Weight: 300.0}
}

// HeavyDutyVehiclePartsFactory creates parts for heavy duty vehicles
type HeavyDutyVehiclePartsFactory struct{}

func (f *HeavyDutyVehiclePartsFactory) CreateEngine() *Engine {
	return &Engine{Type: "Diesel V6", Horsepower: 350}
}

func (f *HeavyDutyVehiclePartsFactory) CreateTransmission() *Transmission {
	return &Transmission{Type: "Manual", Gears: 8}
}

func (f *HeavyDutyVehiclePartsFactory) CreateChassis() *Chassis {
	return &Chassis{Material: "Reinforced Steel", Weight: 800.0}
}

// VehicleAssembler uses the abstract factory to assemble vehicles
type VehicleAssembler struct {
	PartsFactory VehiclePartsFactory
}

func NewVehicleAssembler(factory VehiclePartsFactory) *VehicleAssembler {
	return &VehicleAssembler{PartsFactory: factory}
}

func (a *VehicleAssembler) AssembleVehicle() {
	engine := a.PartsFactory.CreateEngine()
	transmission := a.PartsFactory.CreateTransmission()
	chassis := a.PartsFactory.CreateChassis()

	fmt.Println("Assembling vehicle with:")
	fmt.Println("- " + engine.GetSpecs())
	fmt.Println("- " + transmission.GetSpecs())
	fmt.Println("- " + chassis.GetSpecs())
}

// Example client code
func clientCode() {
	fmt.Println("===== Simple Factory Pattern =====")

	factory := &SimpleVehicleFactory{}

	car, _ := factory.CreateVehicle(CarType, "Toyota", "Camry", 2023, map[string]interface{}{"doors": 4})
	motorcycle, _ := factory.CreateVehicle(MotorcycleType, "Honda", "CBR", 2023, map[string]interface{}{"engineSize": 600})
	truck, _ := factory.CreateVehicle(TruckType, "Ford", "F-150", 2023, map[string]interface{}{"capacity": 3.0})

	fmt.Println(car.GetInfo())
	fmt.Println(car.(*Car).Drive())

	fmt.Println(motorcycle.GetInfo())
	fmt.Println(motorcycle.(*Motorcycle).Ride())

	fmt.Println(truck.GetInfo())
	fmt.Println(truck.(*Truck).Haul())

	fmt.Println("\n===== Factory Method Pattern =====")

	carFactory := &CarFactory{}
	motorcycleFactory := &MotorcycleFactory{}
	truckFactory := &TruckFactory{}

	newCar := carFactory.RegisterVehicle("BMW", "3 Series", 2023, map[string]interface{}{"doors": 2})
	newMotorcycle := motorcycleFactory.RegisterVehicle("Ducati", "Monster", 2023, map[string]interface{}{"engineSize": 821})
	newTruck := truckFactory.RegisterVehicle("Volvo", "VNL", 2023, map[string]interface{}{"capacity": 20.0})

	fmt.Println(newCar.(*Car).Drive())
	fmt.Println(newMotorcycle.(*Motorcycle).Ride())
	fmt.Println(newTruck.(*Truck).Haul())

	fmt.Println("\n===== Abstract Factory Pattern =====")

	sportFactory := &SportVehiclePartsFactory{}
	economyFactory := &EconomyVehiclePartsFactory{}
	heavyDutyFactory := &HeavyDutyVehiclePartsFactory{}

	fmt.Println("Building a sports car:")
	sportAssembler := NewVehicleAssembler(sportFactory)
	sportAssembler.AssembleVehicle()

	fmt.Println("\nBuilding an economy car:")
	economyAssembler := NewVehicleAssembler(economyFactory)
	economyAssembler.AssembleVehicle()

	fmt.Println("\nBuilding a heavy duty truck:")
	heavyDutyAssembler := NewVehicleAssembler(heavyDutyFactory)
	heavyDutyAssembler.AssembleVehicle()
}

func main() {
	// Run the example
	clientCode()
}

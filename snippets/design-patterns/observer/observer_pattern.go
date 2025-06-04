package main

import (
	"fmt"
	"math"
)

/**
 * Observer Pattern Implementation in Go
 * 
 * This demonstrates a weather station example of the Observer pattern.
 */

// Observer interface defines the update method
type Observer interface {
	Update(subject Subject)
	Display()
}

// Subject interface defines methods for attaching, detaching, and notifying observers
type Subject interface {
	RegisterObserver(observer Observer)
	RemoveObserver(observer Observer)
	NotifyObservers()
	GetTemperature() float64
	GetHumidity() float64
	GetPressure() float64
}

// WeatherStation is a concrete subject
type WeatherStation struct {
	observers   []Observer
	temperature float64
	humidity    float64
	pressure    float64
}

// NewWeatherStation creates a new WeatherStation
func NewWeatherStation() *WeatherStation {
	return &WeatherStation{
		observers:   make([]Observer, 0),
		temperature: 0,
		humidity:    0,
		pressure:    0,
	}
}

// RegisterObserver adds an observer to the list
func (ws *WeatherStation) RegisterObserver(observer Observer) {
	fmt.Println("Registering an observer")
	ws.observers = append(ws.observers, observer)
}

// RemoveObserver removes an observer from the list
func (ws *WeatherStation) RemoveObserver(observer Observer) {
	fmt.Println("Removing an observer")
	for i, obs := range ws.observers {
		if obs == observer {
			// Remove the observer by slicing it out
			ws.observers = append(ws.observers[:i], ws.observers[i+1:]...)
			break
		}
	}
}

// NotifyObservers notifies all registered observers
func (ws *WeatherStation) NotifyObservers() {
	fmt.Println("Notifying observers...")
	for _, observer := range ws.observers {
		observer.Update(ws)
	}
}

// SetMeasurements sets the measurements and notifies observers
func (ws *WeatherStation) SetMeasurements(temperature, humidity, pressure float64) {
	fmt.Printf("Setting measurements: %.1f°C, %.1f%%, %.1f hPa\n", temperature, humidity, pressure)
	ws.temperature = temperature
	ws.humidity = humidity
	ws.pressure = pressure
	ws.MeasurementsChanged()
}

// MeasurementsChanged triggers notifications
func (ws *WeatherStation) MeasurementsChanged() {
	ws.NotifyObservers()
}

// Getter methods for observers
func (ws *WeatherStation) GetTemperature() float64 {
	return ws.temperature
}

func (ws *WeatherStation) GetHumidity() float64 {
	return ws.humidity
}

func (ws *WeatherStation) GetPressure() float64 {
	return ws.pressure
}

// CurrentConditionsDisplay is a concrete observer that displays current conditions
type CurrentConditionsDisplay struct {
	temperature   float64
	humidity      float64
	weatherStation Subject
}

// NewCurrentConditionsDisplay creates a new CurrentConditionsDisplay
func NewCurrentConditionsDisplay(weatherStation Subject) *CurrentConditionsDisplay {
	display := &CurrentConditionsDisplay{
		temperature:   0,
		humidity:      0,
		weatherStation: weatherStation,
	}
	weatherStation.RegisterObserver(display)
	return display
}

// Update is called when the subject's state changes
func (cd *CurrentConditionsDisplay) Update(subject Subject) {
	cd.temperature = subject.GetTemperature()
	cd.humidity = subject.GetHumidity()
	cd.Display()
}

// Display shows the current conditions
func (cd *CurrentConditionsDisplay) Display() {
	fmt.Printf("Current conditions: %.1f°C and %.1f%% humidity\n", cd.temperature, cd.humidity)
}

// StatisticsDisplay is a concrete observer that displays statistics
type StatisticsDisplay struct {
	maxTemp      float64
	minTemp      float64
	tempSum      float64
	numReadings  int
	weatherStation Subject
}

// NewStatisticsDisplay creates a new StatisticsDisplay
func NewStatisticsDisplay(weatherStation Subject) *StatisticsDisplay {
	display := &StatisticsDisplay{
		maxTemp:      0,
		minTemp:      200, // A high starting value
		tempSum:      0,
		numReadings:  0,
		weatherStation: weatherStation,
	}
	weatherStation.RegisterObserver(display)
	return display
}

// Update is called when the subject's state changes
func (sd *StatisticsDisplay) Update(subject Subject) {
	temp := subject.GetTemperature()
	sd.tempSum += temp
	sd.numReadings++

	sd.maxTemp = math.Max(sd.maxTemp, temp)
	sd.minTemp = math.Min(sd.minTemp, temp)

	sd.Display()
}

// Display shows the temperature statistics
func (sd *StatisticsDisplay) Display() {
	avgTemp := sd.tempSum / float64(sd.numReadings)
	fmt.Printf("Avg/Max/Min temperature: %.1f/%.1f/%.1f\n", avgTemp, sd.maxTemp, sd.minTemp)
}

// ForecastDisplay is a concrete observer that displays weather forecasts
type ForecastDisplay struct {
	currentPressure float64
	lastPressure    float64
	weatherStation   Subject
}

// NewForecastDisplay creates a new ForecastDisplay
func NewForecastDisplay(weatherStation Subject) *ForecastDisplay {
	display := &ForecastDisplay{
		currentPressure: 29.92, // Starting with a default value
		lastPressure:    0,
		weatherStation:   weatherStation,
	}
	weatherStation.RegisterObserver(display)
	return display
}

// Update is called when the subject's state changes
func (fd *ForecastDisplay) Update(subject Subject) {
	fd.lastPressure = fd.currentPressure
	fd.currentPressure = subject.GetPressure()
	fd.Display()
}

// Display shows the weather forecast
func (fd *ForecastDisplay) Display() {
	fmt.Print("Forecast: ")
	if fd.currentPressure > fd.lastPressure {
		fmt.Println("Improving weather on the way!")
	} else if fd.currentPressure == fd.lastPressure {
		fmt.Println("More of the same")
	} else if fd.currentPressure < fd.lastPressure {
		fmt.Println("Watch out for cooler, rainy weather")
	}
}

// ChannelObserver shows an alternative implementation using Go channels
type ChannelObserver struct {
	ch chan WeatherData
}

// WeatherData represents the data sent through channels
type WeatherData struct {
	Temperature float64
	Humidity    float64
	Pressure    float64
}

// NewChannelObserver creates a new channel-based observer
func NewChannelObserver() *ChannelObserver {
	return &ChannelObserver{
		ch: make(chan WeatherData, 10), // Buffered channel to avoid blocking
	}
}

// Start begins listening for weather updates
func (co *ChannelObserver) Start() {
	go func() {
		for data := range co.ch {
			fmt.Printf("\nChannel Observer: Received weather update: %.1f°C, %.1f%%, %.1f hPa\n",
				data.Temperature, data.Humidity, data.Pressure)
		}
	}()
}

// Stop closes the channel and stops the goroutine
func (co *ChannelObserver) Stop() {
	close(co.ch)
}

// SendUpdate sends weather data to the observer
func (co *ChannelObserver) SendUpdate(data WeatherData) {
	select {
	case co.ch <- data:
		// Data sent successfully
	default:
		fmt.Println("Channel full, update dropped")
	}
}

func main() {
	fmt.Println("Observer Pattern Demonstration in Go")
	fmt.Println("===================================")

	// Create the weather station (subject)
	weatherStation := NewWeatherStation()

	// Create and register displays (observers)
	currentDisplay := NewCurrentConditionsDisplay(weatherStation)
	statisticsDisplay := NewStatisticsDisplay(weatherStation)
	forecastDisplay := NewForecastDisplay(weatherStation)

	// Simulate weather changes
	fmt.Println("\nFirst weather update:")
	weatherStation.SetMeasurements(27.5, 65.0, 30.4)

	fmt.Println("\nSecond weather update:")
	weatherStation.SetMeasurements(28.2, 70.0, 29.2)

	// Remove an observer
	fmt.Println("\nRemoving current conditions display...")
	weatherStation.RemoveObserver(currentDisplay)

	fmt.Println("\nThird weather update (with one less observer):")
	weatherStation.SetMeasurements(26.7, 90.0, 29.2)

	// Demonstrate channel-based implementation
	fmt.Println("\nChannel-based Observer Demo:")
	fmt.Println("---------------------------")
	channelObserver := NewChannelObserver()
	channelObserver.Start()

	fmt.Println("Sending updates via channel...")
	channelObserver.SendUpdate(WeatherData{27.5, 65.0, 30.4})
	channelObserver.SendUpdate(WeatherData{28.2, 70.0, 29.2})
	channelObserver.SendUpdate(WeatherData{26.7, 90.0, 29.2})

	// Allow time for the goroutine to process
	fmt.Println("\nPress Enter to exit...")
	fmt.Scanln()

	// Clean up
	channelObserver.Stop()
} 
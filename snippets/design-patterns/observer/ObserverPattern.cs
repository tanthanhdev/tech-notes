/**
 * Observer Pattern Implementation in C#
 *
 * The Observer Pattern is a behavioral design pattern that defines a one-to-many dependency
 * between objects so that when one object changes state, all its dependents are notified
 * and updated automatically.
 *
 * This example demonstrates a simple weather station (subject) that notifies
 * multiple display devices (observers) when weather data changes.
 */

using System;
using System.Collections.Generic;

namespace DesignPatterns.Observer
{
    // ========== Observer Interface ==========

    /// <summary>
    /// Observer interface to be implemented by all display devices
    /// </summary>
    public interface IObserver
    {
        /// <summary>
        /// Update method called by the subject when state changes
        /// </summary>
        /// <param name="temperature">The current temperature</param>
        /// <param name="humidity">The current humidity</param>
        /// <param name="pressure">The current pressure</param>
        void Update(float temperature, float humidity, float pressure);

        /// <summary>
        /// Gets the name of the observer for identification
        /// </summary>
        string Name { get; }
    }

    // ========== Subject Interface ==========

    /// <summary>
    /// Subject interface to be implemented by objects that notify observers
    /// </summary>
    public interface ISubject
    {
        /// <summary>
        /// Register an observer to be notified of changes
        /// </summary>
        /// <param name="observer">The observer to register</param>
        void RegisterObserver(IObserver observer);

        /// <summary>
        /// Remove an observer from the notification list
        /// </summary>
        /// <param name="observer">The observer to remove</param>
        void RemoveObserver(IObserver observer);

        /// <summary>
        /// Notify all registered observers of state changes
        /// </summary>
        void NotifyObservers();
    }

    // ========== Weather Data Implementation ==========

    /// <summary>
    /// WeatherData class implements the ISubject interface
    /// Maintains the current weather state and notifies observers when it changes
    /// </summary>
    public class WeatherData : ISubject
    {
        private readonly List<IObserver> _observers;
        private float _temperature;
        private float _humidity;
        private float _pressure;

        /// <summary>
        /// Constructor initializes the observers list
        /// </summary>
        public WeatherData()
        {
            _observers = new List<IObserver>();
        }

        /// <summary>
        /// Register an observer to be notified of changes
        /// </summary>
        /// <param name="observer">The observer to register</param>
        public void RegisterObserver(IObserver observer)
        {
            _observers.Add(observer);
            Console.WriteLine($"Observer '{observer.Name}' registered");
        }

        /// <summary>
        /// Remove an observer from the notification list
        /// </summary>
        /// <param name="observer">The observer to remove</param>
        public void RemoveObserver(IObserver observer)
        {
            if (_observers.Remove(observer))
            {
                Console.WriteLine($"Observer '{observer.Name}' removed");
            }
        }

        /// <summary>
        /// Notify all registered observers of state changes
        /// </summary>
        public void NotifyObservers()
        {
            foreach (var observer in _observers)
            {
                observer.Update(_temperature, _humidity, _pressure);
            }
        }

        /// <summary>
        /// Called when measurements have been updated
        /// </summary>
        private void MeasurementsChanged()
        {
            NotifyObservers();
        }

        /// <summary>
        /// Set new weather measurements
        /// </summary>
        /// <param name="temperature">New temperature value</param>
        /// <param name="humidity">New humidity value</param>
        /// <param name="pressure">New pressure value</param>
        public void SetMeasurements(float temperature, float humidity, float pressure)
        {
            _temperature = temperature;
            _humidity = humidity;
            _pressure = pressure;
            MeasurementsChanged();
        }

        /// <summary>
        /// Get the current temperature
        /// </summary>
        public float Temperature => _temperature;

        /// <summary>
        /// Get the current humidity
        /// </summary>
        public float Humidity => _humidity;

        /// <summary>
        /// Get the current pressure
        /// </summary>
        public float Pressure => _pressure;
    }

    // ========== Display Implementations ==========

    /// <summary>
    /// CurrentConditionsDisplay implements the IObserver interface
    /// Displays the current weather conditions
    /// </summary>
    public class CurrentConditionsDisplay : IObserver
    {
        private readonly ISubject _weatherData;
        private float _temperature;
        private float _humidity;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="weatherData">The weather data subject</param>
        /// <param name="name">The name of this observer</param>
        public CurrentConditionsDisplay(ISubject weatherData, string name)
        {
            Name = name;
            _weatherData = weatherData;
            weatherData.RegisterObserver(this);
        }

        /// <summary>
        /// Update method implementation
        /// </summary>
        /// <param name="temperature">The current temperature</param>
        /// <param name="humidity">The current humidity</param>
        /// <param name="pressure">The current pressure</param>
        public void Update(float temperature, float humidity, float pressure)
        {
            _temperature = temperature;
            _humidity = humidity;
            Display();
        }

        /// <summary>
        /// Display the current conditions
        /// </summary>
        public void Display()
        {
            Console.WriteLine($"[{Name}] Current conditions: {_temperature:F1}°F and {_humidity:F1}% humidity");
        }

        /// <summary>
        /// Gets the name of the observer
        /// </summary>
        public string Name { get; }
    }

    /// <summary>
    /// StatisticsDisplay implements the IObserver interface
    /// Displays average, minimum, and maximum temperatures
    /// </summary>
    public class StatisticsDisplay : IObserver
    {
        private readonly ISubject _weatherData;
        private float _maxTemp = 0.0f;
        private float _minTemp = 200.0f;
        private float _tempSum = 0.0f;
        private int _numReadings = 0;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="weatherData">The weather data subject</param>
        /// <param name="name">The name of this observer</param>
        public StatisticsDisplay(ISubject weatherData, string name)
        {
            Name = name;
            _weatherData = weatherData;
            weatherData.RegisterObserver(this);
        }

        /// <summary>
        /// Update method implementation
        /// </summary>
        /// <param name="temperature">The current temperature</param>
        /// <param name="humidity">The current humidity</param>
        /// <param name="pressure">The current pressure</param>
        public void Update(float temperature, float humidity, float pressure)
        {
            _tempSum += temperature;
            _numReadings++;

            if (temperature > _maxTemp)
            {
                _maxTemp = temperature;
            }

            if (temperature < _minTemp)
            {
                _minTemp = temperature;
            }

            Display();
        }

        /// <summary>
        /// Display the statistics
        /// </summary>
        public void Display()
        {
            Console.WriteLine($"[{Name}] Avg/Max/Min temperature: {_tempSum / _numReadings:F1}/{_maxTemp:F1}/{_minTemp:F1}");
        }

        /// <summary>
        /// Gets the name of the observer
        /// </summary>
        public string Name { get; }
    }

    /// <summary>
    /// ForecastDisplay implements the IObserver interface
    /// Displays a simple weather forecast based on pressure changes
    /// </summary>
    public class ForecastDisplay : IObserver
    {
        private readonly ISubject _weatherData;
        private float _currentPressure = 29.92f;
        private float _lastPressure;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="weatherData">The weather data subject</param>
        /// <param name="name">The name of this observer</param>
        public ForecastDisplay(ISubject weatherData, string name)
        {
            Name = name;
            _weatherData = weatherData;
            weatherData.RegisterObserver(this);
        }

        /// <summary>
        /// Update method implementation
        /// </summary>
        /// <param name="temperature">The current temperature</param>
        /// <param name="humidity">The current humidity</param>
        /// <param name="pressure">The current pressure</param>
        public void Update(float temperature, float humidity, float pressure)
        {
            _lastPressure = _currentPressure;
            _currentPressure = pressure;
            Display();
        }

        /// <summary>
        /// Display the forecast
        /// </summary>
        public void Display()
        {
            Console.Write($"[{Name}] Forecast: ");

            if (_currentPressure > _lastPressure)
            {
                Console.WriteLine("Improving weather on the way!");
            }
            else if (Math.Abs(_currentPressure - _lastPressure) < 0.001)
            {
                Console.WriteLine("More of the same");
            }
            else
            {
                Console.WriteLine("Watch out for cooler, rainy weather");
            }
        }

        /// <summary>
        /// Gets the name of the observer
        /// </summary>
        public string Name { get; }
    }

    /// <summary>
    /// HeatIndexDisplay implements the IObserver interface
    /// Displays the heat index based on temperature and humidity
    /// </summary>
    public class HeatIndexDisplay : IObserver
    {
        private readonly ISubject _weatherData;
        private float _heatIndex = 0.0f;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="weatherData">The weather data subject</param>
        /// <param name="name">The name of this observer</param>
        public HeatIndexDisplay(ISubject weatherData, string name)
        {
            Name = name;
            _weatherData = weatherData;
            weatherData.RegisterObserver(this);
        }

        /// <summary>
        /// Update method implementation
        /// </summary>
        /// <param name="temperature">The current temperature</param>
        /// <param name="humidity">The current humidity</param>
        /// <param name="pressure">The current pressure</param>
        public void Update(float temperature, float humidity, float pressure)
        {
            _heatIndex = ComputeHeatIndex(temperature, humidity);
            Display();
        }

        /// <summary>
        /// Compute the heat index based on temperature and humidity
        /// </summary>
        /// <param name="t">Temperature</param>
        /// <param name="rh">Relative humidity</param>
        /// <returns>Heat index</returns>
        private float ComputeHeatIndex(float t, float rh)
        {
            // This is a simplified formula for heat index
            return (float)((16.923 + (0.185212 * t) + (5.37941 * rh) - (0.100254 * t * rh) +
                          (0.00941695 * (t * t)) + (0.00728898 * (rh * rh)) +
                          (0.000345372 * (t * t * rh)) - (0.000814971 * (t * rh * rh)) +
                          (0.0000102102 * (t * t * rh * rh)) - (0.000038646 * (t * t * t)) +
                          (0.0000291583 * (rh * rh * rh)) + (0.00000142721 * (t * t * t * rh)) +
                          (0.000000197483 * (t * rh * rh * rh)) - (0.0000000218429 * (t * t * t * rh * rh)) +
                          0.000000000843296 * (t * t * rh * rh * rh)) -
                          (0.0000000000481975 * (t * t * t * rh * rh * rh));
        }

        /// <summary>
        /// Display the heat index
        /// </summary>
        public void Display()
        {
            Console.WriteLine($"[{Name}] Heat index: {_heatIndex:F1}");
        }

        /// <summary>
        /// Gets the name of the observer
        /// </summary>
        public string Name { get; }
    }

    // ========== Demo Code ==========

    /// <summary>
    /// Demo class to run the weather station example
    /// </summary>
    public class WeatherStationDemo
    {
        /// <summary>
        /// Run the weather station demo
        /// </summary>
        public static void RunWeatherStation()
        {
            // Create the WeatherData subject
            var weatherData = new WeatherData();

            // Create display devices (observers)
            var currentDisplay = new CurrentConditionsDisplay(weatherData, "Current Display");
            var statisticsDisplay = new StatisticsDisplay(weatherData, "Statistics Display");
            var forecastDisplay = new ForecastDisplay(weatherData, "Forecast Display");
            var heatIndexDisplay = new HeatIndexDisplay(weatherData, "Heat Index Display");

            Console.WriteLine("\n=== First Weather Update ===");
            // Simulate new weather measurements
            weatherData.SetMeasurements(80, 65, 30.4f);

            Console.WriteLine("\n=== Second Weather Update ===");
            // Simulate new weather measurements
            weatherData.SetMeasurements(82, 70, 29.2f);

            Console.WriteLine("\n=== Third Weather Update ===");
            // Simulate new weather measurements
            weatherData.SetMeasurements(78, 90, 29.2f);

            Console.WriteLine("\n=== Removing an Observer ===");
            // Remove an observer
            weatherData.RemoveObserver(forecastDisplay);

            Console.WriteLine("\n=== Fourth Weather Update ===");
            // One more measurement after removing an observer
            weatherData.SetMeasurements(75, 60, 30.1f);
        }
    }

    // Main program, run the example
    class Program
    {
        static void Main(string[] args)
        {
            WeatherStationDemo.RunWeatherStation();
            Console.ReadLine();
        }
    }
}
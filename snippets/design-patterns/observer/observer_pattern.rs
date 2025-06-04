/**
 * Observer Pattern Implementation in Rust
 *
 * The Observer Pattern is a behavioral design pattern that defines a one-to-many dependency
 * between objects so that when one object changes state, all its dependents are notified
 * and updated automatically.
 *
 * This example demonstrates a simple weather station (subject) that notifies
 * multiple display devices (observers) when weather data changes.
 */

use std::cell::RefCell;
use std::rc::{Rc, Weak};
use std::fmt;

// ========== Observer Trait ==========

/// Observer trait to be implemented by all display devices
trait Observer {
    /// Update method called by the subject when state changes
    fn update(&mut self, temperature: f32, humidity: f32, pressure: f32);

    /// Get the name of the observer for identification
    fn name(&self) -> &str;
}

// ========== Subject Trait ==========

/// Subject trait to be implemented by objects that notify observers
trait Subject {
    /// Register an observer to be notified of changes
    fn register_observer(&mut self, observer: Rc<RefCell<dyn Observer>>);

    /// Remove an observer from the notification list
    fn remove_observer(&mut self, observer: &Rc<RefCell<dyn Observer>>);

    /// Notify all registered observers of state changes
    fn notify_observers(&self);
}

// ========== Weather Data Implementation ==========

/// WeatherData struct implements the Subject trait
struct WeatherData {
    observers: Vec<Weak<RefCell<dyn Observer>>>,
    temperature: f32,
    humidity: f32,
    pressure: f32,
}

impl WeatherData {
    /// Create a new WeatherData instance
    fn new() -> Self {
        WeatherData {
            observers: Vec::new(),
            temperature: 0.0,
            humidity: 0.0,
            pressure: 0.0,
        }
    }

    /// Called when measurements have been updated
    fn measurements_changed(&self) {
        self.notify_observers();
    }

    /// Set new weather measurements
    fn set_measurements(&mut self, temperature: f32, humidity: f32, pressure: f32) {
        self.temperature = temperature;
        self.humidity = humidity;
        self.pressure = pressure;
        self.measurements_changed();
    }
}

impl Subject for WeatherData {
    fn register_observer(&mut self, observer: Rc<RefCell<dyn Observer>>) {
        let observer_name = observer.borrow().name().to_string();
        self.observers.push(Rc::downgrade(&observer));
        println!("Observer '{}' registered", observer_name);
    }

    fn remove_observer(&mut self, observer_to_remove: &Rc<RefCell<dyn Observer>>) {
        let observer_name = observer_to_remove.borrow().name().to_string();
        let initial_count = self.observers.len();

        // Filter out the observer to remove and any weak references that can't be upgraded
        self.observers.retain(|weak_observer| {
            if let Some(observer) = weak_observer.upgrade() {
                // Keep if it's not the one we want to remove
                !Rc::ptr_eq(&observer, observer_to_remove)
            } else {
                // Remove if the weak reference can't be upgraded
                false
            }
        });

        if self.observers.len() < initial_count {
            println!("Observer '{}' removed", observer_name);
        }
    }

    fn notify_observers(&self) {
        // Create a new vector to hold valid observers
        let mut valid_observers = Vec::new();

        // Process each observer
        for weak_observer in &self.observers {
            if let Some(observer) = weak_observer.upgrade() {
                // Notify the observer
                observer.borrow_mut().update(self.temperature, self.humidity, self.pressure);
                // Keep this observer
                valid_observers.push(Weak::clone(weak_observer));
            }
        }
    }
}

// ========== Display Implementations ==========

/// CurrentConditionsDisplay implements the Observer trait
struct CurrentConditionsDisplay {
    name: String,
    temperature: f32,
    humidity: f32,
}

impl CurrentConditionsDisplay {
    /// Create a new CurrentConditionsDisplay instance
    fn new(name: &str) -> Self {
        CurrentConditionsDisplay {
            name: name.to_string(),
            temperature: 0.0,
            humidity: 0.0,
        }
    }

    /// Display the current conditions
    fn display(&self) {
        println!("[{}] Current conditions: {:.1}°F and {:.1}% humidity",
                 self.name, self.temperature, self.humidity);
    }
}

impl Observer for CurrentConditionsDisplay {
    fn update(&mut self, temperature: f32, humidity: f32, _pressure: f32) {
        self.temperature = temperature;
        self.humidity = humidity;
        self.display();
    }

    fn name(&self) -> &str {
        &self.name
    }
}

/// StatisticsDisplay implements the Observer trait
struct StatisticsDisplay {
    name: String,
    max_temp: f32,
    min_temp: f32,
    temp_sum: f32,
    num_readings: u32,
}

impl StatisticsDisplay {
    /// Create a new StatisticsDisplay instance
    fn new(name: &str) -> Self {
        StatisticsDisplay {
            name: name.to_string(),
            max_temp: 0.0,
            min_temp: 200.0, // Start with a high value
            temp_sum: 0.0,
            num_readings: 0,
        }
    }

    /// Display the statistics
    fn display(&self) {
        let avg_temp = self.temp_sum / self.num_readings as f32;
        println!("[{}] Avg/Max/Min temperature: {:.1}/{:.1}/{:.1}",
                 self.name, avg_temp, self.max_temp, self.min_temp);
    }
}

impl Observer for StatisticsDisplay {
    fn update(&mut self, temperature: f32, _humidity: f32, _pressure: f32) {
        self.temp_sum += temperature;
        self.num_readings += 1;

        if temperature > self.max_temp {
            self.max_temp = temperature;
        }

        if temperature < self.min_temp {
            self.min_temp = temperature;
        }

        self.display();
    }

    fn name(&self) -> &str {
        &self.name
    }
}

/// ForecastDisplay implements the Observer trait
struct ForecastDisplay {
    name: String,
    current_pressure: f32,
    last_pressure: f32,
}

impl ForecastDisplay {
    /// Create a new ForecastDisplay instance
    fn new(name: &str) -> Self {
        ForecastDisplay {
            name: name.to_string(),
            current_pressure: 29.92, // Default starting pressure
            last_pressure: 0.0,
        }
    }

    /// Display the forecast
    fn display(&self) {
        print!("[{}] Forecast: ", self.name);

        if self.current_pressure > self.last_pressure {
            println!("Improving weather on the way!");
        } else if self.current_pressure == self.last_pressure {
            println!("More of the same");
        } else {
            println!("Watch out for cooler, rainy weather");
        }
    }
}

impl Observer for ForecastDisplay {
    fn update(&mut self, _temperature: f32, _humidity: f32, pressure: f32) {
        self.last_pressure = self.current_pressure;
        self.current_pressure = pressure;
        self.display();
    }

    fn name(&self) -> &str {
        &self.name
    }
}

/// HeatIndexDisplay implements the Observer trait
struct HeatIndexDisplay {
    name: String,
    heat_index: f32,
}

impl HeatIndexDisplay {
    /// Create a new HeatIndexDisplay instance
    fn new(name: &str) -> Self {
        HeatIndexDisplay {
            name: name.to_string(),
            heat_index: 0.0,
        }
    }

    /// Compute the heat index based on temperature and humidity
    fn compute_heat_index(t: f32, rh: f32) -> f32 {
        // This is a simplified formula for heat index
        (16.923 + (0.185212 * t) + (5.37941 * rh) - (0.100254 * t * rh) +
         (0.00941695 * (t * t)) + (0.00728898 * (rh * rh)) +
         (0.000345372 * (t * t * rh)) - (0.000814971 * (t * rh * rh)) +
         (0.0000102102 * (t * t * rh * rh)) - (0.000038646 * (t * t * t)) +
         (0.0000291583 * (rh * rh * rh)) + (0.00000142721 * (t * t * t * rh)) +
         (0.000000197483 * (t * rh * rh * rh)) - (0.0000000218429 * (t * t * t * rh * rh)) +
         0.000000000843296 * (t * t * rh * rh * rh)) -
         (0.0000000000481975 * (t * t * t * rh * rh * rh))
    }

    /// Display the heat index
    fn display(&self) {
        println!("[{}] Heat index: {:.1}", self.name, self.heat_index);
    }
}

impl Observer for HeatIndexDisplay {
    fn update(&mut self, temperature: f32, humidity: f32, _pressure: f32) {
        self.heat_index = Self::compute_heat_index(temperature, humidity);
        self.display();
    }

    fn name(&self) -> &str {
        &self.name
    }
}

// ========== Demo Code ==========

/// Run the weather station demo
fn run_weather_station() {
    // Create the WeatherData subject
    let mut weather_data = WeatherData::new();

    // Create display devices (observers)
    let current_display = Rc::new(RefCell::new(CurrentConditionsDisplay::new("Current Display")));
    let stats_display = Rc::new(RefCell::new(StatisticsDisplay::new("Statistics Display")));
    let forecast_display = Rc::new(RefCell::new(ForecastDisplay::new("Forecast Display")));
    let heat_index_display = Rc::new(RefCell::new(HeatIndexDisplay::new("Heat Index Display")));

    // Register observers
    weather_data.register_observer(Rc::clone(&current_display));
    weather_data.register_observer(Rc::clone(&stats_display));
    weather_data.register_observer(Rc::clone(&forecast_display));
    weather_data.register_observer(Rc::clone(&heat_index_display));

    println!("\n=== First Weather Update ===");
    // Simulate new weather measurements
    weather_data.set_measurements(80.0, 65.0, 30.4);

    println!("\n=== Second Weather Update ===");
    // Simulate new weather measurements
    weather_data.set_measurements(82.0, 70.0, 29.2);

    println!("\n=== Third Weather Update ===");
    // Simulate new weather measurements
    weather_data.set_measurements(78.0, 90.0, 29.2);

    println!("\n=== Removing an Observer ===");
    // Remove an observer
    weather_data.remove_observer(&forecast_display);

    println!("\n=== Fourth Weather Update ===");
    // One more measurement after removing an observer
    weather_data.set_measurements(75.0, 60.0, 30.1);
}

fn main() {
    // Run the demo
    run_weather_station();
}

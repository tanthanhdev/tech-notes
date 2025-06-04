#!/usr/bin/env ruby

# Observer Pattern Implementation in Ruby
#
# The Observer Pattern is a behavioral design pattern that defines a one-to-many dependency
# between objects so that when one object changes state, all its dependents are notified
# and updated automatically.
#
# This example demonstrates a simple weather station (subject) that notifies
# multiple display devices (observers) when weather data changes.

# ========== Subject Module ==========

# Subject module to be included by classes that need to notify observers
module Subject
  # Initialize the observers array
  def initialize_subject
    @observers = []
  end

  # Register an observer to be notified of changes
  def register_observer(observer)
    @observers << observer
    puts "Observer #{observer.class} registered"
  end

  # Remove an observer from the notification list
  def remove_observer(observer)
    if @observers.delete(observer)
      puts "Observer #{observer.class} removed"
    end
  end

  # Notify all registered observers of state changes
  def notify_observers
    @observers.each do |observer|
      observer.update(@temperature, @humidity, @pressure)
    end
  end
end

# ========== Observer Module ==========

# Observer module to be included by classes that need to be notified of changes
module Observer
  # Update method to be implemented by concrete observers
  def update(temperature, humidity, pressure)
    raise NotImplementedError, "#{self.class} must implement update method"
  end
end

# ========== Weather Data Implementation ==========

# WeatherData class includes the Subject module
class WeatherData
  include Subject

  attr_reader :temperature, :humidity, :pressure

  # Initialize the weather data
  def initialize
    initialize_subject
    @temperature = 0.0
    @humidity = 0.0
    @pressure = 0.0
  end

  # Called when measurements have been updated
  def measurements_changed
    notify_observers
  end

  # Set new weather measurements
  def set_measurements(temperature, humidity, pressure)
    @temperature = temperature
    @humidity = humidity
    @pressure = pressure
    measurements_changed
  end
end

# ========== Display Implementations ==========

# CurrentConditionsDisplay class includes the Observer module
class CurrentConditionsDisplay
  include Observer

  # Initialize with weather data subject
  def initialize(weather_data)
    @weather_data = weather_data
    @temperature = 0.0
    @humidity = 0.0
    weather_data.register_observer(self)
  end

  # Update method implementation
  def update(temperature, humidity, pressure)
    @temperature = temperature
    @humidity = humidity
    display
  end

  # Display the current conditions
  def display
    puts "Current conditions: #{@temperature}°F and #{@humidity}% humidity"
  end
end

# StatisticsDisplay class includes the Observer module
class StatisticsDisplay
  include Observer

  # Initialize with weather data subject
  def initialize(weather_data)
    @weather_data = weather_data
    @max_temp = 0.0
    @min_temp = 200.0
    @temp_sum = 0.0
    @num_readings = 0
    weather_data.register_observer(self)
  end

  # Update method implementation
  def update(temperature, humidity, pressure)
    @temp_sum += temperature
    @num_readings += 1

    @max_temp = temperature if temperature > @max_temp
    @min_temp = temperature if temperature < @min_temp

    display
  end

  # Display the statistics
  def display
    avg_temp = @temp_sum / @num_readings
    puts "Avg/Max/Min temperature: #{avg_temp.round(1)}/#{@max_temp}/#{@min_temp}"
  end
end

# ForecastDisplay class includes the Observer module
class ForecastDisplay
  include Observer

  # Initialize with weather data subject
  def initialize(weather_data)
    @weather_data = weather_data
    @current_pressure = 29.92
    @last_pressure = 0.0
    weather_data.register_observer(self)
  end

  # Update method implementation
  def update(temperature, humidity, pressure)
    @last_pressure = @current_pressure
    @current_pressure = pressure
    display
  end

  # Display the forecast
  def display
    print "Forecast: "
    if @current_pressure > @last_pressure
      puts "Improving weather on the way!"
    elsif @current_pressure == @last_pressure
      puts "More of the same"
    elsif @current_pressure < @last_pressure
      puts "Watch out for cooler, rainy weather"
    end
  end
end

# HeatIndexDisplay class includes the Observer module
class HeatIndexDisplay
  include Observer

  # Initialize with weather data subject
  def initialize(weather_data)
    @weather_data = weather_data
    @heat_index = 0.0
    weather_data.register_observer(self)
  end

  # Update method implementation
  def update(temperature, humidity, pressure)
    @heat_index = compute_heat_index(temperature, humidity)
    display
  end

  # Compute the heat index based on temperature and humidity
  def compute_heat_index(t, rh)
    # This is a simplified formula for heat index
    (16.923 + (0.185212 * t) + (5.37941 * rh) - (0.100254 * t * rh) +
     (0.00941695 * (t * t)) + (0.00728898 * (rh * rh)) +
     (0.000345372 * (t * t * rh)) - (0.000814971 * (t * rh * rh)) +
     (0.0000102102 * (t * t * rh * rh)) - (0.000038646 * (t * t * t)) +
     (0.0000291583 * (rh * rh * rh)) + (0.00000142721 * (t * t * t * rh)) +
     (0.000000197483 * (t * rh * rh * rh)) - (0.0000000218429 * (t * t * t * rh * rh)) +
     0.000000000843296 * (t * t * rh * rh * rh)) -
     (0.0000000000481975 * (t * t * t * rh * rh * rh))
  end

  # Display the heat index
  def display
    puts "Heat index: #{@heat_index.round(1)}"
  end
end

# ========== Demo Code ==========

# Run the weather station demo
def run_weather_station
  # Create the WeatherData subject
  weather_data = WeatherData.new

  # Create display devices (observers)
  current_display = CurrentConditionsDisplay.new(weather_data)
  statistics_display = StatisticsDisplay.new(weather_data)
  forecast_display = ForecastDisplay.new(weather_data)
  heat_index_display = HeatIndexDisplay.new(weather_data)

  puts "\n=== First Weather Update ==="
  # Simulate new weather measurements
  weather_data.set_measurements(80, 65, 30.4)

  puts "\n=== Second Weather Update ==="
  # Simulate new weather measurements
  weather_data.set_measurements(82, 70, 29.2)

  puts "\n=== Third Weather Update ==="
  # Simulate new weather measurements
  weather_data.set_measurements(78, 90, 29.2)

  puts "\n=== Removing an Observer ==="
  # Remove an observer
  weather_data.remove_observer(forecast_display)

  puts "\n=== Fourth Weather Update ==="
  # One more measurement after removing an observer
  weather_data.set_measurements(75, 60, 30.1)
end

# Run the demo
run_weather_station

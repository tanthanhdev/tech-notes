/**
 * Observer Pattern Implementation in Java
 * 
 * This demonstrates a weather station example of the Observer pattern.
 */

import java.util.ArrayList;
import java.util.List;

// Observer interface
interface Observer {
    void update();
}

// Subject interface
interface Subject {
    void registerObserver(Observer observer);
    void removeObserver(Observer observer);
    void notifyObservers();
}

// Concrete Subject: WeatherStation
class WeatherStation implements Subject {
    private List<Observer> observers;
    private float temperature;
    private float humidity;
    private float pressure;
    
    public WeatherStation() {
        observers = new ArrayList<>();
    }
    
    @Override
    public void registerObserver(Observer observer) {
        observers.add(observer);
    }
    
    @Override
    public void removeObserver(Observer observer) {
        int index = observers.indexOf(observer);
        if (index >= 0) {
            observers.remove(index);
        }
    }
    
    @Override
    public void notifyObservers() {
        for (Observer observer : observers) {
            observer.update();
        }
    }
    
    public void measurementsChanged() {
        notifyObservers();
    }
    
    public void setMeasurements(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;
        measurementsChanged();
    }
    
    // Getter methods that Observers can use to pull data
    public float getTemperature() {
        return temperature;
    }
    
    public float getHumidity() {
        return humidity;
    }
    
    public float getPressure() {
        return pressure;
    }
}

// Concrete Observer: CurrentConditionsDisplay
class CurrentConditionsDisplay implements Observer {
    private float temperature;
    private float humidity;
    private WeatherStation weatherStation;
    
    public CurrentConditionsDisplay(WeatherStation weatherStation) {
        this.weatherStation = weatherStation;
        weatherStation.registerObserver(this);
    }
    
    @Override
    public void update() {
        // Pull model - observer gets the data it needs from the subject
        this.temperature = weatherStation.getTemperature();
        this.humidity = weatherStation.getHumidity();
        display();
    }
    
    public void display() {
        System.out.println("Current conditions: " + temperature + "°C and " + humidity + "% humidity");
    }
}

// Concrete Observer: StatisticsDisplay
class StatisticsDisplay implements Observer {
    private float maxTemp = 0.0f;
    private float minTemp = 200.0f;
    private float tempSum = 0.0f;
    private int numReadings = 0;
    private WeatherStation weatherStation;
    
    public StatisticsDisplay(WeatherStation weatherStation) {
        this.weatherStation = weatherStation;
        weatherStation.registerObserver(this);
    }
    
    @Override
    public void update() {
        float temperature = weatherStation.getTemperature();
        tempSum += temperature;
        numReadings++;
        
        if (temperature > maxTemp) {
            maxTemp = temperature;
        }
        
        if (temperature < minTemp) {
            minTemp = temperature;
        }
        
        display();
    }
    
    public void display() {
        System.out.println("Avg/Max/Min temperature = " + (tempSum / numReadings) + "/" + maxTemp + "/" + minTemp);
    }
}

// Concrete Observer: ForecastDisplay
class ForecastDisplay implements Observer {
    private float currentPressure = 29.92f;
    private float lastPressure;
    private WeatherStation weatherStation;
    
    public ForecastDisplay(WeatherStation weatherStation) {
        this.weatherStation = weatherStation;
        weatherStation.registerObserver(this);
    }
    
    @Override
    public void update() {
        lastPressure = currentPressure;
        currentPressure = weatherStation.getPressure();
        
        display();
    }
    
    public void display() {
        System.out.print("Forecast: ");
        if (currentPressure > lastPressure) {
            System.out.println("Improving weather on the way!");
        } else if (currentPressure == lastPressure) {
            System.out.println("More of the same");
        } else if (currentPressure < lastPressure) {
            System.out.println("Watch out for cooler, rainy weather");
        }
    }
}

// Demonstration
public class ObserverPattern {
    public static void main(String[] args) {
        // Create the subject
        WeatherStation weatherStation = new WeatherStation();
        
        // Create and register observers
        CurrentConditionsDisplay currentDisplay = new CurrentConditionsDisplay(weatherStation);
        StatisticsDisplay statisticsDisplay = new StatisticsDisplay(weatherStation);
        ForecastDisplay forecastDisplay = new ForecastDisplay(weatherStation);
        
        // Simulate new weather measurements
        System.out.println("First weather update:");
        weatherStation.setMeasurements(27.5f, 65.0f, 30.4f);
        
        System.out.println("\nSecond weather update:");
        weatherStation.setMeasurements(28.2f, 70.0f, 29.2f);
        
        System.out.println("\nRemoving current conditions display...");
        weatherStation.removeObserver(currentDisplay);
        
        System.out.println("\nThird weather update (with one less observer):");
        weatherStation.setMeasurements(26.7f, 90.0f, 29.2f);
    }
} 
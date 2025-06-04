#include <iostream>
#include <vector>
#include <algorithm>
#include <memory>
#include <string>

/**
 * Observer Design Pattern Implementation in C++
 * 
 * This demonstrates a weather station example of the Observer pattern.
 */

// Forward declaration
class Subject;

// Observer interface
class Observer {
public:
    virtual ~Observer() = default;
    virtual void update(Subject* subject) = 0;
};

// Subject interface
class Subject {
private:
    std::vector<Observer*> observers;

public:
    virtual ~Subject() = default;

    void attach(Observer* observer) {
        std::cout << "Attaching an observer\n";
        observers.push_back(observer);
    }

    void detach(Observer* observer) {
        std::cout << "Detaching an observer\n";
        observers.erase(std::remove(observers.begin(), observers.end(), observer), observers.end());
    }

    void notify() {
        std::cout << "Notifying observers...\n";
        for (Observer* observer : observers) {
            observer->update(this);
        }
    }

    // Subject should provide interface for observers to get state
    virtual float getTemperature() const = 0;
    virtual float getHumidity() const = 0;
    virtual float getPressure() const = 0;
};

// Concrete Subject
class WeatherStation : public Subject {
private:
    float temperature;
    float humidity;
    float pressure;

public:
    WeatherStation() : temperature(0.0f), humidity(0.0f), pressure(0.0f) {}

    void setMeasurements(float temp, float humidity, float pressure) {
        std::cout << "Setting measurements: " << temp << "°C, " 
                  << humidity << "%, " << pressure << " hPa\n";
        this->temperature = temp;
        this->humidity = humidity;
        this->pressure = pressure;
        measurementsChanged();
    }

    void measurementsChanged() {
        notify();
    }

    float getTemperature() const override {
        return temperature;
    }

    float getHumidity() const override {
        return humidity;
    }

    float getPressure() const override {
        return pressure;
    }
};

// Concrete Observer
class CurrentConditionsDisplay : public Observer {
private:
    float temperature;
    float humidity;
    Subject* weatherStation;

public:
    CurrentConditionsDisplay(Subject* weatherStation) 
        : temperature(0.0f), humidity(0.0f), weatherStation(weatherStation) {
        // Register with the subject
        weatherStation->attach(this);
    }

    ~CurrentConditionsDisplay() override {
        weatherStation->detach(this);
    }

    void update(Subject* subject) override {
        if (subject == weatherStation) {
            temperature = subject->getTemperature();
            humidity = subject->getHumidity();
            display();
        }
    }

    void display() const {
        std::cout << "Current conditions: " << temperature << "°C and " 
                  << humidity << "% humidity\n";
    }
};

// Concrete Observer
class StatisticsDisplay : public Observer {
private:
    float maxTemp;
    float minTemp;
    float tempSum;
    int numReadings;
    Subject* weatherStation;

public:
    StatisticsDisplay(Subject* weatherStation) 
        : maxTemp(0.0f), minTemp(200.0f), tempSum(0.0f), numReadings(0), weatherStation(weatherStation) {
        // Register with the subject
        weatherStation->attach(this);
    }

    ~StatisticsDisplay() override {
        weatherStation->detach(this);
    }

    void update(Subject* subject) override {
        if (subject == weatherStation) {
            float temp = subject->getTemperature();
            tempSum += temp;
            numReadings++;

            if (temp > maxTemp) {
                maxTemp = temp;
            }

            if (temp < minTemp) {
                minTemp = temp;
            }

            display();
        }
    }

    void display() const {
        std::cout << "Avg/Max/Min temperature: " << (tempSum / numReadings) 
                  << "/" << maxTemp << "/" << minTemp << "\n";
    }
};

// Concrete Observer
class ForecastDisplay : public Observer {
private:
    float currentPressure;
    float lastPressure;
    Subject* weatherStation;

public:
    ForecastDisplay(Subject* weatherStation) 
        : currentPressure(29.92f), lastPressure(0.0f), weatherStation(weatherStation) {
        // Register with the subject
        weatherStation->attach(this);
    }

    ~ForecastDisplay() override {
        weatherStation->detach(this);
    }

    void update(Subject* subject) override {
        if (subject == weatherStation) {
            lastPressure = currentPressure;
            currentPressure = subject->getPressure();
            display();
        }
    }

    void display() const {
        std::cout << "Forecast: ";
        if (currentPressure > lastPressure) {
            std::cout << "Improving weather on the way!\n";
        } else if (currentPressure == lastPressure) {
            std::cout << "More of the same\n";
        } else if (currentPressure < lastPressure) {
            std::cout << "Watch out for cooler, rainy weather\n";
        }
    }
};

// Alternative implementation using modern C++ with smart pointers and templates
namespace ModernCpp {

// Generic Subject class with templated notification
template<typename... Args>
class Subject {
private:
    // Using std::function for more flexibility in callback signatures
    using Callback = std::function<void(Args...)>;
    std::vector<std::pair<size_t, Callback>> observers;
    size_t nextId = 0;

public:
    virtual ~Subject() = default;

    // Returns a token that can be used to detach
    size_t attach(Callback callback) {
        size_t id = nextId++;
        observers.push_back({id, std::move(callback)});
        std::cout << "Modern C++: Attaching observer with ID " << id << "\n";
        return id;
    }

    void detach(size_t id) {
        std::cout << "Modern C++: Detaching observer with ID " << id << "\n";
        observers.erase(
            std::remove_if(observers.begin(), observers.end(),
                [id](const auto& pair) { return pair.first == id; }),
            observers.end());
    }

    void notify(Args... args) {
        std::cout << "Modern C++: Notifying observers...\n";
        for (const auto& [_, callback] : observers) {
            callback(args...);
        }
    }
};

// Weather data structure
struct WeatherData {
    float temperature;
    float humidity;
    float pressure;
};

// Concrete Subject: WeatherStation
class WeatherStation : public Subject<const WeatherData&> {
private:
    WeatherData data;

public:
    WeatherStation() : data{0.0f, 0.0f, 0.0f} {}

    void setMeasurements(float temp, float humidity, float pressure) {
        std::cout << "Modern C++: Setting measurements: " << temp << "°C, " 
                  << humidity << "%, " << pressure << " hPa\n";
        data.temperature = temp;
        data.humidity = humidity;
        data.pressure = pressure;
        notify(data);
    }

    const WeatherData& getCurrentData() const {
        return data;
    }
};

} // namespace ModernCpp

int main() {
    std::cout << "Observer Pattern Demonstration in C++\n";
    std::cout << "====================================\n\n";

    // Classic implementation
    std::cout << "Classic Implementation:\n";
    std::cout << "----------------------\n";
    
    WeatherStation weatherStation;
    
    // Create displays (observers)
    CurrentConditionsDisplay currentDisplay(&weatherStation);
    StatisticsDisplay statisticsDisplay(&weatherStation);
    ForecastDisplay forecastDisplay(&weatherStation);
    
    // Simulate weather changes
    std::cout << "\nFirst weather update:\n";
    weatherStation.setMeasurements(27.5f, 65.0f, 30.4f);
    
    std::cout << "\nSecond weather update:\n";
    weatherStation.setMeasurements(28.2f, 70.0f, 29.2f);
    
    // Modern C++ implementation
    std::cout << "\nModern C++ Implementation:\n";
    std::cout << "-------------------------\n";
    
    ModernCpp::WeatherStation modernStation;
    
    // Attach observers using lambdas
    auto currentDisplayId = modernStation.attach([](const ModernCpp::WeatherData& data) {
        std::cout << "Current conditions: " << data.temperature << "°C and " 
                  << data.humidity << "% humidity\n";
    });
    
    // Statistics display with state in the lambda capture
    float maxTemp = 0.0f;
    float minTemp = 200.0f;
    float tempSum = 0.0f;
    int numReadings = 0;
    
    auto statisticsDisplayId = modernStation.attach([&](const ModernCpp::WeatherData& data) {
        tempSum += data.temperature;
        numReadings++;
        
        if (data.temperature > maxTemp) {
            maxTemp = data.temperature;
        }
        
        if (data.temperature < minTemp) {
            minTemp = data.temperature;
        }
        
        std::cout << "Avg/Max/Min temperature: " << (tempSum / numReadings) 
                  << "/" << maxTemp << "/" << minTemp << "\n";
    });
    
    // Forecast display with state in the lambda capture
    float currentPressure = 29.92f;
    float lastPressure = 0.0f;
    
    auto forecastDisplayId = modernStation.attach([&](const ModernCpp::WeatherData& data) {
        lastPressure = currentPressure;
        currentPressure = data.pressure;
        
        std::cout << "Forecast: ";
        if (currentPressure > lastPressure) {
            std::cout << "Improving weather on the way!\n";
        } else if (currentPressure == lastPressure) {
            std::cout << "More of the same\n";
        } else if (currentPressure < lastPressure) {
            std::cout << "Watch out for cooler, rainy weather\n";
        }
    });
    
    // Simulate weather changes
    std::cout << "\nFirst weather update:\n";
    modernStation.setMeasurements(27.5f, 65.0f, 30.4f);
    
    std::cout << "\nSecond weather update:\n";
    modernStation.setMeasurements(28.2f, 70.0f, 29.2f);
    
    // Detach an observer
    std::cout << "\nDetaching the current conditions display...\n";
    modernStation.detach(currentDisplayId);
    
    std::cout << "\nThird weather update (with one less observer):\n";
    modernStation.setMeasurements(26.7f, 90.0f, 29.2f);
    
    return 0;
} 
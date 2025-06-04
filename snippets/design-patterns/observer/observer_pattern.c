/**
 * Observer Pattern Implementation in C
 *
 * The Observer Pattern is a behavioral design pattern that defines a one-to-many dependency
 * between objects so that when one object changes state, all its dependents are notified
 * and updated automatically.
 *
 * This example demonstrates a simple weather station (subject) that notifies
 * multiple display devices (observers) when weather data changes.
 *
 * Note: Since C is not an object-oriented language, we use structs with function pointers
 * to simulate classes and interfaces.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

// Forward declarations
typedef struct Observer Observer;
typedef struct Subject Subject;
typedef struct WeatherData WeatherData;
typedef struct DisplayDevice DisplayDevice;

// ========== Observer Interface ==========

// Observer "interface" - implemented by display devices
struct Observer {
    void (*update)(Observer* self, float temperature, float humidity, float pressure);
    char name[50];
};

// ========== Subject Interface ==========

// Subject "interface" - implemented by weather data
typedef struct ObserverNode {
    Observer* observer;
    struct ObserverNode* next;
} ObserverNode;

struct Subject {
    void (*registerObserver)(Subject* self, Observer* observer);
    void (*removeObserver)(Subject* self, Observer* observer);
    void (*notifyObservers)(Subject* self);

    // List of observers
    ObserverNode* observers;
};

// ========== Weather Data Implementation ==========

// Concrete Subject implementation
struct WeatherData {
    Subject subject;
    float temperature;
    float humidity;
    float pressure;
};

// Forward declarations of WeatherData methods
void weatherData_registerObserver(Subject* self, Observer* observer);
void weatherData_removeObserver(Subject* self, Observer* observer);
void weatherData_notifyObservers(Subject* self);
void weatherData_measurementsChanged(WeatherData* self);
void weatherData_setMeasurements(WeatherData* self, float temperature, float humidity, float pressure);

// Create a new WeatherData instance
WeatherData* createWeatherData() {
    WeatherData* weatherData = (WeatherData*)malloc(sizeof(WeatherData));
    if (weatherData == NULL) {
        return NULL;
    }

    // Initialize the subject interface
    weatherData->subject.registerObserver = weatherData_registerObserver;
    weatherData->subject.removeObserver = weatherData_removeObserver;
    weatherData->subject.notifyObservers = weatherData_notifyObservers;
    weatherData->subject.observers = NULL;

    // Initialize weather data
    weatherData->temperature = 0.0f;
    weatherData->humidity = 0.0f;
    weatherData->pressure = 0.0f;

    return weatherData;
}

// Register an observer
void weatherData_registerObserver(Subject* self, Observer* observer) {
    WeatherData* weatherData = (WeatherData*)self;

    // Create a new node
    ObserverNode* node = (ObserverNode*)malloc(sizeof(ObserverNode));
    if (node == NULL) {
        return;
    }

    node->observer = observer;
    node->next = NULL;

    // Add to the end of the list
    if (self->observers == NULL) {
        self->observers = node;
    } else {
        ObserverNode* current = self->observers;
        while (current->next != NULL) {
            current = current->next;
        }
        current->next = node;
    }

    printf("Observer '%s' registered\n", observer->name);
}

// Remove an observer
void weatherData_removeObserver(Subject* self, Observer* observer) {
    if (self->observers == NULL) {
        return;
    }

    // If the first node matches
    if (self->observers->observer == observer) {
        ObserverNode* temp = self->observers;
        self->observers = self->observers->next;
        free(temp);
        printf("Observer '%s' removed\n", observer->name);
        return;
    }

    // Check the rest of the list
    ObserverNode* current = self->observers;
    while (current->next != NULL) {
        if (current->next->observer == observer) {
            ObserverNode* temp = current->next;
            current->next = temp->next;
            free(temp);
            printf("Observer '%s' removed\n", observer->name);
            return;
        }
        current = current->next;
    }
}

// Notify all observers
void weatherData_notifyObservers(Subject* self) {
    WeatherData* weatherData = (WeatherData*)self;
    ObserverNode* current = self->observers;

    while (current != NULL) {
        current->observer->update(current->observer, weatherData->temperature,
                                 weatherData->humidity, weatherData->pressure);
        current = current->next;
    }
}

// Called when measurements change
void weatherData_measurementsChanged(WeatherData* self) {
    self->subject.notifyObservers((Subject*)self);
}

// Set new measurements
void weatherData_setMeasurements(WeatherData* self, float temperature, float humidity, float pressure) {
    self->temperature = temperature;
    self->humidity = humidity;
    self->pressure = pressure;
    weatherData_measurementsChanged(self);
}

// Free WeatherData resources
void destroyWeatherData(WeatherData* weatherData) {
    if (weatherData == NULL) {
        return;
    }

    // Free all observer nodes
    ObserverNode* current = weatherData->subject.observers;
    while (current != NULL) {
        ObserverNode* temp = current;
        current = current->next;
        free(temp);
    }

    // Free the WeatherData itself
    free(weatherData);
}

// ========== Display Device Implementations ==========

// Current Conditions Display
typedef struct {
    Observer observer;
    float temperature;
    float humidity;
    Subject* weatherData;
} CurrentConditionsDisplay;

// Forward declaration
void currentConditionsDisplay_update(Observer* self, float temperature, float humidity, float pressure);
void currentConditionsDisplay_display(CurrentConditionsDisplay* display);

// Create a new CurrentConditionsDisplay
CurrentConditionsDisplay* createCurrentConditionsDisplay(Subject* weatherData, const char* name) {
    CurrentConditionsDisplay* display = (CurrentConditionsDisplay*)malloc(sizeof(CurrentConditionsDisplay));
    if (display == NULL) {
        return NULL;
    }

    // Initialize the observer interface
    display->observer.update = currentConditionsDisplay_update;
    strncpy(display->observer.name, name, sizeof(display->observer.name) - 1);
    display->observer.name[sizeof(display->observer.name) - 1] = '\0';

    // Initialize display data
    display->temperature = 0.0f;
    display->humidity = 0.0f;
    display->weatherData = weatherData;

    // Register with the subject
    weatherData->registerObserver(weatherData, (Observer*)display);

    return display;
}

// Update method implementation
void currentConditionsDisplay_update(Observer* self, float temperature, float humidity, float pressure) {
    CurrentConditionsDisplay* display = (CurrentConditionsDisplay*)self;
    display->temperature = temperature;
    display->humidity = humidity;
    currentConditionsDisplay_display(display);
}

// Display current conditions
void currentConditionsDisplay_display(CurrentConditionsDisplay* display) {
    printf("[%s] Current conditions: %.1f°F and %.1f%% humidity\n",
           display->observer.name, display->temperature, display->humidity);
}

// Free CurrentConditionsDisplay resources
void destroyCurrentConditionsDisplay(CurrentConditionsDisplay* display, Subject* weatherData) {
    if (display == NULL) {
        return;
    }

    // Unregister from the subject
    if (weatherData != NULL) {
        weatherData->removeObserver(weatherData, (Observer*)display);
    }

    // Free the display itself
    free(display);
}

// Statistics Display
typedef struct {
    Observer observer;
    float maxTemp;
    float minTemp;
    float tempSum;
    int numReadings;
    Subject* weatherData;
} StatisticsDisplay;

// Forward declaration
void statisticsDisplay_update(Observer* self, float temperature, float humidity, float pressure);
void statisticsDisplay_display(StatisticsDisplay* display);

// Create a new StatisticsDisplay
StatisticsDisplay* createStatisticsDisplay(Subject* weatherData, const char* name) {
    StatisticsDisplay* display = (StatisticsDisplay*)malloc(sizeof(StatisticsDisplay));
    if (display == NULL) {
        return NULL;
    }

    // Initialize the observer interface
    display->observer.update = statisticsDisplay_update;
    strncpy(display->observer.name, name, sizeof(display->observer.name) - 1);
    display->observer.name[sizeof(display->observer.name) - 1] = '\0';

    // Initialize display data
    display->maxTemp = 0.0f;
    display->minTemp = 200.0f;  // A very low starting value
    display->tempSum = 0.0f;
    display->numReadings = 0;
    display->weatherData = weatherData;

    // Register with the subject
    weatherData->registerObserver(weatherData, (Observer*)display);

    return display;
}

// Update method implementation
void statisticsDisplay_update(Observer* self, float temperature, float humidity, float pressure) {
    StatisticsDisplay* display = (StatisticsDisplay*)self;

    display->tempSum += temperature;
    display->numReadings++;

    if (temperature > display->maxTemp) {
        display->maxTemp = temperature;
    }

    if (temperature < display->minTemp) {
        display->minTemp = temperature;
    }

    statisticsDisplay_display(display);
}

// Display statistics
void statisticsDisplay_display(StatisticsDisplay* display) {
    printf("[%s] Avg/Max/Min temperature: %.1f/%.1f/%.1f\n",
           display->observer.name,
           display->tempSum / display->numReadings,
           display->maxTemp,
           display->minTemp);
}

// Free StatisticsDisplay resources
void destroyStatisticsDisplay(StatisticsDisplay* display, Subject* weatherData) {
    if (display == NULL) {
        return;
    }

    // Unregister from the subject
    if (weatherData != NULL) {
        weatherData->removeObserver(weatherData, (Observer*)display);
    }

    // Free the display itself
    free(display);
}

// Forecast Display
typedef struct {
    Observer observer;
    float currentPressure;
    float lastPressure;
    Subject* weatherData;
} ForecastDisplay;

// Forward declaration
void forecastDisplay_update(Observer* self, float temperature, float humidity, float pressure);
void forecastDisplay_display(ForecastDisplay* display);

// Create a new ForecastDisplay
ForecastDisplay* createForecastDisplay(Subject* weatherData, const char* name) {
    ForecastDisplay* display = (ForecastDisplay*)malloc(sizeof(ForecastDisplay));
    if (display == NULL) {
        return NULL;
    }

    // Initialize the observer interface
    display->observer.update = forecastDisplay_update;
    strncpy(display->observer.name, name, sizeof(display->observer.name) - 1);
    display->observer.name[sizeof(display->observer.name) - 1] = '\0';

    // Initialize display data
    display->currentPressure = 29.92f;  // Default starting pressure
    display->lastPressure = 0.0f;
    display->weatherData = weatherData;

    // Register with the subject
    weatherData->registerObserver(weatherData, (Observer*)display);

    return display;
}

// Update method implementation
void forecastDisplay_update(Observer* self, float temperature, float humidity, float pressure) {
    ForecastDisplay* display = (ForecastDisplay*)self;

    display->lastPressure = display->currentPressure;
    display->currentPressure = pressure;

    forecastDisplay_display(display);
}

// Display forecast
void forecastDisplay_display(ForecastDisplay* display) {
    printf("[%s] Forecast: ", display->observer.name);

    if (display->currentPressure > display->lastPressure) {
        printf("Improving weather on the way!\n");
    } else if (display->currentPressure == display->lastPressure) {
        printf("More of the same\n");
    } else if (display->currentPressure < display->lastPressure) {
        printf("Watch out for cooler, rainy weather\n");
    }
}

// Free ForecastDisplay resources
void destroyForecastDisplay(ForecastDisplay* display, Subject* weatherData) {
    if (display == NULL) {
        return;
    }

    // Unregister from the subject
    if (weatherData != NULL) {
        weatherData->removeObserver(weatherData, (Observer*)display);
    }

    // Free the display itself
    free(display);
}

// ========== Heat Index Display ==========

typedef struct {
    Observer observer;
    float heatIndex;
    Subject* weatherData;
} HeatIndexDisplay;

// Forward declaration
void heatIndexDisplay_update(Observer* self, float temperature, float humidity, float pressure);
void heatIndexDisplay_display(HeatIndexDisplay* display);
float computeHeatIndex(float temperature, float humidity);

// Create a new HeatIndexDisplay
HeatIndexDisplay* createHeatIndexDisplay(Subject* weatherData, const char* name) {
    HeatIndexDisplay* display = (HeatIndexDisplay*)malloc(sizeof(HeatIndexDisplay));
    if (display == NULL) {
        return NULL;
    }

    // Initialize the observer interface
    display->observer.update = heatIndexDisplay_update;
    strncpy(display->observer.name, name, sizeof(display->observer.name) - 1);
    display->observer.name[sizeof(display->observer.name) - 1] = '\0';

    // Initialize display data
    display->heatIndex = 0.0f;
    display->weatherData = weatherData;

    // Register with the subject
    weatherData->registerObserver(weatherData, (Observer*)display);

    return display;
}

// Update method implementation
void heatIndexDisplay_update(Observer* self, float temperature, float humidity, float pressure) {
    HeatIndexDisplay* display = (HeatIndexDisplay*)self;

    display->heatIndex = computeHeatIndex(temperature, humidity);
    heatIndexDisplay_display(display);
}

// Display heat index
void heatIndexDisplay_display(HeatIndexDisplay* display) {
    printf("[%s] Heat index: %.1f\n", display->observer.name, display->heatIndex);
}

// Compute the heat index
float computeHeatIndex(float t, float rh) {
    // This is a simplified formula for heat index
    return (float)((16.923 + (0.185212 * t) + (5.37941 * rh) - (0.100254 * t * rh) +
                  (0.00941695 * (t * t)) + (0.00728898 * (rh * rh)) +
                  (0.000345372 * (t * t * rh)) - (0.000814971 * (t * rh * rh)) +
                  (0.0000102102 * (t * t * rh * rh)) - (0.000038646 * (t * t * t)) +
                  (0.0000291583 * (rh * rh * rh)) + (0.00000142721 * (t * t * t * rh)) +
                  (0.000000197483 * (t * rh * rh * rh)) - (0.0000000218429 * (t * t * t * rh * rh)) +
                  0.000000000843296 * (t * t * rh * rh * rh)) -
                  (0.0000000000481975 * (t * t * t * rh * rh * rh)));
}

// Free HeatIndexDisplay resources
void destroyHeatIndexDisplay(HeatIndexDisplay* display, Subject* weatherData) {
    if (display == NULL) {
        return;
    }

    // Unregister from the subject
    if (weatherData != NULL) {
        weatherData->removeObserver(weatherData, (Observer*)display);
    }

    // Free the display itself
    free(display);
}

// ========== Demo Code ==========

void runWeatherStation() {
    // Create the WeatherData subject
    WeatherData* weatherData = createWeatherData();

    // Create display devices (observers)
    CurrentConditionsDisplay* currentDisplay = createCurrentConditionsDisplay((Subject*)weatherData, "Current Display");
    StatisticsDisplay* statsDisplay = createStatisticsDisplay((Subject*)weatherData, "Statistics Display");
    ForecastDisplay* forecastDisplay = createForecastDisplay((Subject*)weatherData, "Forecast Display");
    HeatIndexDisplay* heatIndexDisplay = createHeatIndexDisplay((Subject*)weatherData, "Heat Index Display");

    printf("\n=== First Weather Update ===\n");
    // Simulate new weather measurements
    weatherData_setMeasurements(weatherData, 80.0f, 65.0f, 30.4f);

    printf("\n=== Second Weather Update ===\n");
    // Simulate new weather measurements
    weatherData_setMeasurements(weatherData, 82.0f, 70.0f, 29.2f);

    printf("\n=== Third Weather Update ===\n");
    // Simulate new weather measurements
    weatherData_setMeasurements(weatherData, 78.0f, 90.0f, 29.2f);

    printf("\n=== Removing an Observer ===\n");
    // Remove an observer
    weatherData->subject.removeObserver((Subject*)weatherData, (Observer*)forecastDisplay);

    printf("\n=== Fourth Weather Update ===\n");
    // One more measurement after removing an observer
    weatherData_setMeasurements(weatherData, 75.0f, 60.0f, 30.1f);

    // Clean up resources
    destroyCurrentConditionsDisplay(currentDisplay, (Subject*)weatherData);
    destroyStatisticsDisplay(statsDisplay, (Subject*)weatherData);
    destroyForecastDisplay(forecastDisplay, NULL);  // Already removed
    destroyHeatIndexDisplay(heatIndexDisplay, (Subject*)weatherData);
    destroyWeatherData(weatherData);
}

int main() {
    // Run the demo
    runWeatherStation();
    return 0;
}
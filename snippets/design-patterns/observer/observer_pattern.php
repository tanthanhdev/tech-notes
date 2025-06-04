<?php
/**
 * Observer Pattern Implementation in PHP
 *
 * The Observer Pattern is a behavioral design pattern that defines a one-to-many dependency
 * between objects so that when one object changes state, all its dependents are notified
 * and updated automatically.
 *
 * This example demonstrates a simple weather station (subject) that notifies
 * multiple display devices (observers) when weather data changes.
 */

// ========== Observer Interface ==========

/**
 * Observer Interface
 * Implemented by all display devices that should be notified of weather changes
 */
interface Observer {
    /**
     * Update method called by the subject when state changes
     *
     * @param float $temperature The current temperature
     * @param float $humidity The current humidity
     * @param float $pressure The current pressure
     * @return void
     */
    public function update(float $temperature, float $humidity, float $pressure): void;
}

// ========== Subject Interface ==========

/**
 * Subject Interface
 * Implemented by objects that need to notify observers of state changes
 */
interface Subject {
    /**
     * Register an observer to be notified of changes
     *
     * @param Observer $observer The observer to register
     * @return void
     */
    public function registerObserver(Observer $observer): void;

    /**
     * Remove an observer from the notification list
     *
     * @param Observer $observer The observer to remove
     * @return void
     */
    public function removeObserver(Observer $observer): void;

    /**
     * Notify all registered observers of state changes
     *
     * @return void
     */
    public function notifyObservers(): void;
}

// ========== Weather Data Implementation ==========

/**
 * WeatherData class implements the Subject interface
 * Maintains the current weather state and notifies observers when it changes
 */
class WeatherData implements Subject {
    /**
     * @var array Array of registered observers
     */
    private $observers = [];

    /**
     * @var float Current temperature
     */
    private $temperature;

    /**
     * @var float Current humidity
     */
    private $humidity;

    /**
     * @var float Current pressure
     */
    private $pressure;

    /**
     * Register an observer to be notified of changes
     *
     * @param Observer $observer The observer to register
     * @return void
     */
    public function registerObserver(Observer $observer): void {
        $this->observers[] = $observer;
        echo "Observer " . get_class($observer) . " registered\n";
    }

    /**
     * Remove an observer from the notification list
     *
     * @param Observer $observer The observer to remove
     * @return void
     */
    public function removeObserver(Observer $observer): void {
        $index = array_search($observer, $this->observers, true);
        if ($index !== false) {
            unset($this->observers[$index]);
            $this->observers = array_values($this->observers); // Re-index array
            echo "Observer " . get_class($observer) . " removed\n";
        }
    }

    /**
     * Notify all registered observers of state changes
     *
     * @return void
     */
    public function notifyObservers(): void {
        foreach ($this->observers as $observer) {
            $observer->update($this->temperature, $this->humidity, $this->pressure);
        }
    }

    /**
     * Called when measurements have been updated
     *
     * @return void
     */
    public function measurementsChanged(): void {
        $this->notifyObservers();
    }

    /**
     * Set new weather measurements
     *
     * @param float $temperature New temperature value
     * @param float $humidity New humidity value
     * @param float $pressure New pressure value
     * @return void
     */
    public function setMeasurements(float $temperature, float $humidity, float $pressure): void {
        $this->temperature = $temperature;
        $this->humidity = $humidity;
        $this->pressure = $pressure;
        $this->measurementsChanged();
    }

    /**
     * Get the current temperature
     *
     * @return float Current temperature
     */
    public function getTemperature(): float {
        return $this->temperature;
    }

    /**
     * Get the current humidity
     *
     * @return float Current humidity
     */
    public function getHumidity(): float {
        return $this->humidity;
    }

    /**
     * Get the current pressure
     *
     * @return float Current pressure
     */
    public function getPressure(): float {
        return $this->pressure;
    }
}

// ========== Display Implementations ==========

/**
 * CurrentConditionsDisplay class implements the Observer interface
 * Displays the current weather conditions
 */
class CurrentConditionsDisplay implements Observer {
    /**
     * @var float Current temperature
     */
    private $temperature;

    /**
     * @var float Current humidity
     */
    private $humidity;

    /**
     * @var Subject The weather data subject
     */
    private $weatherData;

    /**
     * Constructor
     *
     * @param Subject $weatherData The weather data subject
     */
    public function __construct(Subject $weatherData) {
        $this->weatherData = $weatherData;
        $weatherData->registerObserver($this);
    }

    /**
     * Update method called by the subject when state changes
     *
     * @param float $temperature The current temperature
     * @param float $humidity The current humidity
     * @param float $pressure The current pressure
     * @return void
     */
    public function update(float $temperature, float $humidity, float $pressure): void {
        $this->temperature = $temperature;
        $this->humidity = $humidity;
        $this->display();
    }

    /**
     * Display the current conditions
     *
     * @return void
     */
    public function display(): void {
        echo "Current conditions: {$this->temperature}°F and {$this->humidity}% humidity\n";
    }
}

/**
 * StatisticsDisplay class implements the Observer interface
 * Displays average, minimum, and maximum temperatures
 */
class StatisticsDisplay implements Observer {
    /**
     * @var float Maximum temperature recorded
     */
    private $maxTemp = 0.0;

    /**
     * @var float Minimum temperature recorded
     */
    private $minTemp = 200.0;

    /**
     * @var float Sum of all temperature readings
     */
    private $tempSum = 0.0;

    /**
     * @var int Number of readings taken
     */
    private $numReadings = 0;

    /**
     * @var Subject The weather data subject
     */
    private $weatherData;

    /**
     * Constructor
     *
     * @param Subject $weatherData The weather data subject
     */
    public function __construct(Subject $weatherData) {
        $this->weatherData = $weatherData;
        $weatherData->registerObserver($this);
    }

    /**
     * Update method called by the subject when state changes
     *
     * @param float $temperature The current temperature
     * @param float $humidity The current humidity
     * @param float $pressure The current pressure
     * @return void
     */
    public function update(float $temperature, float $humidity, float $pressure): void {
        $this->tempSum += $temperature;
        $this->numReadings++;

        if ($temperature > $this->maxTemp) {
            $this->maxTemp = $temperature;
        }

        if ($temperature < $this->minTemp) {
            $this->minTemp = $temperature;
        }

        $this->display();
    }

    /**
     * Display the statistics
     *
     * @return void
     */
    public function display(): void {
        $avgTemp = $this->tempSum / $this->numReadings;
        echo "Avg/Max/Min temperature: " . round($avgTemp, 1) . "/" .
             $this->maxTemp . "/" . $this->minTemp . "\n";
    }
}

/**
 * ForecastDisplay class implements the Observer interface
 * Displays a simple weather forecast based on pressure changes
 */
class ForecastDisplay implements Observer {
    /**
     * @var float Current barometric pressure
     */
    private $currentPressure = 29.92;

    /**
     * @var float Previous barometric pressure
     */
    private $lastPressure;

    /**
     * @var Subject The weather data subject
     */
    private $weatherData;

    /**
     * Constructor
     *
     * @param Subject $weatherData The weather data subject
     */
    public function __construct(Subject $weatherData) {
        $this->weatherData = $weatherData;
        $weatherData->registerObserver($this);
    }

    /**
     * Update method called by the subject when state changes
     *
     * @param float $temperature The current temperature
     * @param float $humidity The current humidity
     * @param float $pressure The current pressure
     * @return void
     */
    public function update(float $temperature, float $humidity, float $pressure): void {
        $this->lastPressure = $this->currentPressure;
        $this->currentPressure = $pressure;
        $this->display();
    }

    /**
     * Display the forecast
     *
     * @return void
     */
    public function display(): void {
        echo "Forecast: ";
        if ($this->currentPressure > $this->lastPressure) {
            echo "Improving weather on the way!\n";
        } else if ($this->currentPressure == $this->lastPressure) {
            echo "More of the same\n";
        } else if ($this->currentPressure < $this->lastPressure) {
            echo "Watch out for cooler, rainy weather\n";
        }
    }
}

/**
 * HeatIndexDisplay class implements the Observer interface
 * Displays the heat index based on temperature and humidity
 */
class HeatIndexDisplay implements Observer {
    /**
     * @var float Current heat index
     */
    private $heatIndex = 0.0;

    /**
     * @var Subject The weather data subject
     */
    private $weatherData;

    /**
     * Constructor
     *
     * @param Subject $weatherData The weather data subject
     */
    public function __construct(Subject $weatherData) {
        $this->weatherData = $weatherData;
        $weatherData->registerObserver($this);
    }

    /**
     * Update method called by the subject when state changes
     *
     * @param float $temperature The current temperature
     * @param float $humidity The current humidity
     * @param float $pressure The current pressure
     * @return void
     */
    public function update(float $temperature, float $humidity, float $pressure): void {
        $this->heatIndex = $this->computeHeatIndex($temperature, $humidity);
        $this->display();
    }

    /**
     * Compute the heat index based on temperature and humidity
     *
     * @param float $t Temperature
     * @param float $rh Relative humidity
     * @return float Heat index
     */
    private function computeHeatIndex(float $t, float $rh): float {
        // This is a simplified formula for heat index
        return (float)((16.923 + (0.185212 * $t) + (5.37941 * $rh) - (0.100254 * $t * $rh) +
                      (0.00941695 * ($t * $t)) + (0.00728898 * ($rh * $rh)) +
                      (0.000345372 * ($t * $t * $rh)) - (0.000814971 * ($t * $rh * $rh)) +
                      (0.0000102102 * ($t * $t * $rh * $rh)) - (0.000038646 * ($t * $t * $t)) +
                      (0.0000291583 * ($rh * $rh * $rh)) + (0.00000142721 * ($t * $t * $t * $rh)) +
                      (0.000000197483 * ($t * $rh * $rh * $rh)) - (0.0000000218429 * ($t * $t * $t * $rh * $rh)) +
                      0.000000000843296 * ($t * $t * $rh * $rh * $rh)) -
                      (0.0000000000481975 * ($t * $t * $t * $rh * $rh * $rh)));
    }

    /**
     * Display the heat index
     *
     * @return void
     */
    public function display(): void {
        echo "Heat index: " . round($this->heatIndex, 1) . "\n";
    }
}

// ========== Demo Code ==========

/**
 * Run the weather station demo
 */
function runWeatherStation() {
    // Create the WeatherData subject
    $weatherData = new WeatherData();

    // Create display devices (observers)
    $currentDisplay = new CurrentConditionsDisplay($weatherData);
    $statisticsDisplay = new StatisticsDisplay($weatherData);
    $forecastDisplay = new ForecastDisplay($weatherData);
    $heatIndexDisplay = new HeatIndexDisplay($weatherData);

    echo "\n=== First Weather Update ===\n";
    // Simulate new weather measurements
    $weatherData->setMeasurements(80, 65, 30.4);

    echo "\n=== Second Weather Update ===\n";
    // Simulate new weather measurements
    $weatherData->setMeasurements(82, 70, 29.2);

    echo "\n=== Third Weather Update ===\n";
    // Simulate new weather measurements
    $weatherData->setMeasurements(78, 90, 29.2);

    echo "\n=== Removing an Observer ===\n";
    // Remove an observer
    $weatherData->removeObserver($forecastDisplay);

    echo "\n=== Fourth Weather Update ===\n";
    // One more measurement after removing an observer
    $weatherData->setMeasurements(75, 60, 30.1);
}

// Run the demo
runWeatherStation();

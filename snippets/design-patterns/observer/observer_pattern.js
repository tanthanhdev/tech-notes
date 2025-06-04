/**
 * Observer Pattern Implementation in JavaScript
 *
 * This demonstrates a Weather Station example of the Observer pattern.
 */

// Subject interface
class Subject {
  constructor() {
    this.observers = [];
  }

  // Add an observer to the list
  attach(observer) {
    if (this.observers.includes(observer)) {
      console.log('Observer already attached');
      return;
    }
    console.log('Attaching an observer');
    this.observers.push(observer);
  }

  // Remove an observer from the list
  detach(observer) {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      console.log('Observer not found');
      return;
    }
    console.log('Detaching an observer');
    this.observers.splice(observerIndex, 1);
  }

  // Notify all observers about an event
  notify() {
    console.log('Notifying observers...');
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}

// Concrete Subject: WeatherStation
class WeatherStation extends Subject {
  constructor() {
    super();
    this.temperature = 0;
    this.humidity = 0;
    this.pressure = 0;
  }

  // Getters for weather measurements
  getTemperature() {
    return this.temperature;
  }

  getHumidity() {
    return this.humidity;
  }

  getPressure() {
    return this.pressure;
  }

  // Update measurements and notify observers
  setMeasurements(temperature, humidity, pressure) {
    console.log(`Setting measurements: ${temperature}°C, ${humidity}%, ${pressure} hPa`);
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.measurementsChanged();
  }

  measurementsChanged() {
    this.notify();
  }
}

// Observer interface
class Observer {
  update(subject) {
    // This method should be overridden by concrete observers
    throw new Error('Method "update" must be implemented.');
  }
}

// Concrete Observer: CurrentConditionsDisplay
class CurrentConditionsDisplay extends Observer {
  constructor(weatherStation) {
    super();
    this.weatherStation = weatherStation;
    this.temperature = 0;
    this.humidity = 0;

    // Register this observer with the subject
    this.weatherStation.attach(this);
  }

  update(subject) {
    if (subject instanceof WeatherStation) {
      this.temperature = subject.getTemperature();
      this.humidity = subject.getHumidity();
      this.display();
    }
  }

  display() {
    console.log(`Current conditions: ${this.temperature}°C and ${this.humidity}% humidity`);
  }
}

// Concrete Observer: StatisticsDisplay
class StatisticsDisplay extends Observer {
  constructor(weatherStation) {
    super();
    this.weatherStation = weatherStation;
    this.maxTemp = 0;
    this.minTemp = 200;
    this.tempSum = 0;
    this.numReadings = 0;

    // Register this observer with the subject
    this.weatherStation.attach(this);
  }

  update(subject) {
    if (subject instanceof WeatherStation) {
      const temp = subject.getTemperature();
      this.tempSum += temp;
      this.numReadings++;

      if (temp > this.maxTemp) {
        this.maxTemp = temp;
      }

      if (temp < this.minTemp) {
        this.minTemp = temp;
      }

      this.display();
    }
  }

  display() {
    const avgTemp = this.tempSum / this.numReadings;
    console.log(`Avg/Max/Min temperature: ${avgTemp.toFixed(1)}/${this.maxTemp}/${this.minTemp}`);
  }
}

// Concrete Observer: ForecastDisplay
class ForecastDisplay extends Observer {
  constructor(weatherStation) {
    super();
    this.weatherStation = weatherStation;
    this.currentPressure = 29.92;
    this.lastPressure = 0;

    // Register this observer with the subject
    this.weatherStation.attach(this);
  }

  update(subject) {
    if (subject instanceof WeatherStation) {
      this.lastPressure = this.currentPressure;
      this.currentPressure = subject.getPressure();
      this.display();
    }
  }

  display() {
    let forecast = 'Forecast: ';

    if (this.currentPressure > this.lastPressure) {
      forecast += 'Improving weather on the way!';
    } else if (this.currentPressure === this.lastPressure) {
      forecast += 'More of the same';
    } else if (this.currentPressure < this.lastPressure) {
      forecast += 'Watch out for cooler, rainy weather';
    }

    console.log(forecast);
  }
}

// Example usage
function runWeatherStation() {
  console.log("Weather Station Demo");
  console.log("===================");

  // Create the weather station (subject)
  const weatherStation = new WeatherStation();

  // Create displays (observers)
  const currentDisplay = new CurrentConditionsDisplay(weatherStation);
  const statisticsDisplay = new StatisticsDisplay(weatherStation);
  const forecastDisplay = new ForecastDisplay(weatherStation);

  // Simulate weather changes
  console.log("\nFirst weather update:");
  weatherStation.setMeasurements(27.5, 65, 30.4);

  console.log("\nSecond weather update:");
  weatherStation.setMeasurements(28.2, 70, 29.2);

  // Remove an observer
  console.log("\nDetaching the current conditions display...");
  weatherStation.detach(currentDisplay);

  console.log("\nThird weather update (with one less observer):");
  weatherStation.setMeasurements(26.7, 90, 29.2);
}

// Run the demo
runWeatherStation();

// Event-based Observer Pattern using Node.js EventEmitter
// This is a more JavaScript-idiomatic way to implement the Observer pattern
function eventBasedObserverDemo() {
  const EventEmitter = require('events');

  // Subject as an EventEmitter
  class WeatherStationEmitter extends EventEmitter {
    constructor() {
      super();
      this.temperature = 0;
      this.humidity = 0;
      this.pressure = 0;
    }

    setMeasurements(temperature, humidity, pressure) {
      console.log(`Setting measurements: ${temperature}°C, ${humidity}%, ${pressure} hPa`);
      this.temperature = temperature;
      this.humidity = humidity;
      this.pressure = pressure;

      // Emit an event with the updated data
      this.emit('measurementsChanged', {
        temperature,
        humidity,
        pressure
      });
    }
  }

  console.log("\nEvent-Based Observer Pattern Demo");
  console.log("=================================");

  const weatherStation = new WeatherStationEmitter();

  // Add observers using event listeners
  weatherStation.on('measurementsChanged', (data) => {
    console.log(`Current conditions: ${data.temperature}°C and ${data.humidity}% humidity`);
  });

  let tempSum = 0;
  let numReadings = 0;
  let maxTemp = 0;
  let minTemp = 200;

  weatherStation.on('measurementsChanged', (data) => {
    tempSum += data.temperature;
    numReadings++;

    if (data.temperature > maxTemp) maxTemp = data.temperature;
    if (data.temperature < minTemp) minTemp = data.temperature;

    const avgTemp = tempSum / numReadings;
    console.log(`Avg/Max/Min temperature: ${avgTemp.toFixed(1)}/${maxTemp}/${minTemp}`);
  });

  // Simulate weather changes
  console.log("\nFirst weather update:");
  weatherStation.setMeasurements(27.5, 65, 30.4);

  console.log("\nSecond weather update:");
  weatherStation.setMeasurements(28.2, 70, 29.2);
}

// Run the event-based demo if running in Node.js environment
eventBasedObserverDemo();
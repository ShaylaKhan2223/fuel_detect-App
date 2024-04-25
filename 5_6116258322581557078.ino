#include <Wire.h>
#include <SoftwareSerial.h>
#include <hd44780.h>
#include <hd44780ioClass/hd44780_I2Cexp.h>
#include <RTClib.h>


#define HM10_TX_PIN 1  // Arduino RX
#define HM10_RX_PIN 0  // Arduino TX
#define SENSOR_PIN A0  // Analog sensor pin

SoftwareSerial HM10(HM10_RX_PIN, HM10_TX_PIN);

// Define the LCD and RTC objects
RTC_DS1307 rtc;
hd44780_I2Cexp lcd;

const int LCD_COLS = 20;
const int LCD_ROWS = 4;

volatile unsigned long pulse_freq1 = 0;
volatile unsigned long pulse_freq2 = 0;

double flow1, lastFlow1 = 0;
double flow2;

unsigned long startTime = 0;
bool timerRunning = false;
unsigned long totalElapsedTime = 0; // Maintain elapsed time
unsigned long lastStoppedTime = 0;  // Store the time when the timer stopped

const double flowChangeThreshold = 0.05; // 5% threshold for flow constancy
const int valvePin = 4;                  // Pin for controlling the valve

void setup() {
    lcd.begin(LCD_COLS, LCD_ROWS);
    lcd.backlight();

    lcd.setCursor(0, 0);
    lcd.print("TimeTaken:0:00:00");
    lcd.setCursor(0, 1);
    lcd.print("INLET    :");
    lcd.setCursor(0, 2);
    lcd.print("OVERFLOW :");
    lcd.setCursor(0, 3);
    lcd.print("FuelUsed :");

    pinMode(2, INPUT);
    pinMode(3, INPUT);
    pinMode(valvePin, OUTPUT);
    digitalWrite(valvePin, HIGH);

    attachInterrupt(digitalPinToInterrupt(2), pulse1, RISING);
    attachInterrupt(digitalPinToInterrupt(3), pulse2, RISING);

    // Initialize Serial Monitor
    Serial.begin(9600);
    // Serial.begin(9600);
    HM10.begin(9600); // Default baud rate for HM-10

  pinMode(SENSOR_PIN, INPUT);
}

void loop() {
    unsigned long currentMillis = millis();
    flow1 = 0.25 * pulse_freq1; // Convert pulses to ml
    flow2 = 0.25 * pulse_freq2;

    lcd.setCursor(11, 1);
    lcd.print(flow1, 1);
    lcd.print("ml");
    lcd.setCursor(11, 2);
    lcd.print(flow2, 1);
    lcd.print("ml");
    lcd.setCursor(11, 3);
    lcd.print(flow1 - flow2, 1);
    lcd.print("ml");

    if (flow1 > 0 && !timerRunning) {
        startTime = currentMillis;
        timerRunning = true;
        digitalWrite(valvePin, HIGH); // Open the valve
    }

    if (timerRunning) {
        unsigned long elapsedTime = currentMillis - startTime;

        if (abs(flow1 - lastFlow1) / flow1 < flowChangeThreshold) {
            digitalWrite(valvePin, LOW); // Close valve if flow is constant
            timerRunning = false;
            lastStoppedTime = currentMillis;
            totalElapsedTime += elapsedTime;
        }

        lastFlow1 = flow1;
        printElapsedTime(totalElapsedTime, true); // Update time on LCD

        // Calculate fuel consumption rate using the fuel difference and elapsed time
        double fuelDifference = flow1 - flow2;
        double fuelConsumptionRate = calculateFuelConsumptionPerHour(fuelDifference, totalElapsedTime);

        // Update LCD and Serial Monitor with the fuel consumption rate
        lcd.setCursor(0, 3);
        lcd.print("Fuel: ");
        lcd.print(fuelConsumptionRate, 1);
        lcd.print(" L/h");

        Serial.print("flow1: ");
        Serial.print(flow1);
        Serial.print(" ml, flow2: ");
        Serial.print(flow2);
        Serial.print(" ml, difference: ");
        Serial.print(flow1 - flow2);
        Serial.print(" ml, timetaken: ");
        printElapsedTime(totalElapsedTime, false);
        Serial.print(", Fuel Consumption Rate: ");
        Serial.print(fuelConsumptionRate, 1);
        Serial.println(" L/h");
    }

    // delay(1000); // Delay to stabilize readings


     // Read sensor data
  int sensorValue = analogRead(SENSOR_PIN);

  // Convert sensor value to string
  String data = String(sensorValue);

  // Send data over BLE
  HM10.println(data);

  delay(1000); // Delay for 1 second

}

void printElapsedTime(unsigned long elapsedTime, bool toLCD) {
    char buffer[20]; // Buffer to hold the formatted time string
    unsigned long seconds = elapsedTime / 1000;
    unsigned long minutes = seconds / 60;
    unsigned long hours = minutes / 60;

    sprintf(buffer, "%lu:%02lu:%02lu", hours, minutes % 60, seconds % 60);

    if (toLCD) {
        lcd.setCursor(11, 0);
        lcd.print(buffer);
    } else {
        Serial.print(buffer);
    }
}

double calculateFuelConsumptionPerHour(double fuelDifference, unsigned long elapsedTimeMillis) {
    if (elapsedTimeMillis > 0) {
        double hours = elapsedTimeMillis / 3600000.0; // Convert milliseconds to hours
        return (fuelDifference / hours) / 1000.0; // Calculate L/h from ml/h by dividing by 1000
    }
    // If no time has elapsed, return 0 to avoid division by zero
    return 0.0;
}
void pulse1() {
    noInterrupts(); // Disable interrupts to ensure the count is not corrupted by another interrupt
    pulse_freq1++;  // Increment the pulse frequency counter for flow1
    interrupts();   // Re-enable interrupts
}

void pulse2() {
    noInterrupts(); // Disable interrupts to ensure the count is not corrupted by another interrupt
    pulse_freq2++;  // Increment the pulse frequency counter for flow2
    interrupts();   // Re-enable interrupts
}



// #include <Wire.h>
// #include <SoftwareSerial.h>
// #include <hd44780.h>
// #include <hd44780ioClass/hd44780_I2Cexp.h>
// #include <RTClib.h>

// // Define the LCD and RTC objects
// RTC_DS1307 rtc;
// hd44780_I2Cexp lcd;

// const int LCD_COLS = 20;
// const int LCD_ROWS = 4;

// volatile unsigned long pulse_freq1 = 0;
// volatile unsigned long pulse_freq2 = 0;

// double flow1, lastFlow1 = 0;
// double flow2;

// unsigned long startTime = 0;
// bool timerRunning = false;
// unsigned long totalElapsedTime = 0; // Maintain elapsed time
// unsigned long lastStoppedTime = 0;  // Store the time when the timer stopped

// const double flowChangeThreshold = 0.05; // 5% threshold for flow constancy
// const int valvePin = 4;                  // Pin for controlling the valve

// void setup() {
//     lcd.begin(LCD_COLS, LCD_ROWS);
//     lcd.backlight();

//     lcd.setCursor(0, 0);
//     lcd.print("TimeTaken:0:00:00");
//     lcd.setCursor(0, 1);
//     lcd.print("INLET    :");
//     lcd.setCursor(0, 2);
//     lcd.print("OVERFLOW :");
//     lcd.setCursor(0, 3);
//     lcd.print("FuelUsed :");

//     pinMode(2, INPUT);
//     pinMode(3, INPUT);
//     pinMode(valvePin, OUTPUT);
//     digitalWrite(valvePin, HIGH);

//     attachInterrupt(digitalPinToInterrupt(2), pulse1, RISING);
//     attachInterrupt(digitalPinToInterrupt(3), pulse2, RISING);

//     // Initialize Serial Monitor
//     Serial.begin(9600);
// }

// void loop() {
//     unsigned long currentMillis = millis();
//     flow1 = 0.25 * pulse_freq1; // Convert pulses to ml
//     flow2 = 0.25 * pulse_freq2;

//     lcd.setCursor(11, 1);
//     lcd.print(flow1, 1);
//     lcd.print("ml");
//     lcd.setCursor(11, 2);
//     lcd.print(flow2, 1);
//     lcd.print("ml");
//     lcd.setCursor(11, 3);
//     lcd.print(flow1 - flow2, 1);
//     lcd.print("ml");

//     if (flow1 > 0 && !timerRunning) {
//         startTime = currentMillis;
//         timerRunning = true;
//         digitalWrite(valvePin, HIGH); // Open the valve
//     }

//     if (timerRunning) {
//         unsigned long elapsedTime = currentMillis - startTime;

//         if (abs(flow1 - lastFlow1) / flow1 < flowChangeThreshold) {
//             digitalWrite(valvePin, LOW); // Close valve if flow is constant
//             timerRunning = false;
//             lastStoppedTime = currentMillis;
//             totalElapsedTime += elapsedTime;
//         }

//         lastFlow1 = flow1;
//         printElapsedTime(totalElapsedTime, true); // Update time on LCD

//         // Calculate fuel consumption rate using the fuel difference and elapsed time
//         double fuelDifference = flow1 - flow2;
//         double fuelConsumptionRate = calculateFuelConsumptionPerHour(fuelDifference, totalElapsedTime);

//         // Update LCD and Serial Monitor with the fuel consumption rate
//         lcd.setCursor(0, 3);
//         lcd.print("Fuel: ");
//         lcd.print(fuelConsumptionRate, 1);
//         lcd.print(" L/h");

//         Serial.print("flow1: ");
//         Serial.print(flow1);
//         Serial.print(" ml, flow2: ");
//         Serial.print(flow2);
//         Serial.print(" ml, difference: ");
//         Serial.print(flow1 - flow2);
//         Serial.print(" ml, timetaken: ");
//         printElapsedTime(totalElapsedTime, false);
//         Serial.print(", Fuel Consumption Rate: ");
//         Serial.print(fuelConsumptionRate, 1);
//         Serial.println(" L/h");
//     }

//     delay(1000); // Delay to stabilize readings
// }

// void printElapsedTime(unsigned long elapsedTime, bool toLCD) {
//     char buffer[20]; // Buffer to hold the formatted time string
//     unsigned long seconds = elapsedTime / 1000;
//     unsigned long minutes = seconds / 60;
//     unsigned long hours = minutes / 60;

//     sprintf(buffer, "%lu:%02lu:%02lu", hours, minutes % 60, seconds % 60);

//     if (toLCD) {
//         lcd.setCursor(11, 0);
//         lcd.print(buffer);
//     } else {
//         Serial.print(buffer);
//     }
// }

// double calculateFuelConsumptionPerHour(double fuelDifference, unsigned long elapsedTimeMillis) {
//     if (elapsedTimeMillis > 0) {
//         double hours = elapsedTimeMillis / 3600000.0; // Convert milliseconds to hours
//         return (fuelDifference / hours) / 1000.0; // Calculate L/h from ml/h by dividing by 1000
//     }
//     // If no time has elapsed, return 0 to avoid division by zero
//     return 0.0;
// }
// void pulse1() {
//     noInterrupts(); // Disable interrupts to ensure the count is not corrupted by another interrupt
//     pulse_freq1++;  // Increment the pulse frequency counter for flow1
//     interrupts();   // Re-enable interrupts
// }

// void pulse2() {
//     noInterrupts(); // Disable interrupts to ensure the count is not corrupted by another interrupt
//     pulse_freq2++;  // Increment the pulse frequency counter for flow2
//     interrupts();   // Re-enable interrupts
// }


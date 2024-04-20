// fukne ke bad timer whi pr ruk b jata hai and jaha pr rukta hai agr INLET constant hta h to timer rukta hai agr 
// increase krta h inlet ka value to ttimer ka value whi se bdhna chalu hjta hai

#include <Wire.h>
#include <hd44780.h>
#include <hd44780ioClass/hd44780_I2Cexp.h>
#include <RTClib.h>

RTC_DS1307 rtc; // RTC object
hd44780_I2Cexp lcd;

const int LCD_COLS = 20;
const int LCD_ROWS = 4;

volatile unsigned long pulse_freq1 = 0;
volatile unsigned long pulse_freq2 = 0;

double flow1, lastFlow1 = 0;
double flow2;

unsigned long startTime = 0;
bool timerRunning = false;
unsigned long totalElapsedTime = 0;   // Maintain elapsed time
unsigned long lastStoppedTime = 0;    // Store the time when the timer stopped

const double flowChangeThreshold = 0.05;    // 5% threshold for flow constancy
const int valvePin = 4; // Pin for controlling the valve

void setup() {

    lcd.begin(LCD_COLS, LCD_ROWS);

    lcd.backlight();

    lcd.setCursor(0, 0); lcd.print("TimeTaken:0:00:00");
    lcd.setCursor(0, 1); lcd.print("INLET    :");
    lcd.setCursor(0, 2); lcd.print("OVERFLOW :");
    lcd.setCursor(0, 3); lcd.print("FuelUsed :");

    pinMode(2, INPUT);
    pinMode(3, INPUT);
    pinMode(valvePin, OUTPUT);
    digitalWrite(valvePin, HIGH);

    attachInterrupt(digitalPinToInterrupt(2), pulse1, RISING);
    attachInterrupt(digitalPinToInterrupt(3), pulse2, RISING);

    Serial.begin(9600);
}

void loop() {
    unsigned long currentMillis = millis();
    flow1 = 0.25 * pulse_freq1;
    flow2 = 0.25 * pulse_freq2;

    lcd.setCursor(11, 1); lcd.print(flow1, 1); lcd.print("ml");
    lcd.setCursor(11, 2); lcd.print(flow2, 1); lcd.print("ml");
    lcd.setCursor(11, 3); lcd.print(flow1 - flow2, 1); lcd.print("ml");

    if (flow1 > 0 && !timerRunning) {
        startTime = currentMillis;
        timerRunning = true;
        digitalWrite(valvePin, HIGH);    // Open the valve
    }

    if (timerRunning) {
        unsigned long elapsedTime = currentMillis - startTime;

        // Check if the flow has become constant
        if (timerRunning && abs(flow1 - lastFlow1) / flow1 < flowChangeThreshold) {
            digitalWrite(valvePin, LOW); // Close valve if flow is constant
            timerRunning = false;
            lastStoppedTime = currentMillis; // Update the last stopped time
            totalElapsedTime += elapsedTime; // Update the total elapsed time
        }

        lastFlow1 = flow1;
        
        lcd.setCursor(11, 0);
        printElapsedTime(totalElapsedTime);
    }

    delay(1000); // Delay to stabilize readings
}

void printElapsedTime(unsigned long elapsedTime) {
    lcd.setCursor(11, 0);
    unsigned long seconds = elapsedTime / 1000;
    unsigned long minutes = seconds / 60;
    unsigned long hours = minutes / 60;
    lcd.print(hours); lcd.print(":");
    print2Digits(minutes % 60); lcd.print(":");
    print2Digits(seconds % 60);
}

void print2Digits(unsigned long digits) {
    if (digits < 10) lcd.print("0");
    lcd.print(digits);
}

void pulse1() {
    noInterrupts();
    pulse_freq1++;
    interrupts();
}

void pulse2() {
    noInterrupts();
    pulse_freq2++;
    interrupts();
}









// -------------------

// #include <Wire.h>
// #include <hd44780.h>
// #include <hd44780ioClass/hd44780_I2Cexp.h>
// #include <RTClib.h>
// #include <BLEDevice.h>
// #include <BLEUtils.h>
// #include <BLEServer.h>

// RTC_DS1307 rtc; // RTC object
// hd44780_I2Cexp lcd;

// const int LCD_COLS = 20;
// const int LCD_ROWS = 4;

// volatile unsigned long pulse_freq1 = 0;
// volatile unsigned long pulse_freq2 = 0;

// double flow1, lastFlow1 = 0;
// double flow2;

// unsigned long startTime = 0;
// bool timerRunning = false;
// unsigned long totalElapsedTime = 0;   // Maintain elapsed time
// unsigned long lastStoppedTime = 0;    // Store the time when the timer stopped

// const double flowChangeThreshold = 0.05;    // 5% threshold for flow constancy
// const int valvePin = 4; // Pin for controlling the valve

// BLEServer* pServer = NULL;
// BLECharacteristic* pCharacteristic = NULL;
// const char* serviceUUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
// const char* characteristicUUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

// void setup() {
//     lcd.begin(LCD_COLS, LCD_ROWS);

//     lcd.backlight();

//     lcd.setCursor(0, 0); lcd.print("TimeTaken:0:00:00");
//     lcd.setCursor(0, 1); lcd.print("INLET    :");
//     lcd.setCursor(0, 2); lcd.print("OVERFLOW :");
//     lcd.setCursor(0, 3); lcd.print("FuelUsed :");

//     pinMode(2, INPUT);
//     pinMode(3, INPUT);
//     pinMode(valvePin, OUTPUT);
//     digitalWrite(valvePin, HIGH);

//     attachInterrupt(digitalPinToInterrupt(2), pulse1, RISING);
//     attachInterrupt(digitalPinToInterrupt(3), pulse2, RISING);

//     Serial.begin(9600);

//     BLEDevice::init("FuelMonitor");
//     pServer = BLEDevice::createServer();
//     BLEService *pService = pServer->createService(serviceUUID);
//     pCharacteristic = pService->createCharacteristic(
//                         characteristicUUID,
//                         BLECharacteristic::PROPERTY_READ   |
//                         BLECharacteristic::PROPERTY_WRITE  |
//                         BLECharacteristic::PROPERTY_NOTIFY |
//                         BLECharacteristic::PROPERTY_INDICATE
//                     );
//     pCharacteristic->setValue("0.0"); // Initialize with 0.0 ml
//     pService->start();
//     BLEAdvertising *pAdvertising = pServer->getAdvertising();
//     pAdvertising->start();
// }

// void loop() {
//     unsigned long currentMillis = millis();
//     flow1 = 0.25 * pulse_freq1;
//     flow2 = 0.25 * pulse_freq2;

//     lcd.setCursor(11, 1); lcd.print(flow1, 1); lcd.print("ml");
//     lcd.setCursor(11, 2); lcd.print(flow2, 1); lcd.print("ml");
//     lcd.setCursor(11, 3); lcd.print(flow1 - flow2, 1); lcd.print("ml");

//     if (flow1 > 0 && !timerRunning) {
//         startTime = currentMillis;
//         timerRunning = true;
//         digitalWrite(valvePin, HIGH);    // Open the valve
//     }

//     if (timerRunning) {
//         unsigned long elapsedTime = currentMillis - startTime;

//         // Check if the flow has become constant
//         if (timerRunning && abs(flow1 - lastFlow1) / flow1 < flowChangeThreshold) {
//             digitalWrite(valvePin, LOW); // Close valve if flow is constant
//             timerRunning = false;
//             lastStoppedTime = currentMillis; // Update the last stopped time
//             totalElapsedTime += elapsedTime; // Update the total elapsed time
//         }

//         lastFlow1 = flow1;
        
//         lcd.setCursor(11, 0);
//         printElapsedTime(totalElapsedTime);

//         // Update BLE characteristic value
//         String fuelLevelStr = String(flow1 - flow2, 1);
//         pCharacteristic->setValue(fuelLevelStr.c_str());
//         pCharacteristic->notify();
//     }

//     delay(1000); // Delay to stabilize readings
// }

// void printElapsedTime(unsigned long elapsedTime) {
//     lcd.setCursor(11, 0);
//     unsigned long seconds = elapsedTime / 1000;
//     unsigned long minutes = seconds / 60;
//     unsigned long hours = minutes / 60;
//     lcd.print(hours); lcd.print(":");
//     print2Digits(minutes % 60); lcd.print(":");
//     print2Digits(seconds % 60);
// }

// void print2Digits(unsigned long digits) {
//     if (digits < 10) lcd.print("0");
//     lcd.print(digits);
// }

// void pulse1() {
//     noInterrupts();
//     pulse_freq1++;
//     interrupts();
// }

// void pulse2() {
//     noInterrupts();
//     pulse_freq2++;
//     interrupts();
// }

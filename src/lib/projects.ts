import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'proj-blinking-led',
    slug: 'blinking-led',
    title: 'Blinking LED: The "Hello World" of Hardware',
    description: 'Build your very first electronic circuit with a current-limiting resistor, LED, and digital pin control.',
    fullDescription: 'The "Blinking LED" is the physical computing equivalent of print("Hello World!"). In this project, you will calculate the correct resistor value to protect an LED, wire it on a breadboard, and program your Arduino microcontroller to pulse the light with millisecond precision.',
    trackId: 'arduino',
    difficulty: 'Beginner',
    estimatedTime: '20 mins',
    icon: 'Lightbulb',
    simulationType: 'led',
    parts: [
      { name: 'Arduino Uno R3', quantity: 1, role: 'Microcontroller board', pinHint: 'Digital Pin 13 / Pin 9' },
      { name: '5mm Red LED', quantity: 1, role: 'Light emitter', pinHint: 'Anode (+) to resistor, Cathode (-) to GND' },
      { name: '220Ω Resistor', quantity: 1, role: 'Current limiter (prevents burnout)', pinHint: 'Connected in series' },
      { name: 'Half-size Breadboard', quantity: 1, role: 'Solderless circuit board' },
      { name: 'Jumper Wires (Male-to-Male)', quantity: 2, role: 'Pin 9 to breadboard and GND rail' }
    ],
    wiringSteps: [
      {
        step: 1,
        title: 'Connect Common Ground',
        description: 'Connect a jumper wire from the Arduino GND pin to the blue (-) ground rail on your breadboard.',
        pins: 'Arduino GND -> Breadboard Blue (-) Rail'
      },
      {
        step: 2,
        title: 'Insert the Current-Limiting Resistor',
        description: 'Place a 220Ω resistor (Color code: Red-Red-Brown) across the center channel of the breadboard, connecting row 10 to row 15.',
        pins: 'Breadboard Row 10 -> Row 15'
      },
      {
        step: 3,
        title: 'Insert the LED',
        description: 'Orient the LED: identify the longer leg (Anode +) and shorter leg / flat notch (Cathode -). Insert Anode into row 15, and Cathode into the GND rail.',
        pins: 'LED Anode (+) -> Row 15 | LED Cathode (-) -> GND Rail'
      },
      {
        step: 4,
        title: 'Connect Control Pin',
        description: 'Connect a jumper wire from Arduino Digital Pin 9 (PWM capable) to Breadboard Row 10 (the other leg of the resistor).',
        pins: 'Arduino Pin 9 -> Breadboard Row 10'
      }
    ],
    codeLanguage: 'cpp',
    codeSnippet: `// sunAcademy Project: Blinking LED with Configurable Duty Cycle
const int LED_PIN = 9;       // Digital pin connected to the LED anode resistor
const int BLINK_DELAY = 500; // Duration in milliseconds (500ms = 0.5 sec)

void setup() {
  // Configure LED_PIN as an output driving current
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Blinking LED project initiated.");
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // Supply 5V to turn on LED
  Serial.println("LED State: ON");
  delay(BLINK_DELAY);

  digitalWrite(LED_PIN, LOW);  // Pull to 0V (GND) to turn off LED
  Serial.println("LED State: OFF");
  delay(BLINK_DELAY);
}`,
    troubleshootingTips: [
      {
        issue: 'LED does not light up at all',
        solution: 'Check LED orientation. The longer lead is positive (Anode). If reversed, the diode blocks current. Also verify the ground wire connects to Arduino GND.'
      },
      {
        issue: 'LED is very dim',
        solution: 'You may have used a 10kΩ or 100kΩ resistor instead of a 220Ω resistor. Check color bands: Red-Red-Brown = 220Ω.'
      },
      {
        issue: 'Upload failed: avrdude stk500_recv(): programmer is not responding',
        solution: 'In Arduino IDE, verify Tools -> Port matches your connected board and Tools -> Board is set to Arduino Uno.'
      }
    ]
  },
  {
    id: 'proj-traffic-light',
    slug: 'traffic-light-controller',
    title: 'Traffic Light Controller with Pedestrian Button',
    description: 'Program a realistic 3-state intersection with Red, Yellow, and Green LEDs, plus an interrupt pedestrian request.',
    fullDescription: 'Intersections run on deterministic state machines. In this project, you will build a complete scale traffic light controller with Red, Amber, and Green indicators, and an interactive pedestrian crossing pushbutton that smoothly overrides the light sequence.',
    trackId: 'arduino',
    difficulty: 'Beginner',
    estimatedTime: '35 mins',
    icon: 'Radio',
    simulationType: 'traffic-light',
    parts: [
      { name: 'Arduino Uno R3', quantity: 1, role: 'Microcontroller logic' },
      { name: '5mm Red LED', quantity: 1, role: 'Stop signal', pinHint: 'Digital Pin 12' },
      { name: '5mm Yellow LED', quantity: 1, role: 'Caution signal', pinHint: 'Digital Pin 11' },
      { name: '5mm Green LED', quantity: 1, role: 'Go signal', pinHint: 'Digital Pin 10' },
      { name: '220Ω Resistors', quantity: 3, role: 'Current-limiting for each LED' },
      { name: 'Tactile Pushbutton', quantity: 1, role: 'Pedestrian crossing call button', pinHint: 'Digital Pin 2 (Interrupt 0)' },
      { name: '10kΩ Resistor', quantity: 1, role: 'Pull-down resistor for pushbutton' },
      { name: 'Breadboard & Jumper Wires', quantity: 1, role: 'Wiring manifold' }
    ],
    wiringSteps: [
      {
        step: 1,
        title: 'Wire the LED Array',
        description: 'Place Red, Yellow, and Green LEDs side-by-side on the breadboard. Connect their short leads (Cathodes) to the common GND rail through 220Ω resistors.',
        pins: 'All Cathodes (-) -> 220Ω -> GND Rail'
      },
      {
        step: 2,
        title: 'Connect Control Signals',
        description: 'Connect Arduino Pin 12 to Red LED anode, Pin 11 to Yellow LED anode, and Pin 10 to Green LED anode.',
        pins: 'Pin 12 -> Red, Pin 11 -> Yellow, Pin 10 -> Green'
      },
      {
        step: 3,
        title: 'Wire the Pedestrian Pushbutton',
        description: 'Connect one leg of the pushbutton to 5V. Connect the diagonal opposite leg to Arduino Pin 2, and bridge that same leg to GND through a 10kΩ pull-down resistor.',
        pins: 'Button Leg 1 -> 5V | Leg 2 -> Pin 2 & 10kΩ to GND'
      }
    ],
    codeLanguage: 'cpp',
    codeSnippet: `// sunAcademy Traffic Light Controller with Pedestrian Interrupt
const int RED_PIN = 12;
const int YELLOW_PIN = 11;
const int GREEN_PIN = 10;
const int BUTTON_PIN = 2;

volatile bool pedestrianWaiting = false;

void pedestrianRequest() {
  pedestrianWaiting = true;
}

void setLights(bool red, bool yellow, bool green) {
  digitalWrite(RED_PIN, red ? HIGH : LOW);
  digitalWrite(YELLOW_PIN, yellow ? HIGH : LOW);
  digitalWrite(GREEN_PIN, green ? HIGH : LOW);
}

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(YELLOW_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT);

  // Attach hardware interrupt on Pin 2
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), pedestrianRequest, RISING);
}

void loop() {
  // 1. GREEN (Standard traffic flow)
  setLights(false, false, true);
  for (int i = 0; i < 40; i++) {
    delay(100);
    if (pedestrianWaiting) break; // Early transition for pedestrian
  }

  // 2. YELLOW (Caution warning)
  setLights(false, true, false);
  delay(1500);

  // 3. RED (Full Stop & Pedestrian Crossing)
  setLights(true, false, false);
  pedestrianWaiting = false;
  delay(3500); // Walk window
}`,
    troubleshootingTips: [
      {
        issue: 'Pedestrian button triggers erratically without being pressed',
        solution: 'A missing pull-down resistor leaves Pin 2 floating. Ensure the 10kΩ resistor connects between Pin 2 and GND, or use pinMode(BUTTON_PIN, INPUT_PULLUP) with active-low logic.'
      },
      {
        issue: 'Yellow and Green LEDs turn on at the same time',
        solution: 'Check your breadboard rows; ensure adjacent LED anode jumper wires do not occupy the same 5-hole terminal strip.'
      }
    ]
  },
  {
    id: 'proj-temperature-display',
    slug: 'temperature-display',
    title: 'Temperature & Humidity Display Station',
    description: 'Interface a DHT11 climate sensor and output live metrics to an I2C 16x2 LCD screen with threshold alerts.',
    fullDescription: 'Climate control stations are central to greenhouse monitoring and server rooms. In this project, you will read temperature and humidity digitally, format strings with Celsius/Fahrenheit units, and drive an I2C LCD character display using only two microcontroller signal wires.',
    trackId: 'arduino',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    icon: 'Thermometer',
    simulationType: 'temperature',
    parts: [
      { name: 'Arduino Uno R3', quantity: 1, role: 'Controller processor' },
      { name: 'DHT11 or DHT22 Sensor Module', quantity: 1, role: 'Temperature & relative humidity probe', pinHint: 'Data Pin D4' },
      { name: '16x2 LCD with I2C Backpack (PCF8574)', quantity: 1, role: 'Alphanumeric readout', pinHint: 'SDA to A4, SCL to A5' },
      { name: 'Active Buzzer', quantity: 1, role: 'High temperature alert', pinHint: 'Digital Pin 8' },
      { name: 'Breadboard & Jumpers', quantity: 1, role: 'Interconnects' }
    ],
    wiringSteps: [
      {
        step: 1,
        title: 'Power Common Bus',
        description: 'Connect Arduino 5V and GND to the breadboard top power and ground rails.',
        pins: 'Arduino 5V -> (+) Rail | Arduino GND -> (-) Rail'
      },
      {
        step: 2,
        title: 'Wire the I2C LCD Backpack',
        description: 'Connect LCD VCC to 5V, GND to GND, SDA to Arduino Analog Pin A4, and SCL to Arduino Analog Pin A5.',
        pins: 'VCC->5V | GND->GND | SDA->A4 | SCL->A5'
      },
      {
        step: 3,
        title: 'Connect the DHT11 Sensor',
        description: 'Connect DHT11 VCC to 5V, GND to GND, and Data pin to Arduino Digital Pin 4. (If using bare 4-pin DHT11, add a 4.7kΩ pull-up resistor between VCC and Data).',
        pins: 'DHT Data -> Pin 4'
      },
      {
        step: 4,
        title: 'Wire Alert Buzzer',
        description: 'Connect Buzzer (+) to Digital Pin 8 and (-) to the Ground rail.',
        pins: 'Buzzer (+) -> Pin 8 | Buzzer (-) -> GND'
      }
    ],
    codeLanguage: 'cpp',
    codeSnippet: `// sunAcademy Weather & Climate Station with I2C LCD Readout
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT11
#define BUZZER_PIN 8
#define TEMP_THRESHOLD 28.0 // Alert temperature in Celsius

DHT dht(DHTPIN, DHTTYPE);
// 0x27 is the standard I2C address for PCF8574 backpacks
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(9600);
  pinMode(BUZZER_PIN, OUTPUT);
  
  dht.begin();
  lcd.init();
  lcd.backlight();
  
  lcd.setCursor(0, 0);
  lcd.print("sunAcademy Weather");
  lcd.setCursor(0, 1);
  lcd.print("Initializing...");
  delay(1500);
  lcd.clear();
}

void loop() {
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    lcd.setCursor(0, 0);
    lcd.print("Sensor Read Err!");
    delay(2000);
    return;
  }

  // Row 0: Temperature
  lcd.setCursor(0, 0);
  lcd.print("Temp: ");
  lcd.print(temperature, 1);
  lcd.print((char)223); // Degree symbol
  lcd.print("C");

  // Row 1: Humidity
  lcd.setCursor(0, 1);
  lcd.print("Humidity: ");
  lcd.print(humidity, 0);
  lcd.print(" %");

  // High temperature alert
  if (temperature > TEMP_THRESHOLD) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
  }

  delay(2000); // DHT11 minimum polling interval
}`,
    troubleshootingTips: [
      {
        issue: 'LCD displays solid white boxes or blank screen',
        solution: 'Adjust the small blue potentiometer on the back of the I2C backpack using a small screwdriver to set display contrast. Also verify the I2C address (run an I2C scanner sketch if address is 0x3F instead of 0x27).'
      },
      {
        issue: 'Sensor reports "Sensor Read Err!" / NaN values',
        solution: 'Ensure the DHT11 data pin is seated firmly. Do not poll the DHT11 faster than once every 1.5 seconds.'
      }
    ]
  },
  {
    id: 'proj-ultrasonic-distance',
    slug: 'ultrasonic-distance-sensor',
    title: 'Ultrasonic Distance Meter & Parking Sensor',
    description: 'Calculate real-time distances with sound waves and build a multi-stage acoustic reverse parking radar.',
    fullDescription: 'Automotive reverse parking radars and industrial tank level monitors use ultrasonic echolocation. In this project, you will bounce 40,000 Hz sound waves off obstacles, compute distance in centimeters via the speed of sound, and generate dynamic buzzer beeps whose rate increases as objects approach.',
    trackId: 'arduino',
    difficulty: 'Intermediate',
    estimatedTime: '40 mins',
    icon: 'Radar',
    simulationType: 'ultrasonic',
    parts: [
      { name: 'Arduino Uno R3', quantity: 1, role: 'Microcontroller processor' },
      { name: 'HC-SR04 Ultrasonic Module', quantity: 1, role: 'Sonar transmitter & receiver', pinHint: 'Trig D9, Echo D10' },
      { name: 'Piezo Buzzer', quantity: 1, role: 'Acoustic distance radar beeper', pinHint: 'Digital Pin 6' },
      { name: 'Green, Yellow, Red LEDs', quantity: 3, role: 'Proximity range bar', pinHint: 'Pins 3, 4, 5' },
      { name: '220Ω Resistors', quantity: 3, role: 'LED protection' },
      { name: 'Jumper Wires & Breadboard', quantity: 1, role: 'Circuit interconnection' }
    ],
    wiringSteps: [
      {
        step: 1,
        title: 'Mount Ultrasonic Sensor',
        description: 'Seat the HC-SR04 across the breadboard. Connect VCC to 5V and GND to GND.',
        pins: 'HC-SR04 VCC -> 5V | GND -> GND'
      },
      {
        step: 2,
        title: 'Connect Trigger and Echo',
        description: 'Connect HC-SR04 Trig pin to Arduino Pin 9, and Echo pin to Arduino Pin 10.',
        pins: 'Trig -> Pin 9 | Echo -> Pin 10'
      },
      {
        step: 3,
        title: 'Wire the LED Proximity Indicators',
        description: 'Wire Green LED to Pin 3 (Far: >25cm), Yellow LED to Pin 4 (Mid: 12-25cm), and Red LED to Pin 5 (Close: <12cm). Connect all cathodes through 220Ω resistors to GND.',
        pins: 'Pin 3 -> Green | Pin 4 -> Yellow | Pin 5 -> Red'
      },
      {
        step: 4,
        title: 'Connect the Piezo Buzzer',
        description: 'Connect Buzzer (+) to Digital Pin 6 and Buzzer (-) to Ground.',
        pins: 'Buzzer (+) -> Pin 6 | Buzzer (-) -> GND'
      }
    ],
    codeLanguage: 'cpp',
    codeSnippet: `// sunAcademy Ultrasonic Proximity & Reverse Parking Radar
const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int BUZZER_PIN = 6;
const int LED_GREEN = 3;
const int LED_YELLOW = 4;
const int LED_RED = 5;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  Serial.begin(9600);
}

float measureDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 25000); // 25ms timeout (~4m max)
  if (duration == 0) return 999.0; // Out of range

  return (duration * 0.0343) / 2.0;
}

void loop() {
  float distance = measureDistanceCm();
  Serial.print("Target Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  // Reset LEDs
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_YELLOW, LOW);
  digitalWrite(LED_RED, LOW);

  if (distance < 10.0) {
    // Critical Proximity (< 10cm): Red LED + Constant alarm
    digitalWrite(LED_RED, HIGH);
    tone(BUZZER_PIN, 2200, 100);
    delay(100);
  } else if (distance < 20.0) {
    // Medium Proximity (10-20cm): Yellow LED + Fast Beep
    digitalWrite(LED_YELLOW, HIGH);
    tone(BUZZER_PIN, 1500, 50);
    delay(200);
  } else if (distance < 40.0) {
    // Safe Zone (20-40cm): Green LED + Slow Beep
    digitalWrite(LED_GREEN, HIGH);
    tone(BUZZER_PIN, 1000, 30);
    delay(400);
  } else {
    // Clear path
    noTone(BUZZER_PIN);
    delay(250);
  }
}`,
    troubleshootingTips: [
      {
        issue: 'Sensor returns 0 or 999 continuously',
        solution: 'Check if Trig and Echo wires are swapped. Trig sends the ultrasonic chirp, Echo reads the return wave.'
      },
      {
        issue: 'Inaccurate readings on soft or cloth surfaces',
        solution: 'Cloth and acoustic foam absorb 40kHz ultrasound. Test against hard flat surfaces like a wall, cardboard, or hand.'
      }
    ]
  },
  {
    id: 'proj-smart-plant-watering',
    slug: 'smart-plant-watering-system',
    title: 'Smart Plant Automated Watering System',
    description: 'Monitor soil moisture levels and trigger a 5V submersible relay water pump automatically when soil runs dry.',
    fullDescription: 'Never let your houseplants wilt again. This project combines a capacitive soil moisture sensor, a 5V relay switch, and an automated water pump with dry-run protection and hysteresis to prevent relay chatter.',
    trackId: 'arduino',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    icon: 'Sprout',
    simulationType: 'plant-watering',
    parts: [
      { name: 'Arduino Uno R3', quantity: 1, role: 'Control logic' },
      { name: 'Capacitive Soil Moisture Sensor v1.2', quantity: 1, role: 'Corrosion-free moisture probe', pinHint: 'Analog Pin A0' },
      { name: '5V Single-Channel Relay Module', quantity: 1, role: 'Isolates and switches pump motor', pinHint: 'Digital Pin 7' },
      { name: 'Mini 5V Submersible Water Pump', quantity: 1, role: 'Water irrigation delivery' },
      { name: 'Vinyl Tubing (6mm ID)', quantity: 1, role: 'Water transport line' },
      { name: 'Status Indicator LED', quantity: 1, role: 'Pumping active warning', pinHint: 'Digital Pin 13' },
      { name: 'External 5V / 2A Power Supply', quantity: 1, role: 'Dedicated power for pump' }
    ],
    wiringSteps: [
      {
        step: 1,
        title: 'Wire the Soil Moisture Probe',
        description: 'Connect Capacitive Sensor VCC to 3.3V (for stable reading), GND to Arduino GND, and AOUT to Analog Pin A0.',
        pins: 'Sensor VCC -> 3.3V | GND -> GND | AOUT -> Pin A0'
      },
      {
        step: 2,
        title: 'Connect the 5V Relay Control',
        description: 'Connect Relay module VCC to 5V, GND to GND, and IN (signal) to Arduino Digital Pin 7.',
        pins: 'Relay VCC -> 5V | GND -> GND | IN -> Pin 7'
      },
      {
        step: 3,
        title: 'Wire the Submersible Pump via Relay Contacts',
        description: 'Route the pump’s positive power wire through the Relay Common (COM) and Normally Open (NO) terminal screw terminals. Connect pump (-) to external power supply GND.',
        pins: 'Power Supply (+) -> Relay COM | Relay NO -> Pump (+) | Pump (-) -> Power Supply GND'
      }
    ],
    codeLanguage: 'cpp',
    codeSnippet: `// sunAcademy Automated Smart Plant Watering Controller
const int MOISTURE_PIN = A0;
const int RELAY_PIN = 7;
const int STATUS_LED = 13;

// Calibration values (adjust based on your dry soil vs wet soil tests)
const int DRY_SOIL_ADC = 680;  // Raw value in air/dry soil
const int WET_SOIL_ADC = 320;  // Raw value submerged in water
const int THRESHOLD_PERCENT = 30; // Water if moisture drops below 30%

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(STATUS_LED, OUTPUT);
  // Keep relay deactivated at startup (Active LOW relays turn off on HIGH)
  digitalWrite(RELAY_PIN, HIGH);
  digitalWrite(STATUS_LED, LOW);
  
  Serial.begin(9600);
  Serial.println("sunAcademy Plant Care Unit Active.");
}

int getMoisturePercentage() {
  int raw = analogRead(MOISTURE_PIN);
  int percent = map(raw, DRY_SOIL_ADC, WET_SOIL_ADC, 0, 100);
  return constrain(percent, 0, 100);
}

void loop() {
  int moisture = getMoisturePercentage();
  Serial.print("Soil Moisture: ");
  Serial.print(moisture);
  Serial.println("%");

  if (moisture < THRESHOLD_PERCENT) {
    Serial.println("Status: Soil Dry! Commencing 3-second irrigation cycle...");
    digitalWrite(STATUS_LED, HIGH);
    digitalWrite(RELAY_PIN, LOW); // Activate Relay (pump ON)
    delay(3000);                  // Water for 3 seconds
    
    digitalWrite(RELAY_PIN, HIGH);// Deactivate Relay (pump OFF)
    digitalWrite(STATUS_LED, LOW);
    
    // Allow water to absorb and disperse for 20 seconds before re-checking
    delay(20000);
  } else {
    Serial.println("Status: Soil moisture adequate.");
    delay(5000);
  }
}`,
    troubleshootingTips: [
      {
        issue: 'Pump does not turn on when relay clicks',
        solution: 'Relay is an isolated switch, not a power source. Ensure the pump has an external power supply connected in series with the relay COM and NO terminals.'
      },
      {
        issue: 'Resistive probe corrodes after a few weeks',
        solution: 'Resistive prong probes suffer rapid galvanic corrosion. Upgrade to a capacitive sensor (v1.2) which has coated traces and no exposed copper to water.'
      }
    ]
  },
  {
    id: 'proj-obstacle-avoiding-robot',
    slug: 'obstacle-avoiding-robot',
    title: 'Obstacle-Avoiding Autonomous Mobile Robot',
    description: 'Assemble a 2-wheel robotic rover that scans surrounding obstacles with a servo-mounted ultrasonic sensor and navigates rooms autonomously.',
    fullDescription: 'Autonomous vehicles like Mars rovers and robotic vacuum cleaners navigate unknown terrain using sensor-driven collision avoidance. In this project, you will integrate an L298N H-bridge motor driver, two geared DC motors, an SG90 servo pan unit, and an HC-SR04 sonar sensor to make real-time navigational decisions.',
    trackId: 'arduino',
    difficulty: 'Advanced',
    estimatedTime: '90 mins',
    icon: 'Bot',
    simulationType: 'obstacle-robot',
    parts: [
      { name: '2WD Smart Robot Chassis Kit', quantity: 1, role: 'Acrylic platform, castor wheel, and hardware' },
      { name: 'Arduino Uno R3', quantity: 1, role: 'Autonomous navigation computer' },
      { name: 'L298N Dual H-Bridge Motor Driver', quantity: 1, role: 'Drives high-torque DC motors' },
      { name: 'Geared TT DC Motors', quantity: 2, role: 'Left and Right wheel drives' },
      { name: 'HC-SR04 Ultrasonic Sensor', quantity: 1, role: 'Obstacle detection eyes' },
      { name: 'SG90 Micro Servo', quantity: 1, role: 'Rotates ultrasonic sensor Left/Right' },
      { name: '2x 18650 Battery Pack with Switch (7.4V)', quantity: 1, role: 'High-current motor power' }
    ],
    wiringSteps: [
      {
        step: 1,
        title: 'Connect DC Motors to L298N Driver',
        description: 'Wire Left motor terminals to OUT1 & OUT2. Wire Right motor terminals to OUT3 & OUT4 on the L298N driver board.',
        pins: 'OUT1/OUT2 -> Left Motor | OUT3/OUT4 -> Right Motor'
      },
      {
        step: 2,
        title: 'Interface Motor Driver Logic with Arduino',
        description: 'Connect L298N IN1, IN2, IN3, IN4 to Arduino Pins 5, 6, 7, 8. Connect common GND between battery, L298N, and Arduino.',
        pins: 'IN1->D5 | IN2->D6 | IN3->D7 | IN4->D8 | Common GND'
      },
      {
        step: 3,
        title: 'Mount and Wire Servo Sonar Scanner',
        description: 'Mount HC-SR04 onto the SG90 servo horn at the front chassis. Connect Servo signal to Pin 9, Sonar Trig to Pin 11, and Echo to Pin 12.',
        pins: 'Servo -> Pin 9 | Trig -> Pin 11 | Echo -> Pin 12'
      }
    ],
    codeLanguage: 'cpp',
    codeSnippet: `// sunAcademy Autonomous Obstacle-Avoiding Mobile Rover
#include <Servo.h>

const int IN1 = 5, IN2 = 6, IN3 = 7, IN4 = 8;
const int TRIG_PIN = 11, ECHO_PIN = 12, SERVO_PIN = 9;

Servo headServo;

void setup() {
  pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT); pinMode(IN4, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT); pinMode(ECHO_PIN, INPUT);
  
  headServo.attach(SERVO_PIN);
  headServo.write(90); // Look straight ahead
  delay(1000);
}

int getDistance() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long dur = pulseIn(ECHO_PIN, HIGH, 20000);
  return (dur == 0) ? 999 : (dur * 0.0343) / 2;
}

void moveForward()  { digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW); digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW); }
void moveBackward() { digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH); digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH); }
void turnLeft()     { digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH); digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW); }
void turnRight()    { digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW); digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH); }
void stopRover()    { digitalWrite(IN1, LOW); digitalWrite(IN2, LOW); digitalWrite(IN3, LOW); digitalWrite(IN4, LOW); }

void loop() {
  int centerDist = getDistance();
  
  if (centerDist > 25) {
    moveForward();
  } else {
    stopRover();
    delay(200);
    moveBackward();
    delay(400);
    stopRover();
    
    // Look Left
    headServo.write(150); delay(400);
    int leftDist = getDistance();
    
    // Look Right
    headServo.write(30); delay(400);
    int rightDist = getDistance();
    
    // Return to Center
    headServo.write(90); delay(200);
    
    // Choose path with greater clearance
    if (leftDist > rightDist) {
      turnLeft();
      delay(500);
    } else {
      turnRight();
      delay(500);
    }
  }
  delay(50);
}`,
    troubleshootingTips: [
      {
        issue: 'Robot moves in circles or spins continuously backwards',
        solution: 'Swap the two wires of the backwards motor on the L298N terminal blocks to invert motor polarity.'
      },
      {
        issue: 'Arduino resets or freezes when motors start moving',
        solution: 'Classic brown-out reset! Motor inrush current drops battery voltage below 4.5V. Use separate battery packs for Arduino and motors, and ensure their GND lines are connected together.'
      }
    ]
  }
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return PROJECTS.find(p => p.slug === slug);
};

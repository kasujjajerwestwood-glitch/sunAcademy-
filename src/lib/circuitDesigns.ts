import { CircuitDesign } from '../types';

export const CIRCUIT_DESIGNS: CircuitDesign[] = [
  {
    id: 'circ-1',
    slug: 'blinking-led',
    title: 'Blinking LED & 220Ω Resistor',
    category: 'Circuits',
    lastEdited: 'Edited 25 mins ago',
    isPublic: true,
    difficulty: 'Beginner',
    componentsCount: 4,
    simulationType: 'led',
    description: 'The classic Sun Academy Arduino starter circuit. Demonstrates digital output switching on Pin 9 with current-limiting resistor protection.',
    parts: [
      { name: 'Arduino Uno R3', quantity: 1, role: 'Microcontroller processor' },
      { name: 'Small Breadboard', quantity: 1, role: 'Circuit prototyping' },
      { name: '5mm Red LED', quantity: 1, role: 'Visual indicator' },
      { name: '220Ω Resistor', quantity: 1, role: 'Current limiter' }
    ],
    wiringSteps: [
      { step: 1, title: 'Connect GND', description: 'Run black wire from Arduino GND to breadboard (-) rail.', pins: 'GND -> (-) Rail' },
      { step: 2, title: 'Insert Resistor', description: 'Connect 220Ω resistor from row 10 to row 14.', pins: 'Row 10 -> Row 14' },
      { step: 3, title: 'Insert LED', description: 'Anode to row 14, Cathode to breadboard GND rail.', pins: 'Anode -> Row 14 | Cathode -> GND' },
      { step: 4, title: 'Connect Digital Pin 9', description: 'Run green wire from Arduino Pin 9 to row 10.', pins: 'D9 -> Row 10' }
    ],
    codeLanguage: 'cpp',
    code: `// Sun Academy Arduino Circuits: Blink Sketch
int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("Circuit simulation initialized.");
}

void loop() {
  digitalWrite(ledPin, HIGH);
  Serial.println("LED ON (5V)");
  delay(500);
  
  digitalWrite(ledPin, LOW);
  Serial.println("LED OFF (0V)");
  delay(500);
}`,
    troubleshootingTips: [
      { issue: 'LED not lighting', solution: 'Check polarity: the longer leg is positive (Anode).' },
      { issue: 'LED burned out in simulation', solution: 'Ensure 220Ω resistor is in series to prevent excessive current.' }
    ]
  },
  {
    id: 'circ-2',
    slug: 'traffic-light-controller',
    title: 'Traffic Light with Crosswalk Pushbutton',
    category: 'Circuits',
    lastEdited: 'Edited 2 hours ago',
    isPublic: true,
    difficulty: 'Beginner',
    componentsCount: 8,
    simulationType: 'traffic-light',
    description: 'Tri-color intersection signal (Red, Yellow, Green) with an interrupt-driven pedestrian request button.',
    parts: [
      { name: 'Arduino Uno R3', quantity: 1, role: 'Logic brain' },
      { name: 'Breadboard Small', quantity: 1, role: 'Baseboard' },
      { name: 'Red, Yellow, Green LEDs', quantity: 3, role: 'Traffic lights' },
      { name: '220Ω Resistors', quantity: 3, role: 'LED protection' },
      { name: 'Pushbutton switch', quantity: 1, role: 'Pedestrian walk call' }
    ],
    wiringSteps: [
      { step: 1, title: 'Wire LED array', description: 'Connect Green to Pin 10, Yellow to Pin 11, Red to Pin 12.', pins: 'D10, D11, D12' },
      { step: 2, title: 'Add Resistors', description: 'Wire 220Ω from each LED cathode to GND bus.', pins: 'Cathodes -> GND' },
      { step: 3, title: 'Wire Pushbutton', description: 'Connect button to Pin 2 with 10k pull-down.', pins: 'D2 (Interrupt 0)' }
    ],
    codeLanguage: 'cpp',
    code: `// sunAcademy Traffic Light State Machine
const int RED = 12, YELLOW = 11, GREEN = 10, BTN = 2;
volatile bool walkReq = false;

void requestWalk() { walkReq = true; }

void setup() {
  pinMode(RED, OUTPUT); pinMode(YELLOW, OUTPUT); pinMode(GREEN, OUTPUT);
  pinMode(BTN, INPUT);
  attachInterrupt(digitalPinToInterrupt(BTN), requestWalk, RISING);
}

void loop() {
  digitalWrite(GREEN, HIGH);
  for (int i=0; i<30; i++) { delay(100); if (walkReq) break; }
  digitalWrite(GREEN, LOW); digitalWrite(YELLOW, HIGH); delay(1200);
  digitalWrite(YELLOW, LOW); digitalWrite(RED, HIGH);
  walkReq = false; delay(3500);
  digitalWrite(RED, LOW);
}`,
    troubleshootingTips: [
      { issue: 'Yellow and green on together', solution: 'Verify breadboard isolation between adjacent columns.' }
    ]
  },
  {
    id: 'circ-3',
    slug: 'ultrasonic-distance-sensor',
    title: 'Ultrasonic Sonar Distance Radar',
    category: 'Circuits',
    lastEdited: 'Edited 1 day ago',
    isPublic: true,
    difficulty: 'Intermediate',
    componentsCount: 5,
    simulationType: 'ultrasonic',
    description: 'Measures distance via sound wave time-of-flight with acoustic buzzer frequency modulation.',
    parts: [
      { name: 'Arduino Uno R3', quantity: 1, role: 'Microcontroller' },
      { name: 'HC-SR04 Ultrasonic Sensor', quantity: 1, role: 'Sonar transceiver' },
      { name: 'Piezo Buzzer', quantity: 1, role: 'Acoustic alarm' },
      { name: 'Breadboard & Jumper wires', quantity: 1, role: 'Wiring manifold' }
    ],
    wiringSteps: [
      { step: 1, title: 'Power Sonar', description: 'VCC to 5V, GND to GND rail.', pins: 'VCC->5V | GND->GND' },
      { step: 2, title: 'Signal Pins', description: 'Trig to Pin 9, Echo to Pin 10.', pins: 'Trig->D9 | Echo->D10' },
      { step: 3, title: 'Connect Buzzer', description: 'Positive to Pin 6, Negative to GND.', pins: 'D6 -> Buzzer (+)' }
    ],
    codeLanguage: 'cpp',
    code: `const int TRIG = 9, ECHO = 10, BUZZER = 6;

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT); pinMode(BUZZER, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long dur = pulseIn(ECHO, HIGH, 25000);
  float dist = (dur * 0.0343) / 2.0;
  
  Serial.print("Target Distance: ");
  Serial.print(dist);
  Serial.println(" cm");
  
  if (dist > 0 && dist < 15.0) {
    tone(BUZZER, 2000, 50);
  }
  delay(100);
}`,
    troubleshootingTips: [
      { issue: 'PulseIn returns 0', solution: 'Ensure Trig and Echo are not swapped on pins 9 and 10.' }
    ]
  },
  {
    id: 'circ-4',
    slug: 'smart-plant-watering-system',
    title: 'Smart Plant Soil Moisture & Relay',
    category: 'Starters',
    lastEdited: 'Edited 3 days ago',
    isPublic: true,
    difficulty: 'Intermediate',
    componentsCount: 6,
    simulationType: 'plant-watering',
    description: 'Analog soil moisture probe trigger with 5V relay switch pump activation.',
    parts: [
      { name: 'Arduino Uno R3', quantity: 1, role: 'Controller' },
      { name: 'Soil Moisture Sensor', quantity: 1, role: 'Analog hygrometer' },
      { name: '5V Relay Module', quantity: 1, role: 'Power switch' },
      { name: 'Water Pump 5V', quantity: 1, role: 'Irrigation' }
    ],
    wiringSteps: [
      { step: 1, title: 'Sensor connection', description: 'Probe AOUT to Arduino A0.', pins: 'A0 -> Sensor AOUT' },
      { step: 2, title: 'Relay connection', description: 'Relay IN to Pin 7.', pins: 'D7 -> Relay IN' }
    ],
    codeLanguage: 'cpp',
    code: `const int MOISTURE_PIN = A0;
const int RELAY_PIN = 7;

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Off
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(MOISTURE_PIN);
  int percent = map(raw, 700, 300, 0, 100);
  Serial.print("Moisture: "); Serial.print(percent); Serial.println("%");
  
  if (percent < 30) {
    Serial.println("Soil Dry! Pumping water...");
    digitalWrite(RELAY_PIN, LOW); // Activate pump
    delay(3000);
    digitalWrite(RELAY_PIN, HIGH);
    delay(10000);
  }
  delay(2000);
}`,
    troubleshootingTips: [
      { issue: 'Pump clicks but does not pump', solution: 'Ensure separate external 5V power supply is attached to relay contacts.' }
    ]
  },
  {
    id: 'circ-5',
    slug: 'obstacle-avoiding-robot',
    title: 'Autonomous Mobile Rover Kinematics',
    category: 'Codeblocks',
    lastEdited: 'Edited 5 days ago',
    isPublic: true,
    difficulty: 'Advanced',
    componentsCount: 9,
    simulationType: 'obstacle-robot',
    description: 'Dual DC motor differential steering with servo-mounted sonar obstacle radar.',
    parts: [
      { name: 'Arduino Uno R3', quantity: 1, role: 'Microcontroller' },
      { name: 'L298N Motor Driver', quantity: 1, role: 'Dual H-Bridge' },
      { name: 'TT Geared DC Motors', quantity: 2, role: 'Drive wheels' },
      { name: 'SG90 Micro Servo', quantity: 1, role: 'Scanner pan' }
    ],
    wiringSteps: [
      { step: 1, title: 'Motor Driver', description: 'IN1-IN4 to Pins 5, 6, 7, 8.', pins: 'D5, D6, D7, D8' },
      { step: 2, title: 'Servo Scanner', description: 'Signal wire to Pin 9.', pins: 'D9 -> Servo' }
    ],
    codeLanguage: 'cpp',
    code: `#include <Servo.h>
Servo head;
void setup() { head.attach(9); head.write(90); }
void loop() { delay(100); }`,
    troubleshootingTips: [
      { issue: 'Arduino resets during turn', solution: 'Separate motor battery power from Arduino logic supply.' }
    ]
  },
  {
    id: 'circ-6',
    slug: 'temperature-display',
    title: 'Climate Station & 16x2 I2C Display',
    category: 'Starters',
    lastEdited: 'Edited 1 week ago',
    isPublic: true,
    difficulty: 'Intermediate',
    componentsCount: 5,
    simulationType: 'temperature',
    description: 'Digital temperature monitoring with alphanumeric I2C character display.',
    parts: [
      { name: 'Arduino Uno R3', quantity: 1, role: 'Processor' },
      { name: '16x2 LCD I2C', quantity: 1, role: 'Screen' },
      { name: 'DHT Sensor', quantity: 1, role: 'Climate' }
    ],
    wiringSteps: [
      { step: 1, title: 'Wire I2C Bus', description: 'SDA to A4, SCL to A5.', pins: 'A4 (SDA), A5 (SCL)' }
    ],
    codeLanguage: 'cpp',
    code: `// 16x2 LCD Climate Readout
#include <Wire.h>
void setup() { Wire.begin(); }
void loop() { delay(1000); }`,
    troubleshootingTips: [
      { issue: 'Blank screen', solution: 'Turn blue potentiometer on back of I2C backpack to adjust contrast.' }
    ]
  }
];

export const getCircuitBySlug = (slug: string): CircuitDesign | undefined => {
  return CIRCUIT_DESIGNS.find(c => c.slug === slug);
};

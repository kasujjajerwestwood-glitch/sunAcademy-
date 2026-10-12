import { PlacedComponent, PlacedWire } from '../types/builder';

export interface CircuitStarterPreset {
  id: string;
  name: string;
  category: 'Starters';
  icon: string;
  description: string;
  components: PlacedComponent[];
  wires: PlacedWire[];
  codeLanguage: 'cpp' | 'python';
  code: string;
}

export const CIRCUIT_STARTERS: CircuitStarterPreset[] = [
  // 1. BLINK (ARDUINO UNO + LED)
  {
    id: 'starter-blink-led',
    name: 'Blink (Arduino Uno & LED)',
    category: 'Starters',
    icon: '💡',
    description: 'The "Hello World" of physical computing: an LED flashing on digital pin 9 with 220Ω current-limiting resistor.',
    components: [
      {
        instanceId: 'inst-arduino-starter',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-breadboard-starter',
        componentId: 'comp-breadboard',
        name: 'Breadboard Small',
        x: 390,
        y: 90,
        rotation: 0
      },
      {
        instanceId: 'inst-resistor-starter',
        componentId: 'comp-resistor',
        name: 'Resistor (220Ω)',
        x: 450,
        y: 190,
        rotation: 0,
        customValue: '220Ω'
      },
      {
        instanceId: 'inst-led-starter',
        componentId: 'comp-led',
        name: '5mm Red LED',
        x: 570,
        y: 180,
        rotation: 0,
        color: 'red'
      }
    ],
    wires: [
      {
        id: 'wire-st-1',
        fromComponentId: 'inst-arduino-starter',
        fromPin: 'D9',
        toComponentId: 'inst-resistor-starter',
        toPin: 'Terminal 1',
        color: 'green',
        wireType: 'normal'
      },
      {
        id: 'wire-st-2',
        fromComponentId: 'inst-resistor-starter',
        fromPin: 'Terminal 2',
        toComponentId: 'inst-led-starter',
        toPin: 'Anode (+)',
        color: 'yellow',
        wireType: 'normal'
      },
      {
        id: 'wire-st-3',
        fromComponentId: 'inst-led-starter',
        fromPin: 'Cathode (-)',
        toComponentId: 'inst-arduino-starter',
        toPin: 'GND_TOP',
        color: 'black',
        wireType: 'normal'
      }
    ],
    codeLanguage: 'cpp',
    code: `// Sun Academy Starter: Blink LED
void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  digitalWrite(9, HIGH);
  delay(500);
  digitalWrite(9, LOW);
  delay(500);
}`
  },

  // 2. TRAFFIC LIGHT CONTROLLER (3 LEDs)
  {
    id: 'starter-traffic-lights',
    name: 'Traffic Light Controller (3 LEDs)',
    category: 'Starters',
    icon: '🚦',
    description: 'A realistic traffic light intersection sequencing Red, Yellow, and Green LEDs with timed state delays.',
    components: [
      {
        instanceId: 'inst-ard-traffic',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-bb-traffic',
        componentId: 'comp-breadboard',
        name: 'Breadboard Small',
        x: 390,
        y: 90,
        rotation: 0
      },
      {
        instanceId: 'inst-led-red',
        componentId: 'comp-led',
        name: 'Red LED',
        x: 440,
        y: 160,
        rotation: 0,
        color: 'red'
      },
      {
        instanceId: 'inst-led-yellow',
        componentId: 'comp-led',
        name: 'Yellow LED',
        x: 520,
        y: 160,
        rotation: 0,
        color: 'yellow'
      },
      {
        instanceId: 'inst-led-green',
        componentId: 'comp-led',
        name: 'Green LED',
        x: 600,
        y: 160,
        rotation: 0,
        color: 'green'
      },
      {
        instanceId: 'inst-res-red',
        componentId: 'comp-resistor',
        name: 'Resistor 220Ω',
        x: 440,
        y: 230,
        rotation: 0,
        customValue: '220Ω'
      },
      {
        instanceId: 'inst-res-yellow',
        componentId: 'comp-resistor',
        name: 'Resistor 220Ω',
        x: 520,
        y: 230,
        rotation: 0,
        customValue: '220Ω'
      },
      {
        instanceId: 'inst-res-green',
        componentId: 'comp-resistor',
        name: 'Resistor 220Ω',
        x: 600,
        y: 230,
        rotation: 0,
        customValue: '220Ω'
      }
    ],
    wires: [
      {
        id: 'w-tr-1',
        fromComponentId: 'inst-ard-traffic',
        fromPin: 'D13',
        toComponentId: 'inst-led-red',
        toPin: 'Anode (+)',
        color: 'red'
      },
      {
        id: 'w-tr-2',
        fromComponentId: 'inst-ard-traffic',
        fromPin: 'D12',
        toComponentId: 'inst-led-yellow',
        toPin: 'Anode (+)',
        color: 'yellow'
      },
      {
        id: 'w-tr-3',
        fromComponentId: 'inst-ard-traffic',
        fromPin: 'D11',
        toComponentId: 'inst-led-green',
        toPin: 'Anode (+)',
        color: 'green'
      },
      {
        id: 'w-tr-4',
        fromComponentId: 'inst-led-red',
        fromPin: 'Cathode (-)',
        toComponentId: 'inst-res-red',
        toPin: 'Terminal 1',
        color: 'black'
      },
      {
        id: 'w-tr-5',
        fromComponentId: 'inst-res-red',
        fromPin: 'Terminal 2',
        toComponentId: 'inst-ard-traffic',
        toPin: 'GND_TOP',
        color: 'black'
      }
    ],
    codeLanguage: 'cpp',
    code: `const int RED = 13;
const int YELLOW = 12;
const int GREEN = 11;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
}

void loop() {
  // Green Light
  digitalWrite(GREEN, HIGH);
  delay(3000);
  digitalWrite(GREEN, LOW);

  // Yellow Light
  digitalWrite(YELLOW, HIGH);
  delay(1000);
  digitalWrite(YELLOW, LOW);

  // Red Light
  digitalWrite(RED, HIGH);
  delay(3000);
  digitalWrite(RED, LOW);
}`
  },

  // 3. PUSHBUTTON DIGITAL INPUT
  {
    id: 'starter-pushbutton-led',
    name: 'Pushbutton Digital Input Switch',
    category: 'Starters',
    icon: '🔘',
    description: 'Read momentary tactile button state on digital pin 2 with 10kΩ pull-down resistor to toggle an LED.',
    components: [
      {
        instanceId: 'inst-ard-btn',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-bb-btn',
        componentId: 'comp-breadboard',
        name: 'Breadboard Small',
        x: 390,
        y: 90,
        rotation: 0
      },
      {
        instanceId: 'inst-btn-1',
        componentId: 'comp-pushbutton',
        name: 'Pushbutton',
        x: 460,
        y: 170,
        rotation: 0
      },
      {
        instanceId: 'inst-res-pulldown',
        componentId: 'comp-resistor',
        name: '10kΩ Pull-Down Resistor',
        x: 460,
        y: 240,
        rotation: 0,
        customValue: '10kΩ'
      },
      {
        instanceId: 'inst-led-btn',
        componentId: 'comp-led',
        name: '5mm Green LED',
        x: 580,
        y: 170,
        rotation: 0,
        color: 'green'
      }
    ],
    wires: [
      {
        id: 'w-btn-1',
        fromComponentId: 'inst-ard-btn',
        fromPin: '5V',
        toComponentId: 'inst-btn-1',
        toPin: 'Terminal 1a',
        color: 'red'
      },
      {
        id: 'w-btn-2',
        fromComponentId: 'inst-btn-1',
        fromPin: 'Terminal 2a',
        toComponentId: 'inst-ard-btn',
        toPin: 'D2',
        color: 'orange'
      },
      {
        id: 'w-btn-3',
        fromComponentId: 'inst-ard-btn',
        fromPin: 'D9',
        toComponentId: 'inst-led-btn',
        toPin: 'Anode (+)',
        color: 'green'
      },
      {
        id: 'w-btn-4',
        fromComponentId: 'inst-led-btn',
        fromPin: 'Cathode (-)',
        toComponentId: 'inst-ard-btn',
        toPin: 'GND_TOP',
        color: 'black'
      }
    ],
    codeLanguage: 'cpp',
    code: `const int BUTTON_PIN = 2;
const int LED_PIN = 9;

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  if (buttonState == HIGH) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}`
  },

  // 4. POTENTIOMETER ANALOG DIAL
  {
    id: 'starter-potentiometer-dimmer',
    name: 'Potentiometer Analog Dial & PWM Dimmer',
    category: 'Starters',
    icon: '🎛️',
    description: 'Read analog voltage (0-5V) from a 10kΩ potentiometer on pin A0 and smoothly dim an LED via PWM on Pin ~9.',
    components: [
      {
        instanceId: 'inst-arduino-pot',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-pot-1',
        componentId: 'comp-potentiometer',
        name: '10kΩ Potentiometer',
        x: 390,
        y: 90,
        rotation: 0,
        state: { knobAngle: 180 }
      },
      {
        instanceId: 'inst-led-pot',
        componentId: 'comp-led',
        name: '5mm Blue LED',
        x: 540,
        y: 110,
        rotation: 0,
        color: 'blue'
      }
    ],
    wires: [
      {
        id: 'wire-pot-1',
        fromComponentId: 'inst-arduino-pot',
        fromPin: '5V',
        toComponentId: 'inst-pot-1',
        toPin: 'Terminal 1',
        color: 'red'
      },
      {
        id: 'wire-pot-2',
        fromComponentId: 'inst-pot-1',
        fromPin: 'Wiper',
        toComponentId: 'inst-arduino-pot',
        toPin: 'A0',
        color: 'yellow'
      },
      {
        id: 'wire-pot-3',
        fromComponentId: 'inst-pot-1',
        fromPin: 'Terminal 2',
        toComponentId: 'inst-arduino-pot',
        toPin: 'GND_BOT1',
        color: 'black'
      },
      {
        id: 'wire-pot-4',
        fromComponentId: 'inst-arduino-pot',
        fromPin: 'D9',
        toComponentId: 'inst-led-pot',
        toPin: 'Anode (+)',
        color: 'blue'
      },
      {
        id: 'wire-pot-5',
        fromComponentId: 'inst-led-pot',
        toComponentId: 'inst-arduino-pot',
        fromPin: 'Cathode (-)',
        toPin: 'GND_TOP',
        color: 'black'
      }
    ],
    codeLanguage: 'cpp',
    code: `const int POT_PIN = A0;
const int LED_PIN = 9;

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int sensorValue = analogRead(POT_PIN);
  int brightness = map(sensorValue, 0, 1023, 0, 255);
  analogWrite(LED_PIN, brightness);
  Serial.print("Voltage: ");
  Serial.print(sensorValue * (5.0 / 1023.0));
  Serial.println(" V");
  delay(50);
}`
  },

  // 5. ULTRASONIC DISTANCE SENSOR (HC-SR04)
  {
    id: 'starter-ultrasonic-radar',
    name: 'Ultrasonic Sonar Distance Range (HC-SR04)',
    category: 'Starters',
    icon: '🦇',
    description: 'Measures distances from 2 to 150 cm using 40kHz acoustic echo pulses with live distance output.',
    components: [
      {
        instanceId: 'inst-arduino-ultra',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-ultra-1',
        componentId: 'comp-ultrasonic',
        name: 'HC-SR04 Ultrasonic Sensor',
        x: 400,
        y: 100,
        rotation: 0,
        state: { distanceCm: 42 }
      }
    ],
    wires: [
      {
        id: 'wire-u-1',
        fromComponentId: 'inst-arduino-ultra',
        fromPin: '5V',
        toComponentId: 'inst-ultra-1',
        toPin: 'VCC',
        color: 'red'
      },
      {
        id: 'wire-u-2',
        fromComponentId: 'inst-arduino-ultra',
        fromPin: 'D7',
        toComponentId: 'inst-ultra-1',
        toPin: 'Trig',
        color: 'orange'
      },
      {
        id: 'wire-u-3',
        fromComponentId: 'inst-arduino-ultra',
        fromPin: 'D8',
        toComponentId: 'inst-ultra-1',
        toPin: 'Echo',
        color: 'yellow'
      },
      {
        id: 'wire-u-4',
        fromComponentId: 'inst-arduino-ultra',
        fromPin: 'GND_BOT1',
        toComponentId: 'inst-ultra-1',
        toPin: 'GND',
        color: 'black'
      }
    ],
    codeLanguage: 'cpp',
    code: `const int TRIG = 7;
const int ECHO = 8;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

void loop() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long dur = pulseIn(ECHO, HIGH);
  long cm = dur / 29 / 2;
  Serial.print("Target Distance: ");
  Serial.print(cm);
  Serial.println(" cm");
  delay(100);
}`
  },

  // 6. MICRO SERVO SG90 SWEEP
  {
    id: 'starter-servo-sweep',
    name: 'Micro Servo 180° Sweep (SG90)',
    category: 'Starters',
    icon: '⚙️',
    description: 'Rotates an SG90 nylon horn arm from 0 to 180 degrees using PWM pulses with smooth angular sweeps.',
    components: [
      {
        instanceId: 'inst-arduino-servo',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-servo-1',
        componentId: 'comp-servo',
        name: 'SG90 Micro Servo',
        x: 420,
        y: 110,
        rotation: 0,
        state: { servoAngle: 90 }
      }
    ],
    wires: [
      {
        id: 'wire-sv-1',
        fromComponentId: 'inst-arduino-servo',
        fromPin: 'D6',
        toComponentId: 'inst-servo-1',
        toPin: 'Signal (PWM)',
        color: 'yellow'
      },
      {
        id: 'wire-sv-2',
        fromComponentId: 'inst-arduino-servo',
        fromPin: '5V',
        toComponentId: 'inst-servo-1',
        toPin: 'Power (5V)',
        color: 'red'
      },
      {
        id: 'wire-sv-3',
        fromComponentId: 'inst-arduino-servo',
        fromPin: 'GND_BOT1',
        toComponentId: 'inst-servo-1',
        toPin: 'Ground',
        color: 'black'
      }
    ],
    codeLanguage: 'cpp',
    code: `#include <Servo.h>
Servo myServo;

void setup() {
  myServo.attach(6);
}

void loop() {
  // Sweep from 0 to 180 degrees
  for (int pos = 0; pos <= 180; pos += 15) {
    myServo.write(pos);
    delay(100);
  }
  // Sweep back
  for (int pos = 180; pos >= 0; pos -= 15) {
    myServo.write(pos);
    delay(100);
  }
}`
  },

  // 7. PHOTORESISTOR (LDR) NIGHT LIGHT
  {
    id: 'starter-photoresistor-nightlight',
    name: 'Photoresistor (LDR) Automatic Night Light',
    category: 'Starters',
    icon: '☀️',
    description: 'Light-dependent resistor voltage divider circuit that automatically triggers an LED when ambient light drops.',
    components: [
      {
        instanceId: 'inst-ard-ldr',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-ldr-1',
        componentId: 'comp-photoresistor',
        name: 'Photoresistor (LDR)',
        x: 410,
        y: 100,
        rotation: 0
      },
      {
        instanceId: 'inst-res-ldr',
        componentId: 'comp-resistor',
        name: '10kΩ Resistor',
        x: 410,
        y: 180,
        rotation: 0,
        customValue: '10kΩ'
      },
      {
        instanceId: 'inst-led-ldr',
        componentId: 'comp-led',
        name: '5mm Yellow LED',
        x: 550,
        y: 110,
        rotation: 0,
        color: 'yellow'
      }
    ],
    wires: [
      {
        id: 'w-ldr-1',
        fromComponentId: 'inst-ard-ldr',
        fromPin: '5V',
        toComponentId: 'inst-ldr-1',
        toPin: 'Terminal 1',
        color: 'red'
      },
      {
        id: 'w-ldr-2',
        fromComponentId: 'inst-ldr-1',
        fromPin: 'Terminal 2',
        toComponentId: 'inst-ard-ldr',
        toPin: 'A0',
        color: 'yellow'
      },
      {
        id: 'w-ldr-3',
        fromComponentId: 'inst-ard-ldr',
        fromPin: 'D9',
        toComponentId: 'inst-led-ldr',
        toPin: 'Anode (+)',
        color: 'orange'
      },
      {
        id: 'w-ldr-4',
        fromComponentId: 'inst-led-ldr',
        fromPin: 'Cathode (-)',
        toComponentId: 'inst-ard-ldr',
        toPin: 'GND_TOP',
        color: 'black'
      }
    ],
    codeLanguage: 'cpp',
    code: `const int LDR_PIN = A0;
const int LED_PIN = 9;

void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int lightLevel = analogRead(LDR_PIN);
  Serial.print("Ambient Light: ");
  Serial.println(lightLevel);

  if (lightLevel < 500) {
    digitalWrite(LED_PIN, HIGH); // Turn ON in dark
  } else {
    digitalWrite(LED_PIN, LOW);  // Turn OFF in light
  }
  delay(100);
}`
  },

  // 8. RGB LED RAINBOW MIXER
  {
    id: 'starter-rgb-led-mixer',
    name: 'RGB LED Rainbow Color Spectrum Mixer',
    category: 'Starters',
    icon: '🌈',
    description: 'Drive individual Red, Green, and Blue channels via PWM digital pins ~9, ~10, and ~11 to mix millions of colors.',
    components: [
      {
        instanceId: 'inst-ard-rgb',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-rgb-1',
        componentId: 'comp-led-rgb',
        name: 'RGB LED (Common Cathode)',
        x: 430,
        y: 110,
        rotation: 0
      }
    ],
    wires: [
      {
        id: 'w-rgb-r',
        fromComponentId: 'inst-ard-rgb',
        fromPin: 'D9',
        toComponentId: 'inst-rgb-1',
        toPin: 'Red',
        color: 'red'
      },
      {
        id: 'w-rgb-gnd',
        fromComponentId: 'inst-ard-rgb',
        fromPin: 'GND_TOP',
        toComponentId: 'inst-rgb-1',
        toPin: 'Cathode (-)',
        color: 'black'
      },
      {
        id: 'w-rgb-g',
        fromComponentId: 'inst-ard-rgb',
        fromPin: 'D10',
        toComponentId: 'inst-rgb-1',
        toPin: 'Green',
        color: 'green'
      },
      {
        id: 'w-rgb-b',
        fromComponentId: 'inst-ard-rgb',
        fromPin: 'D11',
        toComponentId: 'inst-rgb-1',
        toPin: 'Blue',
        color: 'blue'
      }
    ],
    codeLanguage: 'cpp',
    code: `const int RED_PIN = 9;
const int GREEN_PIN = 10;
const int BLUE_PIN = 11;

void setup() {
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
}

void setColor(int r, int g, int b) {
  analogWrite(RED_PIN, r);
  analogWrite(GREEN_PIN, g);
  analogWrite(BLUE_PIN, b);
}

void loop() {
  setColor(255, 0, 0);   // Red
  delay(1000);
  setColor(0, 255, 0);   // Green
  delay(1000);
  setColor(0, 0, 255);   // Blue
  delay(1000);
  setColor(255, 255, 0); // Yellow
  delay(1000);
  setColor(168, 85, 247);// Purple
  delay(1000);
}`
  },

  // 9. 16x2 LCD DISPLAY
  {
    id: 'starter-lcd-display',
    name: '16x2 LCD Alphanumeric Display',
    category: 'Starters',
    icon: '📟',
    description: 'Interface an alphanumeric Liquid Crystal Display to show custom greeting text and dynamic runtime counter.',
    components: [
      {
        instanceId: 'inst-ard-lcd',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-lcd-1',
        componentId: 'comp-lcd-16x2',
        name: '16x2 LCD Display (I2C)',
        x: 420,
        y: 100,
        rotation: 0
      }
    ],
    wires: [
      {
        id: 'w-lcd-vcc',
        fromComponentId: 'inst-ard-lcd',
        fromPin: '5V',
        toComponentId: 'inst-lcd-1',
        toPin: 'VCC',
        color: 'red'
      },
      {
        id: 'w-lcd-gnd',
        fromComponentId: 'inst-ard-lcd',
        fromPin: 'GND_BOT1',
        toComponentId: 'inst-lcd-1',
        toPin: 'GND',
        color: 'black'
      },
      {
        id: 'w-lcd-sda',
        fromComponentId: 'inst-ard-lcd',
        fromPin: 'A4',
        toComponentId: 'inst-lcd-1',
        toPin: 'SDA',
        color: 'yellow'
      },
      {
        id: 'w-lcd-scl',
        fromComponentId: 'inst-ard-lcd',
        fromPin: 'A5',
        toComponentId: 'inst-lcd-1',
        toPin: 'SCL',
        color: 'green'
      }
    ],
    codeLanguage: 'cpp',
    code: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Sun Academy!");
  lcd.setCursor(0, 1);
  lcd.print("Arduino Online");
}

void loop() {
  // Run continuous loop
}`
  },

  // 10. TMP36 PRECISION TEMPERATURE SENSOR
  {
    id: 'starter-tmp36-temp',
    name: 'TMP36 Precision Temperature Sensor',
    category: 'Starters',
    icon: '🌡️',
    description: 'Analog temperature sensor providing 10 mV/°C output voltage, converted to Celsius and logged to 9600 baud Serial.',
    components: [
      {
        instanceId: 'inst-ard-tmp',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-tmp-1',
        componentId: 'comp-temp',
        name: 'TMP36 Temperature Sensor',
        x: 430,
        y: 110,
        rotation: 0,
        state: { tempCelsius: 24 }
      }
    ],
    wires: [
      {
        id: 'w-tmp-pwr',
        fromComponentId: 'inst-ard-tmp',
        fromPin: '5V',
        toComponentId: 'inst-tmp-1',
        toPin: 'Power (5V)',
        color: 'red'
      },
      {
        id: 'w-tmp-sig',
        fromComponentId: 'inst-ard-tmp',
        fromPin: 'A0',
        toComponentId: 'inst-tmp-1',
        toPin: 'Vout (Analog)',
        color: 'orange'
      },
      {
        id: 'w-tmp-gnd',
        fromComponentId: 'inst-ard-tmp',
        fromPin: 'GND_BOT1',
        toComponentId: 'inst-tmp-1',
        toPin: 'GND',
        color: 'black'
      }
    ],
    codeLanguage: 'cpp',
    code: `const int SENSOR_PIN = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(SENSOR_PIN);
  float voltage = sensorValue * (5.0 / 1023.0);
  float tempC = (voltage - 0.5) * 100.0;
  float tempF = (tempC * 9.0 / 5.0) + 32.0;

  Serial.print("Temperature: ");
  Serial.print(tempC);
  Serial.print(" °C / ");
  Serial.print(tempF);
  Serial.println(" °F");
  delay(1000);
}`
  },

  // 11. PIEZO BUZZER ALARM SIREN
  {
    id: 'starter-buzzer-alarm',
    name: 'Piezo Buzzer Alarm Siren & Melody',
    category: 'Starters',
    icon: '🔔',
    description: 'Generates acoustic audible square-wave frequencies with tone() to produce security sirens and musical notes.',
    components: [
      {
        instanceId: 'inst-ard-buz',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-buz-1',
        componentId: 'comp-piezo',
        name: 'Piezo Buzzer',
        x: 430,
        y: 110,
        rotation: 0
      }
    ],
    wires: [
      {
        id: 'w-buz-pos',
        fromComponentId: 'inst-ard-buz',
        fromPin: 'D8',
        toComponentId: 'inst-buz-1',
        toPin: 'Positive (+)',
        color: 'red'
      },
      {
        id: 'w-buz-neg',
        fromComponentId: 'inst-ard-buz',
        fromPin: 'GND_TOP',
        toComponentId: 'inst-buz-1',
        toPin: 'Negative (-)',
        color: 'black'
      }
    ],
    codeLanguage: 'cpp',
    code: `const int BUZZER_PIN = 8;

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
}

void loop() {
  // Police siren tone sweep
  for (int hz = 400; hz <= 1000; hz += 20) {
    tone(BUZZER_PIN, hz);
    delay(20);
  }
  for (int hz = 1000; hz >= 400; hz -= 20) {
    tone(BUZZER_PIN, hz);
    delay(20);
  }
}`
  },

  // 12. PIR MOTION SENSOR ALARM
  {
    id: 'starter-pir-motion',
    name: 'PIR Motion Detector Intrusion Security',
    category: 'Starters',
    icon: '👁️',
    description: 'Passive Infrared motion sensor triggering an alert LED whenever human movement is sensed.',
    components: [
      {
        instanceId: 'inst-ard-pir',
        componentId: 'comp-arduino-uno',
        name: 'Arduino Uno R3',
        x: 60,
        y: 80,
        rotation: 0
      },
      {
        instanceId: 'inst-pir-1',
        componentId: 'comp-pir',
        name: 'PIR Motion Sensor',
        x: 410,
        y: 100,
        rotation: 0
      },
      {
        instanceId: 'inst-led-pir',
        componentId: 'comp-led',
        name: '5mm Red Alert LED',
        x: 550,
        y: 110,
        rotation: 0,
        color: 'red'
      }
    ],
    wires: [
      {
        id: 'w-pir-vcc',
        fromComponentId: 'inst-ard-pir',
        fromPin: '5V',
        toComponentId: 'inst-pir-1',
        toPin: 'VCC',
        color: 'red'
      },
      {
        id: 'w-pir-out',
        fromComponentId: 'inst-ard-pir',
        fromPin: 'D2',
        toComponentId: 'inst-pir-1',
        toPin: 'Signal',
        color: 'yellow'
      },
      {
        id: 'w-pir-gnd',
        fromComponentId: 'inst-ard-pir',
        fromPin: 'GND_BOT1',
        toComponentId: 'inst-pir-1',
        toPin: 'GND',
        color: 'black'
      },
      {
        id: 'w-pir-led',
        fromComponentId: 'inst-ard-pir',
        fromPin: 'D13',
        toComponentId: 'inst-led-pir',
        toPin: 'Anode (+)',
        color: 'red'
      },
      {
        id: 'w-pir-ledgnd',
        fromComponentId: 'inst-led-pir',
        fromPin: 'Cathode (-)',
        toComponentId: 'inst-ard-pir',
        toPin: 'GND_TOP',
        color: 'black'
      }
    ],
    codeLanguage: 'cpp',
    code: `const int PIR_PIN = 2;
const int LED_PIN = 13;

void setup() {
  Serial.begin(9600);
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int motion = digitalRead(PIR_PIN);
  if (motion == HIGH) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("[ALERT] Motion Detected!");
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  delay(100);
}`
  }
];

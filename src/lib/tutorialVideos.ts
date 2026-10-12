import { VideoTutorial } from '../types/builder';

export const TUTORIAL_VIDEOS: VideoTutorial[] = [
  // 1. BLINK (HELLO WORLD)
  {
    id: 'vid-tut-1',
    title: 'Create Your First Circuit: Sun Academy Arduino Blink',
    slug: 'create-first-circuit-arduino',
    duration: '5:24',
    level: 'Beginner',
    category: 'Arduino',
    description: 'Learn the fundamentals of physical computing with Sun Academy: placing the Arduino Uno R3, wiring breadboard sockets, current-limiting resistors, and blinking an LED with virtual electricity.',
    thumbnailUrl: 'https://img.youtube.com/vi/fCXWEMNwGkI/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/fCXWEMNwGkI?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-blink-led',
    topics: [
      'Workplane navigation & component placement',
      'Wiring digital pins and breadboard sockets',
      'Using current-limiting 220Ω resistors',
      'Starting & pausing the real-time simulator'
    ],
    partsList: ['Arduino Uno R3', 'Small Breadboard', '5mm Red LED', '220Ω Resistor'],
    starterCode: {
      cpp: `// Sun Academy Arduino Circuits - Lesson 1: Blink
void setup() {
  pinMode(9, OUTPUT);
}

void loop() {
  digitalWrite(9, HIGH);
  delay(500);
  digitalWrite(9, LOW);
  delay(500);
}`,
      python: `# Sun Academy MicroPython - Lesson 1
from machine import Pin
import time

led = Pin(9, Pin.OUT)
while True:
    led.value(1)
    time.sleep(0.5)
    led.value(0)
    time.sleep(0.5)`
    }
  },

  // 2. TRAFFIC LIGHT CONTROLLER
  {
    id: 'vid-tut-2',
    title: 'Traffic Light Controller with Arduino (3 LEDs)',
    slug: 'traffic-light-arduino',
    duration: '8:45',
    level: 'Intermediate',
    category: 'Arduino',
    description: 'Build and simulate a realistic 3-state automated traffic light intersection with Red, Yellow, and Green LEDs, timed state machine transitions, and bus wiring.',
    thumbnailUrl: 'https://img.youtube.com/vi/YvALq8U-xr0/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/YvALq8U-xr0?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-traffic-lights',
    topics: [
      'Multi-LED breadboard bus wiring',
      'Finite state machine timing loop',
      'Digital outputs D11, D12, D13 control',
      'Timed delay transitions'
    ],
    partsList: ['Arduino Uno R3', 'Small Breadboard', 'Red LED', 'Yellow LED', 'Green LED', '3x 220Ω Resistors'],
    starterCode: {
      cpp: `const int RED = 13;
const int YELLOW = 12;
const int GREEN = 11;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
}

void loop() {
  digitalWrite(GREEN, HIGH);
  delay(3000);
  digitalWrite(GREEN, LOW);

  digitalWrite(YELLOW, HIGH);
  delay(1000);
  digitalWrite(YELLOW, LOW);

  digitalWrite(RED, HIGH);
  delay(3000);
  digitalWrite(RED, LOW);
}`
    }
  },

  // 3. PUSHBUTTON DIGITAL INPUT
  {
    id: 'vid-tut-3',
    title: 'Pushbutton Digital Input & Pull-Down Resistor',
    slug: 'pushbutton-digital-input',
    duration: '6:30',
    level: 'Beginner',
    category: 'Arduino',
    description: 'Wire a tactile momentary pushbutton to digital pin 2 with a 10kΩ pull-down resistor to prevent floating pins and toggle an LED on demand.',
    thumbnailUrl: 'https://img.youtube.com/vi/yyG0koj9nNY/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/yyG0koj9nNY?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-pushbutton-led',
    topics: [
      'Pushbutton internal pin switch contacts',
      'Why pull-down resistors prevent floating pins',
      'digitalRead() logic & conditional IF statements',
      'Instant interactive button response'
    ],
    partsList: ['Arduino Uno R3', 'Small Breadboard', 'Pushbutton', '10kΩ Resistor', '5mm Green LED']
  },

  // 4. POTENTIOMETER & PWM DIMMER
  {
    id: 'vid-tut-4',
    title: 'Potentiometer Analog Input & PWM Dimmer',
    slug: 'potentiometer-analog-input',
    duration: '7:18',
    level: 'Beginner',
    category: 'Arduino',
    description: 'Read variable analog voltage from a 10kΩ potentiometer on pin A0 and smoothly dim an LED using PWM on digital pin ~9 with the map() function.',
    thumbnailUrl: 'https://img.youtube.com/vi/4m2K2wJ7eA8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/4m2K2wJ7eA8?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-potentiometer-dimmer',
    topics: [
      'Voltage dividers & analogRead() 10-bit ADC',
      'Pulse-Width Modulation (PWM) on digital pins',
      'The Arduino map() function (0-1023 to 0-255)',
      'Serial monitor voltage readouts'
    ],
    partsList: ['Arduino Uno R3', '10kΩ Potentiometer', '5mm Blue LED', '220Ω Resistor']
  },

  // 5. ULTRASONIC SENSOR (HC-SR04)
  {
    id: 'vid-tut-5',
    title: 'Ultrasonic Distance Sonar Sensor (HC-SR04)',
    slug: 'ultrasonic-distance-radar',
    duration: '9:40',
    level: 'Intermediate',
    category: 'Arduino',
    description: 'Measure distances in centimeters using 40kHz acoustic pulses with the HC-SR04 ultrasonic transducer and calculate target range via echo time-of-flight.',
    thumbnailUrl: 'https://img.youtube.com/vi/ZejQOX69K51/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/ZejQOX69K51?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-ultrasonic-radar',
    topics: [
      'HC-SR04 Trigger & Echo pin timing',
      'Speed of sound calculations in centimeters',
      'Microsecond delay pulses and pulseIn()',
      'Obstacle avoidance robotics radar'
    ],
    partsList: ['Arduino Uno R3', 'HC-SR04 Ultrasonic Sensor', 'Jumper Wires']
  },

  // 6. MICRO SERVO SG90
  {
    id: 'vid-tut-6',
    title: 'Micro Servo Motor (SG90) 180° Sweep Control',
    slug: 'micro-servo-motor-sweep',
    duration: '8:15',
    level: 'Intermediate',
    category: 'Arduino',
    description: 'Control an SG90 micro servo rotary actuator from 0 to 180 degrees using the Arduino Servo library and PWM signal pulses on Pin ~6.',
    thumbnailUrl: 'https://img.youtube.com/vi/kUPbK0J8p8E/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/kUPbK0J8p8E?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-servo-sweep',
    topics: [
      'Servo motors vs standard DC motors',
      '50Hz PWM control pulses (1ms - 2ms)',
      '#include <Servo.h> library syntax',
      'Smooth angular sweeping in for loops'
    ],
    partsList: ['Arduino Uno R3', 'SG90 Micro Servo', 'Mounting Horn', 'Jumper Wires']
  },

  // 7. PHOTORESISTOR (LDR) NIGHT LIGHT
  {
    id: 'vid-tut-7',
    title: 'Photoresistor (LDR) Automatic Light Sensor',
    slug: 'photoresistor-light-sensor',
    duration: '6:50',
    level: 'Beginner',
    category: 'Arduino',
    description: 'Build an automatic twilight night light using a Cadmium Sulfide (CdS) photoresistor and 10kΩ resistor voltage divider that illuminates in dark conditions.',
    thumbnailUrl: 'https://img.youtube.com/vi/jQ1vHqO4m3Y/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/jQ1vHqO4m3Y?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-photoresistor-nightlight',
    topics: [
      'Photoresistor physical properties & lux response',
      'Voltage divider calculation with 10kΩ resistor',
      'Setting light threshold triggers in firmware',
      'Energy-efficient lighting automation'
    ],
    partsList: ['Arduino Uno R3', 'Photoresistor (LDR)', '10kΩ Resistor', '5mm Yellow LED']
  },

  // 8. RGB LED RAINBOW MIXER
  {
    id: 'vid-tut-8',
    title: 'RGB LED Rainbow Color Spectrum Mixer',
    slug: 'rgb-led-color-mixer',
    duration: '8:05',
    level: 'Beginner',
    category: 'Arduino',
    description: 'Wire an RGB LED with three current-limiting resistors to PWM pins ~9, ~10, and ~11 to mix Red, Green, and Blue light to create 16 million colors.',
    thumbnailUrl: 'https://img.youtube.com/vi/LBj3ffYD63Y/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/LBj3ffYD63Y?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-rgb-led-mixer',
    topics: [
      'Common cathode vs common anode RGB LEDs',
      'Simultaneous 3-channel PWM duty cycle mixing',
      'Creating custom functions in Arduino C++',
      'Smooth rainbow color transitions'
    ],
    partsList: ['Arduino Uno R3', 'RGB LED', '3x 220Ω Resistors', 'Small Breadboard']
  },

  // 9. 16x2 LCD DISPLAY
  {
    id: 'vid-tut-9',
    title: '16x2 LCD Alphanumeric Display & I2C Bus',
    slug: '16x2-lcd-display-i2c',
    duration: '10:20',
    level: 'Intermediate',
    category: 'Arduino',
    description: 'Connect an alphanumeric 16x2 Liquid Crystal Display over I2C (SDA/SCL) to display dynamic sensor readouts and custom multi-line text.',
    thumbnailUrl: 'https://img.youtube.com/vi/QyKVbQH4Hi4/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/QyKVbQH4Hi4?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-lcd-display',
    topics: [
      'I2C 2-wire serial protocol (SDA pin A4, SCL pin A5)',
      'LiquidCrystal_I2C library initialization',
      'Cursor positioning (setCursor(col, row))',
      'Printing live sensor values to hardware display'
    ],
    partsList: ['Arduino Uno R3', '16x2 I2C LCD Display', 'Jumper Wires']
  },

  // 10. TMP36 TEMPERATURE SENSOR
  {
    id: 'vid-tut-10',
    title: 'TMP36 Precision Temperature Sensor & Serial Monitor',
    slug: 'tmp36-temperature-sensor',
    duration: '7:40',
    level: 'Beginner',
    category: 'Arduino',
    description: 'Read linear analog voltage from the TMP36 temperature sensor, convert millivolts to Celsius and Fahrenheit, and log data to the Arduino Serial Monitor at 9600 baud.',
    thumbnailUrl: 'https://img.youtube.com/vi/fCXWEMNwGkI/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/fCXWEMNwGkI?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-tmp36-temp',
    topics: [
      'TO-92 semiconductor package pinout (5V, Vout, GND)',
      'Converting ADC units (0-1023) to millivolts',
      'Temperature formula: (Vout - 0.5V) * 100 = °C',
      'Logging serial data for real-time monitoring'
    ],
    partsList: ['Arduino Uno R3', 'TMP36 Temperature Sensor', 'Jumper Wires']
  },

  // 11. PIEZO BUZZER ALARM SIREN
  {
    id: 'vid-tut-11',
    title: 'Piezo Buzzer Alarm Siren & Audio Frequencies',
    slug: 'piezo-buzzer-alarm-siren',
    duration: '6:15',
    level: 'Beginner',
    category: 'Arduino',
    description: 'Generate square wave acoustic audio tones with the Arduino tone() and noTone() functions to create emergency sirens, warning beeps, and musical melodies.',
    thumbnailUrl: 'https://img.youtube.com/vi/yyG0koj9nNY/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/yyG0koj9nNY?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-buzzer-alarm',
    topics: [
      'Piezoelectric effect & acoustic diaphragms',
      'Using tone(pin, frequency) in Hz',
      'Creating frequency sweep sirens with loops',
      'Playing musical notes and melodies'
    ],
    partsList: ['Arduino Uno R3', 'Piezo Buzzer', 'Jumper Wires']
  },

  // 12. PIR MOTION SENSOR ALARM
  {
    id: 'vid-tut-12',
    title: 'PIR Motion Detector Intrusion Security System',
    slug: 'pir-motion-detector-alarm',
    duration: '8:55',
    level: 'Intermediate',
    category: 'Arduino',
    description: 'Wire a Passive Infrared (PIR) motion detector module to digital pin 2 to sense moving infrared thermal signatures and trigger an alert buzzer and flashing LED.',
    thumbnailUrl: 'https://img.youtube.com/vi/4m2K2wJ7eA8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/4m2K2wJ7eA8?autoplay=1&rel=0&enablejsapi=1',
    circuitStarterId: 'starter-pir-motion',
    topics: [
      'Passive Infrared Fresnel lens optics',
      'Sensitivity & retriggering timer adjustments',
      'Digital interrupt trigger detection',
      'Building complete burglar alarm systems'
    ],
    partsList: ['Arduino Uno R3', 'PIR Motion Sensor', '5mm Red Alert LED', 'Piezo Buzzer', 'Jumper Wires']
  }
];

export function getTutorialBySlug(slug: string): VideoTutorial | undefined {
  return TUTORIAL_VIDEOS.find((v) => v.slug === slug || v.id === slug);
}

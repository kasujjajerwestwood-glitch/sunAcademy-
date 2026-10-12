import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'course-arduino-starter',
    slug: 'arduino-starter-kit',
    title: 'Arduino Starter Kit: Hands-On Circuits',
    description: 'Master breadboarding, digital I/O, Ohm’s law, analog inputs, and C++ sketch fundamentals.',
    longDescription: 'This foundational course takes you step-by-step through the world of physical computing. Starting with breadboard anatomy and Ohm’s Law, you will wire real components and write clean Arduino C++ sketches that interact with the physical world.',
    trackId: 'arduino',
    level: 'Beginner',
    lessonCount: 6,
    duration: '4 hours',
    whatYouWillLearn: [
      'Understand voltage, current, resistance, and Ohm’s Law (V = I * R)',
      'Wire safe circuits on standard 400-point and 830-point breadboards',
      'Use pinMode(), digitalWrite(), and digitalRead() for GPIO control',
      'Read analog potentiometers with analogRead() and map 10-bit ADC values',
      'Generate PWM signals with analogWrite() to control LED brightness'
    ],
    prerequisites: ['No prior hardware or coding experience required'],
    partsList: [
      { name: 'Arduino Uno R3 or Compatible', quantity: 1, role: 'Microcontroller brain', pinHint: 'USB powered' },
      { name: 'Half-size Breadboard (400 tie points)', quantity: 1, role: 'Prototyping surface' },
      { name: 'LEDs (Red, Green, Blue 5mm)', quantity: 5, role: 'Visual output indicators', pinHint: 'Long leg = Anode (+)' },
      { name: '220Ω Resistors', quantity: 5, role: 'Current-limiting resistors for LEDs' },
      { name: '10kΩ Potentiometer', quantity: 1, role: 'Analog rotary knob', pinHint: 'Pin A0' },
      { name: 'Pushbutton switches', quantity: 2, role: 'Digital momentary inputs', pinHint: 'Pin D2 & D3' },
      { name: '10kΩ Pull-down resistors', quantity: 2, role: 'Keeps input stable at 0V when unpressed' },
      { name: 'Male-to-Male Jumper Wires', quantity: 15, role: 'Circuit interconnects' }
    ],
    featuredCode: {
      language: 'cpp',
      title: 'Blink & Smooth PWM Brightness',
      code: `// sunAcademy: Arduino Starter - Dual Mode LED & Serial Monitor
const int LED_PIN = 9;       // PWM pin (marked with ~)
const int POT_PIN = A0;      // Analog input from potentiometer

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("sunAcademy Arduino System Ready!");
}

void loop() {
  // Read 0 to 1023 from potentiometer
  int rawValue = analogRead(POT_PIN);
  
  // Map 10-bit analog (0-1023) to 8-bit PWM (0-255)
  int brightness = map(rawValue, 0, 1023, 0, 255);
  analogWrite(LED_PIN, brightness);
  
  // Stream telemetry to Serial Monitor
  Serial.print("Raw Pot: ");
  Serial.print(rawValue);
  Serial.print(" -> Brightness: ");
  Serial.println(brightness);
  
  delay(50);
}`
    },
    lessons: [
      {
        id: 'ard-1',
        title: 'Welcome to Physical Computing & Breadboard Anatomy',
        duration: '25 min',
        description: 'Understand how breadboard power rails, terminal strips, and microcontrollers form complete electrical circuits.',
        keyTakeaways: [
          'Power rails run vertically (+ red and - blue/black)',
          'Terminal strips connect rows 1-30 horizontally in groups of 5',
          'Never connect 5V directly to Ground without resistance (prevents short circuits)'
        ]
      },
      {
        id: 'ard-2',
        title: 'Ohm’s Law & Calculating Resistor Values for LEDs',
        duration: '35 min',
        description: 'Calculate exact resistor values using V = I * R and prevent blown LEDs.',
        codeLanguage: 'cpp',
        codeSnippet: `// LED current limit calculation:
// Supply voltage (Vs) = 5.0V
// Red LED forward voltage (Vf) = 2.0V
// Desired forward current (If) = 15mA (0.015A)
// R = (Vs - Vf) / If = (5.0 - 2.0) / 0.015 = 200 ohms
// Standard available resistor: 220 ohms (Red-Red-Brown)`,
        keyTakeaways: [
          'LEDs are polarity sensitive: Long leg is Anode (+), Short leg/flat edge is Cathode (-)',
          'A 220Ω resistor limits current to ~14mA, which is safe for Arduino ATmega328P pins'
        ]
      },
      {
        id: 'ard-3',
        title: 'Writing Your First Sketch: pinMode & digitalWrite',
        duration: '40 min',
        description: 'Explore the setup() and loop() lifecycle, digital output pin states, and timing delays.',
        codeLanguage: 'cpp',
        codeSnippet: `const int LED_PIN = 13; // Built-in LED on pin 13

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // Turn LED on
  delay(1000);                 // Wait 1 second
  digitalWrite(LED_PIN, LOW);  // Turn LED off
  delay(1000);                 // Wait 1 second
}`,
        keyTakeaways: [
          'setup() runs once when powered on or reset',
          'loop() executes continuously forever',
          'digitalWrite() outputs either 5V (HIGH) or 0V (LOW)'
        ]
      },
      {
        id: 'ard-4',
        title: 'Digital Inputs: Pushbuttons & Pull-up/Pull-down Resistors',
        duration: '45 min',
        description: 'Read button presses without floating pin noise using INPUT_PULLUP and internal resistors.',
        codeLanguage: 'cpp',
        codeSnippet: `const int BUTTON_PIN = 2;
const int LED_PIN = 13;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP); // Active LOW configuration
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  int buttonState = digitalRead(BUTTON_PIN);
  
  // When button is pressed, pin connects to GND (LOW)
  if (buttonState == LOW) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}`,
        keyTakeaways: [
          'Floating input pins pick up ambient electromagnetic noise without a resistor',
          'INPUT_PULLUP enables the Arduino microcontroller’s built-in 20kΩ resistor'
        ]
      },
      {
        id: 'ard-5',
        title: 'Analog Inputs: Potentiometers & 10-bit ADC',
        duration: '45 min',
        description: 'Convert continuous voltage signals (0V-5V) into numerical data with the Analog-to-Digital Converter.',
        codeLanguage: 'cpp',
        codeSnippet: `const int POT_PIN = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(POT_PIN); // 0 to 1023
  float voltage = raw * (5.0 / 1023.0);
  
  Serial.print("ADC: ");
  Serial.print(raw);
  Serial.print(" | Voltage: ");
  Serial.print(voltage, 2);
  Serial.println("V");
  delay(200);
}`,
        keyTakeaways: [
          'Arduino Uno has a 10-bit ADC: 2^10 = 1024 resolution levels (0 to 1023)',
          'Each ADC step corresponds to approximately 4.88 millivolts'
        ]
      },
      {
        id: 'ard-6',
        title: 'Pulse-Width Modulation (PWM) & Fading LEDs',
        duration: '50 min',
        description: 'Simulate analog voltage output on digital pins using high-speed square wave duty cycles.',
        codeLanguage: 'cpp',
        codeSnippet: `const int PWM_PIN = 9;

void setup() {
  pinMode(PWM_PIN, OUTPUT);
}

void loop() {
  // Fade in
  for (int b = 0; b <= 255; b += 5) {
    analogWrite(PWM_PIN, b);
    delay(20);
  }
  // Fade out
  for (int b = 255; b >= 0; b -= 5) {
    analogWrite(PWM_PIN, b);
    delay(20);
  }
}`,
        keyTakeaways: [
          'PWM pins on Uno: 3, 5, 6, 9, 10, 11 (marked with ~)',
          'analogWrite(pin, 128) creates a 50% duty cycle at ~490Hz'
        ]
      }
    ]
  },
  {
    id: 'course-sensors-inputs',
    slug: 'sensors-and-inputs',
    title: 'Sensors & Inputs: Interfacing the Physical World',
    description: 'Interface ultrasonic distance rangers, light photoresistors, DHT11 temp/humidity, and PIR motion sensors.',
    longDescription: 'Sensors allow your microcontroller to perceive heat, light, sound, motion, and distance. In this course, you will learn both analog threshold calibration and digital single-bus protocols to capture environmental data accurately.',
    trackId: 'arduino',
    level: 'Intermediate',
    lessonCount: 5,
    duration: '5 hours',
    whatYouWillLearn: [
      'Calibrate Light Dependent Resistors (LDRs) using voltage dividers',
      'Time sonic bounce waves with HC-SR04 ultrasonic sensors (v = 343 m/s)',
      'Read DHT11/DHT22 temperature and relative humidity with parity verification',
      'Handle PIR infrared motion sensors and debounce false positives',
      'Display live sensor metrics on 16x2 I2C LCD character screens'
    ],
    prerequisites: ['Arduino Starter Kit or basic C++ knowledge'],
    partsList: [
      { name: 'HC-SR04 Ultrasonic Sensor', quantity: 1, role: 'Distance measurement via sound waves', pinHint: 'Trig D9, Echo D10' },
      { name: 'Photoresistor (LDR)', quantity: 2, role: 'Ambient light sensor', pinHint: 'Pin A1' },
      { name: 'DHT11 Temperature & Humidity Sensor', quantity: 1, role: 'Climate monitoring', pinHint: 'Pin D4' },
      { name: 'PIR Motion Sensor (HC-SR501)', quantity: 1, role: 'Passive infrared body detection', pinHint: 'Pin D7' },
      { name: '16x2 LCD Display with I2C Backpack', quantity: 1, role: 'Visual readout display', pinHint: 'SDA (A4), SCL (A5)' },
      { name: 'Piezo Buzzer', quantity: 1, role: 'Audible threshold alert', pinHint: 'Pin D8' }
    ],
    featuredCode: {
      language: 'cpp',
      title: 'HC-SR04 Ultrasonic Distance Meter',
      code: `const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int BUZZER_PIN = 8;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Clear trigger
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  
  // Send 10 microsecond pulse
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Measure return pulse duration (microseconds)
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  
  // Speed of sound is 0.0343 cm/us (divide by 2 for round-trip)
  float distanceCm = (duration * 0.0343) / 2.0;
  
  Serial.print("Distance: ");
  Serial.print(distanceCm);
  Serial.println(" cm");
  
  // Alert if closer than 15 cm
  if (distanceCm > 0 && distanceCm < 15.0) {
    tone(BUZZER_PIN, 1000, 50);
  }
  
  delay(100);
}`
    },
    lessons: [
      {
        id: 'sens-1',
        title: 'Light Detection with Photoresistors & Voltage Dividers',
        duration: '45 min',
        description: 'Understand how LDR resistance drops with illumination and construct an analog voltage divider circuit.',
        keyTakeaways: ['LDR resistance ranges from ~100Ω in sunlight to 10kΩ+ in pitch darkness', 'Voltage divider output: Vout = Vin * (R2 / (R1 + R2))']
      },
      {
        id: 'sens-2',
        title: 'Sound Time-of-Flight with HC-SR04 Ultrasonic',
        duration: '55 min',
        description: 'Emit 40kHz ultrasonic bursts and calculate distance from echo transit time.',
        keyTakeaways: ['pulseIn() measures pulse width with microsecond precision', 'Include a 30ms timeout to avoid hanging when no echo returns']
      },
      {
        id: 'sens-3',
        title: 'Reading Temperature & Humidity: The DHT Protocol',
        duration: '50 min',
        description: 'Demystify custom single-wire digital signaling, bit timing, and data validation.',
        keyTakeaways: ['DHT transmits 40 bits of serial data including a checksum byte', 'Keep sampling frequency under 1Hz to avoid self-heating errors']
      },
      {
        id: 'sens-4',
        title: 'PIR Motion Detection & Human Body Infrared',
        duration: '40 min',
        description: 'Tune sensitivity and delay potentiometers on HC-SR501 sensors for reliable room occupancy sensing.',
        keyTakeaways: ['PIR detects shifts in 10-micron infrared radiation emitted by living organisms', 'Allow 30-60 seconds after power-on for sensor calibration stabilization']
      },
      {
        id: 'sens-5',
        title: 'I2C Communication & 16x2 LCD Dashboards',
        duration: '60 min',
        description: 'Drive two-wire LCD displays using the standard Wire.h library and address scanning.',
        keyTakeaways: ['I2C uses only 2 pins: SDA (Data) and SCL (Clock)', 'Typical I2C backpack addresses are 0x27 or 0x3F']
      }
    ]
  },
  {
    id: 'course-motors-robotics',
    slug: 'motors-and-robotics',
    title: 'Motors & Robotics: DC, Servo & Stepper Control',
    description: 'Control mechanical motion with H-Bridges (L298N/L9110S), position servos, and precise stepper drivers.',
    longDescription: 'Robots need to move. This course teaches how to power inductive motor loads safely without damaging microcontrollers, build differential-drive robot chassis, and achieve sub-degree positioning with stepper and servo motors.',
    trackId: 'arduino',
    level: 'Intermediate',
    lessonCount: 6,
    duration: '6 hours',
    whatYouWillLearn: [
      'Protect microcontroller pins from inductive kickback using flyback diodes',
      'Control DC motor direction and speed with H-Bridge motor drivers',
      'Command SG90 and MG996R servo angles from 0° to 180° with PWM pulses',
      'Step micro-angles with 28BYJ-48 and ULN2003 stepper motor sets',
      'Build a two-wheel differential drive mobile robot navigation system'
    ],
    prerequisites: ['Arduino Starter Kit'],
    partsList: [
      { name: 'L298N Dual H-Bridge Motor Driver Module', quantity: 1, role: 'Drives high-current DC motors' },
      { name: 'Geared TT DC Motors with Rubber Wheels', quantity: 2, role: 'Robot propulsion' },
      { name: 'SG90 9g Micro Servo Motor', quantity: 1, role: 'Pan/tilt scanner mount' },
      { name: '28BYJ-48 Stepper Motor + ULN2003 Driver', quantity: 1, role: 'Precision stepping motor' },
      { name: '2x 18650 Li-ion Battery Holder (7.4V)', quantity: 1, role: 'Isolated motor power supply' }
    ],
    featuredCode: {
      language: 'cpp',
      title: 'H-Bridge Dual Motor Speed & Direction',
      code: `// L298N Motor Driver Pin Connections
const int ENA = 5;  // PWM speed control Motor A
const int IN1 = 6;  // Direction 1
const int IN2 = 7;  // Direction 2
const int IN3 = 8;  // Direction 3
const int IN4 = 11; // Direction 4
const int ENB = 10; // PWM speed control Motor B

void driveForward(int speed) {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
}

void stopMotors() {
  analogWrite(ENA, 0);
  analogWrite(ENB, 0);
}

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(ENB, OUTPUT);
}

void loop() {
  driveForward(200); // 78% speed
  delay(2000);
  stopMotors();
  delay(1000);
}`
    },
    lessons: [
      {
        id: 'mot-1',
        title: 'Inductive Loads, Flyback Diodes & Power Separation',
        duration: '40 min',
        description: 'Why motors cannot be powered directly from Arduino pins and how to prevent back-EMF destruction.',
        keyTakeaways: ['Arduino pins provide max 20-40mA; DC motors draw 200mA-2A stall current', 'Always share common ground (GND) between motor power supply and Arduino']
      },
      {
        id: 'mot-2',
        title: 'H-Bridge Architecture & The L298N Driver',
        duration: '55 min',
        description: 'How 4 internal transistors alternate polarity to achieve bidirectional rotation.',
        keyTakeaways: ['IN1/IN2 set polarity direction', 'ENA jumper enables full speed or accepts PWM for speed modulation']
      },
      {
        id: 'mot-3',
        title: 'Servo Motors: Angle Control with Servo.h',
        duration: '50 min',
        description: 'Generate 1ms-2ms timing pulses every 20ms to lock rotary servos to specific angles.',
        keyTakeaways: ['Servos use internal feedback potentiometers for closed-loop position control', 'Standard micro servos rotate from 0° to 180°']
      },
      {
        id: 'mot-4',
        title: 'Stepper Motors: Full-Step & Half-Step Sequencing',
        duration: '60 min',
        description: 'Energize stator electromagnetic coils in sequence for precision rotary increments without slipping.',
        keyTakeaways: ['28BYJ-48 has a 64:1 internal gearbox resulting in 2048 steps per 360° output rotation', 'ULN2003 Darlington array amplifiers handle coil current']
      },
      {
        id: 'mot-5',
        title: 'Differential Drive Kinematics for Wheeled Robots',
        duration: '65 min',
        description: 'Calculate left/right motor speeds for straight trajectories, pivot turns, and smooth arcs.',
        keyTakeaways: ['Counter-rotating wheels produce instant 360-degree zero-radius pivot spins', 'PWM trimming compensates for slight mechanical motor mismatch']
      },
      {
        id: 'mot-6',
        title: 'Obstacle Avoidance Logic & Finite State Machines',
        duration: '60 min',
        description: 'Combine ultrasonic scanning and state machines to navigate cluttered rooms autonomously.',
        keyTakeaways: ['States: FORWARD, DETECTING, SCAN_SURROUNDINGS, BACK_UP, TURN', 'FSM prevents getting stuck in endless wall loops']
      }
    ]
  },
  {
    id: 'course-python-basics',
    slug: 'python-basics',
    title: 'Python Basics & Algorithmic Thinking',
    description: 'Learn Python syntax, variables, lists, dictionaries, functions, and control flow for software and hardware automation.',
    longDescription: 'Python is the world’s most popular language for data analysis, automation, and embedded systems like Raspberry Pi and MicroPython. Master the language syntax through real practical problem-solving.',
    trackId: 'python',
    level: 'Beginner',
    lessonCount: 6,
    duration: '4.5 hours',
    whatYouWillLearn: [
      'Write clean, idiomatic Python adhering to PEP 8 standards',
      'Work with fundamental data types: int, float, string, and boolean',
      'Manage ordered lists, sets, and key-value dictionaries',
      'Design modular functions with default arguments and type hints',
      'Format console output, handle file I/O, and catch runtime exceptions'
    ],
    prerequisites: ['No programming experience required'],
    featuredCode: {
      language: 'python',
      title: 'Sensor Telemetry Processor in Python',
      code: `# sunAcademy: Sensor Data Analysis & Filtering
from typing import List, Dict

sensor_readings: List[Dict[str, float]] = [
    {"timestamp": 10.2, "temperature_c": 22.4, "humidity": 45.1},
    {"timestamp": 11.2, "temperature_c": 23.1, "humidity": 44.8},
    {"timestamp": 12.2, "temperature_c": 26.8, "humidity": 48.2},
    {"timestamp": 13.2, "temperature_c": 21.9, "humidity": 45.0},
]

def analyze_telemetry(readings: List[Dict[str, float]], threshold_c: float = 25.0) -> Dict[str, float]:
    temps = [r["temperature_c"] for r in readings]
    avg_temp = sum(temps) / len(temps)
    peak_temp = max(temps)
    
    anomalies = [r for r in readings if r["temperature_c"] > threshold_c]
    
    print(f"Average Temp: {avg_temp:.2f}°C")
    print(f"Peak Temp:    {peak_temp:.2f}°C")
    print(f"High Temp Alerts: {len(anomalies)} detected")
    
    return {"average": avg_temp, "peak": peak_temp, "alert_count": len(anomalies)}

results = analyze_telemetry(sensor_readings)
`
    },
    lessons: [
      {
        id: 'py-1',
        title: 'Variables, Expressions & Dynamic Typing',
        duration: '35 min',
        description: 'Understand integers, floats, strings, f-strings, and mathematical operations.',
        codeLanguage: 'python',
        codeSnippet: `board_name = "Raspberry Pi Pico"
clock_mhz = 133
is_active = True
voltage = 3.3

print(f"{board_name} running at {clock_mhz}MHz with {voltage}V logic.")`,
        keyTakeaways: ['Python is dynamically typed and indentation-sensitive', 'Use modern f-strings (f"Value: {val}") for clean formatting']
      },
      {
        id: 'py-2',
        title: 'Conditionals & Boolean Logic Operators',
        duration: '40 min',
        description: 'Use if/elif/else statements, logical operators (and, or, not), and truthy/falsy evaluations.',
        keyTakeaways: ['Comparison operators: ==, !=, <, >, <=, >=', 'Elif chains evaluate in sequential order']
      },
      {
        id: 'py-3',
        title: 'Loops, Iteration & Comprehensions',
        duration: '50 min',
        description: 'Iterate with for-loops over range(), enumerate(), and write compact list comprehensions.',
        codeLanguage: 'python',
        codeSnippet: `adc_values = [512, 600, 750, 480, 890]
# Convert 10-bit ADC to voltages in one line:
voltages = [round(val * 5.0 / 1023, 2) for val in adc_values]
print("Measured Voltages:", voltages)`,
        keyTakeaways: ['List comprehensions provide concise syntax for transformation', 'Use enumerate() when both index and item are needed']
      },
      {
        id: 'py-4',
        title: 'Lists, Dictionaries & Nested Data Structures',
        duration: '55 min',
        description: 'Store structured telemetry using dictionaries, list methods, and dictionary lookups.',
        keyTakeaways: ['Lists are ordered and mutable', 'Dictionaries provide fast O(1) key-value access']
      },
      {
        id: 'py-5',
        title: 'Writing Reusable Functions & Type Hints',
        duration: '45 min',
        description: 'Define clean modular functions, return tuples, and specify parameter type annotations.',
        keyTakeaways: ['Use docstrings to document parameters and return types', 'Type hints improve IDE auto-complete and prevent bugs']
      },
      {
        id: 'py-6',
        title: 'Error Handling with try/except & Clean I/O',
        duration: '45 min',
        description: 'Safely parse user inputs, handle hardware disconnections, and prevent runtime crashes.',
        keyTakeaways: ['Always catch specific exceptions (e.g. ValueError, KeyError) instead of bare except', 'Use context managers (with open(...) as f:) for automatic cleanup']
      }
    ]
  },
  {
    id: 'course-html-css',
    slug: 'html-css-foundations',
    title: 'HTML & CSS Foundations: Modern Web UI',
    description: 'Learn modern semantic HTML5, Flexbox, CSS Grid, responsive design, and CSS variables from scratch.',
    longDescription: 'Build the foundational markup and styling skills required to create clean, responsive interfaces. Discover how modern CSS allows you to construct dark-mode developer dashboards and mobile-friendly applications.',
    trackId: 'web-dev',
    level: 'Beginner',
    lessonCount: 5,
    duration: '3.5 hours',
    whatYouWillLearn: [
      'Write semantic HTML5 structure (<header>, <main>, <article>, <section>)',
      'Master Flexbox for 1D navigation bars and responsive align-items',
      'Create 2D responsive dashboard grids with CSS Grid and auto-fit',
      'Use modern CSS custom properties (variables) for dark themes',
      'Build mobile-first media queries for phone and tablet screens'
    ],
    prerequisites: ['No prerequisites'],
    featuredCode: {
      language: 'html',
      title: 'Modern Responsive Telemetry Card in HTML & CSS',
      code: `<!-- sunAcademy: Modern Telemetry Component -->
<div class="telemetry-card">
  <div class="card-header">
    <span class="status-indicator live"></span>
    <h3>ESP32 Node #01</h3>
  </div>
  <div class="metric-grid">
    <div class="metric">
      <span class="label">Temperature</span>
      <span class="value">24.6 °C</span>
    </div>
    <div class="metric">
      <span class="label">Humidity</span>
      <span class="value">58 %</span>
    </div>
  </div>
</div>

<style>
.telemetry-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 1.5rem;
  color: #f8fafc;
  font-family: system-ui, sans-serif;
}
.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}
.status-indicator.live {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  box-shadow: 0 0 8px #10b981;
}
</style>`
    },
    lessons: [
      {
        id: 'web-1',
        title: 'Semantic HTML5 Architecture & Document Flow',
        duration: '30 min',
        description: 'Structure clean pages using meaningful elements that improve accessibility and SEO.',
        keyTakeaways: ['Use header, nav, main, section, and article instead of endless divs', 'Proper semantic tags give assistive tech clean navigation landmarks']
      },
      {
        id: 'web-2',
        title: 'The CSS Box Model, Spacing & Box-Sizing',
        duration: '40 min',
        description: 'Understand content, padding, border, and margin, and master box-sizing: border-box.',
        keyTakeaways: ['box-sizing: border-box includes padding and border in width calculations', 'Margin collapsing happens on vertical adjoining blocks']
      },
      {
        id: 'web-3',
        title: 'Flexbox Layouts: Align, Justify & Direction',
        duration: '50 min',
        description: 'Effortlessly align headers, badges, button groups, and responsive toolbars.',
        keyTakeaways: ['justify-content controls the main axis; align-items controls the cross axis', 'flex: 1 allows components to expand and fill available room']
      },
      {
        id: 'web-4',
        title: 'CSS Grid: Creating Dashboard Layouts',
        duration: '55 min',
        description: 'Create multi-column card grids with grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)).',
        keyTakeaways: ['CSS Grid is ideal for 2-dimensional page layouts', 'repeat(auto-fit, ...) provides automatic responsiveness without media queries']
      },
      {
        id: 'web-5',
        title: 'CSS Custom Properties, Themes & Transitions',
        duration: '45 min',
        description: 'Implement dark/light color palettes, smooth hover states, and card transform lifts.',
        keyTakeaways: ['CSS variables: define with --color-primary and access with var(--color-primary)', 'Subtle transitions (0.2s ease) elevate UI polish']
      }
    ]
  },
  {
    id: 'course-js-beginners',
    slug: 'javascript-for-beginners',
    title: 'JavaScript for Beginners: Interactive Frontends',
    description: 'Learn modern ES6+ JavaScript, DOM manipulation, asynchronous fetch, events, and WebSockets.',
    longDescription: 'Turn static web pages into living, dynamic interfaces. Learn the programming language of the web, handling user button events, fetching JSON from REST APIs, and updating UI elements in real time.',
    trackId: 'web-dev',
    level: 'Beginner',
    lessonCount: 6,
    duration: '5 hours',
    whatYouWillLearn: [
      'Master modern JavaScript syntax: const/let, arrow functions, destructuring',
      'Manipulate the DOM dynamically using document.querySelector and classList',
      'Handle mouse, keyboard, and form events with addEventListener',
      'Make asynchronous network requests with fetch() and async/await',
      'Store user settings and progress locally with localStorage'
    ],
    prerequisites: ['HTML & CSS Foundations'],
    featuredCode: {
      language: 'javascript',
      title: 'Real-Time Hardware REST API Client',
      code: `// Fetch telemetry from an Arduino / ESP32 web server
async function fetchDeviceStatus(deviceIp) {
  try {
    const response = await fetch(\`http://\${deviceIp}/api/status\`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    console.log("Device status:", data);
    
    // Update dashboard UI
    document.getElementById('temp-readout').textContent = \`\${data.temp}°C\`;
    document.getElementById('led-status').classList.toggle('active', data.ledOn);
  } catch (error) {
    console.error("Failed to connect to device:", error);
  }
}

// Poll every 2 seconds
setInterval(() => fetchDeviceStatus('192.168.1.105'), 2000);`
    },
    lessons: [
      {
        id: 'js-1',
        title: 'Modern JS Syntax: Let, Const, Arrow Functions',
        duration: '40 min',
        description: 'Understand block scoping, arrow functions, template literals, and immutability practices.',
        keyTakeaways: ['Always prefer const; use let only when reassignment is required', 'Avoid legacy var to prevent variable hoisting bugs']
      },
      {
        id: 'js-2',
        title: 'Arrays & Functional Iteration (Map, Filter, Reduce)',
        duration: '50 min',
        description: 'Transform collections of data cleanly without clumsy index loops.',
        keyTakeaways: ['map() creates a transformed new array', 'filter() extracts matching criteria', 'reduce() aggregates arrays into single values']
      },
      {
        id: 'js-3',
        title: 'DOM Querying & Dynamic UI Updates',
        duration: '55 min',
        description: 'Select elements, toggle CSS classes, append nodes, and update text/HTML dynamically.',
        keyTakeaways: ['document.querySelector selects by CSS selector', 'classList.toggle() enables clean state switching']
      },
      {
        id: 'js-4',
        title: 'Event Listeners & Event Delegation',
        duration: '50 min',
        description: 'Capture clicks, input keystrokes, and optimize performance with event delegation.',
        keyTakeaways: ['Use event.preventDefault() to handle form submissions via JS', 'Event delegation listens on parent nodes to handle dynamic children']
      },
      {
        id: 'js-5',
        title: 'Promises, Async/Await & Fetch API',
        duration: '60 min',
        description: 'Execute non-blocking asynchronous calls to external REST APIs and parse JSON responses.',
        keyTakeaways: ['async/await is clean syntactic sugar over JavaScript Promises', 'Always wrap await calls in try/catch blocks for error safety']
      },
      {
        id: 'js-6',
        title: 'Client-Side Storage: LocalStorage & SessionStorage',
        duration: '45 min',
        description: 'Persist dark mode toggles, course progress, and custom preferences in browser storage.',
        keyTakeaways: ['localStorage persists across page reloads and browser restarts', 'Serialize JavaScript objects with JSON.stringify and JSON.parse']
      }
    ]
  },
  {
    id: 'course-react-crash',
    slug: 'react-crash-course',
    title: 'React Crash Course: Components & State',
    description: 'Build fast, reactive web applications with React components, hooks (useState, useEffect), and props.',
    longDescription: 'React is the standard library for modern web interfaces. In this course, you’ll learn declarative UI programming: structuring components, passing props, tracking state with hooks, and building an interactive hardware control console.',
    trackId: 'web-dev',
    level: 'Intermediate',
    lessonCount: 6,
    duration: '5.5 hours',
    whatYouWillLearn: [
      'Understand the virtual DOM and JSX syntax rules',
      'Create reusable functional components with typed props',
      'Manage local component state with useState',
      'Handle side effects, data fetching, and timers with useEffect',
      'Build custom hooks and share state across the component tree'
    ],
    prerequisites: ['JavaScript for Beginners'],
    featuredCode: {
      language: 'typescript',
      title: 'Interactive LED Switch Component in React',
      code: `import React, { useState } from 'react';

interface LedControllerProps {
  pinNumber: number;
  initialState?: boolean;
}

export const LedController: React.FC<LedControllerProps> = ({ pinNumber, initialState = false }) => {
  const [isOn, setIsOn] = useState<boolean>(initialState);
  const [isSending, setIsSending] = useState<boolean>(false);

  const togglePin = async () => {
    setIsSending(true);
    const nextState = !isOn;
    
    // Optimistic UI update
    setIsOn(nextState);
    
    try {
      // Simulate hardware HTTP trigger
      await new Promise((r) => setTimeout(r, 200));
      console.log(\`Pin \${pinNumber} toggled to \${nextState ? 'HIGH' : 'LOW'}\`);
    } catch (err) {
      setIsOn(!nextState); // Rollback on failure
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-white">Digital Pin {pinNumber}</h4>
        <p className="text-xs text-slate-400">State: {isOn ? 'HIGH (5V)' : 'LOW (0V)'}</p>
      </div>
      <button
        onClick={togglePin}
        disabled={isSending}
        className={\`px-4 py-2 rounded-lg font-medium transition-all \${
          isOn 
            ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25' 
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }\`}
      >
        {isOn ? 'Turn OFF' : 'Turn ON'}
      </button>
    </div>
  );
};`
    },
    lessons: [
      {
        id: 'rec-1',
        title: 'JSX Syntax & Functional Components',
        duration: '45 min',
        description: 'Write HTML-like templates inside JavaScript and compose modular page layouts.',
        keyTakeaways: ['JSX translates directly into React.createElement calls', 'Components must return a single top-level parent element or Fragment']
      },
      {
        id: 'rec-2',
        title: 'Props & Unidirectional Data Flow',
        duration: '50 min',
        description: 'Pass data and callback functions seamlessly from parent to child components.',
        keyTakeaways: ['Props are read-only and immutable for the receiving child', 'Pass callback functions down to communicate user actions back to parents']
      },
      {
        id: 'rec-3',
        title: 'useState: Managing Reactive State',
        duration: '60 min',
        description: 'Trigger clean UI re-renders whenever application state changes.',
        keyTakeaways: ['Never mutate state directly; always use the setter function', 'Use updater functions (prev => prev + 1) for state dependent on prior values']
      },
      {
        id: 'rec-4',
        title: 'useEffect: Side Effects & Cleanup Functions',
        duration: '65 min',
        description: 'Fetch remote telemetry, subscribe to WebSocket streams, and prevent memory leaks.',
        keyTakeaways: ['Dependency arrays determine when effects re-run', 'Always return a cleanup function to unsubscribe listeners or clear intervals']
      },
      {
        id: 'rec-5',
        title: 'Controlled Inputs & Interactive Forms',
        duration: '50 min',
        description: 'Synchronize input sliders, number fields, and toggles with component state.',
        keyTakeaways: ['Controlled components maintain single source of truth in React state', 'Synthetic events normalize browser differences']
      },
      {
        id: 'rec-6',
        title: 'Custom Hooks & State Extraction',
        duration: '60 min',
        description: 'Package reusable stateful logic into custom useLocalStorage and useInterval hooks.',
        keyTakeaways: ['Custom hooks must start with "use" prefix', 'Share logic across components without duplicating state variables']
      }
    ]
  },
  {
    id: 'course-esp32-iot',
    slug: 'iot-with-esp32',
    title: 'IoT with ESP32: Wi-Fi, MQTT & Cloud Telemetry',
    description: 'Connect hardware to the internet using the dual-core ESP32, Wi-Fi, MQTT brokers, and REST APIs.',
    longDescription: 'The ESP32 is the powerhouse microcontroller of the modern IoT industry. Learn how to connect to wireless networks, broadcast sensor data via MQTT to cloud dashboards, and host responsive local web servers directly on the chip.',
    trackId: 'embedded',
    level: 'Advanced',
    lessonCount: 6,
    duration: '6.5 hours',
    whatYouWillLearn: [
      'Configure the ESP32 Wi-Fi station and access point modes',
      'Host an embedded asynchronous web server on the ESP32 chip',
      'Publish and subscribe to MQTT topics with HiveMQ and Mosquitto',
      'Implement deep sleep modes to run IoT nodes for months on a battery',
      'Secure communications with TLS certificates and HTTPS requests'
    ],
    prerequisites: ['Arduino Starter Kit', 'C/C++ basics'],
    partsList: [
      { name: 'ESP32 NodeMCU Development Board', quantity: 1, role: 'Wi-Fi & Bluetooth microcontroller', pinHint: 'Micro-USB powered' },
      { name: 'DHT22 High-Precision Sensor', quantity: 1, role: 'Temperature & humidity readings', pinHint: 'GPIO 4' },
      { name: 'SSD1306 0.96" OLED I2C Display', quantity: 1, role: 'Onboard visual status display', pinHint: 'SDA GPIO 21, SCL GPIO 22' },
      { name: 'Relay Module (5V / 10A)', quantity: 1, role: 'Switch mains or high-power appliances', pinHint: 'GPIO 23' }
    ],
    featuredCode: {
      language: 'cpp',
      title: 'ESP32 MQTT Publisher Example',
      code: `#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected! IP: " + WiFi.localIP().toString());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected!");
      client.publish("sunacademy/devices/status", "online");
    } else {
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();
  
  // Publish telemetry every 5 seconds
  static unsigned long lastMsg = 0;
  if (millis() - lastMsg > 5000) {
    lastMsg = millis();
    char msg[64];
    snprintf(msg, sizeof(msg), "{\\"temp\\": 24.5, \\"uptime\\": %lu}", millis() / 1000);
    client.publish("sunacademy/sensors/climate", msg);
  }
}`
    },
    lessons: [
      {
        id: 'esp-1',
        title: 'ESP32 Architecture: Dual Cores & FreeRTOS',
        duration: '50 min',
        description: 'Explore Xtensa 32-bit LX6 cores, pin multiplexing, capacitive touch pins, and FreeRTOS tasks.',
        keyTakeaways: ['ESP32 runs at 240MHz with 520KB SRAM and onboard 2.4GHz Wi-Fi + BLE', 'FreeRTOS enables multi-threaded concurrent hardware tasks']
      },
      {
        id: 'esp-2',
        title: 'Connecting to Wi-Fi: Station Mode & Scan Networks',
        duration: '55 min',
        description: 'Scan wireless SSIDs, handle reconnection logic, and manage static or DHCP IP assignments.',
        keyTakeaways: ['Station Mode (STA) connects to existing routers', 'Access Point Mode (AP) broadcasts its own setup hotspot']
      },
      {
        id: 'esp-3',
        title: 'Building an Embedded Async Web Server',
        duration: '65 min',
        description: 'Serve interactive HTML/JS control dashboards straight from ESP32 flash memory.',
        keyTakeaways: ['ESPAsyncWebServer handles concurrent HTTP requests without blocking main loop', 'Serve SPIFFS/LittleFS flash filesystem static assets']
      },
      {
        id: 'esp-4',
        title: 'MQTT Protocol: Pub/Sub Architecture for IoT',
        duration: '70 min',
        description: 'Understand lightweight MQTT packet headers, Quality of Service (QoS), and broker topologies.',
        keyTakeaways: ['MQTT uses orders of magnitude less bandwidth and battery than HTTP polling', 'Hierarchical topics (sunacademy/floor1/room2/temp) allow clean routing']
      },
      {
        id: 'esp-5',
        title: 'Power Optimization: Deep Sleep & Wake-up Triggers',
        duration: '60 min',
        description: 'Reduce current consumption from 80mA down to 10 microamps to achieve years of battery operation.',
        keyTakeaways: ['ESP32 powers off CPU cores during Deep Sleep; RTC memory retains state', 'Wake up using RTC timer intervals or external GPIO interrupts']
      },
      {
        id: 'esp-6',
        title: 'Over-The-Air (OTA) Wireless Firmware Updates',
        duration: '60 min',
        description: 'Flash new firmware wirelessly through Wi-Fi without ever plugging in a USB cable.',
        keyTakeaways: ['ArduinoOTA library enables remote network uploads', 'Dual partition tables ensure fallback if a new firmware download fails']
      }
    ]
  },
  {
    id: 'course-c-embedded',
    slug: 'c-cpp-microcontrollers',
    title: 'C/C++ for Microcontrollers: Registers & Interrupts',
    description: 'Understand bare-metal memory manipulation, hardware timer interrupts, bitwise operators, and volatile registers.',
    longDescription: 'Go beneath the friendly Arduino abstractions. Learn how microcontrollers actually work at the silicon level: direct port manipulation, external hardware interrupts, analog comparator registers, and efficient pointer arithmetic.',
    trackId: 'embedded',
    level: 'Advanced',
    lessonCount: 5,
    duration: '5.5 hours',
    whatYouWillLearn: [
      'Master bitwise operators (&, |, ^, ~, <<, >>) for register masking',
      'Bypass digitalWrite() using direct PORTB and DDRB port registers (40x faster)',
      'Attach external pin change hardware interrupts (ISR) without CPU polling',
      'Configure 16-bit hardware timers (Timer1) and CTC output compares',
      'Understand the critical necessity of the "volatile" keyword in ISR variables'
    ],
    prerequisites: ['Arduino Starter Kit', 'Basic C or C++ knowledge'],
    featuredCode: {
      language: 'cpp',
      title: 'Direct Port Manipulation & Hardware Timer Interrupt',
      code: `// ATmega328P Bare-Metal: 1Hz Hardware Timer1 CTC Interrupt
#include <avr/io.h>
#include <avr/interrupt.h>

volatile bool ledState = false;

// Interrupt Service Routine for Timer1 Compare Match A
ISR(TIMER1_COMPA_vect) {
  // Toggle Pin 13 (PB5) using PINB toggle register
  PINB |= (1 << PB5);
}

void setup() {
  cli(); // Disable global interrupts
  
  // Set PB5 (Digital Pin 13) as OUTPUT in Data Direction Register
  DDRB |= (1 << PB5);
  
  // Reset Timer1 Control Registers
  TCCR1A = 0;
  TCCR1B = 0;
  TCNT1  = 0;
  
  // Set compare match register for 1 Hz increments:
  // 16,000,000 Hz / (1024 prescaler * 1 Hz) - 1 = 15624
  OCR1A = 15624;
  
  // Turn on CTC (Clear Timer on Compare Match) mode
  TCCR1B |= (1 << WGM12);
  
  // Set CS12 and CS10 bits for 1024 prescaler
  TCCR1B |= (1 << CS12) | (1 << CS10);
  
  // Enable timer compare interrupt
  TIMSK1 |= (1 << OCIE1A);
  
  sei(); // Enable global interrupts
}

void loop() {
  // Main loop is 100% free! CPU does zero polling.
}`
    },
    lessons: [
      {
        id: 'cpp-1',
        title: 'Bitwise Operators & Bitmask Manipulation',
        duration: '45 min',
        description: 'Set, clear, and toggle single bits inside 8-bit registers without modifying other pins.',
        keyTakeaways: ['Set bit: REG |= (1 << BIT)', 'Clear bit: REG &= ~(1 << BIT)', 'Toggle bit: REG ^= (1 << BIT)']
      },
      {
        id: 'cpp-2',
        title: 'Direct Port Manipulation: DDR, PORT, and PIN',
        duration: '55 min',
        description: 'Why digitalWrite takes ~50 CPU cycles and how PORTB takes only 1 single clock cycle (62.5 nanoseconds).',
        keyTakeaways: ['DDR sets input/output direction', 'PORT writes HIGH/LOW', 'PIN reads actual hardware logic levels']
      },
      {
        id: 'cpp-3',
        title: 'Hardware Interrupts & The Volatile Keyword',
        duration: '65 min',
        description: 'Respond to nanosecond edge triggers immediately and understand compiler register caching traps.',
        keyTakeaways: ['Variables modified in an ISR must be marked "volatile" to prevent compiler optimization bugs', 'Keep ISR routines as short and fast as possible (never call delay() inside an ISR)']
      },
      {
        id: 'cpp-4',
        title: 'Hardware Timers & PWM Waveform Generation',
        duration: '70 min',
        description: 'Configure hardware prescalers, counter registers, and Fast PWM without software loops.',
        keyTakeaways: ['ATmega328P has three hardware timers: Timer0 (8-bit), Timer1 (16-bit), Timer2 (8-bit)', 'Timers run independently of CPU execution']
      },
      {
        id: 'cpp-5',
        title: 'Memory Management, Stack & Heap in Microcontrollers',
        duration: '60 min',
        description: 'Prevent stack overflow and SRAM exhaustion on constrained embedded microcontrollers.',
        keyTakeaways: ['ATmega328P has only 2,048 bytes of SRAM', 'Avoid dynamic memory allocation (malloc / new) to prevent memory fragmentation crashes']
      }
    ]
  }
];

export const getCourseBySlug = (slug: string): Course | undefined => {
  return COURSES.find(c => c.slug === slug);
};

export const getCoursesByTrack = (trackId: string): Course[] => {
  return COURSES.filter(c => c.trackId === trackId);
};

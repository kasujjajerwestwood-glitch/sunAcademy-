import { CircuitComponentItem } from '../types';

export const COMPONENTS_CATALOG: CircuitComponentItem[] = [
  // 1. Prototyping & Boards
  {
    id: 'comp-arduino-uno',
    name: 'Arduino Uno R3',
    category: 'Arduino',
    icon: '🎛️',
    color: '#0284C7',
    pins: ['14 Digital I/O', '6 Analog Inputs', '5V, 3.3V, GND'],
    description: 'ATmega328P microcontroller board with USB interface and GPIO headers.'
  },
  {
    id: 'comp-breadboard',
    name: 'Breadboard Small',
    category: 'Basic',
    icon: '▦',
    color: '#F8FAFC',
    pins: ['Power Rails (+/-)', 'Terminal Rows 1-30'],
    description: 'Solderless construction board for prototyping electronic circuits.'
  },
  {
    id: 'comp-breadboard-mini',
    name: 'Breadboard Mini',
    category: 'Basic',
    icon: '◽',
    color: '#F8FAFC',
    pins: ['Rows 1-17 (a-e, f-j)'],
    description: 'Compact 170 tie-point mini breadboard for modular experiments.'
  },

  // 2. Output & Actuators
  {
    id: 'comp-led',
    name: '5mm LED',
    category: 'Basic',
    icon: '💡',
    color: '#EF4444',
    pins: ['Anode (+)', 'Cathode (-)'],
    description: 'Lights up when electric current passes through in forward direction.'
  },
  {
    id: 'comp-led-rgb',
    name: 'RGB LED',
    category: 'Actuators',
    icon: '🌈',
    color: '#A855F7',
    pins: ['Red', 'Cathode (-)', 'Green', 'Blue'],
    description: '4-pin diffused LED capable of generating full RGB color spectrum.'
  },
  {
    id: 'comp-servo',
    name: 'Micro Servo (SG90)',
    category: 'Actuators',
    icon: '⚙️',
    color: '#F59E0B',
    pins: ['GND', 'Power (5V)', 'Signal (PWM)'],
    description: 'Rotary actuator that allows for precise angular control from 0° to 180°.'
  },
  {
    id: 'comp-dc-motor',
    name: 'DC Hobby Motor',
    category: 'Actuators',
    icon: '🔄',
    color: '#3B82F6',
    pins: ['Terminal 1', 'Terminal 2'],
    description: 'Direct current electric motor with rotating central drive shaft.'
  },
  {
    id: 'comp-piezo',
    name: 'Piezo Buzzer',
    category: 'Actuators',
    icon: '🔔',
    color: '#1E293B',
    pins: ['Positive (+)', 'Negative (-)'],
    description: 'Produces sound tones and clicks when driven with PWM audio signals.'
  },
  {
    id: 'comp-relay',
    name: '5V SPDT Relay',
    category: 'Actuators',
    icon: '⚡',
    color: '#0284C7',
    pins: ['Coil 1', 'Coil 2', 'COM', 'NO', 'NC'],
    description: 'Electromechanically operated switch to control high-power circuits.'
  },

  // 3. Passives & Semiconductors
  {
    id: 'comp-resistor',
    name: 'Resistor',
    category: 'Basic',
    icon: '〰️',
    color: '#D97706',
    pins: ['Terminal 1', 'Terminal 2'],
    description: 'Restricts current flow. Standard 220Ω, 1kΩ, 10kΩ options available.'
  },
  {
    id: 'comp-capacitor-ceramic',
    name: 'Ceramic Capacitor',
    category: 'Basic',
    icon: '💿',
    color: '#B45309',
    pins: ['Terminal 1', 'Terminal 2'],
    description: 'Non-polarized 100nF capacitor for noise filtering and decoupling.'
  },
  {
    id: 'comp-capacitor-electrolytic',
    name: 'Electrolytic Capacitor',
    category: 'Basic',
    icon: '🔋',
    color: '#1E293B',
    pins: ['Anode (+)', 'Cathode (-)'],
    description: 'Polarized 100µF capacitor for power rail bulk smoothing.'
  },
  {
    id: 'comp-diode',
    name: 'Diode (1N4007)',
    category: 'Basic',
    icon: '▶️',
    color: '#334155',
    pins: ['Anode (+)', 'Cathode (-)'],
    description: 'Semiconductor device permitting current in one direction only.'
  },
  {
    id: 'comp-transistor-npn',
    name: 'NPN BJT Transistor',
    category: 'Basic',
    icon: '🔀',
    color: '#1E293B',
    pins: ['Collector', 'Base', 'Emitter'],
    description: '2N2222 semiconductor used to amplify or switch electrical signals.'
  },

  // 4. Switches & Sensors
  {
    id: 'comp-pushbutton',
    name: 'Pushbutton',
    category: 'Basic',
    icon: '🔘',
    color: '#3B82F6',
    pins: ['Terminal 1a', 'Terminal 1b', 'Terminal 2a', 'Terminal 2b'],
    description: 'Momentary tactile switch that connects circuit when pressed.'
  },
  {
    id: 'comp-slideswitch',
    name: 'Slide Switch (SPDT)',
    category: 'Basic',
    icon: '🎚️',
    color: '#64748B',
    pins: ['Terminal 1', 'Common', 'Terminal 2'],
    description: 'Maintained SPDT switch that slides between two circuit states.'
  },
  {
    id: 'comp-dipswitch',
    name: 'DIP Switch (4-Pos)',
    category: 'Basic',
    icon: '🎛️',
    color: '#DC2626',
    pins: ['1A-1B', '2A-2B', '3A-3B', '4A-4B'],
    description: 'Dual In-line Package manual toggle switch pack.'
  },
  {
    id: 'comp-potentiometer',
    name: 'Potentiometer',
    category: 'Basic',
    icon: '🎛️',
    color: '#10B981',
    pins: ['Terminal 1', 'Wiper', 'Terminal 2'],
    description: 'Rotary variable resistor used for analog input calibration (0-5V).'
  },
  {
    id: 'comp-photoresistor',
    name: 'Photoresistor (LDR)',
    category: 'Sensors',
    icon: '☀️',
    color: '#84CC16',
    pins: ['Terminal 1', 'Terminal 2'],
    description: 'Light-sensitive variable resistor whose resistance decreases with lux.'
  },
  {
    id: 'comp-ultrasonic',
    name: 'Ultrasonic Sensor (HC-SR04)',
    category: 'Sensors',
    icon: '🦇',
    color: '#06B6D4',
    pins: ['VCC', 'Trig', 'Echo', 'GND'],
    description: 'Emits 40kHz acoustic pulses to measure distances from 2cm to 400cm.'
  },
  {
    id: 'comp-pir',
    name: 'PIR Motion Sensor',
    category: 'Sensors',
    icon: '👁️',
    color: '#EC4899',
    pins: ['VCC', 'Signal', 'GND'],
    description: 'Passive Infrared sensor that detects human body movement.'
  },
  {
    id: 'comp-temp',
    name: 'Temperature Sensor (TMP36)',
    category: 'Sensors',
    icon: '🌡️',
    color: '#F97316',
    pins: ['Power (5V)', 'Vout (Analog)', 'GND'],
    description: 'Precision analog sensor providing voltage proportional to °C.'
  },
  {
    id: 'comp-tilt',
    name: 'Tilt Sensor',
    category: 'Sensors',
    icon: '📐',
    color: '#EAB308',
    pins: ['Terminal 1', 'Terminal 2'],
    description: 'Rolling ball sensor that detects orientation tilt or vibration.'
  },

  // 5. Power Sources
  {
    id: 'comp-battery-9v',
    name: '9V Battery',
    category: 'Power',
    icon: '🔋',
    color: '#64748B',
    pins: ['Positive (+)', 'Negative (-)'],
    description: 'Direct current chemical battery providing standard 9.00 volts.'
  },
  {
    id: 'comp-battery-coincell',
    name: 'Coin Cell 3V (CR2032)',
    category: 'Power',
    icon: '🪙',
    color: '#94A3B8',
    pins: ['Positive (+)', 'Negative (-)'],
    description: 'Lithium button battery delivering steady 3.00V DC.'
  },
  {
    id: 'comp-battery-aa',
    name: '1.5V AA Battery x4 Pack',
    category: 'Power',
    icon: '🔋',
    color: '#F59E0B',
    pins: ['Positive (+ 6V)', 'Negative (-)'],
    description: 'Quad AA cell holder providing 6.00V nominal DC power.'
  },

  // 6. Displays & Instruments
  {
    id: 'comp-lcd-16x2',
    name: '16x2 LCD Display',
    category: 'Instruments',
    icon: '📟',
    color: '#059669',
    pins: ['VCC', 'GND', 'SDA', 'SCL'],
    description: 'Alphanumeric dot matrix liquid crystal display with I2C interface.'
  },
  {
    id: 'comp-7segment',
    name: '7-Segment Display',
    category: 'Instruments',
    icon: '8️⃣',
    color: '#EF4444',
    pins: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'DP', 'COM'],
    description: 'Single-digit numeric display using individual LED bar segments.'
  },
  {
    id: 'comp-multimeter',
    name: 'Digital Multimeter',
    category: 'Instruments',
    icon: '📟',
    color: '#EAB308',
    pins: ['Positive (Red)', 'Negative (Black)'],
    description: 'Test instrument measuring DC voltage, current, and electrical resistance.'
  },
  {
    id: 'comp-oscilloscope',
    name: 'Digital Oscilloscope',
    category: 'Instruments',
    icon: '📉',
    color: '#0284C7',
    pins: ['CH1 Positive (+)', 'CH1 Ground (-)', 'CH2 Positive (+)', 'CH2 Ground (-)'],
    description: 'Visual waveform analyzer for observing varying electrical signal voltages in real-time.'
  },

  // 7. Advanced Microcontrollers & Programmable Boards
  {
    id: 'comp-microbit',
    name: 'BBC micro:bit v2',
    category: 'Arduino',
    icon: '🎛️',
    color: '#10B981',
    pins: ['0 (P0)', '1 (P1)', '2 (P2)', '3V (Power)', 'GND (Ground)'],
    description: 'Pocket-sized programmable computer with 5x5 LED matrix display, two user buttons, and edge connector.'
  },
  {
    id: 'comp-attiny85',
    name: 'ATtiny85 Microcontroller',
    category: 'Arduino',
    icon: '🔲',
    color: '#1E293B',
    pins: ['RESET (PB5)', 'PB3 (A3)', 'PB4 (A2)', 'GND', 'PB0 (PWM)', 'PB1 (PWM)', 'PB2 (A1)', 'VCC'],
    description: 'Compact 8-pin AVR RISC microcontroller for minimalist embedded circuit designs.'
  },

  // 8. Advanced Sensors & Optics
  {
    id: 'comp-neopixel-ring',
    name: 'NeoPixel 12-LED Ring',
    category: 'Actuators',
    icon: '✨',
    color: '#8B5CF6',
    pins: ['Data In (DI)', 'Power (5V)', 'Ground (GND)', 'Data Out (DO)'],
    description: '12 individually addressable ultra-bright WS2812B RGB LEDs arranged in a circular ring.'
  },
  {
    id: 'comp-gas-sensor',
    name: 'Gas Sensor (MQ-2)',
    category: 'Sensors',
    icon: '💨',
    color: '#64748B',
    pins: ['VCC (5V)', 'GND', 'Digital Out', 'Analog Out'],
    description: 'Electrochemical sensor for detecting LPG, smoke, methane, and flammable gases.'
  },
  {
    id: 'comp-flex-sensor',
    name: 'Flex Bend Sensor',
    category: 'Sensors',
    icon: '〰️',
    color: '#475569',
    pins: ['Terminal 1', 'Terminal 2'],
    description: 'Variable resistor whose electrical resistance changes in response to physical bending.'
  },
  {
    id: 'comp-logic-gate-and',
    name: '74HC08 Quad AND Gate',
    category: 'Basic',
    icon: '🔣',
    color: '#1E293B',
    pins: ['1A', '1B', '1Y', '2A', '2B', '2Y', 'GND', '3Y', '3A', '3B', '4Y', '4A', '4B', 'VCC'],
    description: 'Standard 14-pin DIP logic IC featuring four independent positive 2-input AND gates.'
  },
  {
    id: 'comp-powersupply',
    name: 'Variable DC Power Supply',
    category: 'Power',
    icon: '🎛️',
    color: '#0F172A',
    pins: ['Positive (+ Output)', 'Negative (- Output)'],
    description: 'Precision benchtop regulated DC laboratory power supply with adjustable voltage (0-30V) and current limits.'
  }
];

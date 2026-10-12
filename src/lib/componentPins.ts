import { ComponentPinDef } from '../types/builder';

export const COMPONENT_PINS_MAP: Record<string, ComponentPinDef[]> = {
  'comp-arduino-uno': [
    { name: 'D13', relX: 116, relY: 16, type: 'digital', label: '13' },
    { name: 'D12', relX: 128, relY: 16, type: 'digital', label: '12' },
    { name: 'D11', relX: 140, relY: 16, type: 'digital', label: '~11' },
    { name: 'D10', relX: 152, relY: 16, type: 'digital', label: '~10' },
    { name: 'D9', relX: 164, relY: 16, type: 'digital', label: '~9' },
    { name: 'D8', relX: 176, relY: 16, type: 'digital', label: '8' },
    { name: 'D7', relX: 192, relY: 16, type: 'digital', label: '7' },
    { name: 'D6', relX: 204, relY: 16, type: 'digital', label: '~6' },
    { name: 'D5', relX: 216, relY: 16, type: 'digital', label: '~5' },
    { name: 'D4', relX: 228, relY: 16, type: 'digital', label: '4' },
    { name: 'D3', relX: 240, relY: 16, type: 'digital', label: '~3' },
    { name: 'D2', relX: 252, relY: 16, type: 'digital', label: '2' },
    { name: 'GND_TOP', relX: 104, relY: 16, type: 'ground', label: 'GND' },
    { name: 'AREF', relX: 92, relY: 16, type: 'passive', label: 'AREF' },
    // Bottom Pins
    { name: '3.3V', relX: 120, relY: 152, type: 'power', label: '3.3V' },
    { name: '5V', relX: 132, relY: 152, type: 'power', label: '5V' },
    { name: 'GND_BOT1', relX: 144, relY: 152, type: 'ground', label: 'GND' },
    { name: 'GND_BOT2', relX: 156, relY: 152, type: 'ground', label: 'GND' },
    { name: 'VIN', relX: 168, relY: 152, type: 'power', label: 'VIN' },
    { name: 'A0', relX: 192, relY: 152, type: 'analog', label: 'A0' },
    { name: 'A1', relX: 204, relY: 152, type: 'analog', label: 'A1' },
    { name: 'A2', relX: 216, relY: 152, type: 'analog', label: 'A2' },
    { name: 'A3', relX: 228, relY: 152, type: 'analog', label: 'A3' },
    { name: 'A4', relX: 240, relY: 152, type: 'analog', label: 'A4' },
    { name: 'A5', relX: 252, relY: 152, type: 'analog', label: 'A5' }
  ],

  'comp-breadboard': [
    { name: '+ Rail (Top)', relX: 30, relY: 15, type: 'power', label: '+' },
    { name: '- Rail (Top)', relX: 30, relY: 26, type: 'ground', label: '-' },
    { name: 'Col 1 (a-e)', relX: 38, relY: 52, type: 'passive', label: '1' },
    { name: 'Col 5 (a-e)', relX: 74, relY: 52, type: 'passive', label: '5' },
    { name: 'Col 10 (a-e)', relX: 118, relY: 52, type: 'passive', label: '10' },
    { name: 'Col 15 (a-e)', relX: 162, relY: 52, type: 'passive', label: '15' },
    { name: 'Col 20 (a-e)', relX: 206, relY: 52, type: 'passive', label: '20' },
    { name: 'Col 25 (a-e)', relX: 250, relY: 52, type: 'passive', label: '25' },
    { name: 'Col 30 (a-e)', relX: 286, relY: 52, type: 'passive', label: '30' },
    { name: 'Col 1 (f-j)', relX: 38, relY: 88, type: 'passive', label: '1' },
    { name: 'Col 5 (f-j)', relX: 74, relY: 88, type: 'passive', label: '5' },
    { name: 'Col 10 (f-j)', relX: 118, relY: 88, type: 'passive', label: '10' },
    { name: 'Col 15 (f-j)', relX: 162, relY: 88, type: 'passive', label: '15' },
    { name: 'Col 20 (f-j)', relX: 206, relY: 88, type: 'passive', label: '20' },
    { name: 'Col 25 (f-j)', relX: 250, relY: 88, type: 'passive', label: '25' },
    { name: 'Col 30 (f-j)', relX: 286, relY: 88, type: 'passive', label: '30' },
    { name: '+ Rail (Bot)', relX: 30, relY: 118, type: 'power', label: '+' },
    { name: '- Rail (Bot)', relX: 30, relY: 129, type: 'ground', label: '-' }
  ],

  'comp-breadboard-mini': [
    { name: 'Col 1 (a-e)', relX: 20, relY: 35, type: 'passive', label: '1' },
    { name: 'Col 5 (a-e)', relX: 52, relY: 35, type: 'passive', label: '5' },
    { name: 'Col 10 (a-e)', relX: 92, relY: 35, type: 'passive', label: '10' },
    { name: 'Col 17 (a-e)', relX: 150, relY: 35, type: 'passive', label: '17' },
    { name: 'Col 1 (f-j)', relX: 20, relY: 65, type: 'passive', label: '1' },
    { name: 'Col 5 (f-j)', relX: 52, relY: 65, type: 'passive', label: '5' },
    { name: 'Col 10 (f-j)', relX: 92, relY: 65, type: 'passive', label: '10' },
    { name: 'Col 17 (f-j)', relX: 150, relY: 65, type: 'passive', label: '17' }
  ],

  'comp-led': [
    { name: 'Cathode (-)', relX: 24, relY: 76, type: 'ground', label: 'Cathode (-)' },
    { name: 'Anode (+)', relX: 46, relY: 76, type: 'power', label: 'Anode (+)' }
  ],

  'comp-led-rgb': [
    { name: 'Red', relX: 16, relY: 82, type: 'power', label: 'R' },
    { name: 'Cathode (-)', relX: 34, relY: 82, type: 'ground', label: 'GND' },
    { name: 'Green', relX: 52, relY: 82, type: 'power', label: 'G' },
    { name: 'Blue', relX: 70, relY: 82, type: 'power', label: 'B' }
  ],

  'comp-resistor': [
    { name: 'Terminal 1', relX: 10, relY: 25, type: 'passive', label: 'Term 1' },
    { name: 'Terminal 2', relX: 90, relY: 25, type: 'passive', label: 'Term 2' }
  ],

  'comp-capacitor-ceramic': [
    { name: 'Terminal 1', relX: 16, relY: 48, type: 'passive', label: '1' },
    { name: 'Terminal 2', relX: 36, relY: 48, type: 'passive', label: '2' }
  ],

  'comp-capacitor-electrolytic': [
    { name: 'Anode (+)', relX: 20, relY: 68, type: 'power', label: '+' },
    { name: 'Cathode (-)', relX: 40, relY: 68, type: 'ground', label: '-' }
  ],

  'comp-diode': [
    { name: 'Anode (+)', relX: 10, relY: 22, type: 'power', label: '+' },
    { name: 'Cathode (-)', relX: 62, relY: 22, type: 'ground', label: '-' }
  ],

  'comp-transistor-npn': [
    { name: 'Collector', relX: 16, relY: 55, type: 'passive', label: 'C' },
    { name: 'Base', relX: 32, relY: 55, type: 'signal', label: 'B' },
    { name: 'Emitter', relX: 48, relY: 55, type: 'ground', label: 'E' }
  ],

  'comp-pushbutton': [
    { name: 'Terminal 1a', relX: 18, relY: 16, type: 'signal', label: '1a' },
    { name: 'Terminal 1b', relX: 62, relY: 16, type: 'signal', label: '1b' },
    { name: 'Terminal 2a', relX: 18, relY: 64, type: 'signal', label: '2a' },
    { name: 'Terminal 2b', relX: 62, relY: 64, type: 'signal', label: '2b' }
  ],

  'comp-slideswitch': [
    { name: 'Terminal 1', relX: 18, relY: 48, type: 'passive', label: '1' },
    { name: 'Common', relX: 38, relY: 48, type: 'passive', label: 'COM' },
    { name: 'Terminal 2', relX: 58, relY: 48, type: 'passive', label: '2' }
  ],

  'comp-dipswitch': [
    { name: '1A', relX: 18, relY: 14, type: 'passive', label: '1A' },
    { name: '2A', relX: 38, relY: 14, type: 'passive', label: '2A' },
    { name: '3A', relX: 58, relY: 14, type: 'passive', label: '3A' },
    { name: '4A', relX: 78, relY: 14, type: 'passive', label: '4A' },
    { name: '1B', relX: 18, relY: 58, type: 'passive', label: '1B' },
    { name: '2B', relX: 38, relY: 58, type: 'passive', label: '2B' },
    { name: '3B', relX: 58, relY: 58, type: 'passive', label: '3B' },
    { name: '4B', relX: 78, relY: 58, type: 'passive', label: '4B' }
  ],

  'comp-potentiometer': [
    { name: 'Terminal 1', relX: 18, relY: 96, type: 'passive', label: 'Term 1' },
    { name: 'Wiper', relX: 45, relY: 96, type: 'analog', label: 'Wiper' },
    { name: 'Terminal 2', relX: 72, relY: 96, type: 'passive', label: 'Term 2' }
  ],

  'comp-photoresistor': [
    { name: 'Terminal 1', relX: 14, relY: 55, type: 'passive', label: 'Term 1' },
    { name: 'Terminal 2', relX: 38, relY: 55, type: 'passive', label: 'Term 2' }
  ],

  'comp-ultrasonic': [
    { name: 'VCC', relX: 28, relY: 74, type: 'power', label: 'VCC' },
    { name: 'Trig', relX: 48, relY: 74, type: 'digital', label: 'Trig' },
    { name: 'Echo', relX: 68, relY: 74, type: 'digital', label: 'Echo' },
    { name: 'GND', relX: 88, relY: 74, type: 'ground', label: 'GND' }
  ],

  'comp-pir': [
    { name: 'VCC', relX: 25, relY: 75, type: 'power', label: 'VCC' },
    { name: 'Signal', relX: 50, relY: 75, type: 'digital', label: 'OUT' },
    { name: 'GND', relX: 75, relY: 75, type: 'ground', label: 'GND' }
  ],

  'comp-temp': [
    { name: 'Power (5V)', relX: 16, relY: 55, type: 'power', label: '5V' },
    { name: 'Vout (Analog)', relX: 34, relY: 55, type: 'analog', label: 'OUT' },
    { name: 'GND', relX: 52, relY: 55, type: 'ground', label: 'GND' }
  ],

  'comp-tilt': [
    { name: 'Terminal 1', relX: 16, relY: 55, type: 'passive', label: '1' },
    { name: 'Terminal 2', relX: 38, relY: 55, type: 'passive', label: '2' }
  ],

  'comp-servo': [
    { name: 'Signal (PWM)', relX: 25, relY: 82, type: 'digital', label: 'PWM' },
    { name: 'Power (5V)', relX: 52, relY: 82, type: 'power', label: '5V' },
    { name: 'Ground', relX: 80, relY: 82, type: 'ground', label: 'GND' }
  ],

  'comp-dc-motor': [
    { name: 'Terminal 1 (+)', relX: 20, relY: 75, type: 'power', label: '+' },
    { name: 'Terminal 2 (-)', relX: 68, relY: 75, type: 'ground', label: '-' }
  ],

  'comp-piezo': [
    { name: 'Positive (+)', relX: 24, relY: 68, type: 'signal', label: '+' },
    { name: 'Negative (-)', relX: 56, relY: 68, type: 'ground', label: '-' }
  ],

  'comp-relay': [
    { name: 'Coil 1', relX: 18, relY: 20, type: 'signal', label: 'COIL' },
    { name: 'Coil 2', relX: 18, relY: 55, type: 'ground', label: 'GND' },
    { name: 'COM', relX: 58, relY: 20, type: 'passive', label: 'COM' },
    { name: 'NO', relX: 58, relY: 38, type: 'passive', label: 'NO' },
    { name: 'NC', relX: 58, relY: 55, type: 'passive', label: 'NC' }
  ],

  'comp-battery-9v': [
    { name: 'Positive (+)', relX: 26, relY: 16, type: 'power', label: '+' },
    { name: 'Negative (-)', relX: 54, relY: 16, type: 'ground', label: '-' }
  ],

  'comp-battery-coincell': [
    { name: 'Positive (+ 3V)', relX: 18, relY: 30, type: 'power', label: '+' },
    { name: 'Negative (-)', relX: 46, relY: 30, type: 'ground', label: '-' }
  ],

  'comp-battery-aa': [
    { name: 'Positive (+ 6V)', relX: 22, relY: 16, type: 'power', label: '+' },
    { name: 'Negative (-)', relX: 66, relY: 16, type: 'ground', label: '-' }
  ],

  'comp-lcd-16x2': [
    { name: 'GND', relX: 25, relY: 16, type: 'ground', label: 'GND' },
    { name: 'VCC', relX: 42, relY: 16, type: 'power', label: 'VCC' },
    { name: 'SDA', relX: 59, relY: 16, type: 'digital', label: 'SDA' },
    { name: 'SCL', relX: 76, relY: 16, type: 'digital', label: 'SCL' }
  ],

  'comp-7segment': [
    { name: 'A', relX: 14, relY: 12, type: 'passive', label: 'A' },
    { name: 'B', relX: 26, relY: 12, type: 'passive', label: 'B' },
    { name: 'COM_TOP', relX: 38, relY: 12, type: 'ground', label: 'COM' },
    { name: 'F', relX: 50, relY: 12, type: 'passive', label: 'F' },
    { name: 'G', relX: 62, relY: 12, type: 'passive', label: 'G' },
    { name: 'E', relX: 14, relY: 82, type: 'passive', label: 'E' },
    { name: 'D', relX: 26, relY: 82, type: 'passive', label: 'D' },
    { name: 'COM_BOT', relX: 38, relY: 82, type: 'ground', label: 'COM' },
    { name: 'C', relX: 50, relY: 82, type: 'passive', label: 'C' },
    { name: 'DP', relX: 62, relY: 82, type: 'passive', label: 'DP' }
  ],

  'comp-multimeter': [
    { name: 'Positive (Red)', relX: 28, relY: 100, type: 'power', label: 'V/Ω' },
    { name: 'Negative (Black)', relX: 72, relY: 100, type: 'ground', label: 'COM' }
  ],

  'comp-oscilloscope': [
    { name: 'CH1 Positive (+)', relX: 30, relY: 110, type: 'signal', label: 'CH1+' },
    { name: 'CH1 Ground (-)', relX: 52, relY: 110, type: 'ground', label: 'GND' },
    { name: 'CH2 Positive (+)', relX: 118, relY: 110, type: 'signal', label: 'CH2+' },
    { name: 'CH2 Ground (-)', relX: 140, relY: 110, type: 'ground', label: 'GND' }
  ],

  'comp-microbit': [
    { name: '0 (P0)', relX: 25, relY: 135, type: 'analog', label: '0' },
    { name: '1 (P1)', relX: 55, relY: 135, type: 'analog', label: '1' },
    { name: '2 (P2)', relX: 85, relY: 135, type: 'analog', label: '2' },
    { name: '3V (Power)', relX: 115, relY: 135, type: 'power', label: '3V' },
    { name: 'GND (Ground)', relX: 145, relY: 135, type: 'ground', label: 'GND' }
  ],

  'comp-attiny85': [
    { name: 'RESET (PB5)', relX: 16, relY: 15, type: 'digital', label: 'RST' },
    { name: 'PB3 (A3)', relX: 16, relY: 30, type: 'analog', label: 'B3' },
    { name: 'PB4 (A2)', relX: 16, relY: 45, type: 'analog', label: 'B4' },
    { name: 'GND', relX: 16, relY: 60, type: 'ground', label: 'GND' },
    { name: 'PB0 (PWM)', relX: 64, relY: 60, type: 'digital', label: 'B0' },
    { name: 'PB1 (PWM)', relX: 64, relY: 45, type: 'digital', label: 'B1' },
    { name: 'PB2 (A1)', relX: 64, relY: 30, type: 'analog', label: 'B2' },
    { name: 'VCC', relX: 64, relY: 15, type: 'power', label: 'VCC' }
  ],

  'comp-neopixel-ring': [
    { name: 'Data In (DI)', relX: 20, relY: 55, type: 'digital', label: 'DI' },
    { name: 'Power (5V)', relX: 55, relY: 20, type: 'power', label: '5V' },
    { name: 'Ground (GND)', relX: 55, relY: 90, type: 'ground', label: 'GND' },
    { name: 'Data Out (DO)', relX: 90, relY: 55, type: 'digital', label: 'DO' }
  ],

  'comp-gas-sensor': [
    { name: 'VCC (5V)', relX: 20, relY: 65, type: 'power', label: 'VCC' },
    { name: 'GND', relX: 38, relY: 65, type: 'ground', label: 'GND' },
    { name: 'Digital Out', relX: 56, relY: 65, type: 'digital', label: 'DO' },
    { name: 'Analog Out', relX: 74, relY: 65, type: 'analog', label: 'AO' }
  ],

  'comp-flex-sensor': [
    { name: 'Terminal 1', relX: 14, relY: 15, type: 'passive', label: '1' },
    { name: 'Terminal 2', relX: 34, relY: 15, type: 'passive', label: '2' }
  ],

  'comp-logic-gate-and': [
    { name: '1A', relX: 15, relY: 14, type: 'digital', label: '1A' },
    { name: '1B', relX: 30, relY: 14, type: 'digital', label: '1B' },
    { name: '1Y', relX: 45, relY: 14, type: 'digital', label: '1Y' },
    { name: '2A', relX: 60, relY: 14, type: 'digital', label: '2A' },
    { name: '2B', relX: 75, relY: 14, type: 'digital', label: '2B' },
    { name: '2Y', relX: 90, relY: 14, type: 'digital', label: '2Y' },
    { name: 'GND', relX: 105, relY: 14, type: 'ground', label: 'GND' },
    { name: '3Y', relX: 105, relY: 58, type: 'digital', label: '3Y' },
    { name: '3A', relX: 90, relY: 58, type: 'digital', label: '3A' },
    { name: '3B', relX: 75, relY: 58, type: 'digital', label: '3B' },
    { name: '4Y', relX: 60, relY: 58, type: 'digital', label: '4Y' },
    { name: '4A', relX: 45, relY: 58, type: 'digital', label: '4A' },
    { name: '4B', relX: 30, relY: 58, type: 'digital', label: '4B' },
    { name: 'VCC', relX: 15, relY: 58, type: 'power', label: 'VCC' }
  ],

  'comp-powersupply': [
    { name: 'Positive (+ Output)', relX: 45, relY: 98, type: 'power', label: '+' },
    { name: 'Negative (- Output)', relX: 95, relY: 98, type: 'ground', label: '-' }
  ]
};

// Fallback pins generator if unknown
export function getComponentPins(componentId: string): ComponentPinDef[] {
  return (
    COMPONENT_PINS_MAP[componentId] || [
      { name: 'Pin 1', relX: 15, relY: 35, type: 'passive', label: '1' },
      { name: 'Pin 2', relX: 65, relY: 35, type: 'passive', label: '2' }
    ]
  );
}

// Find specific pin coords relative to placed component
export function getPinPosition(componentId: string, pinName: string): { relX: number; relY: number } {
  const pins = getComponentPins(componentId);
  const found = pins.find((p) => p.name === pinName || p.label === pinName);
  if (found) {
    return { relX: found.relX, relY: found.relY };
  }
  // Try partial match
  const partial = pins.find((p) => pinName.includes(p.name) || p.name.includes(pinName));
  if (partial) {
    return { relX: partial.relX, relY: partial.relY };
  }
  return { relX: 30, relY: 30 };
}

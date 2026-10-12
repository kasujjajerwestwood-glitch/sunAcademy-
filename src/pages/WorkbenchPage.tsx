import React, { useState } from 'react';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { CircuitSimulator } from '../components/CircuitSimulator';
import { CodeBlock } from '../components/CodeBlock';
import {
  Wrench,
  Cpu,
  Lightbulb,
  Radio,
  Radar,
  Sprout,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

type WorkbenchSim = 'led' | 'traffic-light' | 'ultrasonic' | 'plant-watering';

export const WorkbenchPage: React.FC = () => {
  const { navigate } = useNavigation();
  const [selectedSim, setSelectedSim] = useState<WorkbenchSim>('led');

  const simInfo: Record<
    WorkbenchSim,
    { title: string; subtitle: string; icon: React.ReactNode; code: string; projectSlug: string }
  > = {
    led: {
      title: 'Digital Pin 9: LED Blink & PWM Fader',
      subtitle: 'PWM duty cycle frequency modulation & current limiting',
      icon: <Lightbulb className="w-4 h-4 text-emerald-400" />,
      projectSlug: 'blinking-led',
      code: `// sunAcademy Virtual Workbench: PWM LED Controller
const int LED_PIN = 9; // PWM pin

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // Test duty cycle ramping
  for (int b = 0; b <= 255; b += 5) {
    analogWrite(LED_PIN, b);
    delay(15);
  }
  for (int b = 255; b >= 0; b -= 5) {
    analogWrite(LED_PIN, b);
    delay(15);
  }
}`
    },
    'traffic-light': {
      title: 'Digital Pins 10, 11, 12: Intersection FSM',
      subtitle: 'Finite State Machine with Pin 2 Pedestrian Hardware Interrupt',
      icon: <Radio className="w-4 h-4 text-amber-400" />,
      projectSlug: 'traffic-light-controller',
      code: `// sunAcademy Virtual Workbench: Traffic Signal State Machine
const int RED = 12, YELLOW = 11, GREEN = 10, BUTTON = 2;
volatile bool req = false;

void isr() { req = true; }

void setup() {
  pinMode(RED, OUTPUT); pinMode(YELLOW, OUTPUT); pinMode(GREEN, OUTPUT);
  pinMode(BUTTON, INPUT);
  attachInterrupt(digitalPinToInterrupt(BUTTON), isr, RISING);
}

void loop() {
  digitalWrite(GREEN, HIGH); delay(req ? 1000 : 3500);
  digitalWrite(GREEN, LOW); digitalWrite(YELLOW, HIGH); delay(1200);
  digitalWrite(YELLOW, LOW); digitalWrite(RED, HIGH); req = false; delay(3000);
  digitalWrite(RED, LOW);
}`
    },
    ultrasonic: {
      title: 'Pins 9 (Trig) & 10 (Echo): Sonar Time-of-Flight',
      subtitle: 'Echolocation calculation: Distance = (Duration * 0.0343) / 2',
      icon: <Radar className="w-4 h-4 text-cyan-400" />,
      projectSlug: 'ultrasonic-distance-sensor',
      code: `// sunAcademy Virtual Workbench: Sonar Distance Meter
const int TRIG = 9, ECHO = 10, BUZZER = 6;

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT); pinMode(BUZZER, OUTPUT);
}

void loop() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long dur = pulseIn(ECHO, HIGH, 30000);
  float dist = (dur * 0.0343) / 2;
  if (dist < 15) tone(BUZZER, 2000, 50);
  delay(100);
}`
    },
    'plant-watering': {
      title: 'Analog A0 (Moisture) & Pin 7 (Relay Switch)',
      subtitle: 'Capacitive soil threshold hysteresis & 5V pump activation',
      icon: <Sprout className="w-4 h-4 text-lime-400" />,
      projectSlug: 'smart-plant-watering-system',
      code: `// sunAcademy Virtual Workbench: Soil Moisture Auto-Pump
const int PROBE = A0, RELAY = 7;

void setup() {
  pinMode(RELAY, OUTPUT);
  digitalWrite(RELAY, HIGH); // Relay OFF (active LOW)
}

void loop() {
  int soilPercent = map(analogRead(PROBE), 680, 320, 0, 100);
  if (soilPercent < 30) {
    digitalWrite(RELAY, LOW);  // Turn ON 5V Pump
    delay(3000);
    digitalWrite(RELAY, HIGH); // Turn OFF
    delay(15000);
  }
  delay(2000);
}`
    }
  };

  const active = simInfo[selectedSim];

  return (
    <div className="py-8 sm:py-12 space-y-10">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-3xl">
            <Badge variant="cyan" size="sm" className="mb-2">
              Virtual Electronics Lab
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interactive Circuit Workbench
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
              Tinker, adjust potentiometers, calibrate sonar echoes, and watch simulated pins react in real time without wiring any breadboards.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/projects/${active.projectSlug}`)}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            View Physical Wiring Guide
          </Button>
        </div>

        {/* Experiment Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8">
          {(Object.keys(simInfo) as WorkbenchSim[]).map((key) => {
            const item = simInfo[key];
            const isSelected = selectedSim === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedSim(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow-md border border-slate-700/80'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Live Simulator Widget */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{active.title}</span>
              </h2>
              <p className="text-xs text-slate-400">{active.subtitle}</p>
            </div>
          </div>

          <CircuitSimulator key={selectedSim} type={selectedSim} />
        </div>

        {/* Live Sketch Inspector */}
        <div className="mt-10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Underlying Firmware Sketch
            </h3>
            <span className="text-xs font-mono text-cyan-400">Arduino C++</span>
          </div>
          <CodeBlock
            code={active.code}
            language="cpp"
            title={`${selectedSim}_firmware.ino`}
          />
        </div>
      </Container>
    </div>
  );
};

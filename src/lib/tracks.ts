import { Track } from '../types';

export const TRACKS: Track[] = [
  {
    id: 'arduino',
    title: 'Arduino & Electronics',
    description: 'Learn circuits, analog & digital I/O, breadboarding, and programming microcontrollers.',
    icon: 'Cpu',
    badge: 'Hardware & Circuits',
    color: 'emerald',
    coursesCount: 3,
    projectsCount: 6,
    skills: ['Breadboarding', 'GPIO Pinouts', 'Sensors', 'PWM Control', 'Actuators']
  },
  {
    id: 'python',
    title: 'Python & Programming Fundamentals',
    description: 'Master clean logic, data structures, automation, and algorithmic problem-solving.',
    icon: 'Terminal',
    badge: 'Core Programming',
    color: 'amber',
    coursesCount: 2,
    projectsCount: 4,
    skills: ['Variables & Loops', 'Functions', 'Data Structures', 'MicroPython', 'Automation']
  },
  {
    id: 'web-dev',
    title: 'Web Development',
    description: 'Build modern user interfaces and real-time dashboards to control and monitor IoT devices.',
    icon: 'Globe',
    badge: 'Full-Stack Web',
    color: 'cyan',
    coursesCount: 2,
    projectsCount: 3,
    skills: ['HTML5 & Modern CSS', 'JavaScript ES6+', 'React Components', 'Hardware WebSockets']
  },
  {
    id: 'embedded',
    title: 'C/C++ for Microcontrollers',
    description: 'Deep dive into memory management, interrupts, registers, ESP32 Wi-Fi, and IoT protocols.',
    icon: 'Binary',
    badge: 'Low-Level Systems',
    color: 'indigo',
    coursesCount: 2,
    projectsCount: 3,
    skills: ['C/C++ Pointers', 'Hardware Interrupts', 'Timers & ADC', 'ESP32 Wi-Fi / MQTT']
  }
];

export const getTrackById = (id: string): Track | undefined => {
  return TRACKS.find(t => t.id === id);
};

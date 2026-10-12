export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: 'Student' | 'Educator' | 'Maker';
  createdAt: string;
}

export interface ComponentPinDef {
  name: string;
  relX: number; // relative to component top-left
  relY: number;
  type: 'digital' | 'analog' | 'power' | 'ground' | 'signal' | 'passive';
  label?: string;
}

export interface PlacedComponent {
  instanceId: string;
  componentId: string; // from COMPONENTS_CATALOG
  name: string;
  x: number;
  y: number;
  rotation: number; // 0, 90, 180, 270
  groupId?: string; // ID of the group this component belongs to for multi-component grouped movement
  customValue?: string; // e.g. "220Ω"
  color?: string; // for LED / wire
  state?: {
    knobAngle?: number; // 0 to 270 deg for potentiometer
    distanceCm?: number; // 2 to 200 cm for ultrasonic
    buttonPressed?: boolean; // pushbutton
    switchState?: boolean; // slide switch
    servoAngle?: number; // 0 to 180 deg
    dcMotorRpm?: number;
    multimeterMode?: 'V' | 'A' | 'R';
    multimeterValue?: string; // e.g. "5.00 V"
    isBuzzerActive?: boolean;
    ledLit?: boolean;
    tempCelsius?: number; // TMP36
    tiltActive?: boolean;
    lcdText?: string;
    segmentDigit?: number;
  };
}

export type WireColorType =
  | 'green'
  | 'red'
  | 'black'
  | 'blue'
  | 'yellow'
  | 'orange'
  | 'white'
  | 'purple'
  | 'brown'
  | 'gray'
  | 'pink'
  | 'cyan';

export type WireStyleType = 'normal' | 'hookup' | 'alligator';

export interface PlacedWire {
  id: string;
  fromComponentId?: string; // Optional if point-to-point wire
  fromPin?: string;
  toComponentId?: string;
  toPin?: string;
  // Free-hand or point-to-point coordinates
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  waypoints?: { x: number; y: number }[];
  color: WireColorType;
  wireType?: WireStyleType;
}

export interface VideoTutorial {
  id: string;
  title: string;
  slug: string;
  duration: string; // e.g. "5:40"
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Circuits' | 'Arduino' | 'MicroPython' | '3D Design' | 'Codeblocks';
  description: string;
  thumbnailUrl: string;
  videoUrl?: string; // HTML5 video or interactive simulation
  circuitStarterId?: string; // Associated circuit to tinker with 1 click
  topics: string[];
  partsList: string[];
  starterCode?: {
    cpp: string;
    python: string;
  };
}

export interface InteractiveCircuitState {
  components: PlacedComponent[];
  wires: PlacedWire[];
}

export interface Shape3D {
  id: string;
  type: 'box' | 'cylinder' | 'sphere' | 'roof' | 'cone' | 'pyramid' | 'wedge' | 'text' | 'tube';
  x: number;
  y: number;
  z: number;
  width: number;
  length: number;
  height: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  color: string;
  isHole: boolean;
  name: string;
}

export interface CodeBlockItem {
  id: string;
  type: 'create_shape' | 'move' | 'rotate' | 'scale' | 'color' | 'repeat';
  shapeType?: 'box' | 'cylinder' | 'sphere' | 'cone';
  params: Record<string, any>;
}

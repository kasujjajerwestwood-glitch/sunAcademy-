# Interactive Tinkercad Circuit Builder & CAD Simulation Engine

Comprehensive overhaul of the Tinkercad Circuits workspace to unfreeze the interactive building experience, enable fluid breadboard drag-and-drop wiring with real-time electrical simulation, multi-select component grouping, and provide an interactive animated CAD simulation masterclass player for all tutorial videos.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your Phase 1 answers, the following core specifications are confirmed and directly drive this implementation:

- **Confirmed Decision 1 (Tutorial Playback)**: Tutorial videos will run in a built-in **Interactive CAD Simulation Player** with real-time animated circuit schematics, live electron flows, breadboard trace illuminations, multimeter readouts, and Web Audio synthesized sound effects—bypassing external iframe playback blocks.
- **Confirmed Decision 2 (Builder Interactivity)**: The canvas builder will prioritize **Interactive Drag-and-Drop Breadboard Wiring and Real-Time Simulation**, featuring pin-to-pin wiring with live bezier curvature, breadboard socket snapping, and active simulation states (LED illumination, resistor voltage drops, battery power).
- **Confirmed Decision 3 (Default Canvas Starter)**: New circuits open with a clean **Empty Breadboard Workspace** ready for hands-on wiring, with the full component catalog immediately accessible in the right sidebar.
- **Confirmed Decision 4 (Multi-Component Grouping)**: Marquee box selection and Shift+Click multi-selection allow selecting multiple components to group (`Ctrl+G`), ungroup, align, and drag together as a unified cluster with dynamic wire recalculation.

---

## 1. Overview & Core Concept

- **What It Does**: A faithful, high-fidelity replica of Autodesk Tinkercad Circuits. Users can drag components (breadboards, Arduino Uno, ATtiny85, LEDs, resistors, batteries, pushbuttons, multimeters) onto the workspace, route colored wires between terminals with auto-routing, group subcircuits, and hit "Start Simulation" to see current flow, components respond dynamically, and inspect voltages. Tutorial videos open immediately in a full-fledged CAD animation player with playback scrub controls, guided steps, and live visual breadboard simulations.
- **Target Audience / Persona**: Students, hobbyists, STEM educators, and makers learning electronics, Arduino prototyping, and circuit design who need an intuitive, responsive, and visual breadboard CAD environment.
- **Key Value**: Eliminates static placeholder behavior and video playback failures; delivers a snappy, tactile circuit building sandbox that behaves like the real Tinkercad suite.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Starting Fresh**: The user clicks "+ New Circuit" or opens the editor. The workspace renders a clean, authentic Tinkercad grid with a pristine mini-breadboard ready for prototyping.
2. **Dragging & Placing Components**: The user selects an LED or 9V battery from the catalog sidebar. Hovering over the canvas reveals placement ghosting with grid snapping ($10\text{px}$ pitch). Dropping sets the component with clear terminal pin targets.
3. **Intuitive Wiring**: Clicking any component pin or breadboard socket activates interactive wire drawing. A dynamic bezier line tracks the cursor. Hovering over a valid destination pin shows a magnetic snap circle and pin label. Clicking establishes the wire. The user can switch wire colors (Red, Black, Yellow, Green, Blue) from the top bar.
4. **Multi-Select & Grouping**:
   - Dragging on empty canvas opens a rubberband marquee selection box.
   - Holding `Shift` and clicking components toggles multi-selection.
   - Selected components highlight with an active cyan bounding box and tag badge.
   - Clicking "Group" (`Ctrl+G`) locks the components into a rigid group.
   - Dragging any member of the group smoothly translates the entire cluster and recalculates all connected wire anchor coordinates in real time.
5. **Real-Time Simulation**: Clicking "Start Simulation" animates the breadboard. If a battery is wired through a resistor to an LED with correct polarity, the LED illuminates with a soft radial glow, current particles pulse along the wires, and multimeters display active voltages ($1.98\text{V}$, $8.2\text{mA}$).
6. **Tutorial Video Masterclass**: Clicking any tutorial card opens the CAD Simulation Player. Users can play, pause, jump between timestamps, toggle educational audio narration tone, and watch animated step-by-step breadboard assembly with live animated electrons.

### Visual Identity & Theme
- **Aesthetic Direction**: High-precision engineering workspace following the Autodesk Tinkercad visual language—neutral slate workplane, clean technical toolbars, vibrant wiring accents, and crisp hardware illustrations.
- **Color Palette & Mood**:
  - Dominant Canvas ($60\%$): Cool engineering grid `#E5E9F0` with subtle $10\text{px}$ dot/line grid and isometric workplane contrast.
  - Structural Surfaces ($30\%$): Pure white top toolbar `#FFFFFF` with hairline `#E2E8F0` borders, dark slate header `#1E293B` for Tinkercad branding, and light gray `#F8FAFC` catalog panel.
  - Accent Budget ($10\%$): Tinkercad Cyan `#0099FF` for selection bounding boxes and active tools; Autodesk Orange `#FF6600` for primary actions; vivid wire colors (Red `#DC2626`, Black `#1E293B`, Green `#16A34A`, Yellow `#CA8A04`, Blue `#2563EB`).
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` SemiBold for workspace headers and modal titles.
  - Monospace Data: `JetBrains Mono` / `font-mono tabular-nums` for multimeter LCD screens, simulation timestamps (`00:01.42`), resistor resistance values, and pin names.
  - Metadata: Clean unboxed text with subtle typographic separators (`·`), adhering strictly to zero-pill guidelines.
- **Interactive Feedback & Motion**:
  - Dragging components features silky 60fps movement with zero DOM lagging.
  - Breadboard pins show distinct hover rings and highlight all connected tie points in the same column/rail.
  - Start Simulation illuminates a green running badge with pulsating current flow indicators along completed electrical paths.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Self-Contained Interactive CAD Simulation Video Engine vs. YouTube Iframes
- **Chosen Approach**: Built-in interactive SVG/Canvas animation player running custom step-by-step CAD demonstrations with Web Audio sound effects, accompanied by an optional external link button to YouTube.
- **Why**: AI Studio sandbox iframe security policies and third-party cookie restrictions frequently block embedded YouTube players (`Video unavailable` / `playback blocked`). The interactive CAD simulation engine guarantees $100\%$ uptime, immediate playback, higher pedagogical clarity, and zero loading friction.
- **Alternative Considered**: Embedding raw iframes with sandbox bypasses—unreliable across browsers and blocked by YouTube's embed policies in framed preview containers.

### Decision 2: Graph-Based Breadboard Tie-Point Netlist Engine for Simulation
- **Chosen Approach**: Lightweight resistive netlist solver on the client that evaluates electrical continuity between power sources (9V, 3V coin cell, USB/Arduino 5V), switches, resistors, and diodes/LEDs.
- **Why**: Enables instantaneous real-time feedback without server roundtrips. When the user closes a switch or completes a loop, the circuit immediately lights up or reports a short-circuit warning.
- **Alternative Considered**: Full SPICE simulator backend—heavy, high latency, complex to deploy, and unnecessary for Tinkercad-level educational simulations.

### Decision 3: Compound Multi-Select Offset Translation for Rigid Group Movement
- **Chosen Approach**: Track group members under a shared `groupId` and maintain relative coordinate deltas from the drag origin. As the user moves any component in the group, all siblings update in lockstep and wire endpoints dynamically re-anchor.
- **Why**: Provides a true desktop CAD feel identical to Tinkercad's grouping mechanics, preventing grouped components from drifting or breaking wire connections.

---

## 4. Technical Architecture & Data Strategy

### System Architecture & Component Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TinkercadDashboardPage                          │
│   (Navbar, Sidebar, Circuit Grid, Starter Cards, Tutorial Modals)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Launches
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
┌───────────────────────────────────┐   ┌───────────────────────────────────┐
│     TutorialVideoPlayerModal      │   │          TinkercadEditor          │
│ - Interactive CAD Simulation Player│   │ - Breadboard & Workplane Canvas   │
│ - Live Animated Electron Engine   │   │ - Component Palette & Inspector   │
│ - Web Audio Sound Synthesizer     │   │ - Netlist Electrical Solver Engine│
│ - Step-by-Step Lesson Timeline    │   │ - Undo/Redo History Stack         │
└───────────────────────────────────┘   └─────────────────┬─────────────────┘
                                                          │
                    ┌─────────────────────────────────────┴───────────────────┐
                    ▼                                                         ▼
       ┌─────────────────────────┐                               ┌─────────────────────────┐
       │   DraggableComponent    │                               │     CanvasWireLayer     │
       │ - Pin Terminal Anchors  │                               │ - Interactive Bezier SVG│
       │ - Multi-Select Bounding │                               │ - Real-time Current Pulse│
       │ - Group Drag Offset     │                               │ - Breadboard Tie Snap   │
       └─────────────────────────┘                               └─────────────────────────┘
```

### Data Model & State Strategy
- **`PlacedComponent`**:
  ```ts
  interface PlacedComponent {
    instanceId: string;
    componentId: string;
    name: string;
    x: number;
    y: number;
    rotation: number;
    groupId?: string;
    color?: string;
    customValue?: string;
    state?: { isOn?: boolean; position?: number; voltage?: number };
  }
  ```
- **`PlacedWire`**:
  ```ts
  interface PlacedWire {
    id: string;
    fromComponentId: string;
    fromPin: string;
    toComponentId: string;
    toPin: string;
    color: string;
    wireType: 'normal' | 'hookup' | 'alligator';
    intermediatePoints?: { x: number; y: number }[];
  }
  ```
- **`SimulationState`**:
  ```ts
  interface SimulationState {
    isRunning: boolean;
    elapsedSeconds: number;
    activeNets: Map<string, { voltage: number; current: number }>;
    illuminatedLeds: Set<string>;
    multimeterReadings: Map<string, { voltage: number; current: number }>;
    warnings: string[];
  }
  ```

### Interactive Component & State Mapping
- **Canvas Workplane**:
  - `onMouseDown`: Starts marquee drag if on background; clears non-Shift selections.
  - `onMouseMove`: Updates marquee rectangle or translates dragging group offset.
  - `onMouseUp`: Selects all components intersecting the marquee box.
- **Wire Drawing Controller**:
  - First Pin Click: Initiates active wire with rubberband preview.
  - Canvas Click: Adds bezier routing control point (like Tinkercad's wire bending).
  - Second Pin Click: Finalizes connection, validates electrical net, registers with undo stack.
- **Simulation Loop**:
  - Runs at $30\text{Hz}$ via `requestAnimationFrame` when active.
  - Propagates power rail connections across breadboard columns ($A\text{--}E$, $F\text{--}J$) and power distribution buses ($+$, $-$).
  - Evaluates switch contacts, potentiometer resistance ratios, and diode forward-bias conditions.
  - Synthesizes subtle audio tick and hum using HTML5 Web Audio API for interactive immersion.

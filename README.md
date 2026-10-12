# ⚡ sunAcademy — Code & Real Hardware

> **Learn to code. Build real hardware.**  
> An all-in-one physical computing and software engineering academy covering Web Development, Python, Electronics, and Arduino microcontrollers.

---

## 🚀 Features

- **Tinkercad-Inspired Clean Circuit Workbench**: Clean, modern, dark-mode electronic workbench with interactive live pin simulators (LED PWM, Traffic Light FSM, Ultrasonic Sonar Radar, and Soil Moisture Auto-Relay).
- **4 Specialized Tracks**:
  - `Arduino & Electronics`: Circuits, GPIO, Breadboard, PWM, ADC.
  - `Python & Programming`: Logic, Data Structures, Automation.
  - `Web Development`: HTML5, CSS Grid, Modern JS ES6+, React.
  - `C/C++ for Microcontrollers`: Registers, Interrupts, Timers, ESP32 IoT.
- **8+ Production-Ready Courses**: Complete curricula with real code snippets, key takeaways, and parts lists.
- **6+ Step-by-Step Hardware Projects**: Wiring diagrams, breadboard pinout checklists, copyable Arduino sketches, and troubleshooting tips.
- **PWA & Mobile-First**: Web App Manifest (`manifest.json`), service worker (`sw.js`), mobile bottom navigation bar, offline support, ready to wrap for the Google Play Store.
- **Client Persistence**: Course progress, completed lessons, and bookmarks saved automatically in browser `localStorage`.
- **Zero Paid APIs**: Runs self-contained with no database requirements for v1.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with dark workbench palette (`#0B0F17`)
- **Icons**: Lucide React
- **Animations & Effects**: Tailwind CSS + Motion
- **Deployment**: Vercel ready via `vercel.json`

---

## 📁 File Structure

```text
├── public/
│   ├── favicon.svg            # Vector chip & sun brand favicon
│   ├── icon-192.svg           # PWA 192px icon
│   ├── icon-512.svg           # PWA 512px icon
│   ├── manifest.json          # PWA Web Manifest
│   └── sw.js                  # Service Worker with offline caching
├── src/
│   ├── types/
│   │   └── index.ts           # Course, Project, Track, and Progress types
│   ├── lib/
│   │   ├── courses.ts         # 8 complete courses and lesson curricula
│   │   ├── projects.ts        # 6 Arduino hardware builds and wiring guides
│   │   ├── tracks.ts          # 4 core curriculum tracks
│   │   └── storage.ts         # LocalStorage progress state engine
│   ├── context/
│   │   ├── NavigationContext.tsx  # History-backed SPA router
│   │   └── ProgressContext.tsx    # Completion & bookmark tracking state
│   ├── components/
│   │   ├── Navbar.tsx             # Responsive header with PWA install button
│   │   ├── Footer.tsx             # Footer links and curriculum index
│   │   ├── Container.tsx          # Responsive layout container
│   │   ├── Button.tsx             # Button variants (primary, glow, outline)
│   │   ├── Badge.tsx              # Colored status badges
│   │   ├── SectionHeading.tsx     # Typography section headings
│   │   ├── ProgressBar.tsx        # Dynamic progress meter
│   │   ├── CodeBlock.tsx          # Syntax code viewer with copy button
│   │   ├── CourseCard.tsx         # Catalog card with lesson count and progress
│   │   ├── ProjectCard.tsx        # Project card with difficulty and components
│   │   ├── TrackCard.tsx          # Track overview card
│   │   ├── SearchFilter.tsx       # Live query & level filter bar
│   │   ├── LessonList.tsx         # Interactive lesson drawers with completion checks
│   │   ├── CircuitSimulator.tsx   # Interactive virtual hardware simulator
│   │   └── BreadboardVisualizer.tsx # SVG circuit schematic & pinout checklist
│   ├── pages/
│   │   ├── HomePage.tsx           # Hero, live preview, stats, tracks, catalog
│   │   ├── CoursesPage.tsx        # Searchable and filterable course directory
│   │   ├── CourseDetailPage.tsx   # Curriculum, parts list, code, lesson player
│   │   ├── ProjectsPage.tsx       # Searchable hardware builds
│   │   ├── ProjectDetailPage.tsx  # Wiring steps, schematic, code, simulator
│   │   ├── WorkbenchPage.tsx      # Full-screen interactive circuit workbench
│   │   └── AboutPage.tsx          # Mission and roadmap
│   ├── App.tsx                    # Main application router
│   ├── index.css                  # Theme tokens, font variables, circuit grids
│   └── main.tsx                   # React 19 entry point
├── vercel.json                    # Single-page application rewrites for Vercel
├── vite.config.ts                 # Vite build configuration
├── tsconfig.json                  # Strict TypeScript configuration
└── package.json                   # Dependencies and build scripts
```

---

## ⚡ Deployment to Vercel (Step-by-Step)

`sunAcademy` is pre-configured with `vercel.json` to handle all client routes (`/courses`, `/projects`, etc.) cleanly.

### Option A: Via GitHub (Recommended)
1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of sunAcademy"
   git branch -M main
   git remote add origin https://github.com/your-username/sunacademy.git
   git push -u origin main
   ```
2. Log in to [vercel.com](https://vercel.com).
3. Click **"Add New..."** -> **"Project"**.
4. Select your `sunacademy` repository.
5. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Your application will be live in ~25 seconds!

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🌐 Connecting a Custom Domain

1. Open your project dashboard in **Vercel**.
2. Go to **Settings** -> **Domains**.
3. Type your custom domain (e.g. `sunacademy.dev` or `learn.yourdomain.com`).
4. Add the provided `CNAME` or `A` records to your DNS provider (e.g., Cloudflare, Namecheap, GoDaddy).
5. Vercel provisions a free automatic SSL/TLS certificate within minutes.

---

## 📱 Google Play Store Wrapper Guide

To publish sunAcademy to the Google Play Store as an Android app:

### Method 1: Using Capacitor (Recommended)
1. Install Capacitor dependencies:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init sunAcademy com.sunacademy.app --web-dir dist
   ```
2. Build the production web bundle:
   ```bash
   npm run build
   ```
3. Add the Android platform:
   ```bash
   npx cap add android
   npx cap sync
   ```
4. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```
5. In Android Studio, go to **Build** -> **Generate Signed Bundle / APK** -> Create your `.aab` (Android App Bundle) and upload to the Google Play Console!

### Method 2: Using Bubblewrap (TWA / Trusted Web Activity)
1. Install Bubblewrap:
   ```bash
   npm install -g @bubblewrap/cli
   ```
2. Initialize from your deployed Vercel URL:
   ```bash
   bubblewrap init --manifest https://your-app.vercel.app/manifest.json
   ```
3. Build the Google Play `.aab` package:
   ```bash
   bubblewrap build
   ```

---

## 💻 Local Development

1. Clone or extract the project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

To verify production build locally:
```bash
npm run build
```

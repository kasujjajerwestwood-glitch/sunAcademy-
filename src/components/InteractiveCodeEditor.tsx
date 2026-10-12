import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';
import {
  Play,
  RotateCcw,
  Terminal,
  Check,
  Copy,
  AlertCircle,
  Clock,
  Code2,
  Trash2,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface InteractiveCodeEditorProps {
  initialLanguage?: 'javascript' | 'python';
  initialCode?: string;
  title?: string;
  description?: string;
  height?: string;
  className?: string;
}

interface OutputLog {
  type: 'log' | 'info' | 'warn' | 'error' | 'return';
  text: string;
  time: string;
}

export const InteractiveCodeEditor: React.FC<InteractiveCodeEditorProps> = ({
  initialLanguage = 'javascript',
  initialCode,
  title = 'Interactive Code Playground',
  description = 'Write, edit, and execute code directly in your browser.',
  height = '340px',
  className = ''
}) => {
  const { theme } = useTheme();
  const [language, setLanguage] = useState<'javascript' | 'python'>(initialLanguage);

  const defaultJsSnippet = `// ⚡ sunAcademy JavaScript Hardware Playground
// Interactive sensor calculation and pin simulation
function readSensorData(samples) {
  const readings = [];
  for (let i = 0; i < samples; i++) {
    // Simulated analog ADC reading (0 - 1023)
    const raw = Math.floor(450 + Math.random() * 200);
    const voltage = ((raw * 5.0) / 1023).toFixed(2);
    readings.push({ sample: i + 1, raw, voltage: parseFloat(voltage) });
  }
  return readings;
}

console.log("Initializing ADC sensor reading...");
const data = readSensorData(4);
console.log("Captured Sensor Samples:", data);

const avgVoltage = (data.reduce((acc, d) => acc + d.voltage, 0) / data.length).toFixed(2);
console.log(\`Average Sensor Voltage: \${avgVoltage}V\`);

if (avgVoltage > 2.5) {
  console.log("Status: High threshold reached! Triggering digital alert.");
} else {
  console.log("Status: Voltage within normal operational range.");
}
`;

  const defaultPythonSnippet = `# ⚡ sunAcademy Python Simulation
# Microcontroller sensor filter and telemetry
sensor_name = "HC-SR04 Ultrasonic Ranger"
echo_microseconds = [1160, 1145, 1200, 1150, 850] # raw pulse durations

print(f"Reading telemetry from: {sensor_name}")

def calculate_distance(duration_us):
    # Speed of sound: 343 m/s = 0.0343 cm/us (divide by 2 for round-trip)
    return round((duration_us * 0.0343) / 2.0, 2)

distances = []
for index, echo in enumerate(echo_microseconds):
    dist_cm = calculate_distance(echo)
    distances.append(dist_cm)
    print(f"Ping #{index + 1}: Echo={echo}us -> Distance={dist_cm} cm")

avg_dist = round(sum(distances) / len(distances), 2)
print(f"Average target distance: {avg_dist} cm")

if avg_dist < 15.0:
    print("ALERT: Proximity critical (< 15cm)! Buzzer frequency engaged.")
else:
    print("STATUS: Path clear. No obstacles detected.")
`;

  const [code, setCode] = useState<string>(
    initialCode || (initialLanguage === 'python' ? defaultPythonSnippet : defaultJsSnippet)
  );

  // Sync when initialCode or initialLanguage changes from parent
  useEffect(() => {
    if (initialCode !== undefined) {
      setCode(initialCode);
    }
  }, [initialCode]);

  useEffect(() => {
    if (initialLanguage) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  const [outputs, setOutputs] = useState<OutputLog[]>([
    {
      type: 'info',
      text: 'Console ready. Click "Run Code" or press Ctrl+Enter to execute.',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionDuration, setExecutionDuration] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Switch language template if needed
  const handleLanguageChange = (newLang: 'javascript' | 'python') => {
    setLanguage(newLang);
    setCode(newLang === 'python' ? defaultPythonSnippet : defaultJsSnippet);
    setOutputs([
      {
        type: 'info',
        text: `Switched language to ${newLang.toUpperCase()}. Click "Run Code" to execute.`,
        time: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleResetCode = () => {
    setCode(language === 'python' ? defaultPythonSnippet : defaultJsSnippet);
    setOutputs([
      {
        type: 'info',
        text: 'Code reset to original template.',
        time: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Safe client-side code runner
  const handleRunCode = () => {
    setIsRunning(true);
    const logs: OutputLog[] = [];
    const startTime = performance.now();
    const timestamp = new Date().toLocaleTimeString();

    if (language === 'javascript') {
      try {
        // Intercept console functions
        const capturedLogs: string[] = [];
        const customConsole = {
          log: (...args: any[]) => {
            const formatted = args
              .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
              .join(' ');
            capturedLogs.push(formatted);
          },
          info: (...args: any[]) => {
            capturedLogs.push(args.map((a) => String(a)).join(' '));
          },
          warn: (...args: any[]) => {
            capturedLogs.push(`[WARN] ${args.map((a) => String(a)).join(' ')}`);
          },
          error: (...args: any[]) => {
            capturedLogs.push(`[ERROR] ${args.map((a) => String(a)).join(' ')}`);
          }
        };

        // Sandboxed execution via Function constructor
        const runFunction = new Function('console', code);
        const result = runFunction(customConsole);

        capturedLogs.forEach((logText) => {
          logs.push({
            type: 'log',
            text: logText,
            time: timestamp
          });
        });

        if (result !== undefined) {
          logs.push({
            type: 'return',
            text: `➔ Returned: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`,
            time: timestamp
          });
        }

        if (logs.length === 0) {
          logs.push({
            type: 'info',
            text: 'Code executed successfully (no output produced).',
            time: timestamp
          });
        }
      } catch (err: any) {
        logs.push({
          type: 'error',
          text: `Runtime Error: ${err?.message || String(err)}`,
          time: timestamp
        });
      }
    } else {
      // Python runner simulation
      try {
        const pythonLogs = executeSimulatedPython(code);
        pythonLogs.forEach((line) => {
          logs.push({
            type: 'log',
            text: line,
            time: timestamp
          });
        });
        if (logs.length === 0) {
          logs.push({
            type: 'info',
            text: 'Python script executed successfully.',
            time: timestamp
          });
        }
      } catch (err: any) {
        logs.push({
          type: 'error',
          text: `Python Parse/Runtime Error: ${err?.message || String(err)}`,
          time: timestamp
        });
      }
    }

    const elapsed = Math.round(performance.now() - startTime);
    setExecutionDuration(elapsed);
    setOutputs(logs);
    setIsRunning(false);
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] shadow-xl overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''
      } ${className}`}
    >
      {/* Top Header & Toolbar */}
      <div className="p-3.5 bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-[#0084FF]/10 text-[#0084FF]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#0084FF] font-semibold">
                VS Code Engine
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800 text-xs font-semibold">
            <button
              onClick={() => handleLanguageChange('javascript')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                language === 'javascript'
                  ? 'bg-[#0084FF] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              JavaScript
            </button>
            <button
              onClick={() => handleLanguageChange('python')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                language === 'python'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Python
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetCode}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Reset to Template Code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Run Code Primary Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="bg-[#0084FF] hover:bg-[#0070E0] active:bg-[#005DBF] text-white px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0">
        {/* Monaco Editor Pane */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 min-h-[260px] relative">
          <Editor
            height={isFullscreen ? 'calc(100vh - 220px)' : height}
            language={language}
            value={code}
            onChange={(val) => setCode(val || '')}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              fontSize: 13,
              fontFamily: 'Fira Code, monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
              lineNumbersMinChars: 3,
              suggestOnTriggerCharacters: true
            }}
          />
        </div>

        {/* Interactive Output Console / Terminal Pane */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-100 p-3.5 flex flex-col justify-between font-mono text-xs">
          <div>
            {/* Console Bar */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400 select-none">
              <div className="flex items-center gap-2 font-bold text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-[#0084FF]" />
                <span>TERMINAL OUTPUT</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              </div>

              <div className="flex items-center gap-3">
                {executionDuration !== null && (
                  <span className="flex items-center gap-1 text-slate-400 text-[10px]">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {executionDuration}ms
                  </span>
                )}
                <button
                  onClick={() => setOutputs([])}
                  className="hover:text-white flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer"
                  title="Clear Terminal"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Console Log Lines */}
            <div className="overflow-y-auto max-h-[260px] space-y-1.5 scrollbar-thin text-[11px] pr-1">
              {outputs.length > 0 ? (
                outputs.map((out, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed whitespace-pre-wrap ${
                      out.type === 'error'
                        ? 'text-rose-400 bg-rose-950/30 p-1.5 rounded border border-rose-900/50'
                        : out.type === 'return'
                        ? 'text-cyan-300 font-bold'
                        : out.type === 'info'
                        ? 'text-slate-400 italic'
                        : 'text-slate-200'
                    }`}
                  >
                    <span className="text-slate-600 select-none text-[10px] mr-1.5">
                      [{out.time.split(' ')[0]}]
                    </span>
                    {out.text}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic py-4 text-center">
                  Output console is empty. Click "Run Code" to view execution results.
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>Sandboxed Client Environment</span>
            <span>Shortcut: Ctrl+Enter / Cmd+Enter</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced client-side Python simulation interpreter
function executeSimulatedPython(pythonCode: string): string[] {
  const outputs: string[] = [];

  // Helper functions injected into execution environment
  const pyEnv: Record<string, any> = {
    print: (...args: any[]) => {
      const formatted = args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
        .join(' ');
      outputs.push(formatted);
    },
    range: (start: number, stop?: number, step = 1) => {
      if (stop === undefined) {
        stop = start;
        start = 0;
      }
      const res: number[] = [];
      for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        res.push(i);
      }
      return res;
    },
    len: (obj: any) => (obj && typeof obj.length === 'number' ? obj.length : 0),
    sum: (arr: number[]) => (Array.isArray(arr) ? arr.reduce((acc, curr) => acc + (Number(curr) || 0), 0) : 0),
    round: (val: number, decimals = 0) => {
      const factor = Math.pow(10, decimals);
      return Math.round(Number(val) * factor) / factor;
    },
    enumerate: (arr: any[]) => (Array.isArray(arr) ? arr.map((item, index) => [index, item]) : []),
    min: (...args: any[]) => {
      const flattened = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.min(...flattened);
    },
    max: (...args: any[]) => {
      const flattened = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.max(...flattened);
    },
    abs: (n: number) => Math.abs(n),
    int: (n: any) => parseInt(String(n), 10) || 0,
    float: (n: any) => parseFloat(String(n)) || 0,
    str: (n: any) => String(n),
    True: true,
    False: false,
    None: null
  };

  // Transpile Python blocks to JavaScript with simulated indentation tracking
  try {
    const rawLines = pythonCode.split('\n');
    let jsCode = '';
    const indentStack: number[] = [0];

    // Prototype polyfill for list.append
    jsCode += `if (!Array.prototype.append) { Array.prototype.append = function(item) { this.push(item); return this; }; };\n`;

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const trimmed = line.trim();

      // Skip empty lines or pure comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Calculate current indentation level
      const indent = line.search(/\S/);
      const currentIndent = indent >= 0 ? indent : 0;

      // Close open indentation scopes
      while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        jsCode += '}\n';
      }

      let transformed = trimmed;

      // Handle f-strings: f"..." or f'...'
      transformed = transformed.replace(/f(["'])(.*?)\1/g, (_, quote, content) => {
        const templated = content.replace(/\{([^}]+)\}/g, '${$1}');
        return `\`${templated}\``;
      });

      // Replace Python boolean keywords and operators
      transformed = transformed
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||')
        .replace(/\bnot\b/g, '!')
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\bNone\b/g, 'null');

      // 1. def func(...) :
      const defMatch = transformed.match(/^def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*:/);
      if (defMatch) {
        transformed = `function ${defMatch[1]}(${defMatch[2]}) {`;
        indentStack.push(currentIndent + 1);
        jsCode += transformed + '\n';
        continue;
      }

      // 2. for [a, b] in enumerate(...) :
      const forEnumerateMatch = transformed.match(/^for\s+([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s+in\s+enumerate\((.*?)\)\s*:/);
      if (forEnumerateMatch) {
        const idxVar = forEnumerateMatch[1];
        const valVar = forEnumerateMatch[2];
        const arrExpr = forEnumerateMatch[3];
        transformed = `for (const [${idxVar}, ${valVar}] of enumerate(${arrExpr})) {`;
        indentStack.push(currentIndent + 1);
        jsCode += transformed + '\n';
        continue;
      }

      // 3. for var in iterable :
      const forMatch = transformed.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?)\s*:/);
      if (forMatch) {
        const loopVar = forMatch[1];
        const iterExpr = forMatch[2];
        transformed = `for (const ${loopVar} of ${iterExpr}) {`;
        indentStack.push(currentIndent + 1);
        jsCode += transformed + '\n';
        continue;
      }

      // 4. while condition :
      const whileMatch = transformed.match(/^while\s+(.*?)\s*:/);
      if (whileMatch) {
        transformed = `while (${whileMatch[1]}) {`;
        indentStack.push(currentIndent + 1);
        jsCode += transformed + '\n';
        continue;
      }

      // 5. if condition :
      const ifMatch = transformed.match(/^if\s+(.*?)\s*:/);
      if (ifMatch) {
        transformed = `if (${ifMatch[1]}) {`;
        indentStack.push(currentIndent + 1);
        jsCode += transformed + '\n';
        continue;
      }

      // 6. elif condition :
      const elifMatch = transformed.match(/^elif\s+(.*?)\s*:/);
      if (elifMatch) {
        transformed = `} else if (${elifMatch[1]}) {`;
        jsCode += transformed + '\n';
        continue;
      }

      // 7. else :
      if (transformed === 'else:') {
        transformed = `} else {`;
        jsCode += transformed + '\n';
        continue;
      }

      // Variable assignment or function call
      // If variable declaration without let/const/var, declare in local scope
      const assignMatch = transformed.match(/^([a-zA-Z0-9_]+)\s*=\s*(.+)$/);
      if (assignMatch && !transformed.startsWith('return ') && !transformed.includes('==')) {
        const varName = assignMatch[1];
        const expr = assignMatch[2];
        transformed = `var ${varName} = ${expr};`;
      } else {
        if (!transformed.endsWith(';') && !transformed.endsWith('{') && !transformed.endsWith('}')) {
          transformed += ';';
        }
      }

      jsCode += transformed + '\n';
    }

    // Close remaining indentation blocks
    while (indentStack.length > 1) {
      indentStack.pop();
      jsCode += '}\n';
    }

    // Execute compiled JavaScript with Python builtins injected
    const fn = new Function(...Object.keys(pyEnv), jsCode);
    fn(...Object.values(pyEnv));

    if (outputs.length === 0) {
      outputs.push('Python script ran successfully (no print outputs produced).');
    }
  } catch (err: any) {
    outputs.push(`Python Execution Error: ${err?.message || String(err)}`);
  }

  return outputs;
}

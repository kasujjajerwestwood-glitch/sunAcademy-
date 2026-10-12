import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'cpp',
  title,
  showLineNumbers = true,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div
      className={`rounded-2xl overflow-hidden border border-slate-800 bg-[#070A0F] shadow-xl text-sm font-mono ${className}`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-300 font-medium tracking-wide">
            {title || `${language.toUpperCase()} Source`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto text-slate-200 text-xs sm:text-sm leading-relaxed">
        <pre className="grid">
          {lines.map((line, index) => (
            <div key={index} className="table-row group hover:bg-slate-800/30">
              {showLineNumbers && (
                <span className="table-cell pr-4 text-right select-none text-slate-400 group-hover:text-slate-400 w-8 text-xs">
                  {index + 1}
                </span>
              )}
              <span className="table-cell whitespace-pre">
                {/* Basic syntax highlight tinting based on keywords */}
                {formatCodeLine(line)}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

// Subtle syntax highlighting helper for fast, dependency-free rendering
function formatCodeLine(line: string): React.ReactNode {
  if (line.trim().startsWith('//') || line.trim().startsWith('#') && !line.includes('<')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }
  if (line.includes('/*') || line.includes('*/') || line.trim().startsWith('*')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }

  // Highlight comments at end of line
  const commentIndex = line.indexOf('//');
  if (commentIndex !== -1) {
    const codePart = line.substring(0, commentIndex);
    const commentPart = line.substring(commentIndex);
    return (
      <>
        <span>{codePart}</span>
        <span className="text-slate-500 italic">{commentPart}</span>
      </>
    );
  }

  return <span>{line}</span>;
}

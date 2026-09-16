'use client';

import React from 'react';
import { Shield, FileSpreadsheet, Terminal, Crosshair, Sun } from 'lucide-react';

interface GovTechNavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenConsole: () => void;
  onOpenDossier: () => void;
  themeMode?: 'oled' | 'judicial';
  onToggleTheme?: (mode: 'oled' | 'judicial') => void;
}

export const GovTechNavbar: React.FC<GovTechNavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenConsole,
  onOpenDossier,
  themeMode = 'judicial',
  onToggleTheme,
}) => {
  const navLinks = [
    { id: 'console', label: 'Investigation Console', isConsoleAction: true },
    { id: 'entities', label: 'Entity Extraction', href: '#capabilities' },
    { id: 'patterns', label: 'Pattern Radar', href: '#showcase' },
    { id: 'legal', label: 'Legal Dossier', href: '#compliance' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0A0F1D]/95 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-colors duration-100 ease-linear">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Minimalist GovTech Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded border border-slate-300 dark:border-slate-700 bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold tracking-tight text-slate-900 dark:text-slate-100">
              CHAKRAVYUH-OS
            </span>
            <span className="text-slate-300 dark:text-slate-600 font-mono text-xs">//</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium hidden md:inline">
              Law Enforcement Intelligence & Syndicate Graph System
            </span>
          </div>
          {/* Subtle green live telemetry dot */}
          <div className="hidden sm:flex items-center space-x-1.5 pl-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
              LIVE TELEMETRY
            </span>
          </div>
        </div>

        {/* Center: Clean Pill Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/90 dark:bg-[#0F1626] p-1 rounded-full border border-slate-200/80 dark:border-slate-800 text-xs font-medium">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.isConsoleAction) {
                  onOpenConsole();
                } else {
                  onSelectTab(item.id);
                  if (item.href) {
                    const el = document.querySelector(item.href);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className={`px-3 py-1.5 rounded-full transition-all duration-100 ease-linear ${
                activeTab === item.id
                  ? 'bg-slate-900 dark:bg-slate-800 text-white dark:text-cyan-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right: Actions & Tactical Lighting Switch */}
        <div className="flex items-center space-x-2.5">
          {/* Tactical Environmental Lighting Switch (OLED Tactical vs Judicial Light) */}
          {onToggleTheme && (
            <div className="border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/80 p-0.5 rounded flex items-center gap-0.5 font-mono text-[11px] select-none transition-colors duration-100 ease-linear">
              <button
                type="button"
                onClick={() => onToggleTheme('oled')}
                className={`px-2 py-1 rounded flex items-center space-x-1.5 transition-colors duration-100 ease-linear ${
                  themeMode === 'oled'
                    ? 'bg-slate-900 dark:bg-slate-800 text-cyan-400 font-bold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Switch to Tactical Dark OLED Mode"
              >
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span>OLED TACTICAL</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleTheme('judicial')}
                className={`px-2 py-1 rounded flex items-center space-x-1.5 transition-colors duration-100 ease-linear ${
                  themeMode === 'judicial'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Switch to Judicial Light Paper Mode"
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>JUDICIAL LIGHT</span>
              </button>
            </div>
          )}

          <button
            onClick={onOpenConsole}
            className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-xs font-mono font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0F1626] hover:bg-slate-50 dark:hover:bg-[#141D30] hover:border-slate-400 dark:hover:border-slate-600 transition-colors duration-100 ease-linear shadow-xs"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-500 dark:text-cyan-400" />
            <span>&gt;_ Console</span>
          </button>

          <button
            onClick={onOpenDossier}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white text-xs font-mono font-medium transition-all duration-100 ease-linear shadow-sm hover:shadow active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
            <span className="whitespace-nowrap">Export BNSS Dossier</span>
          </button>
        </div>
      </div>
    </header>
  );
};

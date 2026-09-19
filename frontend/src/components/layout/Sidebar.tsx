'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Globe, 
  FolderOpen, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Key, 
  LogOut, 
  Terminal, 
  Activity, 
  Radio
} from 'lucide-react';
import { NavigationTab } from '../NavigationHeader';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  patternsCount: number;
  evidenceCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAuditDock?: () => void;
  isTourActive?: boolean;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  isPulse?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  patternsCount,
  evidenceCount,
  isCollapsed,
  onToggleCollapse,
  onOpenAuditDock,
  isTourActive = false,
}) => {
  const { user, isSuperAdmin, logout } = useAuth();

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      shortLabel: 'Ovrvw',
      icon: LayoutDashboard,
    },
    {
      id: 'network',
      label: 'Network Workbench',
      shortLabel: 'Network',
      icon: Network,
    },
    {
      id: 'patterns',
      label: 'Patterns Radar',
      shortLabel: 'Patterns',
      icon: AlertTriangle,
      badge: patternsCount,
    },
    {
      id: 'timeline',
      label: 'Timeline Analysis',
      shortLabel: 'Timeline',
      icon: Clock,
    },
    {
      id: 'evidence',
      label: 'Evidence Vault',
      shortLabel: 'Evidence',
      icon: FileText,
      badge: evidenceCount,
    },
    {
      id: 'socmint',
      label: 'SOCMINT OSINT',
      shortLabel: 'SOCMINT',
      icon: Globe,
      badge: 'LIVE',
      isPulse: true,
    },
    {
      id: 'investigations',
      label: 'My Investigations',
      shortLabel: 'Cases',
      icon: FolderOpen,
      badge: 2,
    },
  ];

  return (
    <aside
      className={`relative h-full bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out z-40 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* 1. Header & Emblem Branding */}
      <div>
        <div className="h-14 px-3 flex items-center justify-between border-b border-slate-800/90 bg-slate-950">
          {!isCollapsed ? (
            <div 
              onClick={() => onSelectTab('overview')}
              className="flex items-center space-x-2.5 cursor-pointer overflow-hidden group"
            >
              <div className="w-8 h-8 rounded-[2px] bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs shrink-0">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono font-bold text-xs tracking-wider text-white group-hover:text-blue-400 transition-colors">
                    CHAKRAVYUH
                  </span>
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-900 text-slate-300 border border-slate-700 rounded-[2px] font-semibold">
                    OS
                  </span>
                </div>
                <div className="text-[9.5px] font-mono text-slate-400 truncate tracking-tight">
                  STF DIRECTIVE PS 13
                </div>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => onSelectTab('overview')}
              className="w-full flex justify-center cursor-pointer"
              title="CHAKRAVYUH OS // STF PS 13"
            >
              <div className="w-8 h-8 rounded-[2px] bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs shrink-0">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          )}

          {/* Collapse Toggle Button */}
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-[2px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed Toggle Bar */}
        {isCollapsed && (
          <div className="flex justify-center py-2 border-b border-slate-800/60">
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-[2px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Navigation Items List */}
        <div className="p-2 space-y-1">
          {!isCollapsed && (
            <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Intelligence Operations
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isTourSpotlight = isTourActive && isActive;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? `${item.label} ${item.badge ? `(${item.badge})` : ''}` : undefined}
                className={`group w-full flex items-center transition-all relative ${
                  isCollapsed ? 'justify-center p-2.5 rounded-[2px]' : 'px-3 py-2 space-x-3'
                } ${
                  isTourSpotlight
                    ? 'bg-slate-900 text-cyan-200 font-medium border-l-2 border-cyan-400 rounded-none ring-2 ring-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : isActive
                    ? 'bg-slate-900 text-slate-100 font-medium border-l-2 border-blue-500 rounded-none'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent rounded-[2px]'
                }`}
              >
                <Icon
                  className={`shrink-0 transition-colors ${
                    isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                  } ${
                    isTourSpotlight
                      ? 'text-cyan-400 animate-pulse'
                      : isActive
                      ? 'text-blue-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="text-xs truncate tracking-tight font-sans">
                      {item.label}
                    </span>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] font-bold flex items-center space-x-1 ${
                          item.isPulse
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : isActive
                            ? 'bg-slate-800 text-slate-200 border border-slate-700'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {item.isPulse && (
                          <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-400 mr-1 inline-block" />
                        )}
                        <span>{item.badge}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Collapsed dot badge */}
                {isCollapsed && item.badge !== undefined && (
                  <span
                    className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-[1px] ${
                      item.isPulse
                        ? 'bg-emerald-400'
                        : 'bg-blue-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Footer: Super Admin Audit Dock & Officer Badge */}
      <div className="p-2 border-t border-slate-800/90 bg-slate-950 space-y-2">
        {/* Super Admin Audit Dock Trigger (Strictly visible ONLY when user role is 'Super Admin') */}
        {isSuperAdmin && onOpenAuditDock && (
          <button
            onClick={onOpenAuditDock}
            title={isCollapsed ? 'Super Admin Audit Dock' : undefined}
            className={`w-full flex items-center rounded-[2px] border transition-all text-left ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 space-x-2.5'
            } bg-amber-950/30 hover:bg-amber-900/40 border-amber-800/60 text-amber-300 group`}
          >
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-200 tracking-wider">
                    AUDIT DOCK
                  </span>
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-amber-950 text-amber-300 border border-amber-700/50 rounded-[2px]">
                    SUPER ADMIN
                  </span>
                </div>
                <div className="text-[10px] text-amber-400/80 font-mono truncate">
                  Live Telemetry Stream
                </div>
              </div>
            )}
          </button>
        )}

        {/* Officer Status / Session Info */}
        {!isCollapsed ? (
          <div className="p-2 rounded-[2px] bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 min-w-0">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-500" />
                <span className="text-[11px] font-mono text-slate-200 font-bold truncate">
                  {user?.badgeNumber || 'STF-OFFICER'}
                </span>
              </div>
              <button
                onClick={logout}
                title="Disconnect Session"
                className="text-slate-400 hover:text-rose-400 transition-colors p-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[9.5px] font-mono text-slate-400 truncate">
                {user?.name || 'Authorized Officer'}
              </span>
              <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded-[2px] bg-slate-950 text-slate-300 border border-slate-700">
                {user?.role || 'Analyst'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 py-1">
            <div 
              className="w-1.5 h-1.5 rounded-[1px] bg-emerald-500" 
              title={`Logged in as ${user?.name || 'Officer'} (${user?.role || 'Analyst'})`}
            />
            <button
              onClick={logout}
              title="Disconnect Session"
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors rounded-[2px] hover:bg-slate-900"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

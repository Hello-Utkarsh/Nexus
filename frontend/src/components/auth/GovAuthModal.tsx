'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  KeyRound, 
  Lock, 
  ChevronRight, 
  BadgeCheck, 
  AlertOctagon, 
  Building2, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  User, 
  Eye, 
  EyeOff,
  Radio
} from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';

interface GovAuthModalProps {
  isOpen?: boolean;
}

export const GovAuthModal: React.FC<GovAuthModalProps> = ({ isOpen = true }) => {
  const { login, quickLogin } = useAuth();

  const [serviceId, setServiceId] = useState('STF-VNS-4491');
  const [passkey, setPasskey] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Analyst/IO');
  const [showPasskey, setShowPasskey] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId.trim()) {
      setAuthError('Service ID or Officer Badge Number is mandatory.');
      return;
    }
    setAuthError(null);
    setIsAuthenticating(true);

    // Simulate GovTech cryptographic challenge-response
    setTimeout(async () => {
      await login(serviceId, selectedRole, passkey);
      setIsAuthenticating(false);
    }, 450);
  };

  const handleQuickDemo = (role: 'Analyst/IO' | 'Super Admin') => {
    setIsAuthenticating(true);
    setTimeout(() => {
      quickLogin(role);
      setIsAuthenticating(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md overflow-y-auto p-4 sm:p-6 font-sans">
      {/* Background Watermark & Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-slate-700" />
      
      {/* Case Directive Watermark overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 overflow-hidden select-none opacity-[0.03] text-white">
        <div className="text-4xl sm:text-6xl font-black font-mono tracking-widest uppercase rotate-[-12deg] transform translate-y-12">
          CRIME BRANCH & STF DIRECTIVE PS 13 COMPLIANT
        </div>
        <div className="text-4xl sm:text-6xl font-black font-mono tracking-widest uppercase rotate-[-12deg] transform translate-x-24 -translate-y-12">
          SECTION 63 BSA SECURE WORKSPACE // CONFIDENTIAL
        </div>
      </div>

      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-[2px] shadow-2xl overflow-hidden z-10 my-auto">
        {/* UX4G Official Portal Header Stripe */}
        <div className="h-[2px] w-full bg-gradient-to-r from-amber-500 via-slate-200 to-emerald-500 opacity-85" />

        {/* Top GovTech Security Bar */}
        <div className="bg-slate-950 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-500" />
            <span className="text-slate-300 font-semibold tracking-wider">CHAKRAVYUH-OS v2.4</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 hidden sm:inline text-[11px]">CENTRAL LAW ENFORCEMENT INTELLIGENCE GATEWAY</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-amber-300 font-medium bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded-[2px]">
            <Radio className="w-3 h-3 text-amber-400" />
            <span>DIRECTIVE PS 13 COMPLIANT</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header & Official Emblem Representation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-start space-x-4">
              {/* Emblem Placeholder */}
              <div className="relative w-14 h-14 rounded-[2px] bg-slate-950 border border-amber-600/70 flex items-center justify-center p-2 shrink-0 group">
                {/* Ashoka / Police Lion Emblem SVG Graphic */}
                <svg viewBox="0 0 48 48" className="w-full h-full text-amber-400" fill="currentColor">
                  <path d="M24 4L12 9v13c0 9 5.2 17.5 12 21 6.8-3.5 12-12 12-21V9L24 4z" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M24 10l6 3v7c0 4.5-2.6 8.7-6 10.5-3.4-1.8-6-6-6-10.5v-7l6-3z" fill="currentColor" fillOpacity="0.3" />
                  <circle cx="24" cy="22" r="3" fill="currentColor" />
                  <line x1="24" y1="16" x2="24" y2="28" stroke="currentColor" strokeWidth="2" />
                  <line x1="18" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="absolute -bottom-1 text-[8px] font-bold bg-amber-500 text-slate-950 px-1 rounded-[1px] uppercase tracking-tighter">
                  STF • IO
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                    CHAKRAVYUH <span className="text-blue-400 font-mono text-base font-normal">DE-ANONYMIZATION OS</span>
                  </h1>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Crime Branch & Special Task Force Inter-State Criminal Syndicate Network Analysis
                </p>
                <div className="flex items-center space-x-2 mt-2 text-[11px] font-mono text-slate-400">
                  <span className="bg-slate-800 px-2 py-0.5 rounded-[2px] text-slate-300 border border-slate-700">MHA DIRECTIVE</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400">SEC 63 BSA COMPLIANT</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">CLASSIFIED</span>
                </div>
              </div>
            </div>

            {/* Tactical Status Pill */}
            <div className="bg-slate-950 border border-slate-800 rounded-[2px] p-3 text-right hidden sm:block shrink-0 min-w-[160px]">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Active Operation</div>
              <div className="text-xs font-mono font-bold text-blue-400 mt-0.5">PURVANCHAL-NET // KASHI</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">FIR #382/2026 Assi Ghat</div>
            </div>
          </div>

          {/* Legal Compliance & Agency Mandate Section */}
          <div className="bg-slate-950 border border-slate-800 rounded-[2px] p-4 relative overflow-hidden">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-amber-300 tracking-wide font-mono uppercase text-[11px] flex items-center justify-between">
                  <span>Section 63 Bharatiya Sakshya Adhiniyam (BSA), 2023 Admissibility Mandate</span>
                  <span className="text-slate-500 font-normal normal-case hidden md:inline">Electronic Record Admissibility</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11.5px]">
                  All network extractions, CDR correlations, Hawala sub-graph queries, and de-anonymized entity links generated in this workspace maintain cryptographic chain-of-custody. Access is monitored and logged under STF Directive PS 13 and Bharatiya Nyaya Sanhita (BNS) Section 111 (Organized Crime).
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Access (For Evaluators & Testing) */}
          <div className="bg-slate-950 border border-slate-800 rounded-[2px] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <BadgeCheck className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-200 tracking-wide font-mono uppercase">
                  Evaluator Quick Demo Access (1-Click Bypass)
                </span>
              </div>
              <span className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded-[2px] border border-slate-700">
                PRE-AUTHENTICATED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickDemo('Analyst/IO')}
                disabled={isAuthenticating}
                className="flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-[2px] transition-colors text-left group"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-blue-300 flex items-center space-x-1.5">
                    <span>Quick Demo Access (Analyst)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Inspector R. K. Singh • UP STF Hawala Cell
                  </div>
                </div>
                <div className="px-1.5 py-0.5 rounded-[2px] text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                  Analyst/IO
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('Super Admin')}
                disabled={isAuthenticating}
                className="flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-[2px] transition-colors text-left group"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-amber-300 flex items-center space-x-1.5">
                    <span>Quick Demo Access (Super Admin)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    DIG Vikramaditya Sen, IPS • STF Directorate
                  </div>
                </div>
                <div className="px-1.5 py-0.5 rounded-[2px] text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800">
                  Super Admin
                </div>
              </button>
            </div>
          </div>

          {/* Tactical Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>Officer Credential Verification</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">GOV-ID TOKEN DISPATCH</span>
            </div>

            {authError && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-[2px] text-rose-300 text-xs font-mono flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Service ID / Badge */}
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Service / Badge No.
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    placeholder="e.g. STF-VNS-4491"
                    className="w-full bg-slate-950 border border-slate-700 rounded-[2px] pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-hidden focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Passkey */}
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Security Passkey
                </label>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPasskey ? 'text' : 'password'}
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter passkey"
                    className="w-full bg-slate-950 border border-slate-700 rounded-[2px] pl-9 pr-9 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-hidden focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasskey(!showPasskey)}
                    className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPasskey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Role Dropdown */}
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Assigned Clearance Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-[2px] px-3 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                >
                  <option value="Analyst/IO">Analyst / IO (Investigating Officer)</option>
                  <option value="Admin">Admin (Supervisory SP / Cell Lead)</option>
                  <option value="Super Admin">Super Admin (STF Directorate / Central)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full mt-2 py-2.5 px-4 bg-blue-700 hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors border border-blue-600 flex items-center justify-center space-x-2"
            >
              {isAuthenticating ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-white" />
                  <span>VERIFYING SECTION 63 DIGITAL SIGNATURE...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-blue-200" />
                  <span>AUTHENTICATE & ENTER CHAKRAVYUH SECURE WORKSPACE</span>
                </>
              )}
            </button>
          </form>

          {/* Disclaimer Banner */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-[2px] px-3.5 py-2.5 flex items-start space-x-2.5 text-amber-300/90 text-xs">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed font-sans">
              <span className="font-bold font-mono uppercase text-amber-300">RESTRICTED LAW ENFORCEMENT ACCESS:</span>{' '}
              Demonstration build with sanitized synthetic dataset. Unauthorized access, exfiltration of telemetry, or tampering with audit logs is punishable under Section 43 & 66 of the Information Technology Act and Section 111 BNS.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import {
  Shield, MapPin, ChevronDown, ArrowRight, Lock, User, Eye, EyeOff,
  Zap, ChevronUp, UserCheck, Users, Building2, ClipboardList, Map,
} from 'lucide-react';

function getAppUrl(app: 'officer' | 'portal' | 'citizen' | 'admin'): string {
  const urls: Record<string, string | undefined> = {
    officer: process.env.NEXT_PUBLIC_OFFICER_URL,
    portal: process.env.NEXT_PUBLIC_PORTAL_URL,
    citizen: process.env.NEXT_PUBLIC_CITIZEN_URL,
    admin: process.env.NEXT_PUBLIC_ADMIN_URL,
  };
  if (urls[app]) return urls[app]!;
  const ports = { officer: 3000, portal: 3001, citizen: 3002, admin: 3003 };
  return `http://localhost:${ports[app]}`;
}

const OFFICER_ROLES = [
  { id: 'tehsildar',     label: 'Revenue Officer', dept: 'Revenue Department',       icon: ClipboardList, color: '#1a2e4a', demoName: 'Rajesh Kumar' },
  { id: 'sub-registrar', label: 'Sub-Registrar',  dept: 'Registration Department',  icon: Building2,     color: '#7C3AED', demoName: 'Priya Sharma' },
  { id: 'town-planner',  label: 'Town Planner',   dept: 'Town & Country Planning',  icon: Map,           color: '#0F766E', demoName: 'Arvind Mehta' },
  { id: 'surveyor',      label: 'Surveyor',        dept: 'Survey & Settlement',      icon: MapPin,        color: '#B45309', demoName: 'Sunita Patel' },
  { id: 'collector',     label: 'Dist. Collector', dept: 'District Administration', icon: Shield,        color: '#B91C1C', demoName: 'IAS Anand Rao' },
];

const OFFICER_ROLES_FULL = [
  { id: 'tehsildar',     label: 'Revenue Officer — Land Records',       dept: 'Revenue Department'       },
  { id: 'sub-registrar', label: 'Sub-Registrar — Registration & Deeds', dept: 'Registration Department'  },
  { id: 'town-planner',  label: 'Town Planner — Planning & Zoning',     dept: 'Town & Country Planning'  },
  { id: 'surveyor',      label: 'Surveyor — Cadastral Survey',          dept: 'Survey & Settlement'      },
  { id: 'collector',     label: 'District Collector — Executive',        dept: 'District Administration' },
];

export default function LoginPage() {
  const [activeTab, setActiveTab]     = useState<'officer' | 'citizen'>('officer');
  const [username, setUsername]       = useState('');
  const [password, setPassword]       = useState('');
  const [selectedRole, setSelectedRole] = useState('tehsildar');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [aadhaar, setAadhaar]         = useState('');
  const [demoOpen, setDemoOpen]       = useState(false);

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const preselectedRole = params?.get('role');
  React.useEffect(() => {
    if (preselectedRole && OFFICER_ROLES_FULL.some(r => r.id === preselectedRole)) {
      setSelectedRole(preselectedRole);
    }
  }, [preselectedRole]);

  // Normal officer login (existing behaviour)
  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('bl-auth', JSON.stringify({
        role: selectedRole,
        name: username || 'Officer',
        authenticated: true,
        demo: false,
        timestamp: Date.now(),
      }));
      window.location.href = `${getAppUrl('officer')}?role=${selectedRole}`;
    }, 600);
  };

  // One-click demo login for a specific role
  const handleDemoLogin = (roleId: string, demoName: string) => {
    setLoadingRole(roleId);
    setTimeout(() => {
      sessionStorage.setItem('bl-auth', JSON.stringify({
        role: roleId,
        name: demoName,
        authenticated: true,
        demo: true,
        timestamp: Date.now(),
      }));
      window.location.href = `${getAppUrl('officer')}?role=${roleId}&demo=1`;
    }, 400);
  };

  // Demo citizen login
  const handleDemoCitizenLogin = () => {
    setLoadingRole('citizen');
    setTimeout(() => {
      sessionStorage.setItem('bl-citizen-auth', JSON.stringify({
        aadhaar: '1234 5678 9012',
        name: 'Ramesh Gupta',
        authenticated: true,
        demo: true,
        timestamp: Date.now(),
      }));
      window.location.href = `${getAppUrl('citizen')}?demo=1`;
    }, 400);
  };

  const handleCitizenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaar.replace(/\s/g, '').length !== 12) return;
    setLoading(true);
    setTimeout(() => {
      window.location.href = getAppUrl('citizen');
    }, 600);
  };

  const formatAadhaar = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
      {/* Tricolor strip */}
      <div className="flex h-[3px] flex-shrink-0">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#128807]" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-3">

          {/* ── DEMO MODE BANNER ── */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Header row */}
            <button
              type="button"
              onClick={() => setDemoOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-100/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[13px] font-semibold text-amber-800">
                  Quick Access — Select Role
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                  SIH 2026
                </span>
              </div>
              {demoOpen
                ? <ChevronUp className="w-4 h-4 text-amber-600" />
                : <ChevronDown className="w-4 h-4 text-amber-600" />
              }
            </button>

            {/* Expandable role grid */}
            {demoOpen && (
              <div className="px-4 pb-4 space-y-3">
                <p className="text-[11px] text-amber-700">
                  One-click access — no credentials needed. For demo & evaluation only.
                </p>

                {/* Officer role buttons */}
                <div>
                  <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-2">
                    Government Officers
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {OFFICER_ROLES.map((role) => {
                      const Icon = role.icon;
                      const isLoading = loadingRole === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          disabled={loadingRole !== null}
                          onClick={() => handleDemoLogin(role.id, role.demoName)}
                          className="flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-gray-50 disabled:opacity-60 border border-gray-200 rounded-xl transition-all text-left group"
                        >
                          <div
                            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: `${role.color}15`, border: `1px solid ${role.color}30` }}
                          >
                            {isLoading
                              ? <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                              : <Icon className="w-4 h-4" style={{ color: role.color }} />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-gray-800 leading-tight">{role.label}</p>
                            <p className="text-[10px] text-gray-400">{role.dept}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Citizen button */}
                <div>
                  <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-2">
                    Citizen Portal
                  </p>
                  <button
                    type="button"
                    disabled={loadingRole !== null}
                    onClick={handleDemoCitizenLogin}
                    className="w-full flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-gray-50 disabled:opacity-60 border border-gray-200 rounded-xl transition-all text-left group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 bg-teal-50 border border-teal-100">
                      {loadingRole === 'citizen'
                        ? <div className="w-4 h-4 border-2 border-gray-300 border-t-teal-600 rounded-full animate-spin" />
                        : <Users className="w-4 h-4 text-teal-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-800 leading-tight">Citizen — Land Owner</p>
                      <p className="text-[10px] text-gray-400">Aadhaar: 1234 5678 9012 (demo)</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── DIVIDER ── */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] text-gray-400 font-medium">or sign in with credentials</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ── NORMAL LOGIN CARD ── */}
          <div>
            {/* Logo & Ministry */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a2e4a] to-[#2a4a6e] shadow-lg mb-2">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-[#1a2e4a] tracking-tight">Bharat Lives</h1>
              <p className="text-[10px] text-gray-500 mt-0.5">
                Ministry of Rural Development · Department of Land Resources
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(26,46,74,0.1)] border border-gray-100 overflow-hidden">
              {/* Tab toggle */}
              <div className="flex border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('officer')}
                  className={`flex-1 py-3 text-[13px] font-semibold transition-colors ${
                    activeTab === 'officer'
                      ? 'text-[#1a2e4a] border-b-2 border-[#1a2e4a] bg-[#f8fafc]'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Government Officer
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('citizen')}
                  className={`flex-1 py-3 text-[13px] font-semibold transition-colors ${
                    activeTab === 'citizen'
                      ? 'text-[#0F766E] border-b-2 border-[#0F766E] bg-[#f8fafc]'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Citizen
                </button>
              </div>

              {/* Officer form */}
              {activeTab === 'officer' && (
                <form onSubmit={handleOfficerLogin} className="p-6 space-y-4">
                  {/* Role selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
                      Designation
                    </label>
                    <div className="relative">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full appearance-none bg-[#f8fafc] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-[#1a2e4a] font-medium focus:outline-none focus:border-[#1a2e4a] focus:ring-1 focus:ring-[#1a2e4a]/20 pr-8"
                      >
                        {OFFICER_ROLES_FULL.map((role) => (
                          <option key={role.id} value={role.id}>{role.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {OFFICER_ROLES_FULL.find(r => r.id === selectedRole)?.dept}
                    </p>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
                      Officer ID
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Officer ID or email"
                        className="w-full bg-[#f8fafc] border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-[13px] text-[#1a2e4a] placeholder-gray-400 focus:outline-none focus:border-[#1a2e4a] focus:ring-1 focus:ring-[#1a2e4a]/20"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-[#f8fafc] border border-gray-200 rounded-lg pl-10 pr-10 py-2.5 text-[13px] text-[#1a2e4a] placeholder-gray-400 focus:outline-none focus:border-[#1a2e4a] focus:ring-1 focus:ring-[#1a2e4a]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Sign in button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1a2e4a] hover:bg-[#243d5e] disabled:bg-[#1a2e4a]/60 text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-gray-400">
                    Authentication via Keycloak OIDC · Role-Based Access Control
                  </p>
                </form>
              )}

              {/* Citizen form */}
              {activeTab === 'citizen' && (
                <form onSubmit={handleCitizenLogin} className="p-6 space-y-4">
                  <div className="text-center mb-2">
                    <p className="text-sm text-gray-600">
                      Verify your identity with Aadhaar e-KYC
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(formatAadhaar(e.target.value))}
                      placeholder="XXXX XXXX XXXX"
                      maxLength={14}
                      className="w-full bg-[#f8fafc] border border-gray-200 rounded-lg px-3 py-2.5 text-[15px] text-center tracking-[0.2em] font-mono text-[#1a2e4a] placeholder-gray-400 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20"
                    />
                    <p className="text-[10px] text-gray-400 mt-1 text-center">
                      For demo: enter any 12 digits
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || aadhaar.replace(/\s/g, '').length !== 12}
                    className="w-full bg-[#0F766E] hover:bg-[#0d6b63] disabled:bg-gray-300 text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Verify with Aadhaar
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-gray-400">
                    UIDAI Aadhaar e-KYC · OTP Verification
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center gap-4 text-[11px]">
            <Link href="/portal" className="text-[#1a2e4a]/60 hover:text-[#1a2e4a] transition-colors">
              Browse roles without signing in
            </Link>
            <span className="text-gray-300">·</span>
            <Link href="/" className="text-[#1a2e4a]/60 hover:text-[#1a2e4a] transition-colors">
              Back to home
            </Link>
          </div>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
            <Shield className="w-3 h-3" />
            Protected by Keycloak OIDC · SHA-256 Audit Chain
          </div>
        </div>
      </div>
    </div>
  );
}

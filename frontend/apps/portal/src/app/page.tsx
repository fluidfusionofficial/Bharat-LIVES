'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  MapPin, Search, FileText, Shield, Eye, AlertCircle,
  BarChart3, ChevronRight, ArrowRight, Layers, Globe, Lock,
} from 'lucide-react';

function getAppUrl(app: 'officer' | 'portal' | 'citizen' | 'admin'): string {
  const ports = { officer: 3000, portal: 3001, citizen: 3002, admin: 3003 };
  const envKey = `NEXT_PUBLIC_${app.toUpperCase()}_URL`;
  try {
    const val = (globalThis as any).process?.env?.[envKey];
    if (val) return val;
  } catch {}
  return `http://localhost:${ports[app]}`;
}

const STATS = [
  { value: '15M+', label: 'Parcels Digitised', sub: 'Across 6 pilot states' },
  { value: '6', label: 'States Onboarded', sub: 'Expanding nationally' },
  { value: '99.2%', label: 'SLA Compliance', sub: 'Citizen service delivery' },
  { value: '18', label: 'Microservices', sub: 'Integrated platform' },
];

const QUICK_SERVICES = [
  { icon: Search,      label: 'Search Land Records',       labelHi: 'भूमि अभिलेख खोज',      desc: 'Search by ULPIN, survey number, owner or location',       href: () => getAppUrl('citizen'),                      color: '#17375E', bg: '#EEF3FB' },
  { icon: FileText,    label: 'RoR / Patta Extract',        labelHi: 'अधिकार अभिलेख',          desc: 'Download certified Record of Rights with Aadhaar e-KYC',  href: () => getAppUrl('citizen'),                      color: '#128807', bg: '#E8F5E9' },
  { icon: Shield,      label: 'Encumbrance Certificate',    labelHi: 'भार प्रमाण पत्र',         desc: 'Instant EC — check mortgage, litigation & dues status',    href: () => getAppUrl('citizen'),                      color: '#7C3AED', bg: '#EDE9FE' },
  { icon: Eye,         label: 'Who Accessed My Land',       labelHi: 'मेरी भूमि किसने देखी',   desc: 'Transparent audit log of officer & bank enquiries',        href: () => getAppUrl('citizen'),                      color: '#0369A1', bg: '#E0F2FE' },
  { icon: MapPin,      label: 'Cadastral Map Viewer',       labelHi: 'भूकर मानचित्र',           desc: 'Interactive GIS map with parcel boundaries & layers',      href: () => `${getAppUrl('officer')}?role=tehsildar`,  color: '#B45309', bg: '#FEF3C7' },
  { icon: AlertCircle, label: 'Track Application Status',   labelHi: 'आवेदन स्थिति',            desc: 'Real-time mutation, partition & service request tracking', href: () => getAppUrl('citizen'),                      color: '#DC2626', bg: '#FEE2E2' },
];

const NEWS = [
  { date: 'Sep 2026', tag: 'Policy Update', title: 'DoLR Extends ULPIN Coverage to 8 More States', body: 'The Department of Land Resources has announced the extension of the Unique Land Parcel Identification Number (ULPIN) roll-out to Rajasthan, Gujarat, Odisha, and five other states.' },
  { date: 'Aug 2026', tag: 'System Update', title: 'Satellite-based Encroachment Detection Now Live', body: 'Sentinel-2 satellite imagery integration with automatic NDVI/NDBI change-detection alerts is now active for all pilot districts under the Bharat Lives platform.' },
  { date: 'Jul 2026', tag: 'Milestone', title: '15 Million Parcels Successfully Digitised', body: 'The Bharat Lives Land Stack platform has crossed the 15 million parcel milestone, with 99.2% SLA compliance on citizen service requests across the six pilot states.' },
];

export default function HomePage() {
  const citizenUrl = getAppUrl('citizen');
  const officerUrl = getAppUrl('officer');

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#17375E] via-[#1d4a7a] to-[#0f2540] text-white">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-7xl mx-auto px-6 py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white/70 text-xs font-medium">SIH 2026 · PS-26014 · Ministry of Rural Development</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
              India's Integrated<br />
              <span className="text-[#FF9933]">Land Records</span> &amp; GIS Platform
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl">
              Bharat Lives — Land Stack is a unified, GIS-based Digital Public Infrastructure for transparent, fraud-resistant land governance across India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={citizenUrl}
                className="inline-flex items-center gap-2 bg-[#FF9933] hover:bg-[#e08820] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
              >
                Citizen Services <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
              >
                Browse All Services <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium px-3 py-2.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" /> Officer / Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#17375E]">{s.value}</div>
              <div className="text-xs font-semibold text-[#16212E] mt-0.5">{s.label}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What is Land Stack ── */}
      <section className="bg-[#f8fafc] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#FF9933] mb-3">About the Platform</div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17375E] leading-snug">
              What is<br />Land Stack?
            </h2>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              Land Stack is the technology backbone of Bharat Lives — an inter-silo data-sharing platform that unifies four pillars of land truth: <strong>Cadastre</strong> (Survey Dept), <strong>Registration</strong> (SRO/NGDRS), <strong>Revenue RoR</strong> (State NIC), and <strong>Master Plan</strong> (Town Planning).
            </p>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Built on OGC-compliant vector tiles, ULPIN-linked parcel identities, and a cryptographic audit ledger — Land Stack ensures every citizen and officer sees a single, authoritative version of land truth.
            </p>
            <Link href="/about" className="inline-flex items-center gap-1.5 mt-5 text-[#17375E] text-sm font-semibold hover:underline">
              Learn more about the platform <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {/* 3-layer visual */}
          <div className="space-y-3">
            {[
              { icon: Globe,  label: 'Geospatial Layer',    desc: 'OGC Vector Tiles · ULPIN · Cadastral GIS · Satellite Watch',   color: '#0369A1', bg: '#E0F2FE' },
              { icon: Layers, label: 'Inter-Silo Truth Engine', desc: 'Cadastre + SRO Deeds + Revenue RoR + Town Planning — reconciled', color: '#17375E', bg: '#EEF3FB' },
              { icon: Lock,   label: 'Audit & Trust Layer', desc: 'Hash-chain ledger · Keycloak OIDC · Citizen audit log',        color: '#128807', bg: '#E8F5E9' },
            ].map(({ icon: Icon, label, desc, color, bg }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#16212E]">{label}</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Citizen Quick Services ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-7">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#FF9933] mb-1">For Citizens</div>
              <h2 className="text-xl font-serif font-bold text-[#17375E]">Citizen Quick Services</h2>
            </div>
            <Link href="/services" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#17375E] hover:underline">
              All services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <a
                  key={svc.label}
                  href={svc.href()}
                  className="group bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-5 space-y-3 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: svc.bg }}>
                      <Icon className="w-5 h-5" style={{ color: svc.color }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#16212E] group-hover:text-[#17375E] transition-colors">{svc.label}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{svc.labelHi}</div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{svc.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-bold" style={{ color: svc.color }}>
                    Access <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── News & Updates ── */}
      <section className="bg-[#f8fafc] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-7">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#FF9933] mb-1">Latest</div>
              <h2 className="text-xl font-serif font-bold text-[#17375E]">News &amp; Updates</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {NEWS.map((n) => (
              <div key={n.title} className="bg-white border border-gray-200 rounded-xl p-5 space-y-2 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#17375E] bg-[#EEF3FB] px-2 py-0.5 rounded-full">{n.tag}</span>
                  <span className="text-[10px] text-gray-400">{n.date}</span>
                </div>
                <div className="text-sm font-bold text-[#16212E] leading-snug">{n.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Access Portal CTA ── */}
      <section className="bg-[#17375E] text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-serif font-bold">Access the Officer &amp; Admin Portal</h2>
            <p className="text-sm text-white/60 mt-1">For Revenue Officers, Sub-Registrars, Town Planners, Surveyors, and Collectors.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 bg-[#FF9933] hover:bg-[#e08820] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Access Portal <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

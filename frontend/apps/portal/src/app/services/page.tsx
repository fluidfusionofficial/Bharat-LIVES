'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search, FileText, Shield, Eye, AlertCircle, BarChart3,
  MapPin, Clock, ChevronRight, Download, ClipboardList,
  Zap, Home, ShoppingCart, ArrowLeftRight, Scale, Layers,
} from 'lucide-react';

function getAppUrl(app: 'officer' | 'citizen'): string {
  const ports = { officer: 3000, citizen: 3002 };
  const envKey = `NEXT_PUBLIC_${app.toUpperCase()}_URL`;
  try { const v = (globalThis as any).process?.env?.[envKey]; if (v) return v; } catch {}
  return `http://localhost:${ports[app]}`;
}

const ALL_SERVICES = [
  // Land Records
  { id: 'ror',    name: 'Record of Rights (RoR)',           nameHi: 'अधिकार अभिलेख',         desc: 'Download certified RoR/Patta for your land parcel.',          time: 'Instant', free: true,  category: 'Land Records', icon: FileText,     href: () => getAppUrl('citizen'), intents: ['find', 'buy'] },
  { id: 'jamab',  name: 'Jamabandi / Khatoni Copy',         nameHi: 'जमाबंदी / खतौनी',       desc: 'Download revenue record of agricultural land holdings.',      time: 'Instant', free: true,  category: 'Land Records', icon: FileText,     href: () => getAppUrl('citizen'), intents: ['find', 'inherit'] },
  { id: 'parcel', name: 'Parcel Map Extract',               nameHi: 'भूखंड नक्शा',           desc: 'Download cadastral boundary map for a survey number.',         time: 'Instant', free: true,  category: 'Land Records', icon: MapPin,       href: () => getAppUrl('citizen'), intents: ['find', 'buy'] },
  // Ownership
  { id: 'ec',     name: 'Encumbrance Certificate (EC)',     nameHi: 'भार प्रमाण पत्र',       desc: 'Check mortgage, litigation, and outstanding dues on land.',   time: 'Instant', free: true,  category: 'Ownership',    icon: Shield,       href: () => getAppUrl('citizen'), intents: ['buy', 'sell', 'loan'] },
  { id: 'own',    name: 'Ownership Verification',           nameHi: 'स्वामित्व जांच',         desc: 'Verify legal ownership by ULPIN or survey number.',           time: 'Instant', free: true,  category: 'Ownership',    icon: Shield,       href: () => getAppUrl('citizen'), intents: ['buy', 'find'] },
  { id: 'title',  name: 'Title Clarity Report (13-Year)',   nameHi: 'शीर्षक रिपोर्ट',        desc: '13-year deed chain and encumbrance report.',                  time: '2–5 days', free: false, category: 'Ownership',    icon: ClipboardList, href: () => getAppUrl('citizen'), intents: ['buy', 'sell'] },
  // Mutations
  { id: 'mut',    name: 'Mutation Application',             nameHi: 'दाखिल-खारिज आवेदन',    desc: 'Apply for title transfer in Revenue Records after deed.',      time: '15 days',  free: false, category: 'Mutations',    icon: ArrowLeftRight, href: () => getAppUrl('citizen'), intents: ['sell', 'transfer', 'inherit'] },
  { id: 'part',   name: 'Partition Request',                nameHi: 'बंटवारा अनुरोध',        desc: 'Apply for physical partition of jointly held land.',           time: '21 days',  free: false, category: 'Mutations',    icon: ArrowLeftRight, href: () => getAppUrl('citizen'), intents: ['inherit', 'transfer'] },
  { id: 'track',  name: 'Track Application Status',         nameHi: 'आवेदन स्थिति',          desc: 'Check status of pending mutation or partition request.',       time: 'Real-time', free: true, category: 'Mutations',    icon: AlertCircle,  href: () => getAppUrl('citizen'), intents: ['transfer'] },
  // Transparency
  { id: 'audit',  name: 'Who Accessed My Land',             nameHi: 'मेरी भूमि को किसने देखा', desc: 'Transparent audit of all officer and bank enquiries.',        time: 'Instant', free: true,  category: 'Transparency', icon: Eye,          href: () => getAppUrl('citizen'), intents: ['dispute', 'find'] },
  { id: 'txn',    name: 'Transaction History',              nameHi: 'लेनदेन इतिहास',         desc: 'Complete registered deed history and stamp duty records.',    time: 'Instant', free: true,  category: 'Transparency', icon: Eye,          href: () => getAppUrl('citizen'), intents: ['buy', 'find'] },
  { id: 'disp',   name: 'Dispute Status Check',             nameHi: 'विवाद स्थिति',          desc: 'Check court orders, stay orders, or revenue disputes.',        time: 'Instant', free: true,  category: 'Transparency', icon: Scale,        href: () => getAppUrl('citizen'), intents: ['buy', 'dispute'] },
  // Maps & GIS
  { id: 'cad',    name: 'Cadastral Map Viewer',             nameHi: 'भूकर मानचित्र',         desc: 'Interactive map with parcel boundaries, utilities & zoning.', time: 'Instant', free: true,  category: 'Maps & GIS',   icon: Layers,       href: () => `${getAppUrl('officer')}?role=tehsildar`, intents: ['find', 'buy'] },
  { id: 'zone',   name: 'Land Use & Zoning Map',            nameHi: 'भूमि उपयोग नक्शा',      desc: 'Master Plan zone, FSI, and restriction overlays.',            time: 'Instant', free: true,  category: 'Maps & GIS',   icon: BarChart3,    href: () => `${getAppUrl('officer')}?role=town-planner`, intents: ['buy', 'build'] },
  { id: 'sat',    name: 'Satellite View',                   nameHi: 'उपग्रह दृश्य',          desc: 'Sentinel-2 imagery and change detection alerts.',             time: 'Instant', free: true,  category: 'Maps & GIS',   icon: MapPin,       href: () => `${getAppUrl('officer')}?role=surveyor`, intents: ['find'] },
];

const INTENTS = [
  { id: 'all',      label: 'All Services',      icon: Layers },
  { id: 'find',     label: 'Find the Property', icon: Search },
  { id: 'buy',      label: 'Buying a Property', icon: ShoppingCart },
  { id: 'sell',     label: 'Selling a Property', icon: Home },
  { id: 'transfer', label: 'Transfer / Mutation', icon: ArrowLeftRight },
  { id: 'inherit',  label: 'Family & Inheritance', icon: FileText },
  { id: 'loan',     label: 'Raising a Loan',     icon: Shield },
  { id: 'dispute',  label: 'Dispute / Wrong Entry', icon: Scale },
  { id: 'build',    label: 'Building on It',     icon: BarChart3 },
];

export default function ServicesPage() {
  const [query, setQuery] = React.useState('');
  const [intent, setIntent] = React.useState('all');

  const filtered = React.useMemo(() => {
    let list = ALL_SERVICES;
    if (intent !== 'all') list = list.filter(s => s.intents.includes(intent));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.nameHi.includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, intent]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-[#1a2e4a] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-sm font-semibold text-[#1a2e4a]">Services</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search documents, services and tools…"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#1a2e4a] focus:bg-white transition-all"
              />
            </div>
            <span className="text-sm text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Intent filter pills */}
        <div className="max-w-5xl mx-auto px-6 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {INTENTS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setIntent(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  intent === id
                    ? 'bg-[#1a2e4a] text-white border-[#1a2e4a]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service Grid */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No services match your search. Try a different intent or keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((svc) => {
              const Icon = svc.icon;
              return (
                <a
                  key={svc.id}
                  href={typeof svc.href === 'function' ? svc.href() : svc.href}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-[#1a2e4a]/40 hover:shadow-md transition-all p-4 flex flex-col gap-3"
                >
                  {/* Top: icon + badges */}
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#f0f4f8] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#1a2e4a]" />
                    </div>
                    <div className="flex gap-1">
                      {svc.free && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">FREE</span>
                      )}
                      <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" />
                        {svc.time === 'Instant' ? 'Instant' : svc.time}
                      </span>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <div className="text-sm font-bold text-[#1a2e4a] leading-snug group-hover:text-[#0f1b2e] transition-colors">{svc.name}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{svc.nameHi}</div>
                  </div>

                  {/* Desc */}
                  <p className="text-xs text-gray-500 leading-relaxed flex-1">{svc.desc}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                    <span className="text-[10px] text-gray-400 font-medium">{svc.category}</span>
                    <span className="text-xs font-bold text-[#1a2e4a] flex items-center gap-1">
                      Access <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

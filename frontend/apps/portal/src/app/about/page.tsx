'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ChevronRight, MapPin, Layers, Database, Cpu, Shield,
  Network, Zap, GitBranch, CheckCircle2, Building2, Globe,
} from 'lucide-react';

const TIMELINE = [
  { date: '31 Dec 2025', event: 'Pilot Launch', detail: 'Chandigarh (Urban Estate) & Tamil Nadu (Rural Records)', done: true },
  { date: 'Apr 2026', event: 'Phase 2 Onboarding', detail: 'Karnataka (Bhoomi) & Maharashtra (MahaBhulekh) integrated', done: true },
  { date: '2026–27', event: 'National Expansion', detail: 'One city + one village in every State & Union Territory', done: false },
  { date: '2027+', event: 'Full Coverage', detail: 'Nationwide coverage across all districts and tehsils', done: false },
];

const PILOT_STATES = [
  { code: 'TN', name: 'Tamil Nadu', system: 'Tamil Nilam Rural Records', parcels: '4.28M', status: 'ACTIVE', score: 98.4, districts: 38 },
  { code: 'CH', name: 'Chandigarh', system: 'Estate Office & MCL Urban', parcels: '840K', status: 'ACTIVE', score: 97.8, districts: 1 },
  { code: 'KA', name: 'Karnataka', system: 'Bhoomi RTC System', parcels: '3.65M', status: 'ACTIVE', score: 96.2, districts: 30 },
  { code: 'MH', name: 'Maharashtra', system: 'MahaBhulekh', parcels: '5.12M', status: 'ACTIVE', score: 94.7, districts: 36 },
  { code: 'UP', name: 'Uttar Pradesh', system: 'Bhulekh UP', parcels: '1.45M', status: 'ONBOARDING', score: 88.5, districts: 75 },
  { code: 'MP', name: 'Madhya Pradesh', system: 'MP Bhulekh', parcels: '420K', status: 'PENDING', score: 82.0, districts: 55 },
];

const TECH_STACK = [
  { layer: 'Frontend', items: ['Next.js 14 (React)', 'TypeScript', 'Tailwind CSS', 'Turborepo Monorepo', 'Leaflet / MapLibre GL'] },
  { layer: 'Backend Microservices', items: ['FastAPI (Python)', 'PostGIS + PostgreSQL', 'Redis Cache', 'Apache Kafka', 'NGINX API Gateway'] },
  { layer: 'GIS & Spatial', items: ['OGC WFS/WMS', 'GeoServer', 'TopoJSON', 'Sentinel-2 Imagery', 'GDAL/OGR'] },
  { layer: 'AI/ML', items: ['Satellite Change Detection', 'Trust-Graph Fraud Engine', 'NL Query Interface', 'Predictive Mutation Analytics', 'Boundary Conflict Resolver'] },
  { layer: 'Security & Auth', items: ['Keycloak OIDC', 'RBAC (7 roles)', 'Immutable Audit Hash-Chain', 'E2E Encryption', 'DPDPA Compliant'] },
  { layer: 'Infrastructure', items: ['Kubernetes (K8s)', 'Docker Containers', 'NIC Cloud / On-prem', 'Horizontal Auto-scaling', '18 Microservices'] },
];

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-[#f8fafc] border-b border-gray-200 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-gray-500 flex items-center gap-1.5 mb-4">
            <Link href="/" className="hover:text-[#17375E] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#17375E] font-semibold">About the Initiative</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17375E]">
            About Bharat Lives — Land Stack
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-3xl">
            Integrated GIS-Based Digital Public Infrastructure for Land Governance — initiated by the
            Department of Land Resources (DoLR), Ministry of Rural Development, Government of India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-14">

        {/* Background */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#17375E] flex items-center gap-3">
              <span className="w-1 h-6 bg-[#FF9933] rounded-full" />
              Background & Problem
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Land governance in India involves multiple institutions maintaining land-related
              information in <strong className="text-[#17375E]">fragmented and disconnected systems</strong>.
              Core datasets such as cadastral maps, Record of Rights (RoR), registration records, land
              use information, Master Plans, building permissions, property taxation records, and utility
              infrastructure are managed independently by different departments with limited interoperability.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              This results in duplication of effort, inconsistencies in records, delays in obtaining
              ownership information, lack of transparency in transactions, and inconvenience to citizens
              seeking land-related services.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              One of the major challenges in India is that <strong className="text-[#17375E]">land is a State subject</strong>,
              resulting in significant diversity in land administration systems across states — variations
              in record formats, database structures, units of measurement, language, and administrative workflows.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#17375E] flex items-center gap-3">
              <span className="w-1 h-6 bg-[#128807] rounded-full" />
              The Land Stack Solution
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-[#17375E]">Bharat Lives (Land Stack)</strong> is envisaged as an integrated
              GIS-based digital platform that brings together all land-related datasets, workflows, and services into
              a single interoperable framework. Built upon georeferenced cadastral maps and linked with Record of Rights,
              Land Stack serves as foundational digital infrastructure for:
            </p>
            <ul className="space-y-2">
              {[
                'Efficient land governance and administration',
                'Informed decision-making by officials and citizens',
                'Improved, transparent service delivery',
                'Cross-departmental data interoperability',
                'AI/ML-driven analytics and fraud detection',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-[#128807] flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Deployment Timeline */}
        <section>
          <h2 className="text-xl font-serif font-bold text-[#17375E] flex items-center gap-3 mb-6">
            <span className="w-1 h-6 bg-[#FF9933] rounded-full" />
            Deployment Timeline
          </h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-6 pl-12">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[34px] w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done ? 'bg-[#128807] border-[#128807]' : 'bg-white border-gray-300'}`}>
                    {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className={`bg-white border rounded-lg p-4 ${item.done ? 'border-[#128807]/30' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.done ? 'bg-[#128807]/10 text-[#128807]' : 'bg-gray-100 text-gray-500'}`}>
                        {item.date}
                      </span>
                      {item.done && <span className="text-[10px] font-bold text-[#128807]">✓ COMPLETED</span>}
                    </div>
                    <div className="text-sm font-bold text-[#17375E]">{item.event}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pilot States */}
        <section>
          <h2 className="text-xl font-serif font-bold text-[#17375E] flex items-center gap-3 mb-6">
            <span className="w-1 h-6 bg-[#FF9933] rounded-full" />
            Active Pilot States & UTs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PILOT_STATES.map((state) => (
              <div key={state.code} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-serif font-bold text-[#17375E]">{state.code}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${state.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : state.status === 'ONBOARDING' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                    {state.status}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#16212E]">{state.name}</div>
                  <div className="text-xs text-gray-400">{state.system}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-400">Parcels:</span> <span className="font-serif font-bold text-[#16212E]">{state.parcels}</span></div>
                  <div><span className="text-gray-400">Districts:</span> <span className="font-serif font-bold text-[#16212E]">{state.districts}</span></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">OGC Conformance</span>
                    <span className="font-bold text-[#128807]">{state.score}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#17375E] to-[#128807] rounded-full" style={{ width: `${state.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <h2 className="text-xl font-serif font-bold text-[#17375E] flex items-center gap-3 mb-6">
            <span className="w-1 h-6 bg-[#FF9933] rounded-full" />
            Technology Architecture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_STACK.map((tier) => (
              <div key={tier.layer} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="text-xs font-bold text-[#17375E] uppercase tracking-wider border-b border-gray-100 pb-2">{tier.layer}</div>
                <ul className="space-y-1.5">
                  {tier.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="w-1 h-1 bg-[#FF9933] rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance */}
        <section className="bg-[#f8fafc] border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-serif font-bold text-[#17375E] mb-4">Standards & Compliance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {['OGC WFS/WMS', 'ISO 19115', 'BNDR Metadata', 'WCAG 2.1 AA', 'DPDPA 2023', 'NIC Security Framework'].map((std) => (
              <div key={std} className="bg-white border border-gray-200 rounded p-2 text-center text-xs font-semibold text-[#17375E] flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#128807] flex-shrink-0" />
                {std}
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}

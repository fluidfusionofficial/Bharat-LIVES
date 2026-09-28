'use client';

import * as React from 'react';
import {
  Users, ShieldCheck, Scale, Map, BarChart3, Globe,
  ArrowRight, Settings, ChevronRight,
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

const roles = [
  {
    id: 'citizen',
    title: 'Citizen',
    titleHi: 'नागरिक',
    subtitle: 'Land Owner / General Public',
    description: 'Search land records, verify ownership, download RoR extracts, track mutation applications, and view who accessed your parcel data.',
    icon: Users,
    color: '#0F766E',
    bgColor: '#E6F6F4',
    href: getAppUrl('citizen'),
    tags: ['Parcel Lookup', 'RoR Download', 'Access Audit'],
    toolCount: 5,
    features: ['ULPIN / Survey search', 'My Registered Parcels', 'Who Accessed My Land', 'Mutation Application', 'EC Download'],
    border: 'border-l-4 border-[#0F766E]',
  },
  {
    id: 'tehsildar',
    title: 'Revenue Officer',
    titleHi: 'तहसीलदार',
    subtitle: 'Revenue Officer',
    description: 'View mutation casework, RoR records, inspect spatial overlaps, and monitor trust scores — all from cross-verified state department data.',
    icon: Scale,
    color: '#17375E',
    bgColor: '#EEF3FB',
    href: `/login?role=tehsildar`,
    tags: ['Mutations', 'Revenue Records', 'Trust & Fraud'],
    toolCount: 10,
    features: ['Revenue Casework Register', 'Mutation Queue', 'Cadastral GIS Map', 'Entity Resolution', 'Trust Score Engine'],
    border: 'border-l-4 border-[#17375E]',
  },
  {
    id: 'sub-registrar',
    title: 'Sub-Registrar',
    titleHi: 'उप-पंजीयक',
    subtitle: 'Registration & Deeds Officer',
    description: 'View registered deeds, encumbrance certificates, stamp duty calculations, and flag suspicious transfers.',
    icon: ShieldCheck,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    href: `/login?role=sub-registrar`,
    tags: ['Deeds & EC', 'Stamp Duty', 'Fraud Flags'],
    toolCount: 7,
    features: ['Deed Register (SRO)', 'Encumbrance Certificate', 'Stamp Duty Calculator', 'Duplicate Deed Check', 'Suspicious Alerts'],
    border: 'border-l-4 border-[#7C3AED]',
  },
  {
    id: 'town-planner',
    title: 'Town Planner',
    titleHi: 'नगर नियोजक',
    subtitle: 'Planning & Zoning Officer',
    description: 'Inspect zoning compliance, review building permits, manage restriction zones, and map municipal Property IDs to ULPINs.',
    icon: Map,
    color: '#B45309',
    bgColor: '#FEF3C7',
    href: `/login?role=town-planner`,
    tags: ['Zoning', 'Building Permits', 'Tax Linkage'],
    toolCount: 8,
    features: ['Zoning Compliance', 'Building Permit Review', 'Land Use Trends', 'Restriction Zones', 'Property Tax Linkage'],
    border: 'border-l-4 border-[#B45309]',
  },
  {
    id: 'surveyor',
    title: 'Surveyor',
    titleHi: 'सर्वेक्षक',
    subtitle: 'Cadastral Survey Officer',
    description: 'Resolve topology conflicts, validate parcel boundaries, detect encroachments via satellite imagery, and manage field demarcation.',
    icon: Globe,
    color: '#0369A1',
    bgColor: '#E0F2FE',
    href: `/login?role=surveyor`,
    tags: ['Topology', 'Demarcation', 'Satellite Watch'],
    toolCount: 7,
    features: ['Topology Conflict Resolver', 'Cadastral GIS Map', 'Sentinel-2 Watch', 'Dynamic Partitioning', 'DGPS Measurement'],
    border: 'border-l-4 border-[#0369A1]',
  },
  {
    id: 'collector',
    title: 'District Collector',
    titleHi: 'जिला कलेक्टर',
    subtitle: 'Executive & Policy Analytics',
    description: 'District-wide GIS heatmaps, KPIs, cross-department conflict summaries, scheme coverage, and land conversion trends.',
    icon: BarChart3,
    color: '#17375E',
    bgColor: '#E2ECF5',
    href: `/login?role=collector`,
    tags: ['Analytics', 'Heatmaps', 'All Departments'],
    toolCount: 14,
    features: ['Executive Analytics', 'District Heatmap', 'All Officer Tools', 'Cross-Dept Conflicts', 'Scheme Coverage'],
    border: 'border-l-4 border-[#17375E]',
  },
  {
    id: 'admin',
    title: 'Platform Admin',
    titleHi: 'प्लेटफ़ॉर्म व्यवस्थापक',
    subtitle: 'State / System Administrator',
    description: 'State onboarding, schema field mappings, service health monitoring, NL query console, and audit hash-chain verification.',
    icon: Settings,
    color: '#4A5B6E',
    bgColor: '#F1F4F8',
    href: getAppUrl('admin'),
    tags: ['State Onboarding', 'Schema Mappings', 'Service Health'],
    toolCount: 5,
    features: ['National Overview', 'State Onboarding', 'Schema Mapping Editor', 'NL Query Explorer', 'Services Health'],
    border: 'border-l-4 border-[#4A5B6E]',
  },
];

export default function PortalPage() {
  return (
    <>
      {/* Page Banner */}
      <div className="bg-[#f8fafc] border-b border-gray-200 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 flex items-center gap-1.5 mb-4">
            <a href="/" className="hover:text-[#17375E] transition-colors">Home</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#17375E] font-semibold">Portal Access</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17375E]">
            Select Your Role · <span className="text-[#FF9933]">अपनी भूमिका चुनें</span>
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            Each role provides a tailored view of the same underlying land records. Select your
            designation below to access the tools, dashboards, and data relevant to your responsibilities.
          </p>
        </div>
      </div>

      {/* Role Grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Citizen – Full width card at top */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-gray-300" /> Citizen Access · नागरिक पहुंच
          </h2>
          {roles.filter((r) => r.id === 'citizen').map((role) => {
            const Icon = role.icon;
            return (
              <a
                key={role.id}
                href={role.href}
                className="group block bg-white border border-gray-200 hover:border-[#0F766E] rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-16 flex-shrink-0 flex items-stretch">
                    <div className="w-full sm:w-2 rounded-t sm:rounded-t-none sm:rounded-l-lg" style={{ backgroundColor: role.color }} />
                    <div className="hidden sm:flex w-14 items-center justify-center" style={{ backgroundColor: role.bgColor }}>
                      <Icon className="w-7 h-7" style={{ color: role.color }} />
                    </div>
                  </div>
                  <div className="flex-1 p-5 flex flex-col sm:flex-row gap-4 items-start">
                    <div className="sm:hidden w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: role.bgColor }}>
                      <Icon className="w-5 h-5" style={{ color: role.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-[#16212E]">{role.title}</span>
                        <span className="text-sm text-gray-400">·</span>
                        <span className="text-sm font-medium text-gray-400">{role.titleHi}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: role.bgColor, color: role.color }}>
                          {role.toolCount} tools
                        </span>
                      </div>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: role.color }}>{role.subtitle}</p>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{role.description}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-1 sm:w-40">
                      {role.features.slice(0, 4).map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: role.color }} />
                          {f}
                        </div>
                      ))}
                    </div>
                    <div
                      className="flex-shrink-0 flex items-center gap-2 font-bold text-white text-xs px-5 py-2.5 rounded transition-all group-hover:opacity-90 self-center"
                      style={{ backgroundColor: role.color }}
                    >
                      Enter Portal
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Officer / Government roles */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-gray-300" /> Government Officials · सरकारी अधिकारी
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.filter((r) => r.id !== 'citizen').map((role) => {
              const Icon = role.icon;
              return (
                <a
                  key={role.id}
                  href={role.href}
                  className="group bg-white border border-gray-200 hover:border-opacity-80 rounded-lg overflow-hidden hover:shadow-md transition-all"
                  style={{ ['--hover-color' as string]: role.color }}
                >
                  {/* Colored top border */}
                  <div className="h-1" style={{ backgroundColor: role.color }} />

                  <div className="p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: role.bgColor }}>
                        <Icon className="w-5 h-5" style={{ color: role.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-[#16212E]">{role.title}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: role.bgColor, color: role.color }}>
                            {role.toolCount} tools
                          </span>
                        </div>
                        <div className="text-[10px] font-medium mt-0.5" style={{ color: role.color }}>{role.subtitle}</div>
                        <div className="text-[10px] text-gray-400">{role.titleHi}</div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">{role.description}</p>

                    <div className="space-y-1 pt-1">
                      {role.features.slice(0, 3).map((f) => (
                        <div key={f} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: role.color }} />
                          {f}
                        </div>
                      ))}
                      {role.features.length > 3 && (
                        <div className="text-[10px] font-semibold" style={{ color: role.color }}>+{role.features.length - 3} more</div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {role.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: role.bgColor, color: role.color }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold" style={{ color: role.color }}>
                        Enter <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Security note */}
        <div className="mt-8 bg-[#f8fafc] border border-gray-200 rounded-lg p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#128807] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            <strong className="text-[#17375E]">Secure Access:</strong> All portals are protected by Keycloak OIDC
            authentication. Officer-level portals require valid government credentials. Citizen services
            use Aadhaar e-KYC verification. All access is logged in an immutable audit chain.
          </p>
        </div>
      </div>
    </>
  );
}

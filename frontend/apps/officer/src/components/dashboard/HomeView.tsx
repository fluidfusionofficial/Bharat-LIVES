'use client';

import React from 'react';
import {
  Map, MapPin, FileSpreadsheet, FileCheck2, Building2, Layers,
  ShieldAlert, Satellite, GitBranch, Search, BarChart3, Scale,
  ArrowRight, Clock, CheckCircle2, AlertTriangle, Globe, Users,
  Eye, Zap, Database, TrendingUp, ChevronRight, Landmark, Compass,
  MessageCircle, X,
} from 'lucide-react';
import { useRole, OfficerNavTab } from '@/context/RoleContext';
import { useFreshness } from '@/context/FreshnessContext';
import { ReconciliationCockpit } from './ReconciliationCockpit';
import { CadastralMap, type LayerState, type ParcelData, PARCEL_DATA } from './CadastralMap';
import { PARCEL_GEOJSON } from '../../data/cadastral-data';

// ── Interfaces ────────────────────────────────────────────────────────────────

interface QuickAction {
  tab: OfficerNavTab;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  tab: OfficerNavTab;
}

interface RecentItem {
  id: string;
  title: string;
  sub: string;
  time: string;
  status: 'ok' | 'warning' | 'critical';
  dept: string;
}

// ── Role-based helpers ────────────────────────────────────────────────────────

function getQuickActions(role: string): QuickAction[] {
  const common: QuickAction[] = [
    { tab: 'parcels', label: 'Search Parcels', description: 'Look up any parcel by ULPIN, survey number, or owner name', icon: Search, color: '#14548C', bgColor: '#E2ECF5' },
    { tab: 'cadastral', label: 'Cadastral Map', description: 'Open the Three-Tier GIS engine with satellite imagery', icon: Map, color: '#0F766E', bgColor: '#E6F6F4' },
  ];
  switch (role) {
    case 'tehsildar': return [
      { tab: 'revenue', label: 'Revenue Casework', description: 'View mutation register, RoR records, and pattadar transfers', icon: FileSpreadsheet, color: '#14548C', bgColor: '#E2ECF5' },
      { tab: 'queue', label: 'Casework Queue', description: 'Review pending identity matches, mutations, and conflicts', icon: Clock, color: '#B8720B', bgColor: '#FDF1E0' },
      ...common,
      { tab: 'trust', label: 'Trust & Fraud', description: 'Inspect anomaly scores and circular chain detection', icon: ShieldAlert, color: '#A32E2E', bgColor: '#FDEAEA' },
      { tab: 'workflows', label: 'Workflows', description: 'Launch cross-departmental workflow simulations', icon: GitBranch, color: '#1E7B4D', bgColor: '#E7F6EC' },
    ];
    case 'sub-registrar': return [
      { tab: 'registration', label: 'Deeds & EC', description: 'View registered deeds, encumbrance certificates, and stamp duty calculator', icon: FileCheck2, color: '#7C3AED', bgColor: '#EDE9FE' },
      { tab: 'queue', label: 'Casework Queue', description: 'Review pending identity matches and deed verification', icon: Clock, color: '#B8720B', bgColor: '#FDF1E0' },
      ...common,
      { tab: 'trust', label: 'Suspicious Transfers', description: 'Flag and review suspicious transfer patterns', icon: ShieldAlert, color: '#A32E2E', bgColor: '#FDEAEA' },
      { tab: 'workflows', label: 'Workflows', description: 'Launch encumbrance locking and mutation workflows', icon: GitBranch, color: '#1E7B4D', bgColor: '#E7F6EC' },
    ];
    case 'town-planner': return [
      { tab: 'planning', label: 'Planning & Zoning', description: 'Zoning compliance, building permits, and property tax linkage', icon: Building2, color: '#B45309', bgColor: '#FEF3C7' },
      ...common,
      { tab: 'spatial', label: 'Spatial Analysis', description: 'Topology conflicts, boundary overlaps, and restriction zones', icon: Layers, color: '#0369A1', bgColor: '#E0F2FE' },
      { tab: 'satellite', label: 'Satellite Watch', description: 'Sentinel-2 unauthorized conversion detection', icon: Satellite, color: '#A32E2E', bgColor: '#FDEAEA' },
      { tab: 'workflows', label: 'Workflows', description: 'Launch violation detection workflow simulations', icon: GitBranch, color: '#1E7B4D', bgColor: '#E7F6EC' },
    ];
    case 'surveyor': return [
      { tab: 'spatial', label: 'Topology Conflicts', description: 'Resolve overlaps, gaps, slivers in cadastral boundaries', icon: Layers, color: '#0369A1', bgColor: '#E0F2FE' },
      ...common,
      { tab: 'satellite', label: 'Satellite Watch', description: 'Encroachment detection via Sentinel-2 imagery', icon: Satellite, color: '#A32E2E', bgColor: '#FDEAEA' },
      { tab: 'workflows', label: 'Workflows', description: 'Launch dynamic partitioning workflow', icon: GitBranch, color: '#1E7B4D', bgColor: '#E7F6EC' },
    ];
    case 'collector': return [
      { tab: 'analytics', label: 'Executive Analytics', description: 'District KPIs, heatmaps, department performance, and scheme coverage', icon: BarChart3, color: '#0B2E4E', bgColor: '#E2ECF5' },
      { tab: 'queue', label: 'Pendency Board', description: 'Cross-department pending casework requiring escalation', icon: Clock, color: '#B8720B', bgColor: '#FDF1E0' },
      ...common,
      { tab: 'trust', label: 'Trust & Fraud', description: 'District-wide anomaly patterns and network graph', icon: ShieldAlert, color: '#A32E2E', bgColor: '#FDEAEA' },
      { tab: 'workflows', label: 'Workflows', description: 'All four cross-departmental workflow simulations', icon: GitBranch, color: '#1E7B4D', bgColor: '#E7F6EC' },
    ];
    default: return common;
  }
}

function getStats(role: string): StatCard[] {
  switch (role) {
    case 'tehsildar': return [
      { label: 'Pending Mutations', value: '7', sub: '3 high priority', icon: FileSpreadsheet, color: '#B8720B', bgColor: '#FDF1E0', tab: 'revenue' },
      { label: 'Topology Conflicts', value: '5', sub: '2 boundary overlaps', icon: Layers, color: '#A32E2E', bgColor: '#FDEAEA', tab: 'spatial' },
      { label: 'High Risk Parcels', value: '4', sub: 'Trust score < 40', icon: ShieldAlert, color: '#A32E2E', bgColor: '#FDEAEA', tab: 'trust' },
      { label: 'Verified This Week', value: '8', sub: 'of 15 total', icon: CheckCircle2, color: '#1E7B4D', bgColor: '#E7F6EC', tab: 'parcels' },
    ];
    case 'sub-registrar': return [
      { label: 'Pending Deeds', value: '5', sub: '2 mortgage deeds', icon: FileCheck2, color: '#7C3AED', bgColor: '#EDE9FE', tab: 'registration' },
      { label: 'EC Requests', value: '3', sub: 'Avg 0.2 days', icon: Scale, color: '#14548C', bgColor: '#E2ECF5', tab: 'registration' },
      { label: 'Suspicious Transfers', value: '2', sub: 'Flagged by trust engine', icon: ShieldAlert, color: '#A32E2E', bgColor: '#FDEAEA', tab: 'trust' },
      { label: 'Registered This Week', value: '12', sub: '₹2.1Cr total', icon: CheckCircle2, color: '#1E7B4D', bgColor: '#E7F6EC', tab: 'registration' },
    ];
    case 'town-planner': return [
      { label: 'Zone Violations', value: '4', sub: '2 commercial on ag. land', icon: AlertTriangle, color: '#A32E2E', bgColor: '#FDEAEA', tab: 'planning' },
      { label: 'Permits Pending', value: '6', sub: '3 pending > 7 days', icon: Building2, color: '#B45309', bgColor: '#FEF3C7', tab: 'planning' },
      { label: 'Land Use Changes', value: '3', sub: 'Satellite detected', icon: Satellite, color: '#0369A1', bgColor: '#E0F2FE', tab: 'satellite' },
      { label: 'Restriction Zones', value: '4', sub: 'CRZ, Heritage, SEZ', icon: Landmark, color: '#14548C', bgColor: '#E2ECF5', tab: 'planning' },
    ];
    case 'surveyor': return [
      { label: 'Topology Conflicts', value: '5', sub: '3 overlaps, 2 slivers', icon: Layers, color: '#A32E2E', bgColor: '#FDEAEA', tab: 'spatial' },
      { label: 'Demarcation Pending', value: '4', sub: 'DGPS upload needed', icon: Globe, color: '#0369A1', bgColor: '#E0F2FE', tab: 'spatial' },
      { label: 'Encroachments', value: '2', sub: 'Sentinel-2 flagged', icon: Satellite, color: '#B8720B', bgColor: '#FDF1E0', tab: 'satellite' },
      { label: 'Parcels Surveyed', value: '11', sub: 'This month', icon: CheckCircle2, color: '#1E7B4D', bgColor: '#E7F6EC', tab: 'parcels' },
    ];
    case 'collector': return [
      { label: 'Total Parcels', value: '15,842', sub: '+312 this month', icon: MapPin, color: '#14548C', bgColor: '#E2ECF5', tab: 'analytics' },
      { label: 'Revenue Collection', value: '₹4.2Cr', sub: '+18.4% YoY', icon: TrendingUp, color: '#1E7B4D', bgColor: '#E7F6EC', tab: 'analytics' },
      { label: 'Mutation Backlog', value: '47', sub: '-12 from last month', icon: Clock, color: '#B8720B', bgColor: '#FDF1E0', tab: 'analytics' },
      { label: 'Active Disputes', value: '23', sub: '6 critical', icon: AlertTriangle, color: '#A32E2E', bgColor: '#FDEAEA', tab: 'analytics' },
    ];
    default: return [];
  }
}

const RECENT_ACTIVITY: RecentItem[] = [
  { id: '1', title: 'Mutation MUT-2026-0819 filed', sub: 'ULPIN TN-CHN-000001 · Sale deed transfer', time: '2 hrs ago', status: 'warning', dept: 'Revenue' },
  { id: '2', title: 'Topology conflict resolved', sub: 'Parcels P003–P008 overlap fixed', time: '4 hrs ago', status: 'ok', dept: 'Survey' },
  { id: '3', title: 'Court stay registered', sub: 'Case OS-421/2024 · P003 ownership dispute', time: '1 day ago', status: 'critical', dept: 'eCourts' },
  { id: '4', title: 'Encumbrance lien placed', sub: 'SBI Chengalpattu · ULPIN TN-CHN-000002', time: '1 day ago', status: 'warning', dept: 'Registration' },
  { id: '5', title: 'Satellite anomaly detected', sub: 'P006 agricultural → mixed use (NDBI +0.48)', time: '2 days ago', status: 'critical', dept: 'Satellite' },
  { id: '6', title: 'RoR extract issued', sub: 'Citizen request for TN-CHN-000008', time: '2 days ago', status: 'ok', dept: 'Citizen Services' },
];

// ── Default layer state for landing map ───────────────────────────────────────

const LANDING_LAYERS: LayerState = {
  parcels: true,
  ulpin: false,
  villageBoundary: true,
  roads: true,
  railway: true,
  governmentLand: true,
  ownership: true,
  landUse: false,
  zoning: false,
  registration: false,
  encumbrance: false,
  litigation: false,
  topologyConflicts: false,
  propertyTax: false,
  utilityLines: true,
  infrastructureRoW: true,
  envBuffers: false,
};

// ── Search helpers ────────────────────────────────────────────────────────────

interface SearchSuggestion {
  parcel: ParcelData;
  matchField: string;
  matchText: string;
}

function searchParcels(query: string): SearchSuggestion[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results: SearchSuggestion[] = [];

  for (const p of PARCEL_DATA) {
    if (results.length >= 6) break;
    if (p.owner.toLowerCase().includes(q)) {
      results.push({ parcel: p, matchField: 'Owner', matchText: p.owner });
    } else if (p.survey_number.toLowerCase().includes(q)) {
      results.push({ parcel: p, matchField: 'Survey No.', matchText: p.survey_number });
    } else if (p.ulpin.includes(q)) {
      results.push({ parcel: p, matchField: 'ULPIN', matchText: p.ulpin });
    } else if (p.place.toLowerCase().includes(q)) {
      results.push({ parcel: p, matchField: 'Place', matchText: p.place });
    }
  }
  return results;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HomeView({ onNavigateTab }: { onNavigateTab: (tab: any) => void }) {
  const { config, role } = useRole();
  const freshness = useFreshness();
  const quickActions = getQuickActions(role);
  const stats = getStats(role);

  const [viewMode, setViewMode] = React.useState<'map' | 'triage'>('map');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedParcelId, setSelectedParcelId] = React.useState<string | null>(null);
  const [inputMode, setInputMode] = React.useState<'chat' | 'map'>('map');
  const searchRef = React.useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearchInput(value: string) {
    setSearchQuery(value);
    const results = searchParcels(value);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      onNavigateTab('search');
    }
  }

  function handleSuggestionClick(suggestion: SearchSuggestion) {
    setSearchQuery('');
    setShowSuggestions(false);
    onNavigateTab('parcels');
  }

  function handleParcelSelect(parcel: ParcelData) {
    setSelectedParcelId(parcel.parcel_id);
  }

  const parcelCount = PARCEL_GEOJSON.features.length;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">

      {/* ── Mode toggle pill — top-left ── */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-0.5 bg-black/35 backdrop-blur-md rounded-full px-1 py-1 border border-white/10 shadow">
        <button
          type="button"
          onClick={() => setViewMode('map')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
            viewMode === 'map' ? 'bg-white text-[#0b2447] shadow-sm' : 'text-white/70 hover:text-white'
          }`}
        >
          <Compass className="w-3 h-3" /> Map
        </button>
        <button
          type="button"
          onClick={() => setViewMode('triage')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
            viewMode === 'triage' ? 'bg-white text-[#0b2447] shadow-sm' : 'text-white/70 hover:text-white'
          }`}
        >
          <BarChart3 className="w-3 h-3" /> Triage
        </button>
      </div>

      {/* ── Map-first landing (default) ── */}
      {viewMode === 'map' && (
        <div className="flex-1 min-h-0 overflow-hidden relative">

          {/* Full-screen cadastral map background */}
          <div className="absolute inset-0">
            <CadastralMap
              layers={LANDING_LAYERS}
              statusFilter="all"
              riskFilter="all"
              selectedParcelId={selectedParcelId}
              onParcelSelect={handleParcelSelect}
              globe={false}
            />
          </div>

          {/* Top-left village info badge (below mode toggle) */}
          <div className="absolute top-14 left-3 z-20">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border shadow-sm backdrop-blur-sm"
              style={{
                background: 'rgba(255,255,255,0.92)',
                borderColor: '#e3e8ef',
              }}
            >
              <MapPin className="w-3.5 h-3.5 text-[#14a89a]" />
              <div>
                <div className="text-[11px] font-bold text-[#0b2447] leading-tight">
                  Tirupporur Village · Chengalpattu
                </div>
                <div className="text-[10px] text-[#6b7688]">
                  {parcelCount} parcels registered · SRID 4326
                </div>
              </div>
            </div>
          </div>

          {/* Centered floating search card */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div
              className="pointer-events-auto w-full max-w-[560px] mx-4 rounded-2xl border shadow-xl"
              style={{
                background: '#ffffff',
                borderColor: '#e3e8ef',
                boxShadow: '0 8px 40px rgba(11,36,71,0.12), 0 2px 12px rgba(11,36,71,0.06)',
              }}
            >
              <div className="px-6 pt-5 pb-4">
                {/* Heading */}
                <h1 className="text-lg font-serif font-bold text-[#0b2447] mb-3 flex items-center gap-2">
                  <span className="text-xl">&#10024;</span>
                  What brings you here today?
                </h1>

                {/* Search input */}
                <div ref={searchRef} className="relative">
                  <form onSubmit={handleSearchSubmit}>
                    <div
                      className="flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all focus-within:border-[#14a89a] focus-within:ring-2 focus-within:ring-[#14a89a]/15"
                      style={{ borderColor: '#e3e8ef', background: '#f8fafb' }}
                    >
                      <Search className="w-4 h-4 text-[#9aa4b3] flex-shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                        placeholder="Find land owned by Rajasekharan, Tirupporur"
                        className="flex-1 bg-transparent text-sm text-[#0b2447] placeholder:text-[#9aa4b3] outline-none"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }}
                          className="text-[#9aa4b3] hover:text-[#4a5b6e] transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Suggestion dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-lg overflow-hidden"
                      style={{ background: '#ffffff', borderColor: '#e3e8ef', zIndex: 50 }}
                    >
                      {suggestions.map((s) => (
                        <button
                          key={s.parcel.parcel_id}
                          type="button"
                          onClick={() => handleSuggestionClick(s)}
                          className="w-full px-4 py-2.5 text-left hover:bg-[#f0f7f6] transition-colors flex items-center gap-3 border-b border-[#f1f4f8] last:border-0"
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: '#E6F6F4' }}
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#14a89a]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-[#0b2447] truncate">
                              {s.parcel.survey_number} · {s.parcel.owner}
                            </div>
                            <div className="text-[10px] text-[#6b7688] flex items-center gap-1.5">
                              <span className="font-medium text-[#14a89a]">{s.matchField}</span>
                              <span>·</span>
                              <span className="truncate">{s.parcel.place}</span>
                              <span>·</span>
                              <span>{s.parcel.area} ac</span>
                            </div>
                          </div>
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            s.parcel.status === 'Verified' ? 'bg-[#16a34a]' :
                            s.parcel.status === 'Conflict' ? 'bg-[#dc2626]' :
                            s.parcel.status === 'Warning' ? 'bg-[#d97706]' : 'bg-[#2456a6]'
                          }`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chat/Map pills + Trust Engine badge */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 bg-[#f1f4f8] rounded-full p-0.5">
                    <button
                      type="button"
                      onClick={() => setInputMode('chat')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                        inputMode === 'chat'
                          ? 'bg-white text-[#0b2447] shadow-sm'
                          : 'text-[#6b7688] hover:text-[#0b2447]'
                      }`}
                    >
                      <MessageCircle className="w-3 h-3" /> Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('map')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                        inputMode === 'map'
                          ? 'bg-white text-[#0b2447] shadow-sm'
                          : 'text-[#6b7688] hover:text-[#0b2447]'
                      }`}
                    >
                      <Map className="w-3 h-3" /> Map
                    </button>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{ background: '#E6F6F4', color: '#0F766E' }}
                  >
                    <ShieldAlert className="w-3 h-3" />
                    Trust Engine v2
                  </div>
                </div>

                {/* Quick action chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {quickActions.slice(0, 4).map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.tab + action.label}
                        type="button"
                        onClick={() => onNavigateTab(action.tab)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all hover:shadow-sm"
                        style={{
                          borderColor: '#e3e8ef',
                          color: action.color,
                          background: '#ffffff',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = action.color;
                          (e.currentTarget as HTMLElement).style.background = action.bgColor;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#e3e8ef';
                          (e.currentTarget as HTMLElement).style.background = '#ffffff';
                        }}
                      >
                        <Icon className="w-3 h-3" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom hint */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm shadow-sm"
              style={{
                background: 'rgba(11,36,71,0.75)',
                borderColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <Eye className="w-3.5 h-3.5 text-[#14a89a]" />
              <span className="text-[11px] font-medium text-white/90">
                Click anywhere on the map to investigate a parcel
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Triage mode — ReconciliationCockpit ── */}
      {viewMode === 'triage' && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <ReconciliationCockpit onNavigateTab={onNavigateTab} />
        </div>
      )}
    </div>
  );
}

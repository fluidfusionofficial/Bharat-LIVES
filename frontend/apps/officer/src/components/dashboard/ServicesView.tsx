'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  FileText,
  FileCheck2,
  MapPin,
  Building2,
  Shield,
  Clock,
  IndianRupee,
  ChevronRight,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
} from 'lucide-react';

// ── Service catalog data ─────────────────────────────────────────────────────

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  department: string;
  category: string;
  sla_days: number;
  fee: number;
  type: 'Instant' | 'Standard';
}

const SERVICE_CATALOG: ServiceItem[] = [
  { id: 'ROR_EXTRACT', name: 'RoR Extract (Patta Copy)', description: 'Certified copy of Record of Rights from Tamil Nilam', department: 'Revenue', category: 'verify', sla_days: 3, fee: 100, type: 'Instant' },
  { id: 'ENCUMBRANCE_CERT', name: 'Encumbrance Certificate', description: 'EC search across SRO registration database (13/30 year)', department: 'Registration', category: 'verify', sla_days: 3, fee: 100, type: 'Instant' },
  { id: 'MUTATION_SALE', name: 'Revenue Title Mutation', description: 'Transfer of pattadar name following registered sale deed', department: 'Revenue', category: 'mutation', sla_days: 15, fee: 250, type: 'Standard' },
  { id: 'MUTATION_INHERITANCE', name: 'Succession Mutation', description: 'Title transfer on death of pattadar (legal heir certificate required)', department: 'Revenue', category: 'mutation', sla_days: 30, fee: 250, type: 'Standard' },
  { id: 'LAND_USE_CONVERSION', name: 'Land-Use Change NOC', description: 'Permission to convert agricultural land to residential/commercial use', department: 'Planning', category: 'planning', sla_days: 30, fee: 1500, type: 'Standard' },
  { id: 'BOUNDARY_DEMARCATION', name: 'Field Demarcation & Survey', description: 'Licensed surveyor dispatch for boundary stone verification and DGPS measurement', department: 'Survey', category: 'survey', sla_days: 15, fee: 500, type: 'Standard' },
  { id: 'BUILDING_PERMIT', name: 'Building Permit Application', description: 'Construction permission from Town & Country Planning Directorate', department: 'Planning', category: 'planning', sla_days: 45, fee: 2000, type: 'Standard' },
  { id: 'ZONE_CERTIFICATE', name: 'Zoning & Land Use Certificate', description: 'Official confirmation of master plan zone classification for a parcel', department: 'Planning', category: 'planning', sla_days: 7, fee: 200, type: 'Instant' },
  { id: 'PROPERTY_TAX_ASSESSMENT', name: 'Property Tax Assessment', description: 'Fresh guideline value assessment and property tax computation', department: 'Revenue', category: 'verify', sla_days: 10, fee: 150, type: 'Standard' },
  { id: 'PARTITION_DEED', name: 'Cadastral Partition & Sub-division', description: 'Physical sub-division of parcel with new survey numbers', department: 'Survey', category: 'survey', sla_days: 30, fee: 1000, type: 'Standard' },
  { id: 'EC_LIEN_PLACEMENT', name: 'Encumbrance Lien Placement', description: 'Record bank mortgage or court attachment on a registered parcel', department: 'Registration', category: 'verify', sla_days: 5, fee: 200, type: 'Standard' },
  { id: 'CONFLICT_RESOLUTION', name: 'Boundary Conflict Resolution', description: 'Mediation and adjudication of overlapping cadastral claims between parcels', department: 'Revenue', category: 'survey', sla_days: 45, fee: 500, type: 'Standard' },
];

interface PendingApplication {
  id: string;
  service: string;
  applicant: string;
  ulpin: string;
  submitted: string;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISPUTED';
  priority: 'high' | 'medium' | 'low';
}

const PENDING_APPLICATIONS: PendingApplication[] = [
  { id: 'APP-2026-0891', service: 'Revenue Title Mutation', applicant: 'Rajasekharan K.', ulpin: 'TN-CHN-000003', submitted: '2026-09-22', status: 'IN_REVIEW', priority: 'high' },
  { id: 'APP-2026-0887', service: 'Encumbrance Certificate', applicant: 'Suresh Babu', ulpin: 'TN-CHN-000004', submitted: '2026-09-21', status: 'SUBMITTED', priority: 'medium' },
  { id: 'APP-2026-0882', service: 'Land-Use Change NOC', applicant: 'Karthik Selvam', ulpin: 'TN-CHN-000006', submitted: '2026-09-20', status: 'IN_REVIEW', priority: 'high' },
  { id: 'APP-2026-0878', service: 'Field Demarcation & Survey', applicant: 'Ganesh Moorthy', ulpin: 'TN-CHN-000009', submitted: '2026-09-19', status: 'SUBMITTED', priority: 'medium' },
  { id: 'APP-2026-0871', service: 'Building Permit Application', applicant: 'Nithya Sundaram', ulpin: 'TN-CHN-000012', submitted: '2026-09-18', status: 'DISPUTED', priority: 'high' },
  { id: 'APP-2026-0865', service: 'RoR Extract (Patta Copy)', applicant: 'Lakshmi Narayanan', ulpin: 'TN-CHN-000001', submitted: '2026-09-17', status: 'APPROVED', priority: 'low' },
];

const SLA_DATA = [
  { service: 'RoR Extract', avg_days: 1.8, sla_target: 3, compliance: 96 },
  { service: 'Encumbrance Certificate', avg_days: 2.1, sla_target: 3, compliance: 94 },
  { service: 'Revenue Mutation', avg_days: 12.4, sla_target: 15, compliance: 88 },
  { service: 'Field Demarcation', avg_days: 18.2, sla_target: 15, compliance: 72 },
  { service: 'Building Permit', avg_days: 38, sla_target: 45, compliance: 82 },
  { service: 'Land-Use Conversion', avg_days: 24, sla_target: 30, compliance: 85 },
];

const CATEGORIES = [
  { id: 'all', label: 'All Services' },
  { id: 'verify', label: 'Verify Ownership' },
  { id: 'mutation', label: 'Process Mutation' },
  { id: 'survey', label: 'Survey & Demarcation' },
  { id: 'planning', label: 'Planning & Compliance' },
];

const INTENTS = [
  { id: 'all', label: 'All Services' },
  { id: 'verify', label: 'Verify Ownership' },
  { id: 'mutation', label: 'Mutation & Title Change' },
  { id: 'planning', label: 'Planning & Zoning' },
  { id: 'survey', label: 'Survey & Demarcation' },
];

const DEPARTMENTS = ['Revenue', 'Registration', 'Planning', 'Survey'];

const DEPT_COLORS: Record<string, string> = {
  Revenue: '#14548C',
  Registration: '#7C3AED',
  Survey: '#0F766E',
  Planning: '#B45309',
};

const DEPT_GRADIENTS: Record<string, string> = {
  Revenue: 'linear-gradient(135deg, #14548C, #2E6DA6)',
  Registration: 'linear-gradient(135deg, #7C3AED, #9F67FF)',
  Planning: 'linear-gradient(135deg, #B45309, #D97706)',
  Survey: 'linear-gradient(135deg, #0F766E, #14A89A)',
};

function deptIcon(dept: string) {
  switch (dept) {
    case 'Revenue': return <FileText className="w-5 h-5" />;
    case 'Registration': return <FileCheck2 className="w-5 h-5" />;
    case 'Survey': return <MapPin className="w-5 h-5" />;
    case 'Planning': return <Building2 className="w-5 h-5" />;
    default: return <Shield className="w-5 h-5" />;
  }
}

function statusBadge(status: PendingApplication['status']) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    SUBMITTED: { bg: '#eef3fb', text: '#14548C', label: 'Submitted' },
    IN_REVIEW: { bg: '#fdf1e0', text: '#B8720B', label: 'In Review' },
    APPROVED: { bg: '#e7f6ec', text: '#1E7B4D', label: 'Approved' },
    REJECTED: { bg: '#fdeaea', text: '#A32E2E', label: 'Rejected' },
    DISPUTED: { bg: '#fdeaea', text: '#A32E2E', label: 'Disputed' },
  };
  const s = map[status] || map.SUBMITTED;
  return (
    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

function priorityDot(p: string) {
  const c = p === 'high' ? '#dc2626' : p === 'medium' ? '#d97706' : '#16a34a';
  return <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c }} />;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ServicesView() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'queue' | 'sla'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<'all' | 'Instant' | 'Standard'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const filteredServices = useMemo(() => {
    return SERVICE_CATALOG.filter((s) => {
      if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
      if (selectedType !== 'all' && s.type !== selectedType) return false;
      if (selectedDepartment !== 'all' && s.department !== selectedDepartment) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.department.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCategory, selectedType, selectedDepartment, searchQuery]);

  const pendingCount = PENDING_APPLICATIONS.filter((a) => a.status === 'SUBMITTED' || a.status === 'IN_REVIEW').length;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

      {/* Header */}
      <div className="bg-white border-b border-[#e3e8ef] px-6 pt-5 pb-0 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[20px] font-extrabold text-[#12315e]">Government Land Services</h1>
            <p className="text-[13px] text-[#6b7688] mt-0.5">Browse and manage land governance services across departments</p>
          </div>
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa4b3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a service..."
              className="w-full h-10 pl-10 pr-4 text-[13px] rounded-xl bg-[#f7f9fc] border border-[#e3e8ef] text-[#1f2733] placeholder-[#9aa4b3] focus:outline-none focus:border-[#14548C] focus:ring-2 focus:ring-[#14548C]/10"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`text-[13px] font-semibold px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === 'catalog'
                ? 'text-[#12315e] border-[#14548C]'
                : 'text-[#6b7688] border-transparent hover:text-[#12315e]'
            }`}
          >
            Services <span className="text-[#14548C] font-bold ml-1">{SERVICE_CATALOG.length}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`text-[13px] font-semibold px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === 'queue'
                ? 'text-[#12315e] border-[#14548C]'
                : 'text-[#6b7688] border-transparent hover:text-[#12315e]'
            }`}
          >
            Applications Queue
            {pendingCount > 0 && (
              <span className="ml-1.5 text-[10px] font-bold bg-[#B8720B] text-white px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sla')}
            className={`text-[13px] font-semibold px-4 py-2.5 border-b-2 transition-colors ${
              activeTab === 'sla'
                ? 'text-[#12315e] border-[#14548C]'
                : 'text-[#6b7688] border-transparent hover:text-[#12315e]'
            }`}
          >
            SLA Performance
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">

        {/* ── Services Catalog ──────────────────────────────────────────── */}
        {activeTab === 'catalog' && (
          <div className="flex min-h-0">
            {/* Left: Intent-based side filters */}
            <div className="w-[220px] flex-shrink-0 bg-white border-r border-[#DCE3EA] p-5">
              {/* Intent / category filters */}
              <div className="text-[11px] font-bold text-[#4A5B6E] uppercase tracking-wider mb-3">
                Filters
              </div>
              <div className="space-y-0.5 mb-6">
                {INTENTS.map((intent) => {
                  const count = intent.id === 'all'
                    ? SERVICE_CATALOG.length
                    : SERVICE_CATALOG.filter((s) => s.category === intent.id).length;
                  return (
                    <label
                      key={intent.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] cursor-pointer transition-colors ${
                        selectedCategory === intent.id
                          ? 'bg-[#eef3fb] text-[#14548C] font-semibold'
                          : 'text-[#4A5B6E] hover:bg-[#F4F7FB]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="intent"
                          checked={selectedCategory === intent.id}
                          onChange={() => setSelectedCategory(intent.id)}
                          className="w-3.5 h-3.5 accent-[#14548C]"
                        />
                        {intent.label}
                      </span>
                      <span className={`text-[11px] font-bold ${
                        selectedCategory === intent.id ? 'text-[#14548C]' : 'text-[#4A5B6E]/60'
                      }`}>
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Service type filter */}
              <div className="text-[11px] font-bold text-[#4A5B6E] uppercase tracking-wider mb-3">
                Service Type
              </div>
              <div className="space-y-0.5 mb-6">
                {([
                  { id: 'all' as const, label: 'All Types', icon: null },
                  { id: 'Instant' as const, label: 'Instant', icon: <Zap className="w-3.5 h-3.5 text-[#14A89A]" /> },
                  { id: 'Standard' as const, label: 'Standard', icon: <Clock className="w-3.5 h-3.5 text-[#4A5B6E]" /> },
                ]).map((t) => (
                  <label
                    key={t.id}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] cursor-pointer transition-colors ${
                      selectedType === t.id
                        ? 'bg-[#eef3fb] text-[#14548C] font-semibold'
                        : 'text-[#4A5B6E] hover:bg-[#F4F7FB]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      checked={selectedType === t.id}
                      onChange={() => setSelectedType(t.id)}
                      className="w-3.5 h-3.5 accent-[#14548C]"
                    />
                    {t.icon}
                    {t.label}
                  </label>
                ))}
              </div>

              {/* Department filter */}
              <div className="text-[11px] font-bold text-[#4A5B6E] uppercase tracking-wider mb-3">
                Department
              </div>
              <div className="space-y-0.5">
                {[{ id: 'all', label: 'All Departments' }, ...DEPARTMENTS.map((d) => ({ id: d, label: d }))].map((dept) => (
                  <label
                    key={dept.id}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] cursor-pointer transition-colors ${
                      selectedDepartment === dept.id
                        ? 'bg-[#eef3fb] text-[#14548C] font-semibold'
                        : 'text-[#4A5B6E] hover:bg-[#F4F7FB]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="department"
                      checked={selectedDepartment === dept.id}
                      onChange={() => setSelectedDepartment(dept.id)}
                      className="w-3.5 h-3.5 accent-[#14548C]"
                    />
                    {dept.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Right: Service cards grid */}
            <div className="flex-1 p-5 bg-[#F4F7FB]">
              <div className="mb-1">
                <h2 className="text-[15px] font-bold text-[#16212E]">
                  Browse Services{' '}
                  <span className="text-[#14548C]">{filteredServices.length}</span>
                </h2>
              </div>
              <p className="text-[12.5px] text-[#4A5B6E] mb-5">
                Not sure what you need? Start with an intent filter on the left.
              </p>

              <div className="grid grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-lg border border-[#DCE3EA] overflow-hidden hover:shadow-[0_4px_16px_rgba(11,46,78,0.08)] hover:border-[#14548C]/30 transition-all cursor-pointer group"
                  >
                    {/* Department color strip */}
                    <div
                      className="h-1.5 w-full"
                      style={{ background: DEPT_GRADIENTS[service.department] || '#6b7688' }}
                    />

                    <div className="p-4">
                      <h3 className="text-[14px] font-bold text-[#16212E] leading-snug mb-1.5 group-hover:text-[#14548C] transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-[12px] text-[#4A5B6E] leading-relaxed line-clamp-2 mb-4">
                        {service.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-[#F4F7FB]">
                        <div className="flex items-center gap-1.5 text-[11.5px]">
                          {service.type === 'Instant' ? (
                            <span className="flex items-center gap-1 font-semibold text-[#14A89A]">
                              <Zap className="w-3 h-3" /> Instant
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 font-semibold text-[#4A5B6E]">
                              <FileText className="w-3 h-3" /> Standard
                            </span>
                          )}
                          <span className="text-[#DCE3EA] mx-0.5">&middot;</span>
                          <span className="text-[#4A5B6E]">{service.sla_days} days</span>
                          <span className="text-[#DCE3EA] mx-0.5">&middot;</span>
                          <span className="text-[#4A5B6E] font-medium">&#8377;{service.fee}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#DCE3EA] group-hover:text-[#14548C] transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Applications Queue ────────────────────────────────────────── */}
        {activeTab === 'queue' && (
          <div className="p-5">
            <div className="bg-white rounded-xl border border-[#e3e8ef] overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f7f9fc] border-b border-[#e3e8ef]">
                    <th className="text-[11px] font-bold text-[#6b7688] uppercase tracking-wider px-5 py-3">Application ID</th>
                    <th className="text-[11px] font-bold text-[#6b7688] uppercase tracking-wider px-5 py-3">Service</th>
                    <th className="text-[11px] font-bold text-[#6b7688] uppercase tracking-wider px-5 py-3">Applicant</th>
                    <th className="text-[11px] font-bold text-[#6b7688] uppercase tracking-wider px-5 py-3">ULPIN</th>
                    <th className="text-[11px] font-bold text-[#6b7688] uppercase tracking-wider px-5 py-3">Submitted</th>
                    <th className="text-[11px] font-bold text-[#6b7688] uppercase tracking-wider px-5 py-3">Priority</th>
                    <th className="text-[11px] font-bold text-[#6b7688] uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-[11px] font-bold text-[#6b7688] uppercase tracking-wider px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {PENDING_APPLICATIONS.map((app) => (
                    <tr key={app.id} className="border-b border-[#f1f4f8] hover:bg-[#f7f9fc] transition-colors">
                      <td className="px-5 py-3.5 text-[12.5px] font-bold text-[#14548C] font-mono">{app.id}</td>
                      <td className="px-5 py-3.5 text-[12.5px] font-semibold text-[#12315e]">{app.service}</td>
                      <td className="px-5 py-3.5 text-[12.5px] text-[#425066]">{app.applicant}</td>
                      <td className="px-5 py-3.5 text-[12px] font-mono text-[#14548C]">{app.ulpin}</td>
                      <td className="px-5 py-3.5 text-[12px] text-[#6b7688]">{app.submitted}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {priorityDot(app.priority)}
                          <span className="text-[12px] text-[#425066] capitalize">{app.priority}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">{statusBadge(app.status)}</td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          className="text-[11.5px] font-semibold text-[#14548C] hover:text-[#0f3d6e] flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SLA Performance ──────────────────────────────────────────── */}
        {activeTab === 'sla' && (
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4">
              {SLA_DATA.map((sla) => {
                const onTrack = sla.compliance >= 85;
                return (
                  <div key={sla.service} className="bg-white rounded-xl border border-[#e3e8ef] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-bold text-[#12315e]">{sla.service}</h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${onTrack ? 'bg-[#e7f6ec] text-[#1E7B4D]' : 'bg-[#fdeaea] text-[#A32E2E]'}`}>
                        {onTrack ? 'On Track' : 'At Risk'}
                      </span>
                    </div>

                    <div className="flex items-end gap-4 mb-3">
                      <div>
                        <div className="text-[24px] font-extrabold text-[#12315e]">{sla.avg_days}</div>
                        <div className="text-[11px] text-[#6b7688]">avg days</div>
                      </div>
                      <div className="text-[#9aa4b3] text-[12px] pb-1">/ {sla.sla_target}d target</div>
                    </div>

                    <div className="mb-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-[#6b7688]">SLA Compliance</span>
                      <span className={`font-bold ${sla.compliance >= 90 ? 'text-[#1E7B4D]' : sla.compliance >= 80 ? 'text-[#B8720B]' : 'text-[#A32E2E]'}`}>
                        {sla.compliance}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#f1f4f8] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${sla.compliance}%`,
                          background: sla.compliance >= 90 ? '#1E7B4D' : sla.compliance >= 80 ? '#B8720B' : '#A32E2E',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

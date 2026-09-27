'use client';

import * as React from 'react';
import {
  Home,
  MapPin,
  Map,
  Inbox,
  FileSpreadsheet,
  FileCheck2,
  GitMerge,
  Layers,
  ShieldAlert,
  Satellite,
  Workflow,
  Search,
  Building2,
  BarChart3,
  ArrowLeft,
  ClipboardList,
} from 'lucide-react';
import { cn, getAppUrl } from '@bhoomi/ui';
import { useRole, OfficerNavTab } from '@/context/RoleContext';

interface NavItem {
  id: OfficerNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  section: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { id: 'home',         label: 'Home',           icon: Home,            description: 'Map-first landing with quick actions',       section: 'Overview' },
  { id: 'analytics',    label: 'Analytics',      icon: BarChart3,       description: 'Executive KPIs & Heatmaps',        section: 'Overview' },
  { id: 'cadastral',    label: 'Cadastral Map',  icon: Map,             description: 'Full-Screen GIS Cadastral View',   section: 'Land Records' },
  { id: 'parcels',      label: 'Parcels',        icon: MapPin,          description: 'Search & Cadastral Lineage',       section: 'Land Records' },
  { id: 'queue',        label: 'Queue',          icon: Inbox,           description: 'Active Casework Queue',            section: 'Casework' },
  { id: 'revenue',      label: 'Revenue',        icon: FileSpreadsheet, description: 'RoR & Mutation Casework',          section: 'Casework' },
  { id: 'registration', label: 'Registration',   icon: FileCheck2,      description: 'Deeds & Encumbrance (EC)',         section: 'Casework' },
  { id: 'planning',     label: 'Planning',       icon: Building2,       description: 'Zoning, Master Plan & Permits',    section: 'Casework' },
  { id: 'resolution',   label: 'Resolution',     icon: GitMerge,        description: 'Entity-Resolution Queue',          section: 'Intelligence' },
  { id: 'spatial',      label: 'Spatial',        icon: Layers,          description: 'Topology Conflicts & Detect',      section: 'Intelligence' },
  { id: 'trust',        label: 'Trust & Fraud',  icon: ShieldAlert,     description: 'Anomalies & Network Graph',        section: 'Intelligence' },
  { id: 'satellite',    label: 'Satellite',      icon: Satellite,       description: 'Unauthorized Conversion Watch',    section: 'Intelligence' },
  { id: 'workflows',    label: 'Workflows',      icon: Workflow,        description: 'Guided Workflow Launcher',         section: 'Tools' },
  { id: 'search',       label: 'Search',         icon: Search,          description: 'Global Ledger Lookup',             section: 'Tools' },
  { id: 'services',     label: 'Services',       icon: ClipboardList,   description: 'Service Catalog & Applications',   section: 'Tools' },
];

export interface OfficerSidebarProps {
  activeTab: OfficerNavTab;
  onTabChange: (tab: OfficerNavTab) => void;
  pendingCounts?: Partial<Record<OfficerNavTab, number>>;
}

export function OfficerSidebar({
  activeTab,
  onTabChange,
  pendingCounts = {},
}: OfficerSidebarProps) {
  const { config, isTabAllowed } = useRole();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [hoveredRect, setHoveredRect] = React.useState<{ top: number } | null>(null);

  const filteredItems = ALL_NAV_ITEMS.filter((item) => isTabAllowed(item.id));

  const sections: { label: string; items: NavItem[] }[] = [];
  let currentSection = '';
  for (const item of filteredItems) {
    if (item.section !== currentSection) {
      currentSection = item.section;
      sections.push({ label: currentSection, items: [] });
    }
    sections[sections.length - 1].items.push(item);
  }

  const hoveredNav = hoveredItem ? ALL_NAV_ITEMS.find((n) => n.id === hoveredItem) : null;

  return (
    <aside
      className={cn(
        'relative flex-shrink-0 transition-[width] duration-200 ease-in-out overflow-visible bg-[#0B2447] text-[#E2ECF5] flex flex-col select-none border-r border-[#103F68]',
        isExpanded ? 'w-[220px]' : 'w-14'
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => { setIsExpanded(false); setHoveredItem(null); setHoveredRect(null); }}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center px-3 border-b border-[#14548C]/60 overflow-hidden">
        <div
          className="w-8 h-8 flex-shrink-0 rounded-[5px] grid place-items-center font-bold text-sm text-white"
          style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)` }}
        >
          {config.title.charAt(0)}
        </div>
        {isExpanded && (
          <div className="ml-3 whitespace-nowrap overflow-hidden animate-in fade-in duration-150">
            <div className="text-xs font-bold text-white leading-none">{config.title}</div>
            <div className="text-[10px] text-[#E2ECF5]/80 mt-0.5">{config.subtitle}</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {sections.map((section, si) => (
          <div key={section.label}>
            {isExpanded ? (
              <div className="px-3 pt-3 pb-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#E2ECF5]/40">
                  {section.label}
                </span>
              </div>
            ) : (
              si > 0 && <div className="mx-2.5 my-1.5 border-t border-[#1A3158]" />
            )}
            {section.items.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              const count = pendingCounts[item.id];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  onMouseEnter={(e) => {
                    if (!isExpanded) {
                      setHoveredItem(item.id);
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredRect({ top: rect.top });
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isExpanded) {
                      setHoveredItem(null);
                      setHoveredRect(null);
                    }
                  }}
                  className={cn(
                    'relative w-full flex items-center gap-3 px-3 py-2.5 overflow-hidden whitespace-nowrap transition-colors',
                    isActive
                      ? 'bg-[#14548C] text-white'
                      : 'text-[#E2ECF5]/80 hover:bg-[#14548C]/40 hover:text-white'
                  )}
                >
                  <span className="relative flex-shrink-0">
                    <Icon className="w-5 h-5" />
                    {!isExpanded && count != null && count > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#B8720B]" />
                    )}
                  </span>
                  {isExpanded && (
                    <>
                      <span className="text-xs font-semibold truncate flex-1">
                        {item.label}
                      </span>
                      {count != null && count > 0 && (
                        <span
                          className={cn(
                            'text-[10px] font-bold px-1.5 rounded-full',
                            isActive ? 'bg-white text-[#14548C]' : 'bg-[#B8720B] text-white'
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Back to Portal link */}
      <a
        href={getAppUrl('portal')}
        className="flex items-center gap-3 px-3 py-2.5 border-t border-[#14548C]/60 text-[#E2ECF5]/60 hover:text-white hover:bg-[#14548C]/30 transition-colors overflow-hidden whitespace-nowrap"
      >
        <ArrowLeft className="w-5 h-5 flex-shrink-0" />
        {isExpanded && (
          <span className="text-xs font-semibold">Switch Role</span>
        )}
      </a>

      {/* Footer */}
      <div className="border-t border-[#14548C]/60 bg-[#07223B] px-3 py-2.5 overflow-hidden whitespace-nowrap">
        {isExpanded && (
          <div className="text-[10px] text-[#E2ECF5]/60">
            v1.0.0 · Keycloak SSO
          </div>
        )}
      </div>

      {/* Tooltip (collapsed state only) */}
      {!isExpanded && hoveredNav && hoveredRect && (
        <div
          className="fixed z-[9999] ml-1 pointer-events-none"
          style={{ left: 56, top: hoveredRect.top }}
        >
          <div className="bg-[#0f1d38] border border-[#1e3d6b] text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-lg whitespace-nowrap">
            {hoveredNav.label}
            <div className="text-[10px] font-normal text-[#8EAECF] mt-0.5">{hoveredNav.description}</div>
          </div>
        </div>
      )}
    </aside>
  );
}

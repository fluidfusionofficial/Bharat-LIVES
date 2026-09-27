'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  fetchMyParcels,
  MyParcelSummary,
  setToken,
} from '@bhoomi/api-client';
import {
  Card,
  Button,
  StatusBadge,
  EmptyState,
  ErrorState,
} from '@bhoomi/ui';
import {
  Search,
  MapPin,
  FileText,
  Shield,
  Eye,
  ChevronRight,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CitizenHeader } from '@/components/CitizenHeader';
import { BottomNav } from '@/components/BottomNav';
import { AadhaarAuth, useAadhaarAuth } from '@/components/AadhaarAuth';

export default function CitizenHomePage() {
  const { isAuthenticated, maskedAadhaar, checked, authenticate } = useAadhaarAuth();

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#14548C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <AadhaarAuth onAuthenticated={authenticate} />;
  return <CitizenDashboard maskedAadhaar={maskedAadhaar} />;
}

function CitizenDashboard({ maskedAadhaar }: { maskedAadhaar: string }) {
  const [parcels, setParcels] = React.useState<MyParcelSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [authIdentity] = React.useState('CITIZEN:a1b2c3d4');
  const [parcelsOpen, setParcelsOpen] = React.useState(false);

  const loadParcels = React.useCallback(async () => {
    setLoading(true); setError(null);
    try {
      setToken(authIdentity);
      const res = await fetchMyParcels();
      setParcels(Array.isArray(res?.parcels) ? res.parcels : []);
    } catch (err: any) {
      setError(err?.message || 'Could not retrieve registered parcels.');
    } finally {
      setLoading(false);
    }
  }, [authIdentity]);

  React.useEffect(() => { loadParcels(); }, [loadParcels]);

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col pb-20">
      <CitizenHeader />
      <main className="flex-1 max-w-md w-full mx-auto p-4 space-y-3">

        {/* Search — primary */}
        <Link href="/search">
          <div className="flex items-center gap-3 bg-white border border-[#DCE3EA] hover:border-[#14548C] rounded-xl px-4 py-3.5 shadow-sm transition-colors cursor-pointer">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-400">Search by ULPIN, survey no., owner name…</span>
          </div>
        </Link>

        {/* Quick actions 2x2 */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Search,   label: 'Search Records',        href: '/search',                          color: '#14548C', bg: '#E2ECF5' },
            { icon: Shield,   label: 'Encumbrance Cert.',     href: '/applications/new?service=EC',     color: '#7C3AED', bg: '#EDE9FE' },
            { icon: FileText, label: 'Apply for Mutation',    href: '/applications/new?service=MUTATION', color: '#B45309', bg: '#FEF3C7' },
            { icon: Eye,      label: 'Who Accessed My Land',  href: '/access-log',                      color: '#0369A1', bg: '#E0F2FE' },
          ].map(({ icon: Icon, label, href, color, bg }) => (
            <Link key={label} href={href}>
              <div className="bg-white border border-[#DCE3EA] hover:border-[#14548C]/60 rounded-xl p-3 flex items-center gap-2.5 transition-colors hover:shadow-sm group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-xs font-semibold text-[#16212E] group-hover:text-[#14548C] leading-tight transition-colors">{label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* My Parcels — collapsed by default */}
        <div className="bg-white border border-[#DCE3EA] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setParcelsOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#14548C]" />
              <span className="text-sm font-semibold text-[#16212E]">My Registered Parcels</span>
              {!loading && (
                <span className="text-[10px] font-bold bg-[#E2ECF5] text-[#14548C] px-1.5 py-0.5 rounded-full">{parcels.length}</span>
              )}
            </div>
            {parcelsOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {parcelsOpen && (
            <div className="border-t border-[#DCE3EA]">
              {loading ? (
                <div className="space-y-2 p-3">{[1,2].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}</div>
              ) : error ? (
                <div className="p-3"><ErrorState title="Unable to load parcels" description={error} onRetry={loadParcels} /></div>
              ) : parcels.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    title="No parcels linked to your ID"
                    description="Search public registry or ensure mutation is entered in the revenue registry."
                    action={<Link href="/search"><Button variant="outline" size="sm">Search Public Land Registry</Button></Link>}
                  />
                </div>
              ) : (
                <div className="divide-y divide-[#F1F4F8]">
                  {parcels.map((p) => (
                    <Link key={p.parcel_id || p.ulpin} href={`/parcels/${p.parcel_id || p.ulpin}`} className="block group">
                      <div className="px-4 py-3 hover:bg-[#F7F9FC] transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-[#4A5B6E] uppercase tracking-wider font-semibold">ULPIN</div>
                            <div className="text-sm font-serif font-bold text-[#16212E]">{p.ulpin}</div>
                            <div className="text-[11px] text-[#4A5B6E] mt-0.5">
                              Survey {p.survey_number || '42/1B'} · {p.area_sq_m ? `${p.area_sq_m.toLocaleString()} m²` : '1.42 Ha'} · {p.land_use || 'Agricultural'}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <StatusBadge status={p.has_dispute ? 'disputed' : 'approved'} variant={p.has_dispute ? 'rejected' : 'approved'}>
                              {p.has_dispute ? 'Dispute' : 'Clear'}
                            </StatusBadge>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#14548C] transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Services — compact */}
        <div className="grid grid-cols-2 gap-2">
          <Link href="/applications/new?service=MUTATION">
            <div className="bg-white border border-[#DCE3EA] hover:border-[#14548C] rounded-xl p-3 transition-colors">
              <FileText className="w-5 h-5 text-[#14548C] mb-1.5" />
              <div className="text-xs font-semibold text-[#16212E]">Apply for Mutation</div>
              <div className="text-[10px] text-[#4A5B6E] mt-0.5">Transfer of title & RoR update</div>
            </div>
          </Link>
          <Link href="/applications/new?service=EC">
            <div className="bg-white border border-[#DCE3EA] hover:border-[#14548C] rounded-xl p-3 transition-colors">
              <Shield className="w-5 h-5 text-[#14548C] mb-1.5" />
              <div className="text-xs font-semibold text-[#16212E]">Encumbrance Certificate</div>
              <div className="text-[10px] text-[#4A5B6E] mt-0.5">Download digital EC</div>
            </div>
          </Link>
        </div>

        {/* Aadhaar strip — bottom, subtle */}
        <div className="flex items-center justify-between bg-white border border-[#DCE3EA] rounded-xl px-3 py-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-[#14548C]" />
            <span className="text-[11px] text-[#4A5B6E]">e-KYC · {maskedAadhaar || 'XXXX XXXX ••••'}</span>
          </div>
          <span className="text-[10px] font-bold text-[#1E7B4D]">VERIFIED</span>
        </div>

      </main>
      <BottomNav />
    </div>
  );
}
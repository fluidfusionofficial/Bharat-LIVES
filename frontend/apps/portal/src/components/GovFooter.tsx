'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, Phone, Mail, MapPin } from 'lucide-react';

export function GovFooter() {
  return (
    <footer className="w-full bg-[#17375E] text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1 – About */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-[#FF9933] border-b border-white/10 pb-2">
            Bharat Lives
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Integrated GIS-based Digital Public Infrastructure for Land Governance. A Smart India
            Hackathon 2026 initiative under Problem Statement PS-26014.
          </p>
          <div className="flex items-start gap-2 text-xs text-white/60">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#FF9933]" />
            <span>Department of Land Resources (DoLR), Ministry of Rural Development, Krishi Bhawan, New Delhi - 110001</span>
          </div>
        </div>

        {/* Column 2 – Quick Links */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-[#FF9933] border-b border-white/10 pb-2">
            Quick Links
          </div>
          <ul className="space-y-2">
            {[
              { label: 'Home', href: '/' },
              { label: 'About Land Stack', href: '/about' },
              { label: 'Citizen Services', href: '/services' },
              { label: 'Access Portal', href: '/portal' },
              { label: 'API Documentation', href: '#' },
              { label: 'ULPIN Registry', href: '#' },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-[#FF9933] rounded-full" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 – External Gov Links */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-[#FF9933] border-b border-white/10 pb-2">
            Government Links
          </div>
          <ul className="space-y-2">
            {[
              { label: 'India.gov.in', href: 'https://india.gov.in' },
              { label: 'Ministry of Rural Development', href: 'https://rural.nic.in' },
              { label: 'Digital India', href: 'https://digitalindia.gov.in' },
              { label: 'DILRMP (DoLR)', href: 'https://dolr.gov.in' },
              { label: 'DigiLocker', href: 'https://digilocker.gov.in' },
              { label: 'NIC', href: 'https://nic.in' },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3 text-[#FF9933]" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 – Contact */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-[#FF9933] border-b border-white/10 pb-2">
            Contact & Help
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-xs text-white/60">
              <Phone className="w-3.5 h-3.5 text-[#FF9933] flex-shrink-0" />
              <div>
                <div className="font-semibold text-white/80">Toll Free</div>
                <div>1800-xxx-xxxx (9AM–6PM)</div>
              </div>
            </li>
            <li className="flex items-center gap-2 text-xs text-white/60">
              <Mail className="w-3.5 h-3.5 text-[#FF9933] flex-shrink-0" />
              <div>
                <div className="font-semibold text-white/80">Email Helpdesk</div>
                <div>support@bhoomidhrishti.gov.in</div>
              </div>
            </li>
          </ul>

          {/* Standards badges */}
          <div className="pt-2 space-y-1.5">
            {['OGC WFS/WMS Compliant', 'WCAG 2.1 AA Accessible', 'DPDPA Compliant'].map((s) => (
              <div key={s} className="flex items-center gap-1.5 text-[10px] text-white/50">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#112c4a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/40">
          <div>
            © 2025–2026 Department of Land Resources (DoLR), Ministry of Rural Development, Government of India.
            All Rights Reserved.
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>v1.0.0-pilot</span>
            <span>·</span>
            <span>SIH 2026 · PS-26014</span>
            <span>·</span>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <span>·</span>
            <a href="#" className="hover:text-white">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

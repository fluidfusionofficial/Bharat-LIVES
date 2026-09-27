'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, Mail, Globe } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', labelHi: 'होम', href: '/' },
  { label: 'About', labelHi: 'परियोजना के बारे में', href: '/about' },
  { label: 'Services', labelHi: 'नागरिक सेवाएं', href: '/services' },
  { label: 'Access Portal', labelHi: 'पोर्टल एक्सेस', href: '/portal', highlight: true },
];

export function GovHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [lang, setLang] = React.useState<'en' | 'hi'>('en');

  return (
    <header className="w-full z-50 sticky top-0 shadow-md">
      {/* ── Tricolor top strip ── */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-t border-b border-gray-200" />
        <div className="flex-1 bg-[#128807]" />
      </div>

      {/* ── Accessibility / language strip ── */}
      <div className="bg-[#f5f7fa] border-b border-gray-200 px-4 py-1 hidden sm:flex items-center justify-between text-[11px] text-[#444]">
        <div className="flex items-center gap-4">
          <a href="#main-content" className="text-[#17375E] hover:underline font-medium">Skip to main content</a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:underline">Screen Reader</a>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">
            <span className="font-medium text-gray-600">A</span>
            <button className="font-bold text-[#17375E] hover:underline text-sm">A</button>
            <button className="font-bold text-[#17375E] hover:underline text-base">A</button>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 text-[#17375E] font-semibold hover:underline"
          >
            <Globe className="w-3 h-3" />
            {lang === 'en' ? 'हिन्दी' : 'English'}
          </button>
          <span className="text-gray-300">|</span>
          <span>Last Updated: 26 Sep 2026</span>
        </div>
      </div>

      {/* ── Ministry branding header ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4 sm:gap-6">
          {/* National Emblem placeholder */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex flex-col items-center justify-center bg-[#17375E] rounded-full text-white">
            <div className="text-[8px] font-bold leading-none text-center">🇮🇳</div>
            <div className="text-[6px] font-bold text-center mt-0.5 leading-tight opacity-80">INDIA</div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Ministry name */}
            <div className="text-[10px] sm:text-[11px] font-semibold text-[#128807] tracking-wide uppercase">
              {lang === 'hi' ? 'भारत सरकार' : 'Government of India'}
            </div>
            <div className="text-[11px] sm:text-xs text-[#444] font-medium">
              {lang === 'hi'
                ? 'ग्रामीण विकास मंत्रालय · भूमि संसाधन विभाग'
                : 'Ministry of Rural Development · Department of Land Resources (DoLR)'}
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-bold text-[#17375E] leading-tight mt-0.5">
              {lang === 'hi' ? 'भारत लाइव्स' : 'Bharat Lives'}
              <span className="hidden sm:inline text-sm font-normal text-[#666] ml-2">
                — {lang === 'hi' ? 'भूमि स्टैक' : 'Land Stack'}
              </span>
            </div>
            <div className="text-[10px] text-[#888] hidden sm:block">
              {lang === 'hi'
                ? 'एकीकृत GIS-आधारित डिजिटल सार्वजनिक अवसंरचना · SIH 2026 · PS-26014'
                : 'Integrated GIS-Based Digital Public Infrastructure · SIH 2026 · PS-26014'}
            </div>
          </div>

          {/* Right side badges */}
          <div className="hidden lg:flex flex-col items-end gap-1 flex-shrink-0">
            <div className="flex items-center gap-2">
              <img
                src="https://www.india.gov.in/sites/upload_files/npi/files/india-logo-2.png"
                alt="India.gov.in"
                className="h-8 opacity-80"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="text-right">
                <div className="text-[9px] font-bold text-[#FF9933] uppercase tracking-widest">Digital India</div>
                <div className="text-[8px] text-[#888]">Transforming India</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#444]">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium text-emerald-700">All Services Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main navigation ── */}
      <nav className="bg-[#17375E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-5 py-3.5 text-sm font-semibold transition-colors border-b-2
                    ${link.highlight
                      ? 'bg-[#FF9933] text-white border-[#FF9933] hover:bg-[#e08820]'
                      : isActive
                        ? 'border-[#FF9933] text-[#FF9933]'
                        : 'border-transparent text-white/80 hover:text-white hover:border-white/40'
                    }
                  `}
                >
                  {lang === 'hi' ? link.labelHi : link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: SIH badge */}
          <div className="hidden md:flex items-center gap-3 py-2">
            <div className="bg-white/10 border border-white/20 rounded px-3 py-1.5 text-xs font-mono text-white/70">
              PS-26014 · SIH 2026
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden py-3 px-2 text-white"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-6 py-3 text-sm font-semibold border-b border-white/10 ${
                  link.highlight
                    ? 'bg-[#FF9933] text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {lang === 'hi' ? link.labelHi : link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

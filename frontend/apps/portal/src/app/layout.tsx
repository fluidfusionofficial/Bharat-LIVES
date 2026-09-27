import type { Metadata } from 'next';
import { Public_Sans, IBM_Plex_Serif } from 'next/font/google';
import './globals.css';
import { GovHeader } from '@/components/GovHeader';
import { GovFooter } from '@/components/GovFooter';

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Bharat Lives — Land Stack | Dept. of Land Resources, MoRD, Govt. of India',
    template: '%s | Bharat Lives — Land Stack',
  },
  description:
    'Bharat Lives (Land Stack): An Integrated GIS-based Digital Public Infrastructure for Land Governance. Department of Land Resources (DoLR), Ministry of Rural Development, Government of India. SIH 2026 PS-26014.',
  keywords: ['Land Stack', 'ULPIN', 'Bharat Lives', 'GIS', 'DoLR', 'Land Governance', 'SIH 2026'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${publicSans.variable} ${ibmPlexSerif.variable}`}>
      <body className="font-sans antialiased bg-[#F4F7FB] text-[#16212E] flex flex-col min-h-screen">
        <GovHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <GovFooter />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Access Portal — Select Your Role',
  description: 'Access the Bharat Lives Land Stack portal. Select your role: Citizen, Revenue Officer, Sub-Registrar, Town Planner, Surveyor, District Collector, or Platform Admin.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}

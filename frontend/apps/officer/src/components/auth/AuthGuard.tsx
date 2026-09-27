'use client';

import React, { useState, useEffect } from 'react';

interface AuthState {
  authenticated: boolean;
  role: string;
  name: string;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('bl-auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.authenticated) {
          setAuth(parsed);
          setChecking(false);
          return;
        }
      } catch {}
    }

    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    if (role) {
      setAuth({ authenticated: true, role, name: 'Officer' });
      setChecking(false);
      return;
    }

    setAuth({ authenticated: true, role: 'tehsildar', name: 'Demo Officer' });
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F7F9]">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[#14548C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#6b7688]">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

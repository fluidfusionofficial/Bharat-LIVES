const APP_PORTS: Record<string, number> = {
  officer: 3000,
  portal: 3001,
  citizen: 3002,
  admin: 3003,
};

export function getAppUrl(app: 'officer' | 'portal' | 'citizen' | 'admin'): string {
  const envKey = `NEXT_PUBLIC_${app.toUpperCase()}_URL`;
  try {
    const val = (globalThis as any).process?.env?.[envKey];
    if (val) return val;
  } catch {}
  return `http://localhost:${APP_PORTS[app]}`;
}

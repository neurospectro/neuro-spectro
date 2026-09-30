export type AccessStatus = "active" | "expired";

export interface AccessPeriod {
  startsAt: string;
  expiresAt: string;
}

export function createAccessPeriod(startsAt: Date, accessDays: number): AccessPeriod {
  const expiresAt = new Date(startsAt);
  expiresAt.setDate(expiresAt.getDate() + accessDays);
  return { startsAt: startsAt.toISOString(), expiresAt: expiresAt.toISOString() };
}

export function getAccessStatus(expiresAt: string, now = new Date()): AccessStatus {
  return new Date(expiresAt).getTime() > now.getTime() ? "active" : "expired";
}

export function getDaysRemaining(expiresAt: string, now = new Date()): number {
  const ms = new Date(expiresAt).getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function formatAccessDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

import type { AttendeesData, BeisApplication, CostItem, FinancialProjectionRow } from "./types";

export function toNumber(v: string): number {
  const n = Number(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function formatSgd(v: number): string {
  return new Intl.NumberFormat("en-SG", { style: "currency", currency: "SGD" }).format(v);
}

export function formatNumber(v: number): string {
  return new Intl.NumberFormat("en-SG").format(v);
}

export function formatDateSg(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-SG", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Singapore" }).format(d);
}

// F015 — event duration, calculated automatically
export function eventDurationDays(startDate: string, endDate: string): number | null {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return null;
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function projectionProfitLoss(row: FinancialProjectionRow): number {
  return toNumber(row.expectedRevenue) - toNumber(row.expectedExpenditure);
}

// F045-F047 — attendee totals
export function attendeeTotals(a: AttendeesData) {
  const foreignByMarketTotal = Object.values(a.foreignByMarket).reduce((sum, v) => sum + toNumber(v), 0);
  const local = toNumber(a.local);
  const totalForeign = foreignByMarketTotal; // F045
  const totalLocal = local; // F046
  const totalAttendees = totalForeign + totalLocal; // F047
  const foreignPercent = totalAttendees > 0 ? (totalForeign / totalAttendees) * 100 : 0;
  return { totalForeign, totalLocal, totalAttendees, foreignPercent };
}

export function tradeConsumerTotals(a: AttendeesData) {
  const { tradeForeign, tradeLocal, consumerForeign, consumerLocal } = a.tradeConsumer;
  const tf = toNumber(tradeForeign);
  const tl = toNumber(tradeLocal);
  const cf = toNumber(consumerForeign);
  const cl = toNumber(consumerLocal);
  return {
    tradeTotal: tf + tl,
    consumerTotal: cf + cl,
    foreignTotal: tf + cf,
    localTotal: tl + cl,
    grandTotal: tf + tl + cf + cl,
  };
}

// F072 — estimated total project costs
export function totalProjectCosts(costs: CostItem[]): number {
  return costs.reduce((sum, c) => sum + toNumber(c.amount), 0);
}

export function meetsMinimumForeignThreshold(app: BeisApplication): boolean {
  const { foreignPercent } = attendeeTotals(app.attendees);
  return foreignPercent >= 20;
}

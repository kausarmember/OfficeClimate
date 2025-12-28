import type { ComfortReport, Role, Comfort, Floor, Zone } from "./types";

const ROLE_KEY = "officeclimate.role";
const REPORTS_KEY = "officeclimate.reports";

/* =========================
   Role handling
========================= */

export function saveRole(role: Role) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
}

export function getRole(): Role | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(ROLE_KEY);
  return value === "fm" || value === "worker" ? value : null;
}

/* =========================
   Report storage
========================= */

export function getReports(): ComfortReport[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ComfortReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addReport(report: ComfortReport) {
  if (typeof window === "undefined") return;

  const reports = getReports();
  reports.unshift(report); // newest first
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function getLatestReport(): ComfortReport | null {
  const reports = getReports();
  return reports.length > 0 ? reports[0] : null;
}

/* =========================
   Date filtering (FM use)
========================= */

export function getReportsForDate(dateISO: string): ComfortReport[] {
  const reports = getReports();
  const target = new Date(dateISO);

  return reports.filter((r) => {
    const d = new Date(r.createdAt);
    return (
      d.getFullYear() === target.getFullYear() &&
      d.getMonth() === target.getMonth() &&
      d.getDate() === target.getDate()
    );
  });
}

/* =========================
   Heatmap aggregation
========================= */

export type HeatmapCell = {
  floor: Floor;
  zone: Zone;
  count: number;
  dominant: Comfort;
  breakdown: Record<Comfort, number>;
  comments: { text: string; time: string }[];
};

export function buildHeatmap(
  reports: ComfortReport[],
  floors: Floor[],
  zones: Zone[]
): HeatmapCell[] {
  const cells: HeatmapCell[] = [];

  for (const floor of floors) {
    for (const zone of zones) {
      const matching = reports.filter(
        (r) => r.floor === floor && r.zone === zone
      );

      const breakdown: Record<Comfort, number> = {
        cold: 0,
        comfortable: 0,
        warm: 0,
      };

      matching.forEach((r) => {
        breakdown[r.comfort]++;
      });

      const dominant: Comfort =
        breakdown.cold >= breakdown.comfortable &&
        breakdown.cold >= breakdown.warm
          ? "cold"
          : breakdown.warm >= breakdown.comfortable
          ? "warm"
          : "comfortable";

      const comments = matching
        .filter((r) => r.comment && r.comment.trim().length > 0)
        .map((r) => ({
          text: r.comment!,
          time: new Date(r.createdAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

      cells.push({
        floor,
        zone,
        count: matching.length,
        dominant,
        breakdown,
        comments,
      });
    }
  }

  return cells;
}

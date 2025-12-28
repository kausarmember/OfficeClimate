"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getRole,
  getReportsForDate,
  buildHeatmap,
  type HeatmapCell,
} from "../../lib/storage";
import type { Floor, Zone, Comfort } from "../../lib/types";

const FLOORS: Floor[] = [5, 6];
const ZONES: Zone[] = ["1-10", "11-20", "21-30", "31-40"];

function labelForComfort(c: Comfort) {
  if (c === "cold")
    return { text: "Cold", icon: "●", iconClass: "text-blue-600", bg: "bg-blue-50" };
  if (c === "warm")
    return { text: "Warm", icon: "▲", iconClass: "text-orange-600", bg: "bg-orange-50" };
  return {
    text: "Comfortable",
    icon: "■",
    iconClass: "text-emerald-600",
    bg: "bg-emerald-50",
  };
}

function greetingNoName() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
}

function formatUKDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function makeEmptyCell(floor: Floor, zone: Zone): HeatmapCell {
  return {
    floor,
    zone,
    count: 0,
    dominant: "comfortable",
    breakdown: { cold: 0, comfortable: 0, warm: 0 },
    comments: [],
  };
}

export default function FmDashboardPage() {
  const router = useRouter();

  // Guard: only FM should view this page
  useEffect(() => {
    const role = getRole();
    if (role !== "fm") router.replace("/login");
  }, [router]);

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString());
  const [cells, setCells] = useState<HeatmapCell[]>([]);
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);

  // Build heatmap whenever date changes
  useEffect(() => {
    const dayReports = getReportsForDate(selectedDate);
    setCells(buildHeatmap(dayReports, FLOORS, ZONES));
  }, [selectedDate]);

  const dateLabel = useMemo(() => formatUKDate(new Date(selectedDate)), [selectedDate]);

  // Map for quick lookup: `${floor}-${zone}` -> HeatmapCell
  const cellMap = useMemo(() => {
    const map = new Map<string, HeatmapCell>();
    for (const c of cells) map.set(`${c.floor}-${c.zone}`, c);
    return map;
  }, [cells]);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/accenture-logo1.png"
              alt="Accenture logo"
              width={40}
              height={20}
              priority
            />
            <span className="text-sm font-medium text-gray-800">
              Accenture | OfficeClimate
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/report"
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              Submit Report
            </a>
            <a
              href="/login"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Logout
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">FM Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">{greetingNoName()}</p>
          </div>
          <p className="text-sm text-gray-500">{formatUKDate(new Date())}</p>
        </div>

        {/* Date selector */}
        <div className="mt-8 max-w-sm">
          <label className="block text-sm font-medium text-gray-700" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={new Date(selectedDate).toISOString().slice(0, 10)}
            onChange={(e) => {
              const iso = new Date(e.target.value + "T00:00:00").toISOString();
              setSelectedDate(iso);
              setSelectedCell(null);
            }}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:border-gray-600"
          />
          <p className="mt-2 text-xs text-gray-500">Showing reports for {dateLabel}.</p>
        </div>

        {/* Heatmap card */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Temperature Heatmap</h2>

          {/* Column headers (desktop only) */}
          <div className="mt-6 hidden sm:grid grid-cols-[120px_repeat(4,minmax(0,1fr))] gap-4 text-sm text-gray-600">
            <div />
            {ZONES.map((z) => (
              <div key={z} className="text-center font-medium">
                {z}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="mt-4 space-y-6">
            {FLOORS.map((floor) => (
              <div key={floor}>
                {/* Floor label on mobile */}
                <div className="sm:hidden mb-3 text-sm font-medium text-gray-700">
                  Floor {floor}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[120px_repeat(4,minmax(0,1fr))] sm:gap-4 items-stretch">
                  {/* Floor label on desktop */}
                  <div className="hidden sm:flex items-center text-sm font-medium text-gray-700">
                    Floor {floor}
                  </div>

                  {ZONES.map((zone) => {
                    const cell = cellMap.get(`${floor}-${zone}`);
                    const displayCell = cell ?? makeEmptyCell(floor, zone);

                    const count = displayCell.count;

                    const meta =
                      count === 0
                        ? {
                            text: "No data",
                            icon: "–",
                            iconClass: "text-gray-400",
                            bg: "bg-gray-50",
                          }
                        : labelForComfort(displayCell.dominant);

                    const isSelected =
                      selectedCell?.floor === floor && selectedCell?.zone === zone;

                    const aria =
                      count === 0
                        ? `Floor ${floor}, seats ${zone}, no reports for selected date`
                        : `Floor ${floor}, seats ${zone}, ${meta.text}, ${count} reports`;

                    return (
                      <button
                        key={`${floor}-${zone}`}
                        type="button"
                        onClick={() => setSelectedCell(displayCell)}
                        className={[
                          "rounded-2xl border p-5 sm:p-6 text-center shadow-sm transition",
                          meta.bg,
                          "hover:shadow-md",
                          "focus:outline-none focus:ring-2 focus:ring-gray-400",
                          isSelected ? "border-gray-700" : "border-gray-200",
                        ].join(" ")}
                        aria-label={aria}
                      >
                        {/* On mobile show zone label inside the cell */}
                        <div className="sm:hidden mb-2 text-xs font-medium text-gray-600">
                          Seats {zone}
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <div className={`text-5xl ${meta.iconClass}`} aria-hidden="true">
                            {meta.icon}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{meta.text}</div>
                          <div className="text-xs text-gray-600">{count} reports</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-10 border-t border-gray-200 pt-6">
            <p className="text-sm font-medium text-gray-900">Legend</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-4 sm:gap-x-8 sm:gap-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-blue-600" aria-hidden="true" />
                <span>Cold</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 bg-emerald-600" aria-hidden="true" />
                <span>Comfortable</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-0 w-0
                    border-l-[7px] border-l-transparent
                    border-r-[7px] border-r-transparent
                    border-b-[12px] border-b-orange-600"
                  aria-hidden="true"
                />
                <span>Warm</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-block h-[2px] w-4 rounded bg-gray-400" aria-hidden="true" />
                <span>No data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments side panel */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex">
          {/* overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close comments"
            onClick={() => setSelectedCell(null)}
          />

          {/* panel */}
          <aside
            className="ml-auto h-full w-full sm:max-w-md bg-white shadow-xl relative"
            role="dialog"
            aria-modal="true"
            aria-label="Comments panel"
          >
            <div className="border-b border-gray-200 p-6 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Floor {selectedCell.floor}, Seats {selectedCell.zone}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedCell.count} reports · {dateLabel}
                </p>
              </div>

              <button
                type="button"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Close"
                onClick={() => setSelectedCell(null)}
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {selectedCell.count === 0 ? (
                <p className="text-sm text-gray-600">
                  No reports for this area on the selected date.
                </p>
              ) : selectedCell.comments.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No comments were submitted for this area.
                </p>
              ) : (
                <ul className="space-y-4">
                  {selectedCell.comments.map((c, idx) => (
                    <li key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm text-gray-900">“{c.text}”</p>
                      <p className="mt-2 text-xs text-gray-500">{c.time}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

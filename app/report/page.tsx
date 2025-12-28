"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addReport, getRole } from "../../lib/storage";
import type { Floor, Zone } from "../../lib/types";

type Comfort = "cold" | "comfortable" | "warm";

export default function ReportPage() {
  const router = useRouter();

  // Greeting (no name)
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  }, []);

  // Date (UK format)
  const today = useMemo(() => {
    const d = new Date();
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  }, []);

  const [comfort, setComfort] = useState<Comfort>("comfortable");
  const [floor, setFloor] = useState<Floor>(5);
  const [zone, setZone] = useState<Zone>("1-10");
  const [comment, setComment] = useState("");

  // Tile styles (hover shadow, selected border matches icon colour)
  const baseTile =
    "w-full rounded-xl border bg-white px-4 py-6 transition shadow-sm " +
    "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400";

  const tileClasses = (type: Comfort) => {
    const selected = comfort === type;
    if (!selected) return `${baseTile} border-gray-200`;

    if (type === "cold") return `${baseTile} border-blue-600 bg-blue-50`;
    if (type === "comfortable") return `${baseTile} border-emerald-600 bg-emerald-50`;
    return `${baseTile} border-orange-600 bg-orange-50`;
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="px-6 py-6 flex items-center gap-2">
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
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <section className="flex justify-center">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-8">
              {/* Greeting + date inside the card */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{greeting}</p>
                <p className="text-sm text-gray-500">{today}</p>
              </div>

              <h1 className="mt-3 text-lg font-semibold text-gray-900">
                Submit Comfort Report
              </h1>

              <form
                className="mt-6 space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();

                  const role = getRole() ?? "worker";

                  addReport({
                    id: crypto.randomUUID(),
                    role,
                    floor,
                    zone,
                    comfort,
                    comment: comment.trim() ? comment.trim() : undefined,
                    createdAt: new Date().toISOString(),
                  });

                  router.push("/confirm");
                }}
              >
                {/* Floor & Seat range */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="floor"
                    >
                      Floor
                    </label>
                    <select
                      id="floor"
                      value={floor}
                      onChange={(e) => setFloor(Number(e.target.value) as Floor)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2
                                 text-gray-900
                                 focus:outline-none focus:border-gray-600"
                    >
                      <option value={5}>Floor 5</option>
                      <option value={6}>Floor 6</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="zone"
                    >
                      Seat Range
                    </label>
                    <select
                      id="zone"
                      value={zone}
                      onChange={(e) => setZone(e.target.value as Zone)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2
                                 text-gray-900
                                 focus:outline-none focus:border-gray-600"
                    >
                      <option value="1-10">1–10</option>
                      <option value="11-20">11–20</option>
                      <option value="21-30">21–30</option>
                      <option value="31-40">31–40</option>
                    </select>
                  </div>
                </div>

                {/* Comfort selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    How does it feel in your current area?
                  </label>

                  {/* ✅ Mobile-first: stack vertically. From sm up: 3 columns */}
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 items-stretch">
                    {/* Cold */}
                    <button
                      type="button"
                      aria-pressed={comfort === "cold"}
                      onClick={() => setComfort("cold")}
                      className={tileClasses("cold")}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <span aria-hidden="true" className="text-7xl text-blue-600 leading-none">
                          ●
                        </span>
                        <span className="text-sm font-medium text-gray-900">Too Cold</span>
                      </div>
                    </button>

                    {/* Comfortable */}
                    <button
                      type="button"
                      aria-pressed={comfort === "comfortable"}
                      onClick={() => setComfort("comfortable")}
                      className={tileClasses("comfortable")}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <span aria-hidden="true" className="text-7xl text-emerald-600 leading-none">
                          ■
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          Comfortable
                        </span>
                      </div>
                    </button>

                    {/* Warm */}
                    <button
                      type="button"
                      aria-pressed={comfort === "warm"}
                      onClick={() => setComfort("warm")}
                      className={tileClasses("warm")}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <span aria-hidden="true" className="text-6xl text-orange-600 leading-none">
                          ▲
                        </span>
                        <span className="text-sm font-medium text-gray-900">Too Warm</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="comment"
                  >
                    Optional comments
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-3
                               text-gray-900 placeholder:text-gray-400
                               focus:outline-none focus:border-gray-600"
                    placeholder="Anything else we should know?"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-purple-600 px-4 py-3 font-medium text-white hover:bg-purple-700"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

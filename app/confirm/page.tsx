"use client";

import { useMemo, useState } from "react";
import { getLatestReport } from "../../lib/storage";

export default function ConfirmPage() {
  const latest = getLatestReport();
  const [showDetails, setShowDetails] = useState(false);

  // Simple suggestion placeholder (you can improve this later)
  const suggestion = useMemo(() => {
    if (!latest) return "Based on your preference, try Floor 5, Seats 1–10.";
    return `Based on your report, try Floor ${latest.floor}, Seats ${latest.zone}.`;
  }, [latest]);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-10 shadow-sm text-center">
        {/* Success icon */}
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"
          aria-hidden="true"
        >
          <span className="text-3xl text-emerald-700">✓</span>
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-gray-900">
          Thank you for your submission!
        </h1>

        <p className="mt-3 text-gray-700">{suggestion}</p>

        {/* Primary action */}
        <div className="mt-8">
          <a
            href="/report"
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
          >
            Submit Another Report
          </a>
        </div>

        {/* Secondary action */}
        <div className="mt-4">
          <a
            href="/login"
            className="text-sm text-gray-700 underline underline-offset-4 hover:text-gray-900"
          >
            Logout
          </a>
        </div>

        {/* Details toggle (evidence without clutter) */}
        <div className="mt-10 text-left">
          <button
            type="button"
            onClick={() => setShowDetails((s) => !s)}
            className="text-sm font-medium text-gray-800 underline underline-offset-4 hover:text-gray-900"
            aria-expanded={showDetails}
          >
            {showDetails ? "Hide saved report details" : "View saved report details"}
          </button>

          {showDetails && (
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              {!latest ? (
                <p className="text-sm text-gray-600">
                  No saved report found yet. Submit a report first.
                </p>
              ) : (
                <dl className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Floor</dt>
                    <dd className="font-medium text-gray-900">{latest.floor}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Zone</dt>
                    <dd className="font-medium text-gray-900">{latest.zone}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Comfort</dt>
                    <dd className="font-medium text-gray-900">{latest.comfort}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Time</dt>
                    <dd className="font-medium text-gray-900">
                      {new Date(latest.createdAt).toLocaleString("en-GB")}
                    </dd>
                  </div>

                  {latest.comment ? (
                    <div className="mt-2">
                      <dt className="text-gray-500">Comment</dt>
                      <dd className="mt-1 font-medium text-gray-900">
                        {latest.comment}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

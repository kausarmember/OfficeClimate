"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveRole } from "../../lib/storage";
import type { Role } from "../../lib/types";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // demo only
  const [error, setError] = useState<string | null>(null);

  // MVP stand-in for real SSO/Directory roles.
  const fmAllowlist = useMemo(
    () => new Set(["fm.john@accenture.com", "fm.jane@accenture.com"]),
    []
  );

  function handleSignIn() {
    setError(null);

    const cleaned = email.trim().toLowerCase();
    if (!cleaned) return setError("Enter your email address.");
    if (!cleaned.includes("@")) return setError("Enter a valid email address.");
    if (!password) return setError("Enter your password.");

    const role: Role = fmAllowlist.has(cleaned) ? "fm" : "worker";
    saveRole(role);

    router.push(role === "fm" ? "/fm" : "/report");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        {/* Logo + app name */}
        <div className="flex items-center gap-2">
          <Image
            src="/accenture-logo1.png"
            alt="Accenture logo"
            width={50}
            height={28}
            priority
          />
          <h1 className="text-xl font-semibold text-gray-900">
            Accenture | OfficeClimate
          </h1>
        </div>

        <p className="text-gray-600 mt-4">
          Sign in with your organisation account
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@accenture.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2
                         focus:outline-none focus:border-gray-600"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2
                         focus:outline-none focus:border-gray-600"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleSignIn}
            className="w-full rounded-lg px-4 py-3 font-medium text-white
                       bg-purple-600 hover:bg-purple-700"
          >
            Sign In
          </button>

          <button className="w-full text-sm text-gray-500 underline underline-offset-2">
            Having trouble signing in?
          </button>

          <p className="text-xs text-gray-500 mt-2">
            Demo note: FM access is controlled by an allowlist in code (replace
            with SSO roles in production).
          </p>
        </div>
      </div>
    </main>
  );
}

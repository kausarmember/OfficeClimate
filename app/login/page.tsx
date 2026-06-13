"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { saveRole } from "../../lib/storage";
import type { Role } from "../../lib/types";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fmAllowlist = useMemo(
    () => new Set(["fm.john@accenture.com", "fm.jane@accenture.com"]),
    []
  );

  function handleSignIn() {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    const cleaned = email.trim().toLowerCase();
    if (!cleaned) {
      setError("Enter your email address.");
      setIsLoading(false);
      return;
    }
    if (!cleaned.includes("@")) {
      setError("Enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError("Enter your password.");
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }

    const role: Role = fmAllowlist.has(cleaned) ? "fm" : "worker";
    saveRole(role);

    router.push(role === "fm" ? "/fm" : "/report");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !isLoading) {
      handleSignIn();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
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
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="name@accenture.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2
                         text-gray-900 placeholder:text-gray-400
                        focus:outline-none focus:border-gray-600
                        disabled:opacity-50 disabled:cursor-not-allowed"
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
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Enter your password"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2
                         text-gray-900 placeholder:text-gray-400
                         focus:outline-none focus:border-gray-600
                         disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full rounded-lg px-4 py-3 font-medium text-white
                       bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <button 
            type="button"
            disabled={isLoading}
            className="w-full text-sm text-gray-500 underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Having trouble signing in?
          </button>
        </div>
      </div>
    </main>
  );
}

// MVP stand-in for real SSO/Directory roles.
// In production, roles would be derived from identity provider claims.
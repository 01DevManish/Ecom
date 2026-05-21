"use client";

import { FormEvent, useEffect, useState } from "react";

type User = {
  id: string;
  phone?: string;
  name?: string | null;
  email?: string | null;
  role?: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadMe = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      if (data?.role === "customer") setUser(data as User);
      else setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  async function sendOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP send failed");
      setOtpSent(true);
      setDevOtp(data.devOtp || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP send failed");
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verify failed");
      await loadMe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verify failed");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOtpSent(false);
    setOtp("");
  }

  if (loading) {
    return <div className="rounded-xl border border-[#e1e3e5] bg-white p-6 text-sm text-[#6d7175]">Loading account...</div>;
  }

  if (user) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[#e1e3e5] bg-white p-6">
          <h1 className="text-xl font-black text-[#202223]">My Account</h1>
          <p className="mt-2 text-sm text-[#4f5357]">Phone: {user.phone || "-"}</p>
          <p className="mt-1 text-sm text-[#4f5357]">Name: {user.name || "Not set"}</p>
          <button onClick={logout} className="mt-4 rounded-lg border border-[#c9cccf] px-3 py-2 text-xs font-semibold text-[#202223] hover:bg-[#f6f6f7]">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-xl border border-[#e1e3e5] bg-white p-6">
      <h1 className="text-xl font-black text-[#202223]">Login to continue</h1>
      <p className="mt-1 text-xs text-[#6d7175]">Login is required to add items to cart and wishlist.</p>

      {error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{error}</p> : null}

      {!otpSent ? (
        <form onSubmit={sendOtp} className="mt-4 space-y-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number (e.g. +918572839479)"
            className="h-10 w-full rounded-lg border border-[#c9cccf] px-3 text-sm"
            required
          />
          <button disabled={busy} className="h-10 w-full rounded-lg bg-[#008060] text-sm font-bold text-white disabled:opacity-60">
            {busy ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="mt-4 space-y-3">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="h-10 w-full rounded-lg border border-[#c9cccf] px-3 text-sm"
            required
          />
          <button disabled={busy} className="h-10 w-full rounded-lg bg-[#008060] text-sm font-bold text-white disabled:opacity-60">
            {busy ? "Verifying..." : "Verify OTP"}
          </button>
          {devOtp ? <p className="text-xs text-[#6d7175]">Dev OTP: <span className="font-bold text-[#202223]">{devOtp}</span></p> : null}
        </form>
      )}
    </div>
  );
}

"use client";

import React, {Suspense, useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {useThemeLanguage} from "../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../lib/api";

const VerifyContent = () => {
  const { t } = useThemeLanguage();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/auth/sign-in"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Device-Type": "web"
        },
        body: JSON.stringify({
          accountCredentials: { eMail: email },
          password
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.request?.resultMessage || data?.message || "Login failed. Please check your password.");
      }

      // Success -> Store token and redirect
      if (data?.payload?.token) {
        localStorage.setItem("auth_token", data.payload.token);
        window.location.href = "/";
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (err: any) {
      console.error("[Auth] Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-24 bg-background transition-colors duration-300">
      <div className="max-w-md w-full animate-fade-in-up">
        <div className="bg-surface rounded-[3rem] p-10 md:p-12 border border-border-color shadow-2xl shadow-primary/5 transition-colors duration-300">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-text-primary mb-3">Welcome back.</h1>
            <p className="text-text-secondary text-sm">Enter your password for <span className="text-text-primary font-bold">{email}</span></p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-text-secondary uppercase tracking-widest mb-3 px-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
                className="w-full px-6 py-4 rounded-2xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-text-primary font-bold placeholder:text-text-secondary/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-full font-black text-sm hover:opacity-90 transition-all duration-300 shadow-xl shadow-primary/20 active:scale-[0.98] mt-4 disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>

            <div className="text-center mt-6">
              <Link href="/forgot-password" title="Forgot Password" className="text-xs font-bold text-text-secondary hover:text-primary transition-colors">
                Forgot your password?
              </Link>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-border-color text-center">
             <Link href="/login" className="text-xs font-bold text-primary hover:underline">
               Use a different email
             </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}

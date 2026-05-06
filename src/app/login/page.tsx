"use client";

import React, {useState} from "react";
import Link from "next/link";
import {useThemeLanguage} from "../../context/ThemeLanguageContext";
import {useToast} from "../../context/ToastContext";
import {signInWithApple, signInWithGoogle} from "../../lib/firebase";
import {apiUrl} from "../../lib/api";

const LoginPage = () => {
  const { t } = useThemeLanguage();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"google" | "apple" | "email" | null>(null);

  // ── Shared: send idToken to backend social-login endpoint ───────────────────
  const sendToBackend = async (idToken: string, provider: "google" | "apple", user: any) => {
    const payload = {
      oauthData: {
        provider,
        idToken,
        email:         user.email,
        displayName:   user.displayName,
        profilePhoto:  user.photoURL,
        providerUserID: user.uid,
      },
    };

    const res = await fetch(apiUrl("/auth/social-login"), {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Device-Type": "web"
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json?.request?.resultMessage || json?.message || "Authentication failed.");
    }

    return json;
  };

  // ── Google ──────────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading("google");
    try {
      const { idToken, user: firebaseUser } = await signInWithGoogle();
      const result = await sendToBackend(idToken, "google", firebaseUser);

      if (result?.payload?.needsRegistration) {
        window.location.href = "/register?provider=google";
      } else if (result?.payload?.token) {
        const { token, user } = result.payload;
        localStorage.setItem("auth_token", token);
        localStorage.setItem("token", token); // For Admin compatibility
        if (user) localStorage.setItem("user", JSON.stringify(user));
        
        window.location.href = "/";
      } else {
        throw new Error(result?.request?.resultMessage || "Login failed.");
      }
    } catch (err: any) {
      showToast(err.message || "Google sign-in failed.", "error");
    } finally {
      setLoading(null);
    }
  };

  // ── Apple ───────────────────────────────────────────────────────────────────
  const handleAppleLogin = async () => {
    setLoading("apple");
    try {
      const { idToken, user: firebaseUser } = await signInWithApple();
      const result = await sendToBackend(idToken, "apple", firebaseUser);

      if (result?.payload?.needsRegistration) {
        window.location.href = "/register?provider=apple";
      } else if (result?.payload?.token) {
        const { token, user } = result.payload;
        localStorage.setItem("auth_token", token);
        localStorage.setItem("token", token); // For Admin compatibility
        if (user) localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "/";
      } else {
        throw new Error(result?.request?.resultMessage || "Login failed.");
      }
    } catch (err: any) {
      showToast(err.message || "Apple sign-in failed.", "error");
    } finally {
      setLoading(null);
    }
  };

  // ── Email/Password ──────────────────────────────────────────────────────────
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading("email");
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
        throw new Error(data?.request?.resultMessage || data?.message || "Login failed.");
      }

      if (data?.payload?.token) {
        const { token, user } = data.payload;
        localStorage.setItem("auth_token", token);
        localStorage.setItem("token", token); // For Admin compatibility
        if (user) localStorage.setItem("user", JSON.stringify(user));
        
        window.location.href = "/";
      } else {
        throw new Error(data?.request?.resultMessage || "Invalid response from server.");
      }
    } catch (err: any) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-24 bg-background transition-colors duration-300">
      <div className="max-w-md w-full animate-fade-in-up">
        <div className="bg-surface rounded-[3rem] p-10 md:p-12 border border-border-color shadow-2xl shadow-primary/5 transition-colors duration-300">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-text-primary mb-3">Welcome to salutbabe.</h1>
            <p className="text-text-secondary text-sm">Sign in to your account.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 py-4 bg-background border border-border-color text-text-primary rounded-full font-bold text-sm hover:bg-surface hover:border-primary transition-all duration-300 shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {loading === "google" ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
              )}
              Continue with Google
            </button>

            <button
              onClick={handleAppleLogin}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 py-4 bg-text-primary text-background rounded-full font-bold text-sm hover:opacity-90 transition-all duration-300 shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {loading === "apple" ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="18" height="18" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
              )}
              Continue with Apple
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-color"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface text-text-secondary">or use email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-text-secondary uppercase tracking-widest mb-2 px-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="hello@salutbabe.com"
                required
                className="w-full px-6 py-4 rounded-2xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-text-primary font-bold placeholder:text-text-secondary/50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-text-secondary uppercase tracking-widest mb-2 px-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-6 py-4 rounded-2xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-text-primary font-bold placeholder:text-text-secondary/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading !== null}
              className="w-full py-4 bg-primary text-white rounded-full font-black text-sm hover:opacity-90 transition-all duration-300 shadow-xl shadow-primary/20 active:scale-[0.98] mt-4 disabled:opacity-50"
            >
              {loading === "email" ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-border-color text-center">
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Devam ederek{" "}
              <button 
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: { tab: 'terms-of-use' } }))}
                className="font-black text-text-primary hover:text-primary transition-colors underline decoration-border-color underline-offset-4"
              >
                kullanım şartlarımızı
              </button>
              {" "}kabul etmiş sayılırsınız.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;

"use client";

import React, {useState} from "react";
import Link from "next/link";
import {useThemeLanguage} from "../../context/ThemeLanguageContext";
import {useToast} from "../../context/ToastContext";
import {signInWithApple, signInWithGoogle} from "../../lib/firebase";
import {apiUrl} from "../../lib/api";

const RegisterPage = () => {
  const { t } = useThemeLanguage();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [loading, setLoading] = useState<"google" | "apple" | "email" | "register" | null>(null);

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
      throw new Error(json?.request?.resultMessage || json?.message || "Registration failed.");
    }

    return json;
  };

  const processAuthResult = (result: any) => {
    if (result?.payload?.needsRegistration) {
      setShowDetailsPopup(true);
      return;
    }

    if (result?.payload?.token) {
      const { token, user } = result.payload;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/panel";
    } else {
      setShowDetailsPopup(true);
    }
  };

  // ── Google ──────────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading("google");
    try {
      const { idToken, user } = await signInWithGoogle();
      const result = await sendToBackend(idToken, "google", user);
      processAuthResult(result);
    } catch (err: any) {
      showToast(err.message || t("auth.google_failed"), "error");
    } finally {
      setLoading(null);
    }
  };

  // ── Apple ───────────────────────────────────────────────────────────────────
  const handleAppleLogin = async () => {
    setLoading("apple");
    try {
      const { idToken, user } = await signInWithApple();
      const result = await sendToBackend(idToken, "apple", user);
      processAuthResult(result);
    } catch (err: any) {
      showToast(err.message || t("auth.apple_failed"), "error");
    } finally {
      setLoading(null);
    }
  };

  // ── Email Start ─────────────────────────────────────────────────────────────
  const handleEmailStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setShowDetailsPopup(true);
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) return;
    setLoading("register");
    try {
      const res = await fetch(apiUrl("/auth/register"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Device-Type": "web"
        },
        body: JSON.stringify({
          eMail: email,
          password: password,
          userName: firstName,
          userSurname: lastName
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.request?.resultMessage || "Registration failed.");

      const { token, user } = json.payload;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/panel";
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
            <h1 className="text-3xl font-black text-text-primary mb-3">{t("auth.join")}</h1>
            <p className="text-text-secondary text-sm">{t("auth.signup_desc")}</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 py-4 bg-background border border-border-color text-text-primary rounded-full font-bold text-sm hover:bg-surface hover:border-primary transition-all duration-300 shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              {t("auth.google_signup")}
            </button>

            <button
              onClick={handleAppleLogin}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 py-4 bg-text-primary text-background rounded-full font-bold text-sm hover:opacity-90 transition-all duration-300 shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="18" height="18" fill="currentColor">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              {t("auth.apple_signup")}
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-color"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface text-text-secondary">{t("auth.or_email")}</span>
            </div>
          </div>

          <form onSubmit={handleEmailStart} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-text-secondary uppercase tracking-widest mb-2 px-1">
                {t("auth.email")}
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

            <button
              type="submit"
              disabled={loading !== null}
              className="w-full py-4 bg-primary text-white rounded-full font-black text-sm hover:opacity-90 transition-all duration-300 shadow-xl shadow-primary/20 active:scale-[0.98] mt-4 disabled:opacity-50"
            >
              {loading === "email" ? t("auth.continuing") : t("auth.signup_btn")}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              {t("auth.have_account")}{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                {t("auth.signin_link")}
              </Link>
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-border-color text-center">
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {t("auth.terms_prefix")}{" "}
              <button 
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: { tab: 'terms-of-use' } }))}
                className="font-black text-text-primary hover:text-primary transition-colors underline decoration-border-color underline-offset-4"
              >
                {t("auth.terms_link")}
              </button>
              {" "}{t("auth.terms_suffix")}{" "}
              {t("auth.regulations_link") && (
                <button 
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: { tab: 'terms-of-use' } }))}
                  className="font-black text-text-primary hover:text-primary transition-colors underline decoration-border-color underline-offset-4"
                >
                  {t("auth.regulations_link")}
                </button>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* REGISTRATION DETAILS MODAL */}
      {showDetailsPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border-color rounded-[3rem] p-10 md:p-12 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setShowDetailsPopup(false)}
              className="absolute right-8 top-8 text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-text-primary mb-2">Almost there!</h2>
              <p className="text-text-secondary text-sm">Please complete your details</p>
            </div>

            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-text-secondary uppercase tracking-widest mb-2 px-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    placeholder="Jane"
                    className="w-full px-6 py-4 rounded-2xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-text-primary font-bold placeholder:text-text-secondary/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-text-secondary uppercase tracking-widest mb-2 px-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    placeholder="Doe"
                    className="w-full px-6 py-4 rounded-2xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-text-primary font-bold placeholder:text-text-secondary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-text-secondary uppercase tracking-widest mb-2 px-1">
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-6 py-4 rounded-2xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-text-primary font-bold placeholder:text-text-secondary/50 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading === "register"}
                className="w-full py-4 bg-primary text-white rounded-full font-black text-sm hover:opacity-90 transition-all duration-300 shadow-xl shadow-primary/20 active:scale-[0.98] mt-4 disabled:opacity-50"
              >
                {loading === "register" ? t("auth.continuing") : t("auth.signup_btn")}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default RegisterPage;

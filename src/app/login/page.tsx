"use client";

import React, {useState} from "react";
import {useThemeLanguage} from "../../context/ThemeLanguageContext";
import {useToast} from "../../context/ToastContext";
import {auth, signInWithGoogle} from "../../lib/firebase";
import {OAuthProvider, signInWithPopup} from "firebase/auth";
import {apiUrl} from "../../lib/api";

const LoginPage = () => {
  const { t } = useThemeLanguage();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<"google" | "email" | "register" | null>(null);

  // Registration states
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

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
    console.log("[Auth] Backend Response:", json);

    if (!res.ok) {
      throw new Error(json?.request?.resultMessage || json?.message || "Authentication failed.");
    }

    return json;
  };

  const processAuthResult = (result: any) => {
    const payload = result?.payload;
    
    // Handle Token Presence (Success)
    if (payload?.token) {
      const { token, user } = payload;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      
      // REDIRECTION LOGIC:
      // 1- If SYSOP/ADMIN -> Admin Portal
      // 2- If normal USER -> Seller Panel (Currently Home, or /panel if exists)
      const userType = user?.userType;
      const isAdmin = Array.isArray(userType) 
        ? (userType.includes("SYSOP") || userType.includes("ADMIN"))
        : (userType === "SYSOP" || userType === "ADMIN");
      
      if (isAdmin) {
        window.location.href = "/dashboard/sysop";
      } else {
        window.location.href = "/dashboard/sysop";
      }
      return;
    }

    // Handle Registration / Linking States
    if (payload?.needsRegistration || payload?.isRegistered === false) {
      if (payload?.needsLinking) {
        showToast(t("auth.linking_required"), "info");
        // Auto-fill email if available from social login
        if (payload?.email) setEmail(payload.email);
      } else {
        if (payload?.email) setRegEmail(payload.email);
        setShowSignupPopup(true);
      }
      return;
    }

    // Fallback
    const msg = result?.request?.resultMessage || t("auth.invalid_response");
    showToast(msg, "info");
    
    if (msg.toLowerCase().includes('processed') || msg.toLowerCase().includes('not found')) {
       window.location.href = "/register";
    }
  };

  // ── Google ──────────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading("google");
    try {
      const { idToken, user: firebaseUser } = await signInWithGoogle();
      const result = await sendToBackend(idToken, "google", firebaseUser);
      processAuthResult(result);
    } catch (err: any) {
      showToast(err.message || t("auth.google_failed"), "error");
    } finally {
      setLoading(null);
    }
  };

  // ── Apple ───────────────────────────────────────────────────────────────────
  const handleAppleLogin = async () => {
    try {
      setLoading("google"); // Using google loading state since we don't have separate Apple state right now, or we can just use "apple" if we update state type
      if (!auth) {
        throw new Error("Firebase is not properly initialized. Check your environment variables.");
      }
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth as any, provider);
      const idToken = await result.user.getIdToken();
      const backendResponse = await sendToBackend(idToken, "apple", result.user);
      processAuthResult(backendResponse);
    } catch (error: any) {
      console.error("[Auth] Apple Login Error:", error);
      showToast(error.message || "Apple login failed.", "error");
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
        localStorage.setItem("token", token);
        if (user) localStorage.setItem("user", JSON.stringify(user));
        
        const userType = user?.userType || [];
        const isAdmin = userType.includes("SYSOP") || userType.includes("ADMIN");
        
        if (isAdmin) {
          window.location.href = "/dashboard/sysop";
        } else {
          window.location.href = "/dashboard/sysop";
        }
      } else {
        throw new Error(data?.request?.resultMessage || "Invalid response from server.");
      }
    } catch (err: any) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setLoading(null);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regFirstName || !regLastName) return;
    setLoading("register");
    try {
      const res = await fetch(apiUrl("/auth/register"), {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Device-Type": "web"
        },
        body: JSON.stringify({
          eMail: regEmail,
          password: regPassword,
          userName: regFirstName,
          userSurname: regLastName
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.request?.resultMessage || "Registration failed.");

      const { token, user } = json.payload;
      localStorage.setItem("auth_token", token);
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      
      const userType = user?.userType || [];
      const isAdmin = Array.isArray(userType) 
        ? (userType.includes("SYSOP") || userType.includes("ADMIN"))
        : (userType === "SYSOP" || userType === "ADMIN");
        
      if (isAdmin) {
        window.location.href = "/dashboard/sysop";
      } else {
        window.location.href = "/dashboard/sysop";
      }
    } catch (err: any) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md animate-fade-in-up">
        
        {/* Logo/Header area */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-text-primary tracking-tight mb-2">salutbabe.</h1>
          <p className="text-text-secondary text-[15px] font-medium">{t("auth.signin_desc") || "Hesabına giriş yap."}</p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-color/50">
          
          <div className="space-y-3">
            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              className="w-full relative flex items-center justify-center gap-3 py-3.5 bg-background border border-border-color text-text-primary rounded-xl font-bold text-[15px] hover:bg-surface hover:border-text-primary transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading === "google" ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg className="absolute left-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
              )}
              {t("auth.google_signin") || "Google ile devam et"}
            </button>

            {/* Apple Button */}
            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={loading !== null}
              className="w-full relative flex items-center justify-center gap-3 py-3.5 bg-text-primary text-background rounded-xl font-bold text-[15px] hover:opacity-90 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute left-4 w-[22px] h-[22px] flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" width="18" height="18">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
              </div>
              Continue with Apple
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 h-[1px] bg-border-color"></div>
            <span className="px-4 text-[13px] font-bold text-text-secondary uppercase tracking-wider bg-surface">
              {t("auth.or_email") || "veya"}
            </span>
            <div className="flex-1 h-[1px] bg-border-color"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t("auth.email") || "E-posta adresi"}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-background border border-border-color focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all outline-none text-text-primary font-medium placeholder:text-text-secondary/60 text-[15px]"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t("auth.password") || "Şifre"}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-background border border-border-color focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all outline-none text-text-primary font-medium placeholder:text-text-secondary/60 pr-12 text-[15px]"
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

            <button
              type="submit"
              disabled={loading !== null}
              className="w-full py-4 bg-text-primary text-background rounded-xl font-bold text-[15px] hover:opacity-90 transition-all duration-200 shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] active:scale-[0.98] mt-2 disabled:opacity-50"
            >
              {loading === "email" ? (t("auth.signing_in") || "Giriş yapılıyor...") : (t("auth.signin_btn") || "Giriş Yap")}
            </button>
          </form>
        </div>

        {/* Footer Area */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-[15px] text-text-secondary font-medium">
            {t("auth.no_account") || "Hesabın yok mu?"}{" "}
            <button type="button" onClick={() => setShowSignupPopup(true)} className="text-text-primary font-bold hover:underline underline-offset-4 decoration-2">
              {t("auth.signup_link") || "Kayıt ol"}
            </button>
          </p>

          <p className="text-[12px] text-text-secondary/70 max-w-sm mx-auto leading-relaxed">
            {t("auth.terms_prefix") || "Devam ederek"}{" "}
            <button 
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: { tab: 'terms-of-use' } }))}
              className="font-bold text-text-secondary hover:text-text-primary underline underline-offset-2"
            >
              {t("auth.terms_link") || "Kullanım Şartlarımızı"}
            </button>
            {" "}{t("auth.terms_suffix") || "kabul etmiş sayılırsınız."}{" "}
          </p>
        </div>
      </div>

      {/* REGISTRATION POPUP MODAL */}
      {showSignupPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border-color/50 rounded-3xl p-8 sm:p-10 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setShowSignupPopup(false)}
              className="absolute right-6 top-6 text-text-secondary hover:text-text-primary transition-colors bg-background rounded-full p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-text-primary mb-2">{t("auth.join") || "Kayıt Ol"}</h2>
              <p className="text-text-secondary text-[14px] font-medium">{t("auth.signup_desc") || "Aramıza katılmak için bilgilerini doldur."}</p>
            </div>

            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={regFirstName}
                  onChange={e => setRegFirstName(e.target.value)}
                  required
                  placeholder="Adınız"
                  className="w-full px-4 py-3.5 rounded-xl bg-background border border-border-color focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all outline-none text-text-primary font-medium placeholder:text-text-secondary/60 text-[15px]"
                />
                <input
                  type="text"
                  value={regLastName}
                  onChange={e => setRegLastName(e.target.value)}
                  required
                  placeholder="Soyadınız"
                  className="w-full px-4 py-3.5 rounded-xl bg-background border border-border-color focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all outline-none text-text-primary font-medium placeholder:text-text-secondary/60 text-[15px]"
                />
              </div>

              <input
                type="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="E-posta adresi"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-background border border-border-color focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all outline-none text-text-primary font-medium placeholder:text-text-secondary/60 text-[15px]"
              />

              <div className="relative">
                <input
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Şifre (min 8 karakter)"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-background border border-border-color focus:border-text-primary focus:ring-1 focus:ring-text-primary transition-all outline-none text-text-primary font-medium placeholder:text-text-secondary/60 pr-12 text-[15px]"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showRegPassword ? (
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

              <button
                type="submit"
                disabled={loading === "register"}
                className="w-full py-4 bg-text-primary text-background rounded-xl font-bold text-[15px] hover:opacity-90 transition-all duration-200 shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] active:scale-[0.98] mt-2 disabled:opacity-50"
              >
                {loading === "register" ? (t("auth.continuing") || "Kayıt olunuyor...") : (t("auth.signup_btn") || "Kayıt Ol")}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default LoginPage;

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
      
      const allowedEmails = ["mustafamavedda@gmail.com", "cansumavedda@gmail.com", "hidirektor@gmail.com"];
      const userEmail = user?.email || user?.eMail || "";
      const isWhitelisted = allowedEmails.includes(userEmail.toLowerCase());

      if (isAdmin || isWhitelisted) {
        window.location.href = "/dashboard/sysop";
      } else {
        window.location.href = "/";
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
          window.location.href = "/dashboard/sysop/product-approval";
        } else {
          window.location.href = "/";
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
        window.location.href = "/dashboard/sysop/product-approval";
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: '#FAFAFA', fontFamily: 'var(--font-family)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        
        {/* Logo/Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#111', letterSpacing: '-0.5px', marginBottom: '8px' }}>salutbabe.</h1>
          <p style={{ color: '#767676', fontSize: '15px', fontWeight: 500 }}>{t("auth.signin_desc") || "Hesabına giriş yap."}</p>
        </div>

        {/* Card */}
        <div style={{ background: '#FFF', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #EAEAEA' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '14px', background: '#FFF', border: '1px solid #EAEAEA', color: '#111', borderRadius: '14px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s', opacity: loading !== null ? 0.5 : 1 }}
            >
              {loading === "google" ? (
                <svg style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg style={{ position: 'absolute', left: '16px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22">
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
              style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '14px', background: '#111', color: '#FFF', borderRadius: '14px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none', transition: 'all 0.2s', opacity: loading !== null ? 0.5 : 1 }}
            >
              <div style={{ position: 'absolute', left: '16px', width: '22px', height: '22px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" width="18" height="18">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
              </div>
              {t("auth.apple_signin") || "Apple ile devam et"}
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#EAEAEA' }}></div>
            <span style={{ padding: '0 16px', fontSize: '13px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {t("auth.or_email") || "veya e-posta kullan"}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#EAEAEA' }}></div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t("auth.email") || "E-posta Adresi"}
              required
              style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', background: '#FAFAFA', border: '1px solid #EAEAEA', outline: 'none', color: '#111', fontWeight: 500, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t("auth.password") || "Şifre"}
                required
                style={{ width: '100%', padding: '14px 48px 14px 16px', borderRadius: '14px', background: '#FAFAFA', border: '1px solid #EAEAEA', outline: 'none', color: '#111', fontWeight: 500, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '4px' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  )}
                </svg>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading !== null}
              style={{ width: '100%', padding: '16px', background: '#111', color: '#FFF', borderRadius: '14px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none', marginTop: '4px', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'all 0.2s', opacity: loading !== null ? 0.5 : 1, fontFamily: 'inherit' }}
            >
              {loading === "email" ? (t("auth.signing_in") || "Giriş yapılıyor...") : (t("auth.signin_btn") || "GİRİŞ YAP")}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#767676', fontWeight: 500 }}>
            {t("auth.no_account") || "Hesabın yok mu?"}{" "}
            <button type="button" onClick={() => setShowSignupPopup(true)} style={{ color: '#111', fontWeight: 800, cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '4px', fontSize: '15px', fontFamily: 'inherit' }}>
              {t("auth.signup_link") || "Kayıt ol"}
            </button>
          </p>

          <p style={{ fontSize: '12px', color: '#999', maxWidth: '340px', margin: '16px auto 0', lineHeight: 1.6 }}>
            {t("auth.terms_prefix") || "Devam ederek"}{" "}
            <button 
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-legal-modal', { detail: { tab: 'terms-of-use' } }))}
              style={{ fontWeight: 700, color: '#767676', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', textUnderlineOffset: '2px', fontSize: '12px', fontFamily: 'inherit' }}
            >
              {t("auth.terms_link") || "kullanım şartlarımızı"}
            </button>
            {" "}{t("auth.terms_suffix") || "kabul etmiş sayılırsınız."}
          </p>
        </div>
      </div>

      {/* REGISTRATION POPUP MODAL */}
      {showSignupPopup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: '100%', maxWidth: '420px', background: '#FFF', border: '1px solid #EAEAEA', borderRadius: '24px', padding: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', position: 'relative' }}>
            <button
              onClick={() => setShowSignupPopup(false)}
              style={{ position: 'absolute', right: '20px', top: '20px', color: '#999', cursor: 'pointer', background: '#FAFAFA', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#111', marginBottom: '8px' }}>{t("auth.join") || "Kayıt Ol"}</h2>
              <p style={{ color: '#767676', fontSize: '14px', fontWeight: 500 }}>{t("auth.signup_desc") || "Aramıza katılmak için bilgilerini doldur."}</p>
            </div>

            <form onSubmit={handleEmailRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  type="text"
                  value={regFirstName}
                  onChange={e => setRegFirstName(e.target.value)}
                  required
                  placeholder="Adınız"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', background: '#FAFAFA', border: '1px solid #EAEAEA', outline: 'none', color: '#111', fontWeight: 500, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <input
                  type="text"
                  value={regLastName}
                  onChange={e => setRegLastName(e.target.value)}
                  required
                  placeholder="Soyadınız"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', background: '#FAFAFA', border: '1px solid #EAEAEA', outline: 'none', color: '#111', fontWeight: 500, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>

              <input
                type="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="E-posta adresi"
                required
                style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', background: '#FAFAFA', border: '1px solid #EAEAEA', outline: 'none', color: '#111', fontWeight: 500, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />

              <div style={{ position: 'relative' }}>
                <input
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Şifre (min 8 karakter)"
                  required
                  style={{ width: '100%', padding: '14px 48px 14px 16px', borderRadius: '14px', background: '#FAFAFA', border: '1px solid #EAEAEA', outline: 'none', color: '#111', fontWeight: 500, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '4px' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                    {showRegPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading === "register"}
                style={{ width: '100%', padding: '16px', background: '#111', color: '#FFF', borderRadius: '14px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none', marginTop: '4px', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'all 0.2s', opacity: loading === "register" ? 0.5 : 1, fontFamily: 'inherit' }}
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

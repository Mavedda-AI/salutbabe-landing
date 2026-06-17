"use client";

import React, {useEffect, useRef, useState} from "react";
import {useThemeLanguage} from "../../context/ThemeLanguageContext";
import {useToast} from "../../context/ToastContext";
import {auth, signInWithGoogle} from "../../lib/firebase";
import {OAuthProvider, signInWithPopup} from "firebase/auth";
import {apiUrl} from "../../lib/api";
import {useAuthStore} from "../../store/useAuthStore";
import {useRouter} from "next/navigation";

const GlowInput = ({ label, type = "text", value, onChange, placeholder, required, icon, ...props }: any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const updateCapsLock = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState("CapsLock"));
  };

  // HACK: Safari forces an unremovable Caps Lock icon on type="password". 
  // By using type="text" and masking the font via -webkit-text-security, 
  // we bypass Safari's forced UI while keeping the password perfectly masked!
  const isPasswordMasked = type === "password";
  const renderedType = isPasswordMasked ? "text" : type;

  return (
    <div 
      ref={containerRef}
      className="relative w-full group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <label className="absolute top-0 -translate-y-1/2 left-4 px-1.5 bg-white dark:bg-[#12141C] z-20 pointer-events-none">
        <span className="relative block text-[11px] font-bold tracking-wider text-gray-500 dark:text-[#8F95B2]">
          {label}
          
          {/* Overlay text that receives the gradient and is masked by the exact mouse position */}
          <span 
            className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-600 to-gray-400 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              WebkitMaskImage: `radial-gradient(100px circle at ${position.x - 16}px ${position.y + 8}px, black, transparent)`,
              maskImage: `radial-gradient(100px circle at ${position.x - 16}px ${position.y + 8}px, black, transparent)`
            }}
          >
            {label}
          </span>
        </span>
      </label>
      
      <div className="relative rounded-xl bg-gray-100 dark:bg-[#222533] z-10 overflow-hidden">
        {/* Dynamic Gradient Glow */}
        <div 
          className="absolute inset-0 z-0 transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `linear-gradient(135deg, white, gray-100, gray-200)`,
            WebkitMaskImage: `radial-gradient(100px circle at ${position.x}px ${position.y}px, black, transparent)`,
            maskImage: `radial-gradient(100px circle at ${position.x}px ${position.y}px, black, transparent)`
          }}
        />

        {/* Inner background blocking glow except 1px border */}
        <div className="absolute inset-[1px] bg-white dark:bg-[#222533] rounded-xl z-0 transition-colors group-focus-within:bg-gray-50 dark:group-focus-within:bg-[#1C1F2B]" />
        
        {/* Flex Layout for Input + Icons to prevent Safari native overlap */}
        <div className="relative z-10 w-full h-14 border border-gray-200 dark:border-transparent focus-within:border-gray-900 dark:border-white/50 rounded-xl px-5 flex items-center transition-all">
          <input
            type={renderedType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            onKeyDown={updateCapsLock}
            onKeyUp={updateCapsLock}
            onClick={updateCapsLock}
            style={{ WebkitTextSecurity: isPasswordMasked ? "disc" : "none" }}
            {...props}
            className="flex-1 w-full bg-transparent text-[#1A2332] dark:text-white placeholder-gray-400 dark:placeholder-[#4A506B] outline-none h-full"
          />
          <div className="flex items-center gap-2 ml-2 shrink-0">
            {capsLockActive && (
              <div className="text-gray-900 dark:text-white animate-pulse" title="Caps Lock is ON">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="4" y="4" width="16" height="16" rx="4" />
                  <path d="M12 16V8" />
                  <path d="M8 12L12 8L16 12" />
                </svg>
              </div>
            )}
            {icon && <div>{icon}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { t } = useThemeLanguage();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<"google" | "email" | "register" | null>(null);
  
  const { isAuthenticated, user, hydrateStore } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    hydrateStore();
  }, [hydrateStore]);

  useEffect(() => {
    if (isAuthenticated) {
      const userType = user?.userType;
      const isAdmin = Array.isArray(userType) 
        ? (userType.includes("SYSOP") || userType.includes("ADMIN"))
        : (userType === "SYSOP" || userType === "ADMIN");
      
      const allowedEmails = ["mustafamavedda@gmail.com", "cansumavedda@gmail.com", "hidirektor@gmail.com"];
      const userEmail = user?.email || user?.eMail || "";
      const isWhitelisted = allowedEmails.includes(userEmail.toLowerCase());

      if (isAdmin || isWhitelisted) {
        router.push("/dashboard/sysop");
      } else {
        router.push("/dashboard/common");
      }
    }
  }, [isAuthenticated, user, router]);

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
        window.location.href = "/dashboard/common";
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
       window.location.href = "https://www.salutbabe.com/download";
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
    <main className="min-h-screen flex w-full font-sans bg-gray-50 dark:bg-[#0B0C10] text-[#1A2332] dark:text-white">
      
      {/* Left Promotional Side (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img src="/images/login-promo.png" alt="Promo" className="w-full h-full object-cover" />
          {/* Subtle gradient to blend with the dark background */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50/80 via-gray-50/40 dark:from-[#0B0C10]/80 dark:via-[#0B0C10]/40 to-transparent"></div>
        </div>
        
        {/* Glassmorphic overlay card at the bottom */}
        <div className="relative z-10 m-12 p-8 rounded-[32px] bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 rounded-full border border-[#1A2332]/20 dark:border-white/30 flex items-center justify-center text-[10px] text-[#1A2332] dark:text-white">
                ✓
              </div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#1A2332]/70 dark:text-white/70 uppercase">
                {t('auth.secure_shopping') || 'GÜVENLİ ALIŞVERİŞ'}
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-[#1A2332] dark:text-white mb-2">
              {t('auth.promo_title') || 'Anneden anneye, güvenle.'}
            </h2>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('auth.promo_subtitle') || 'Sıfır Komisyon Avantajı'}
            </h3>
            <p className="text-sm text-[#1A2332]/70 dark:text-white/60">
              {t('auth.promo_desc') || 'Bebeğinizin küçülenlerini değerlendirin, ihtiyacınız olanlara ulaşın.'}
            </p>
          </div>
          
          <button className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors px-6 py-3 rounded-full flex items-center gap-3 font-bold text-sm text-white dark:text-gray-900 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
            <span className="w-6 h-6 rounded-full bg-[#101516] text-gray-900 dark:text-white flex items-center justify-center text-lg leading-none">
              →
            </span>
            {t('auth.discover') || 'KEŞFET'}
          </button>
        </div>
      </div>

      {/* Right Login Side */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-16 relative bg-white dark:bg-[#12141C] overflow-y-auto">
        <div className="w-full max-w-[400px] mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight mb-3">
              {t('auth.welcome_back') || 'Welcome Back to'} <span className="text-gray-900 dark:text-white">salutbabe</span>
            </h1>
            <p className="text-gray-500 dark:text-[#8F95B2] font-medium text-sm">
              {t('auth.signin_desc') || 'Sign in to continue your journey'}
            </p>
          </div>

          {/* Email / Phone Toggle */}
          <div className="flex bg-gray-100 dark:bg-[#1B1D27] rounded-[24px] p-1.5 max-w-[260px] mx-auto mb-10 border border-gray-200 dark:border-[#2A2E3D]/50 shadow-inner">
            <button type="button" className="flex-1 bg-white dark:bg-[#3A3F55] text-[#1A2332] dark:text-white rounded-[20px] py-2.5 text-[15px] font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              {t('auth.email_toggle') || 'Email'}
            </button>
            <button 
              type="button" 
              onClick={() => showToast(t('auth.coming_soon') || 'Yakında eklenecek!', 'info')}
              className="flex-1 text-gray-500 dark:text-[#6F768E] hover:text-[#1A2332] dark:hover:text-white/80 transition-colors rounded-[20px] py-2.5 text-[15px] font-bold"
            >
              {t('auth.phone_toggle') || 'Phone'}
            </button>
          </div>

          <form onSubmit={handleEmailLogin} className="flex flex-col gap-6">
            
            {/* Custom Outline Input - Email */}
            <GlowInput
              label={t('auth.email') || "E-Mail"}
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              placeholder={t('auth.email_placeholder') || "Enter your email"}
              required
            />

            {/* Custom Outline Input - Password */}
            <GlowInput
              label={t('auth.password') || "Password"}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              placeholder={t('auth.password_placeholder') || "Enter your password"}
              required
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#8F95B2] hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
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
              }
            />

            {/* Extras: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between px-1">
              <label className="cursor-pointer flex items-center gap-3">
                <input type="checkbox" className="checkbox checkbox-sm rounded bg-gray-50 dark:bg-[#222533] border-gray-300 dark:border-[#4A506B] checked:bg-gray-900 dark:bg-white checked:border-gray-900 dark:border-white" />
                <span className="text-sm text-gray-600 dark:text-[#8F95B2] font-medium">{t('auth.remember_me') || "Remember Me"}</span>
              </label>
              
              <button type="button" className="text-sm text-gray-900 dark:text-white font-bold hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                {t('auth.forgot_password') || "Forgot Password?"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading !== null}
              className="w-full h-14 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl mt-4 font-bold text-[15px] shadow-[0_0_25px_rgba(0,0,0,0.15)] transition-all"
            >
              {loading === "email" ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  {t('auth.signing_in') || "Signing In..."}
                </div>
              ) : (
                t('auth.signin_btn') || "Sign In"
              )}
            </button>
            
            {/* Google Alternative Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              className="w-full h-14 bg-white dark:bg-[#222533] hover:bg-gray-50 dark:hover:bg-[#2A2E40] border border-gray-200 dark:border-[#2A2E40] text-[#1A2332] dark:text-white rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              {t('auth.google_signin') || "Continue with Google"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-[13px] text-gray-500 dark:text-[#8F95B2] font-medium">
              {t('auth.no_account') || "Don't Have an Account?"}{" "}
              <button type="button" onClick={() => window.location.href = "https://www.salutbabe.com/download"} className="text-gray-900 dark:text-white font-bold hover:underline underline-offset-4 ml-1">
                {t('auth.create_one') || "Create One"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* REGISTRATION POPUP MODAL */}
      <dialog className={`modal ${showSignupPopup ? 'modal-open' : ''}`}>
        <div className="modal-box p-8 sm:p-10 rounded-3xl max-w-lg bg-white dark:bg-[#171923] border border-gray-200 dark:border-[#222533] text-[#1A2332] dark:text-white">
          <button
            onClick={() => setShowSignupPopup(false)}
            className="btn btn-sm btn-circle btn-ghost absolute right-5 top-5 text-gray-400 dark:text-[#8F95B2] hover:text-[#1A2332] dark:hover:text-white"
          >
            ✕
          </button>
          
          <div className="text-center mb-10 mt-2">
            <h2 className="text-3xl font-black mb-3 text-[#1A2332] dark:text-white">{t('auth.create_account') || "Create Account"}</h2>
            <p className="text-[15px] text-gray-500 dark:text-[#8F95B2] font-medium">{t('auth.signup_desc') || "Join us to continue your journey."}</p>
          </div>

          <form onSubmit={handleEmailRegister} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <GlowInput
                label={t('auth.first_name') || "First Name"}
                type="text"
                value={regFirstName}
                onChange={(e: any) => setRegFirstName(e.target.value)}
                placeholder={t('auth.first_name_placeholder') || "Enter first name"}
                required
              />
              <GlowInput
                label={t('auth.last_name') || "Last Name"}
                type="text"
                value={regLastName}
                onChange={(e: any) => setRegLastName(e.target.value)}
                placeholder={t('auth.last_name_placeholder') || "Enter last name"}
                required
              />
            </div>

            <GlowInput
              label={t('auth.email') || "E-Mail"}
              type="email"
              value={regEmail}
              onChange={(e: any) => setRegEmail(e.target.value)}
              placeholder={t('auth.email_placeholder') || "Enter your email"}
              required
            />

            <GlowInput
              label={t('auth.password') || "Password"}
              type={showRegPassword ? "text" : "password"}
              value={regPassword}
              onChange={(e: any) => setRegPassword(e.target.value)}
              placeholder={t('auth.password_min') || "Min 8 characters"}
              required
              icon={
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="text-[#8F95B2] hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
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
              }
            />

            <button
              type="submit"
              disabled={loading !== null}
              className="w-full h-14 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl mt-4 font-bold text-[15px] shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-all"
            >
              {loading === "register" ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  {t('auth.creating_account') || "Creating Account..."}
                </div>
              ) : (
                t('auth.create_account') || "Create Account"
              )}
            </button>
          </form>
        </div>
        
        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowSignupPopup(false)}>close</button>
        </form>
      </dialog>
    </main>
  );
};

export default LoginPage;

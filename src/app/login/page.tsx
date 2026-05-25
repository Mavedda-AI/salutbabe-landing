"use client";

import React, {useState} from "react";
import {useThemeLanguage} from "@/context/ThemeLanguageContext";
import {useToast} from "@/context/ToastContext";
import {apiUrl} from "@/lib/api";
import {auth} from "@/lib/firebase";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";

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
    try {
      setLoading("google");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const backendResponse = await sendToBackend(idToken, "google", result.user);
      processAuthResult(backendResponse);
    } catch (error: any) {
      console.error("[Auth] Google Login Error:", error);
      showToast(error.message || "Google login failed.", "error");
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
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-[#0B0C0E] transition-colors duration-300">
      
      {/* LEFT SIDE - IMAGE & OVERLAY & SCROLLING GRID */}
      <div className="relative hidden lg:block w-full h-full overflow-hidden bg-[#0A0A0A]">
        <img 
          src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80" 
          alt="Salutbabe Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        
        {/* Scrolling Grid Overlay */}
        <div className="absolute inset-0 z-10 overflow-hidden flex gap-6 px-4 py-8 rotate-[-4deg] scale-125 origin-center ml-10">
          <style>{`
            @keyframes scrollUp {
              0% { transform: translateY(0); }
              100% { transform: translateY(-50%); }
            }
            @keyframes scrollDown {
              0% { transform: translateY(-50%); }
              100% { transform: translateY(0); }
            }
            .animate-scroll-up { animation: scrollUp 45s linear infinite; }
            .animate-scroll-down { animation: scrollDown 55s linear infinite; }
          `}</style>
          
          {/* Column 1 (Scrolls Up) */}
          <div className="flex flex-col gap-6 w-1/3 animate-scroll-up">
            {[1,2].map((group) => (
              <React.Fragment key={group}>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-3xl shadow-2xl flex flex-col gap-3">
                  <img src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=300" className="w-full h-44 object-cover rounded-2xl" alt="" />
                  <div className="flex justify-between items-center px-2 pb-1">
                    <span className="text-white font-bold text-sm">Zara Kids Mont</span>
                    <span className="text-white font-black text-sm">450 ₺</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl flex flex-col gap-3">
                  <div className="flex gap-1 text-yellow-400 text-sm">★★★★★</div>
                  <p className="text-white/90 text-[15px] font-medium leading-relaxed">"Harika bir uygulama, aradığım her şeyi çok hızlı ve güvenle buldum."</p>
                  <span className="text-white/50 text-[11px] uppercase tracking-wider font-black">Ayşe Y.</span>
                </div>
                <div className="bg-[#A0D8D0]/90 backdrop-blur-xl border border-white/30 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center gap-2">
                  <span className="text-[#1B5E20] font-black text-4xl tracking-tighter">50K+</span>
                  <span className="text-[#1B5E20]/80 text-[11px] font-black uppercase tracking-widest">Mutlu Anne</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Column 2 (Scrolls Down) */}
          <div className="flex flex-col gap-6 w-1/3 animate-scroll-down">
            {[1,2].map((group) => (
              <React.Fragment key={group}>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-black text-lg">Z</div>
                    <div>
                      <div className="text-white font-black text-[15px]">Zeynep'in Dolabı</div>
                      <div className="text-white/60 text-xs font-bold">240 Ürün</div>
                    </div>
                  </div>
                  <button type="button" className="w-full py-3 bg-white text-black font-black rounded-xl text-xs hover:bg-gray-100 transition-colors">Takip Et</button>
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-3xl shadow-2xl flex flex-col gap-3">
                  <img src="https://images.unsplash.com/photo-1522771930-78848d92d3e2?auto=format&fit=crop&q=80&w=300" className="w-full h-56 object-cover rounded-2xl" alt="" />
                  <div className="flex justify-between items-center px-2 pb-1">
                    <span className="text-white font-bold text-sm">Nike Ayakkabı</span>
                    <span className="text-white font-black text-sm">890 ₺</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl flex flex-col gap-3">
                  <div className="text-white font-black text-lg">Güvenli Ödeme</div>
                  <p className="text-white/70 text-sm font-medium leading-relaxed">Tüm alışverişleriniz Salutbabe iade güvencesi altındadır.</p>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Column 3 (Scrolls Up) */}
          <div className="flex flex-col gap-6 w-1/3 animate-scroll-up" style={{ animationDelay: '-15s' }}>
            {[1,2].map((group) => (
              <React.Fragment key={group}>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-3xl shadow-2xl flex flex-col gap-3">
                  <img src="https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&q=80&w=300" className="w-full h-40 object-cover rounded-2xl" alt="" />
                  <div className="flex justify-between items-center px-2 pb-1">
                    <span className="text-white font-bold text-sm">Bebek Arabası</span>
                    <span className="text-white font-black text-sm">4.500 ₺</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl flex flex-col gap-4">
                  <span className="text-white font-black text-sm tracking-wide">Yeni Mesaj</span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex-shrink-0"></div>
                    <div className="h-2 w-32 bg-white/30 rounded-full"></div>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full mt-1"></div>
                  <div className="h-2 w-2/3 bg-white/20 rounded-full"></div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-3xl shadow-2xl flex flex-col gap-3">
                  <img src="https://images.unsplash.com/photo-1560506840-0cae0350d512?auto=format&fit=crop&q=80&w=300" className="w-full h-60 object-cover rounded-2xl" alt="" />
                  <div className="flex justify-between items-center px-2 pb-1">
                    <span className="text-white font-bold text-sm">Kız Çocuk Elbise</span>
                    <span className="text-white font-black text-sm">320 ₺</span>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Gradient Fade Overlays */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/90"></div>

        {/* Text Area */}
        <div className="absolute bottom-0 left-0 right-0 p-16 z-30 pointer-events-none">
          <h2 className="text-5xl font-black text-white mb-5 leading-[1.1] drop-shadow-xl tracking-tight">
            Anne ve çocuk modasının<br/>en büyük Super-App'i
          </h2>
          <p className="text-white/80 text-[17px] font-medium max-w-md drop-shadow-lg leading-relaxed">
            Binlerce butik, özel tasarımlar ve güvenilir alışveriş deneyimi Salutbabe'de seni bekliyor.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full h-full flex flex-col items-center justify-center px-6 py-12 md:px-16 xl:px-24 animate-fade-in-up">
        <div className="w-full max-w-[400px]">
          
          {/* Logo / Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#2D2D2D] dark:bg-white flex items-center justify-center shadow-lg">
              <span className="text-2xl font-black text-white dark:text-black">S</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-[28px] font-black text-gray-900 dark:text-white mb-3 tracking-tight">
              Salutbabe'e Hoşgeldin
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-[15px] font-medium leading-relaxed px-4">
              En büyük anne-çocuk "Super-App"ine katılmak için giriş yap veya kayıt ol.
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E-posta Adresin"
                required
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 text-[15px] shadow-sm"
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Şifren"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 text-[15px] pr-12 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              <div className="flex justify-end mt-3">
                <span className="text-[13px] font-bold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white cursor-pointer transition-colors">
                  Şifremi Unuttum
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading !== null}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-[15px] hover:bg-gray-800 dark:hover:bg-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] mt-2 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
            >
              {loading === "email" ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : "Giriş Yap"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <hr className="flex-1 border-gray-200 dark:border-[#2A2A2C]" />
            <span className="text-[14px] text-gray-400 font-medium">veya</span>
            <hr className="flex-1 border-gray-200 dark:border-[#2A2A2C]" />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-2xl font-bold text-[15px] hover:bg-gray-50 dark:hover:bg-white/5 hover:shadow-md transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-sm"
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
              Google ile Devam Et
            </button>
            
            {/* Apple login removed as requested */}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button 
              type="button" 
              onClick={() => window.location.href='/dashboard/seller'} 
              className="px-6 py-3 bg-[#E8F5E9] text-[#2E7D32] dark:bg-[#2E7D32]/20 dark:text-[#A5D6A7] rounded-xl font-bold text-[14px] hover:bg-[#C8E6C9] dark:hover:bg-[#2E7D32]/40 transition-colors shadow-sm"
            >
              Satış Paneli
            </button>
            <button 
              type="button" 
              onClick={() => setShowSignupPopup(true)} 
              className="px-6 py-3 bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white rounded-xl font-bold text-[14px] hover:bg-gray-200 dark:hover:bg-white/20 transition-colors shadow-sm"
            >
              Kaydol
            </button>
          </div>

        </div>
      </div>

      {/* REGISTRATION POPUP MODAL */}
      {showSignupPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#121214] border border-gray-100 dark:border-[#2A2A2C] rounded-[2rem] p-10 md:p-12 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setShowSignupPopup(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Aramıza Katıl</h2>
              <p className="text-gray-500 text-sm">Hemen hesap oluştur ve alışverişe başla.</p>
            </div>

            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={regFirstName}
                    onChange={e => setRegFirstName(e.target.value)}
                    required
                    placeholder="Adın"
                    className="w-full px-5 py-4 rounded-2xl bg-[#F7F7F9] dark:bg-[#161618] border-none focus:ring-2 focus:ring-[#2D2D2D] dark:focus:ring-white transition-all outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 text-[15px]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={regLastName}
                    onChange={e => setRegLastName(e.target.value)}
                    required
                    placeholder="Soyadın"
                    className="w-full px-5 py-4 rounded-2xl bg-[#F7F7F9] dark:bg-[#161618] border-none focus:ring-2 focus:ring-[#2D2D2D] dark:focus:ring-white transition-all outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 text-[15px]"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="E-posta Adresin"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-[#F7F7F9] dark:bg-[#161618] border-none focus:ring-2 focus:ring-[#2D2D2D] dark:focus:ring-white transition-all outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 text-[15px]"
                />
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showRegPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Şifre Belirle"
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-[#F7F7F9] dark:bg-[#161618] border-none focus:ring-2 focus:ring-[#2D2D2D] dark:focus:ring-white transition-all outline-none text-gray-900 dark:text-white font-medium placeholder:text-gray-400 text-[15px] pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              </div>

              <button
                type="submit"
                disabled={loading === "register"}
                className="w-full py-4 bg-[#2D2D2D] dark:bg-white text-white dark:text-black rounded-2xl font-bold text-[15px] hover:bg-black dark:hover:bg-gray-100 transition-all duration-300 active:scale-[0.98] mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading === "register" ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : "Kayıt Ol"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default LoginPage;

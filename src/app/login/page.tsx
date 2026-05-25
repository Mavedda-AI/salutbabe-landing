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
  
  const [view, setView] = useState<"social" | "email">("social");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<"google" | "email" | "register" | null>(null);

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
        if (payload?.email) setEmail(payload.email);
        setView("email");
      } else {
        showToast("Registration required", "info");
        window.location.href = "/register";
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

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <main className="min-h-screen w-full bg-white flex flex-col items-center pt-[12vh]">
      
      {/* Container */}
      <div className="w-full max-w-[400px] px-6 flex flex-col items-center">
        
        {/* Logo */}
        <div className="w-[60px] h-[60px] bg-[#FF3300] rounded-full flex items-center justify-center mb-6 shadow-sm overflow-hidden">
           {/* Depop style simple circle or letter */}
           <span className="text-white font-black text-3xl select-none leading-none mt-1">S</span>
        </div>

        {/* Title */}
        <h1 className="text-[28px] font-black text-[#111111] mb-10 tracking-tight text-center">
          Sign up or log in
        </h1>

        {view === "social" ? (
          <div className="w-full flex flex-col items-center">
            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              className="w-full relative flex items-center justify-center py-3.5 mb-3 bg-white border border-gray-300 text-[#111111] rounded-full font-bold text-[15px] hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {loading === "google" ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <>
                  Continue with Google
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                  </div>
                </>
              )}
            </button>
            
            {/* Apple Button */}
            <button
              disabled={loading !== null}
              className="w-full relative flex items-center justify-center py-3.5 bg-black text-white rounded-full font-bold text-[15px] hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="white" width="18" height="18">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
              </div>
              Continue with Apple
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8 w-full px-2">
              <hr className="flex-1 border-gray-300" />
              <span className="text-[14px] text-gray-500 font-medium bg-white">or</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Email Link */}
            <button 
              onClick={() => setView("email")}
              className="text-[#1976D2] font-bold text-[16px] hover:underline"
            >
              Continue with email
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailLogin} className="w-full flex flex-col items-center">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-4 py-4 mb-4 rounded-xl border border-gray-400 bg-white text-gray-900 font-medium placeholder:text-gray-500 focus:border-black focus:ring-1 focus:ring-black outline-none text-[15px] transition-colors"
            />
            
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-4 mb-8 rounded-xl border border-gray-400 bg-white text-gray-900 font-medium placeholder:text-gray-500 focus:border-black focus:ring-1 focus:ring-black outline-none text-[15px] transition-colors"
            />

            <button
              type="submit"
              disabled={!isFormValid || loading !== null}
              className={`w-full py-3.5 rounded-sm font-bold text-[16px] transition-colors flex items-center justify-center gap-2 ${
                isFormValid
                  ? "bg-black text-white hover:bg-gray-900"
                  : "bg-[#D9D9D9] text-white cursor-not-allowed"
              }`}
            >
              {loading === "email" ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : "Continue"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8 w-full px-2">
              <hr className="flex-1 border-gray-300" />
              <span className="text-[14px] text-gray-500 font-medium bg-white">or</span>
              <hr className="flex-1 border-gray-300" />
            </div>
            
            <div className="w-full space-y-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading !== null}
                className="w-full relative flex items-center justify-center py-3.5 bg-white border border-gray-300 text-[#111111] rounded-full font-bold text-[15px] hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Continue with Google
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                </div>
              </button>
              
              {/* Apple Button */}
              <button
                type="button"
                disabled={loading !== null}
                className="w-full relative flex items-center justify-center py-3.5 bg-black text-white rounded-full font-bold text-[15px] hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="white" width="18" height="18">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                </div>
                Continue with Apple
              </button>
            </div>
            
            {/* Back Button */}
            <button 
              type="button"
              onClick={() => setView("social")}
              className="mt-6 text-gray-500 font-bold text-[14px] hover:text-black hover:underline"
            >
              Geri dön
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default LoginPage;

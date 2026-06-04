"use client";

import React, {useState} from "react";
import {useThemeLanguage} from "@/context/ThemeLanguageContext";
import {useToast} from "@/context/ToastContext";
import {apiUrl} from "@/lib/api";
import {auth} from "@/lib/firebase";
import {GoogleAuthProvider, OAuthProvider, signInWithPopup} from "firebase/auth";
import Header from "@/components/Header";

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
      if (!auth || !auth.app) {
        throw new Error("Firebase is not properly initialized. Check your environment variables.");
      }
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

  // ── Apple ───────────────────────────────────────────────────────────────────
  const handleAppleLogin = async () => {
    try {
      setLoading("google"); // Using google loading state since we don't have separate Apple state right now, or we can just use "apple" if we update state type
      if (!auth || !auth.app) {
        throw new Error("Firebase is not properly initialized. Check your environment variables.");
      }
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
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

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-white flex flex-col items-center pt-[10vh]">
      
      {/* Container */}
      <div className="w-full max-w-[330px] px-2 flex flex-col items-center">
        
        {/* Logo */}
        <div className="w-[44px] h-[44px] bg-[#E32915] rounded-full flex items-center justify-center mb-5 overflow-hidden">
           {/* Depop style red circle */}
           <span className="text-white font-black text-xl select-none mt-0.5">S</span>
        </div>

        {/* Title */}
        <h1 className="text-[24px] font-extrabold text-[#111111] mb-6 tracking-tight text-center">
          Sign up or log in
        </h1>

        {view === "social" ? (
          <div className="w-full flex flex-col items-center">
            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading !== null}
              style={{ border: '1px solid #DADCE0' }}
              className="w-full h-[48px] flex items-center mb-3 bg-white text-[#3C4043] rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {loading === "google" ? (
                <div className="w-full flex justify-center">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                </div>
              ) : (
                <>
                  <div className="w-[52px] h-full flex justify-center items-center shrink-0">
                    <img 
                      src="https://lh3.googleusercontent.com/a/ACg8ocKwZt92G9N1zL8pS0y_6RzH8Q7Q=s96-c" 
                      alt="Avatar" 
                      className="w-[28px] h-[28px] rounded-full object-cover shadow-sm"
                      onError={(e) => {
                        // Fallback to a transparent pixel or default avatar to avoid React removeChild errors
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='22' height='22'%3E%3Cpath fill='%23FFC107' d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3Cpath fill='%23FF3D00' d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'/%3E%3Cpath fill='%234CAF50' d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'/%3E%3Cpath fill='%231976D2' d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col items-start justify-center text-left pt-[2px]">
                    <span className="font-bold text-[#3C4043] text-[13.5px] leading-tight">Continue as Mustafa</span>
                    <span className="text-[#5F6368] text-[11px] leading-tight mt-[1px]">mustafamavedda@gmail.com</span>
                  </div>
                  <div className="w-[40px] h-full flex justify-center items-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18">
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
              type="button"
              onClick={handleAppleLogin}
              disabled={loading !== null}
              style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
              className="w-full h-[48px] flex items-center rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              <div className="w-[52px] h-full flex justify-center items-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="white" width="18" height="18">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
              </div>
              <div className="flex-1 flex items-center justify-start">
                <span className="font-extrabold text-[15px] pl-1 tracking-wide">Continue with Apple</span>
              </div>
              <div className="w-[40px] shrink-0"></div>
            </button>

            {/* Divider */}
            <div className="flex items-center w-full mt-7 mb-6">
              <div className="flex-1 border-t border-[#EAEAEA]"></div>
              <span className="text-[13px] text-[#757575] font-normal px-5 bg-white tracking-wide">or</span>
              <div className="flex-1 border-t border-[#EAEAEA]"></div>
            </div>

            {/* Email Link */}
            <button 
              onClick={() => setView("email")}
              className="text-[#1976D2] font-medium text-[14.5px] hover:underline tracking-wide"
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
            <div className="flex items-center w-full mt-7 mb-6">
              <div className="flex-1 border-t border-[#EAEAEA]"></div>
              <span className="text-[13px] text-[#757575] font-normal px-5 bg-white tracking-wide">or</span>
              <div className="flex-1 border-t border-[#EAEAEA]"></div>
            </div>
            
            <div className="w-full space-y-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading !== null}
                style={{ border: '1px solid #DADCE0' }}
                className="w-full h-[48px] flex items-center bg-white text-[#3C4043] rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="w-[52px] h-full flex justify-center items-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22" height="22">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                </div>
                <div className="flex-1 flex items-center justify-start">
                  <span className="font-extrabold text-[15px] pl-1 tracking-wide">Continue with Google</span>
                </div>
                <div className="w-[40px] shrink-0"></div>
              </button>
              
              {/* Apple Button */}
              <button
                type="button"
                onClick={handleAppleLogin}
                disabled={loading !== null}
                style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
                className="w-full h-[48px] flex items-center rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                <div className="w-[52px] h-full flex justify-center items-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="white" width="18" height="18">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                </div>
                <div className="flex-1 flex items-center justify-start">
                  <span className="font-extrabold text-[15px] pl-1 tracking-wide">Continue with Apple</span>
                </div>
                <div className="w-[40px] shrink-0"></div>
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
    </>
  );
};

export default LoginPage;

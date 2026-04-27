"use client";

import React from "react";
import Link from "next/link";

const LoginPage = () => {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full animate-fade-in-up">
        <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/50">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-3">Welcome Back.</h1>
            <p className="text-slate-500 text-sm">Please enter your details to continue.</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Email Address</label>
              <input 
                type="email" 
                placeholder="hello@salutbabe.com"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-blue/20 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-300"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3 px-1">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <Link href="/forgot-password" className="text-[10px] font-black text-primary-blue hover:text-slate-900 transition-colors uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary-blue/20 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-300"
              />
            </div>

            <button className="w-full py-5 bg-slate-900 text-white rounded-full font-black text-sm hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-[0.98] mt-4">
              SIGN IN
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500">
              New to SalutBabe?{" "}
              <Link href="/register" className="font-black text-slate-900 hover:text-primary-blue transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;

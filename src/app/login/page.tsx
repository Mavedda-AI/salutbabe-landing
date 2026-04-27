import React from 'react';
import Link from 'next/link';
import {Button} from '../../components/ui/Button';
import {Input} from '../../components/ui/Input';

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-brand-bg px-6">
      <div className="w-full max-w-lg space-y-10">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center space-x-2 group mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">S</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-primary">salutbabe</span>
          </Link>
          <h1 className="text-4xl font-black text-primary">Hoş Geldiniz</h1>
          <p className="text-gray-500 font-medium">Bebekler için daha akıllı alışverişe devam edin.</p>
        </div>

        <div className="glass-card p-10 rounded-[40px] space-y-8">
          <form className="space-y-6">
            <Input 
              label="E-posta veya Telefon" 
              placeholder="örnek@eposta.com" 
              type="text"
            />
            <div className="space-y-2">
              <Input 
                label="Şifre" 
                placeholder="••••••••" 
                type="password"
              />
              <div className="flex justify-end">
                <Link 
                  href="/forgot-password" 
                  className="text-sm font-bold text-secondary hover:opacity-70 transition-opacity"
                >
                  Şifremi Unuttum
                </Link>
              </div>
            </div>

            <Button size="full">Giriş Yap</Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">veya</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-3 px-4 py-3 rounded-2xl border-2 border-primary/5 hover:border-primary/20 transition-all font-bold text-sm text-primary">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center space-x-3 px-4 py-3 rounded-2xl border-2 border-primary/5 hover:border-primary/20 transition-all font-bold text-sm text-primary">
              <img src="https://www.apple.com/favicon.ico" className="w-5 h-5" alt="Apple" />
              <span>Apple</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm font-medium text-gray-400">
          Henüz bir hesabınız yok mu?{' '}
          <Link href="/register" className="text-primary font-black hover:underline">
            Hemen Kaydolun
          </Link>
        </p>
      </div>
    </div>
  );
}

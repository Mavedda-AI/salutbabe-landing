import React from 'react';
import Link from 'next/link';
import {Button} from '../../components/ui/Button';
import {Input} from '../../components/ui/Input';

export default function ForgotPasswordPage() {
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
          <h1 className="text-4xl font-black text-primary">Şifre Sıfırlama</h1>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            Hesabınızla ilişkili e-posta adresini girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        <div className="glass-card p-10 rounded-[40px] space-y-8">
          <form className="space-y-6">
            <Input 
              label="E-posta Adresi" 
              placeholder="örnek@eposta.com" 
              type="email"
            />

            <Button size="full">Bağlantı Gönder</Button>
          </form>
          
          <div className="text-center pt-2">
            <Link 
              href="/login" 
              className="text-sm font-bold text-primary hover:opacity-70 transition-opacity flex items-center justify-center space-x-2"
            >
              <span>←</span>
              <span>Giriş Sayfasına Dön</span>
            </Link>
          </div>
        </div>

        <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
          <p className="text-xs text-center text-primary/60 font-medium leading-relaxed">
            Eğer bir e-posta almazsanız lütfen spam kutunuzu kontrol edin veya{' '}
            <Link href="/contact" className="font-bold underline">destek ekibimizle</Link> iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  );
}

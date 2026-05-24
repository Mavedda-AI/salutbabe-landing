import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-primary/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-xl font-black tracking-tight text-primary">salutbabe</span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            Anne ve bebekler için en güvenli, en kolay ve en ekonomik alışveriş deneyimi.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-primary mb-6">Kurumsal</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link href="/about" className="hover:text-secondary transition-colors">Hakkımızda</Link></li>
            <li><Link href="/contact" className="hover:text-secondary transition-colors">İletişim</Link></li>
            <li><Link href="/career" className="hover:text-secondary transition-colors">Kariyer</Link></li>
            <li><Link href="/press" className="hover:text-secondary transition-colors">Basın</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-primary mb-6">Yardım</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link href="/help" className="hover:text-secondary transition-colors">Sıkça Sorulan Sorular</Link></li>
            <li><Link href="/safety" className="hover:text-secondary transition-colors">Güvenli Ödeme</Link></li>
            <li><Link href="/shipping" className="hover:text-secondary transition-colors">Kargo Süreçleri</Link></li>
            <li><Link href="/return" className="hover:text-secondary transition-colors">İade Politikası</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-primary mb-6">Hukuki</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-medium">
            <li><Link href="/terms" className="hover:text-secondary transition-colors">Kullanım Koşulları</Link></li>
            <li><Link href="/privacy" className="hover:text-secondary transition-colors">Gizlilik Politikası</Link></li>
            <li><Link href="/kvkk" className="hover:text-secondary transition-colors">KVKK Aydınlatma</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-medium">
        <p>© 2026 Salutbabe Teknoloji A.Ş. Tüm hakları saklıdır.</p>
        <div className="flex items-center space-x-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
          <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-primary transition-colors">LinkedIn</Link>
        </div>
      </div>
    </footer>
  );
};

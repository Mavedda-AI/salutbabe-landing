"use client";

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
  <footer className="bg-white pt-24 pb-12 border-t border-slate-50">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="font-black text-2xl tracking-tight text-slate-900 mb-6">
            SALUTBABE
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            The first secure baby platform in Turkey. We provide a premium second-hand experience for modern families.
          </p>
        </div>
        
        <div>
          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Shop</h4>
          <ul className="space-y-4">
            {['New Arrivals', 'Trending', 'Travel', 'Nursery'].map(item => (
              <li key={item}>
                <Link href="/shop" className="text-sm text-slate-400 hover:text-slate-900 transition-colors font-medium">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Company</h4>
          <ul className="space-y-4">
            {['About Us', 'Sustainability', 'Premium', 'Contact'].map(item => (
              <li key={item}>
                <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-slate-400 hover:text-slate-900 transition-colors font-medium">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Legal</h4>
          <ul className="space-y-4">
            {['Privacy Policy', 'Terms of Use', 'Return Policy', 'KVKK'].map(item => (
              <li key={item}>
                <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-slate-400 hover:text-slate-900 transition-colors font-medium">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          © 2026 SALUTBABE — A MAVEDDA BRAND. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-8">
           <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest">Instagram</Link>
           <Link href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest">Twitter</Link>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;

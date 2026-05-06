"use client";

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const sections = [
    {
      title: "Shop",
      links: [
        { label: "New Arrivals", href: "/category/new" },
        { label: "Bestsellers", href: "/category/bestsellers" },
        { label: "Clothing", href: "/category/clothing" },
        { label: "Gear", href: "/category/gear" }
      ]
    },
    {
      title: "About",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Sustainability", href: "/sustainability" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Returns", href: "/returns" },
        { label: "Shipping", href: "/shipping" },
        { label: "Contact Us", href: "/contact" }
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-slate-100 mt-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-4">
            <Link href="/" className="text-xl font-black tracking-tighter text-slate-900 block mb-6">
              SALUTBABE.
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              A curated marketplace for modern families. Discover premium pre-loved and new essentials for your little ones.
            </p>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href}
                        className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6">
            <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-900 transition-colors">Privacy Policy</Link>
          </div>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Salutbabe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

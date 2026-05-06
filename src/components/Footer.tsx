"use client";

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  // Animation delay helper for letter-by-letter reveal
  const renderAnimatedWord = (word: string) => {
    return (
      <span className="relative inline-flex overflow-hidden group">
        {word.split('').map((char, index) => {
          const delay = `${index * 0.025}s`;
          return (
            <span key={index} className="relative inline-block overflow-hidden h-[1.15em] leading-[1.15em]">
              <span className="block text-text-primary transition-transform duration-600 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:-translate-y-full" 
                style={{ transitionDelay: delay }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
              <span className="absolute left-0 top-0 block translate-y-full text-primary transition-transform duration-600 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:translate-y-0" 
                style={{ transitionDelay: delay }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <footer className="bg-background text-text-primary overflow-hidden pt-24 pb-8 selection:bg-info/30 transition-colors duration-300">
      <style>{`
        @keyframes brandShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        [data-brand-wordmark] {
          position: relative;
          display: inline-block;
          color: inherit;
          -webkit-text-fill-color: currentColor;
          -webkit-text-stroke: 0.02em transparent;
          background-image: linear-gradient(110deg, #FF007A 0%, #00B2FF 50%, #FF007A 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          animation: brandShift 5.2s ease-in-out infinite;
          font-family: 'Airbnb Cereal', 'Airbnb Cereal App', 'AirbnbCereal', sans-serif;
        }

        [data-underline-link] {
          text-decoration: none;
          position: relative;
        }

        [data-underline-link]::before,
        [data-underline-link="alt"]::before,
        [data-underline-link="alt"]::after {
          content: "";
          position: absolute;
          bottom: -0.0625em;
          left: 0;
          width: 100%;
          height: 0.0625em;
          background-color: currentColor;
          transition: transform 0.735s cubic-bezier(0.625, 0.05, 0, 1);
          transform-origin: right;
          transform: scaleX(0) rotate(0.001deg);
        }

        [data-underline-link="alt"]::before {
          transform-origin: left;
          transform: scaleX(1) rotate(0.001deg);
          transition-delay: 0.3s;
        }

        [data-underline-link="alt"]::after {
          transform-origin: right;
          transform: scaleX(0) rotate(0.001deg);
          transition-delay: 0s;
        }

        @media (hover: hover) and (pointer: fine) {
          [data-hover]:hover [data-underline-link]::before,
          [data-underline-link]:hover::before,
          .group:hover [data-underline-link]::before {
            transform-origin: left;
            transform: scaleX(1) rotate(0.001deg);
          }  
          
          [data-hover]:hover [data-underline-link="alt"]::before,
          [data-underline-link="alt"]:hover::before {
            transform-origin: right;
            transform: scaleX(0) rotate(0.001deg);
            transition-delay: 0s;
          }
          
          [data-hover]:hover [data-underline-link="alt"]::after,
          [data-underline-link="alt"]:hover::after {
            transform-origin: left;
            transform: scaleX(1) rotate(0.001deg);
            transition-delay: 0.3s;
          }
        }
      `}</style>
      
      <div className="max-w-[1700px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between mb-20 md:mb-32 gap-16">
          
          <div className="flex flex-col gap-10 lg:w-1/3">
            <div className="flex flex-col gap-3">
              <Link className="inline-block w-fit" href="/">
                <span className="text-4xl font-black tracking-tighter" data-underline-link="true">
                  <span data-brand-wordmark="true">salutbabe</span>
                </span>
              </Link>
              <p className="font-bold text-[13px] uppercase tracking-wide opacity-90">
                Anneden Anneye Güvenli Alışveriş
              </p>
            </div>
            <div className="text-[13px] opacity-60 leading-relaxed font-medium space-y-1">
              <a href="mailto:info@salutbabe.com" className="block w-fit hover:text-primary transition-colors">info@salutbabe.com</a>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-x-16 gap-y-12 shrink-0 md:min-w-[600px] justify-between lg:justify-end xl:gap-32">
            
            <div className="flex flex-col gap-6">
              <p className="font-medium text-[18px] md:text-[22px] lg:text-[24px] uppercase tracking-[-0.01em] text-text-primary">
                Platform
              </p>
              <ul className="flex flex-col gap-2 list-none">
                <li className="m-0">
                  <Link className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="/shop">
                    {renderAnimatedWord("Shop")}
                  </Link>
                </li>
                <li className="m-0">
                  <Link className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="/sell">
                    {renderAnimatedWord("Sell")}
                  </Link>
                </li>
                <li className="m-0">
                  <Link className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="/brands">
                    {renderAnimatedWord("Brands")}
                  </Link>
                </li>
                <li className="m-0">
                  <Link className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="/about">
                    {renderAnimatedWord("About Us")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <p className="font-medium text-[18px] md:text-[22px] lg:text-[24px] uppercase tracking-[-0.01em] text-text-primary">
                Support
              </p>
              <ul className="flex flex-col gap-2 list-none">
                <li className="m-0">
                  <Link className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="/contact">
                    {renderAnimatedWord("Contact")}
                  </Link>
                </li>
                <li className="m-0">
                  <Link className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="/faq">
                    {renderAnimatedWord("FAQ")}
                  </Link>
                </li>
                <li className="m-0">
                  <Link className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="/privacy">
                    {renderAnimatedWord("Privacy Policy")}
                  </Link>
                </li>
                <li className="m-0">
                  <Link className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="/terms">
                    {renderAnimatedWord("Terms of Use")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-6 w-full md:w-auto mt-4 md:mt-0">
              <p className="font-medium text-[18px] md:text-[22px] lg:text-[24px] uppercase tracking-[-0.01em] text-text-primary">
                Follow Us
              </p>
              <ul className="flex flex-col gap-2 list-none">
                <li className="m-0">
                  <a target="_blank" rel="noopener noreferrer" className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="https://www.instagram.com/salutbabe/">
                    {renderAnimatedWord("Instagram")}
                  </a>
                </li>
                <li className="m-0">
                  <a target="_blank" rel="noopener noreferrer" className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="https://www.tiktok.com/@salutbabe">
                    {renderAnimatedWord("TikTok")}
                  </a>
                </li>
                <li className="m-0">
                  <a target="_blank" rel="noopener noreferrer" className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="https://www.linkedin.com/company/salutbabe">
                    {renderAnimatedWord("LinkedIn")}
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div className="w-full mt-16 mb-8 md:mb-12 flex justify-center select-none pointer-events-none overflow-hidden">
          <div className="relative inline-block pb-4 pr-4">
            <h2 className="text-[10vw] font-black tracking-[-0.04em] text-text-primary/5 leading-none whitespace-nowrap" style={{ fontFamily: "'Airbnb Cereal', 'Airbnb Cereal App', 'AirbnbCereal', sans-serif" }}>
              salutbabe
            </h2>
            <div className="absolute inset-0">
              <h2 className="text-[10vw] font-black tracking-[-0.04em] text-text-primary leading-none whitespace-nowrap" style={{ fontFamily: "'Airbnb Cereal', 'Airbnb Cereal App', 'AirbnbCereal', sans-serif" }}>
                <span data-brand-wordmark="true">salutbabe</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="flex flex-col pt-8 border-t border-border-color text-[11px] font-bold tracking-widest opacity-60">
          <div className="flex justify-center mb-8">
            <Link className="group inline-flex items-center gap-2 rounded-full border border-border-color bg-surface px-4 py-2 text-[10px] font-black capitalize tracking-[0.2em] text-text-primary transition-all hover:bg-text-primary hover:text-background hover:border-text-primary" href="/download">
              <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-background animate-pulse"></span>
              Download App
            </Link>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 md:gap-0">
            <div>
              <p>© 2026 salutbabe. ALL RIGHTS RESERVED.</p>
            </div>
            <div>
              <p>designed by <a href="https://www.linkedin.com/in/hidirektor/" target="_blank" rel="noopener noreferrer" data-underline-link="alt" className="text-text-primary hover:text-primary transition-colors">hidirektor</a></p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

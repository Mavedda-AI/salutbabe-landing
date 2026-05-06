"use client";

import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useThemeLanguage} from "../context/ThemeLanguageContext";
import {CONTACT_INFO, SOCIAL_LINKS} from "../constants";
import {apiUrl, MAPBOX_TOKEN} from "../lib/api";

const Footer = () => {
  const pathname = usePathname();
  const { language } = useThemeLanguage();
  
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState('kvkk');
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

    useEffect(() => {
      const handleOpenLegal = (e: any) => {
        setIsLegalOpen(true);
        if (e.detail?.tab) {
          setActiveLegalTab(e.detail.tab);
        }
      };
      window.addEventListener('open-legal-modal', handleOpenLegal);
      return () => window.removeEventListener('open-legal-modal', handleOpenLegal);
    }, []);

    useEffect(() => {
      if (isContactOpen && mapContainerRef.current && !mapInstance.current) {
      // Load Mapbox CSS
      if (!document.getElementById('mapbox-css')) {
        const link = document.createElement('link');
        link.id = 'mapbox-css';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }

      // Load Mapbox JS
      if (!document.getElementById('mapbox-js')) {
        const script = document.createElement('script');
        script.id = 'mapbox-js';
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        script.async = true;
        script.onload = () => {
          initMap();
        };
        document.head.appendChild(script);
      } else if ((window as any).mapboxgl) {
        initMap();
      }
    }
    
    function initMap() {
      if (!mapContainerRef.current || mapInstance.current) return;
      
      const token = MAPBOX_TOKEN;
      
      if (!token) {
        mapContainerRef.current.innerHTML = '<div style="display:flex; height:100%; align-items:center; justify-content:center; color:gray; font-size:12px; text-align:center; padding:20px;">Map integration pending.<br/>Please add NEXT_PUBLIC_MAPBOX_API_KEY to your .env file.</div>';
        return;
      }
      
      (window as any).mapboxgl.accessToken = token;
      
      const isDark = document.documentElement.classList.contains('dark');
      const mapStyle = isDark ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';
      
      mapInstance.current = new (window as any).mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: [-0.1276, 51.5072], // London coordinates
        zoom: 12,
        attributionControl: false
      });
      
      // Add a marker for salutbabe HQ (London)
      new (window as any).mapboxgl.Marker({ color: '#FF85B2' })
        .setLngLat([-0.1276, 51.5072])
        .addTo(mapInstance.current);
    }

    return () => {
      if (!isContactOpen && mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isContactOpen]);

  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard/sysop'))) {
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
          -webkit-text-stroke: 0.05em transparent;
          background-image: linear-gradient(110deg, #FF007A 0%, #00B2FF 50%, #FF007A 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          animation: brandShift 5.2s ease-in-out infinite;
          font-family: 'Airbnb Cereal', 'Airbnb Cereal App', 'AirbnbCereal', sans-serif;
          padding: 0 0.1em;
          margin: 0 -0.1em;
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
              <p className="font-semibold text-[10px] uppercase tracking-[0.15em] opacity-60">
                Anneden Anneye Güvenli Alışveriş
              </p>
            </div>
            <div className="text-[13px] opacity-60 leading-relaxed font-medium space-y-3 mt-4">
              <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-2 w-fit hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {CONTACT_INFO.email}
              </a>
              <div className="flex items-center gap-2 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                London / United Kingdom
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-x-16 gap-y-12 shrink-0 md:min-w-[600px] justify-between lg:justify-end xl:gap-32">
            
            <div className="flex flex-col gap-6">
              <p className="font-medium text-[18px] md:text-[22px] lg:text-[24px] uppercase tracking-[-0.01em] text-text-primary">
                Platform
              </p>
              <ul className="flex flex-col gap-2 list-none">
                <li className="m-0">
                  <Link className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="/category/new">
                    {renderAnimatedWord("New Arrivals")}
                  </Link>
                </li>
                <li className="m-0">
                  <Link className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href="/categories">
                    {renderAnimatedWord("Categories")}
                  </Link>
                </li>
                <li className="m-0">
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-leaderboard-modal'))}
                    className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {renderAnimatedWord("Leaderboard")}
                  </button>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <p className="font-medium text-[18px] md:text-[22px] lg:text-[24px] uppercase tracking-[-0.01em] text-text-primary">
                Support
              </p>
              <ul className="flex flex-col gap-2 list-none">
                <li className="m-0">
                  <button onClick={() => setIsContactOpen(true)} className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity">
                    {renderAnimatedWord("Contact")}
                  </button>
                </li>
                <li className="m-0">
                  <button onClick={() => setIsFaqOpen(true)} className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity">
                    {renderAnimatedWord("FAQ")}
                  </button>
                </li>
                <li className="m-0">
                  <button onClick={() => setIsLegalOpen(true)} className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity">
                    {renderAnimatedWord("Legal")}
                  </button>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-6 w-full md:w-auto mt-4 md:mt-0">
              <p className="font-medium text-[18px] md:text-[22px] lg:text-[24px] uppercase tracking-[-0.01em] text-text-primary">
                Follow Us
              </p>
              <ul className="flex flex-col gap-2 list-none">
                <li className="m-0">
                  <a target="_blank" rel="noopener noreferrer" className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href={SOCIAL_LINKS.instagram}>
                    {renderAnimatedWord("Instagram")}
                  </a>
                </li>
                <li className="m-0">
                  <a target="_blank" rel="noopener noreferrer" className="group inline-block font-bold text-[11px] uppercase tracking-[0.2em] py-1 opacity-70 hover:opacity-100 transition-opacity" href={SOCIAL_LINKS.linkedin}>
                    {renderAnimatedWord("LinkedIn")}
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div className="w-full mt-16 mb-8 md:mb-12 flex justify-center select-none pointer-events-none overflow-hidden">
          <div className="relative inline-block px-4 py-4 md:px-8">
            <h2 className="text-[10vw] font-black tracking-[-0.04em] text-text-primary/5 leading-none whitespace-nowrap" style={{ fontFamily: "'Airbnb Cereal', 'Airbnb Cereal App', 'AirbnbCereal', sans-serif" }}>
              salutbabe
            </h2>
            <div className="absolute inset-0 px-4 py-4 md:px-8">
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

      {/* Contact Popup with Mapbox */}
      {isContactOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in-up" onClick={() => setIsContactOpen(false)}>
          <div className="bg-background border border-border-color rounded-3xl p-2 md:p-4 max-w-4xl w-full h-[600px] max-h-[90vh] flex flex-col md:flex-row relative overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsContactOpen(false)} className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors z-10 bg-background/50 rounded-full p-2 backdrop-blur-md">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="w-full md:w-5/12 p-6 md:p-8 flex flex-col justify-center h-full">
              <h3 className="text-3xl font-black mb-4">Get in touch.</h3>
              <p className="text-text-secondary mb-8 text-[13px] leading-relaxed">We'd love to hear from you. Reach out to us through any of the following channels or visit our headquarters.</p>
              
              <div className="space-y-4">
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border-color hover:border-primary transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-background border border-border-color flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-sm text-text-primary tracking-wide">Email Us</span>
                    <span className="text-[12px] text-text-secondary">{CONTACT_INFO.email}</span>
                  </div>
                </a>
                
                <a href={`tel:${CONTACT_INFO.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border-color hover:border-primary transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-background border border-border-color flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-sm text-text-primary tracking-wide">Call Us</span>
                    <span className="text-[12px] text-text-secondary">{CONTACT_INFO.phone}</span>
                  </div>
                </a>
                
                <div className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border-color transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-background border border-border-color flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-sm text-text-primary tracking-wide">Headquarters</span>
                    <span className="text-[12px] text-text-secondary">London / United Kingdom</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block w-7/12 h-full rounded-2xl overflow-hidden relative border border-border-color">
              <div ref={mapContainerRef} className="w-full h-full bg-surface" />
              <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"></div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Popup */}
      {isFaqOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in-up" onClick={() => setIsFaqOpen(false)}>
          <div className="bg-background border border-border-color rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsFaqOpen(false)} className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-2xl font-black mb-6">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {[
                {
                  q: "What is salutbabe?",
                  a: "salutbabe is a premium, secure marketplace dedicated entirely to mothers. You can easily buy and sell high-quality, pre-loved baby and maternity items in a trusted community."
                },
                {
                  q: "How do I list my items for sale?",
                  a: "Simply download our mobile app, take clear photos of your item, write a descriptive title and details, set a fair price, and publish. Your listing will instantly be available to thousands of mothers."
                },
                {
                  q: "Is the payment secure?",
                  a: "Absolutely. We use industry-leading secure payment gateways with an escrow-like system. The payment is held securely and only released to the seller once you receive and approve the item."
                },
                {
                  q: "What happens if the item is not as described?",
                  a: "If an item arrives damaged or significantly not as described, you have 48 hours to report it. Our buyer protection ensures you can return the item for a full refund."
                },
                {
                  q: "How does shipping work?",
                  a: "We provide integrated shipping codes. The seller just needs to pack the item, write the generated code on the box, and drop it off at the designated courier branch. Tracking is automatically updated."
                },
                {
                  q: "Are there any seller fees?",
                  a: "Listing an item is completely free. A small commission fee is only deducted when your item successfully sells, which covers the secure payment processing and platform maintenance."
                },
                {
                  q: "How do I withdraw my earnings?",
                  a: "Once a buyer confirms receipt of the item, the funds are added to your salutbabe wallet. You can instantly withdraw your balance to your registered bank account at any time."
                }
              ].map((faq, idx) => (
                <details key={idx} className="group bg-surface rounded-xl border border-border-color cursor-pointer overflow-hidden transition-colors hover:border-primary">
                  <summary className="font-bold text-[13px] md:text-sm list-none flex justify-between items-center p-4 outline-none">
                    {faq.q}
                    <svg className="w-5 h-5 text-text-secondary transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="text-text-secondary text-[12px] md:text-[13px] leading-relaxed p-4 pt-0">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legal Popup */}
      {isLegalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in-up" onClick={() => setIsLegalOpen(false)}>
          <div className="bg-background border border-border-color rounded-3xl p-6 md:p-8 max-w-5xl w-full h-[85vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsLegalOpen(false)} className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors z-10">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-2xl font-black mb-6 shrink-0">Legal Information</h3>
            <div className="flex flex-col md:flex-row gap-6 h-full min-h-0">
              {/* Tabs */}
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0 md:w-56 pb-2 md:pb-0 scrollbar-hide">
                {[
                  { id: 'kvkk', label: 'KVKK' },
                  { id: 'terms-of-use', label: 'TERMS OF USE' },
                  { id: 'distance-sales', label: 'DISTANCE SALES' },
                  { id: 'privacy-policy', label: 'PRIVACY POLICY' },
                  { id: 'delivery-returns', label: 'DELIVERY & RETURNS' },
                  { id: 'cancellation-policy', label: 'CANCELLATION POLICY' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveLegalTab(tab.id)}
                    className={`whitespace-nowrap text-left px-4 py-3 rounded-xl text-[12px] font-bold tracking-wider transition-all duration-300 ${activeLegalTab === tab.id ? 'bg-primary text-white shadow-md' : 'bg-surface text-text-secondary hover:bg-surface/80 border border-transparent hover:border-border-color'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {/* Content Area (Iframe fetches from backend) */}
              <div className="flex-1 bg-surface rounded-2xl border border-border-color overflow-hidden relative shadow-inner">
                <iframe 
                  src={apiUrl(`/legal/${activeLegalTab}?lang=${language}`)}
                  className="w-full h-full border-none"
                  title="Legal Document"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;

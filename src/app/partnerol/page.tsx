'use client';

import React from 'react';
import Link from 'next/link';
import { Share2, Users, Wallet, PieChart, ArrowRight, Download, Handshake, CheckCircle2 } from 'lucide-react';

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-pink-500/30 font-sans overflow-x-hidden">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-32 pb-20 px-4">
          <div className="max-w-5xl mx-auto text-center animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-300">Salutbabe Partner Programı</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Paylaş, Öner ve <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                %30 Kâr Payı Kazan!
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Kendi özel referans kodunu oluştur, arkadaşlarını davet et. Davet ettiğin kullanıcıların 
              ilk 5 satışından elde ettiğimiz net kârın <span className="text-white font-semibold">%30'u anında senin olsun.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                <span>Hemen Uygulamayı İndir</span>
                <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="relative z-10 py-24 px-4 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Nasıl Çalışır?</h2>
              <p className="text-gray-400 text-lg">Sadece 3 basit adımda kazanmaya başla</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Share2 className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">1. Kodunu Oluştur</h3>
                <p className="text-gray-400 leading-relaxed">
                  Uygulamaya kayıt ol ve saniyeler içinde kendine özel partner (referans) kodunu yarat.
                </p>
              </div>

              {/* Step 2 */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">2. Arkadaşlarını Davet Et</h3>
                <p className="text-gray-400 leading-relaxed">
                  Davet kodunu sosyal medyada veya arkadaş gruplarında paylaş. Kayıt olurken kodunu girmelerini sağla.
                </p>
              </div>

              {/* Step 3 */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wallet className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">3. Anında Kazan</h3>
                <p className="text-gray-400 leading-relaxed">
                  Davet ettiğin kullanıcının ilk 5 satışından platforma kalan net kârın %30'u anında cüzdanına yatsın!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transparency & Math Section */}
        <section className="relative z-10 py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Şeffaf ve Adil <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Kazanç Dağılımı</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Sürpriz kesintiler veya gizli şartlar yok. Bir satış gerçekleştiğinde, KDV ve banka (sanal pos) masrafları düşüldükten sonra platforma kalan net kârın <strong className="text-white">tam %30'u</strong> senin olur.
                </p>
                
                <ul className="space-y-4">
                  {[
                    "Gerçek zamanlı bakiye yansıması",
                    "Davet ettiğin kullanıcının ilk 5 satışında geçerli",
                    "Cüzdanındaki bakiyeyi dilediğin zaman çek",
                    "Sosyal medya fenomenlerine özel ek avantajlar"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Graphic/Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 relative shadow-2xl">
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                        <PieChart className="w-6 h-6 text-pink-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Örnek Dağılım</div>
                        <div className="text-xl font-bold text-white">Platform Net Kârı</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Senin Payın</div>
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">%30</div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="relative pt-2">
                      <div className="flex mb-2 items-center justify-between">
                        <div><span className="text-xs font-semibold inline-block text-pink-400">Senin Kazancın (%30)</span></div>
                        <div className="text-right"><span className="text-xs font-semibold inline-block text-white">Platform (%70)</span></div>
                      </div>
                      <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-white/10">
                        <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-pink-500 to-purple-500"></div>
                        <div style={{ width: "70%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white/20"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 italic">
                      * Hesaplamalar temsilidir. Kazancın, satış yapılan ürünün fiyat aralığına ve güncel kampanyalara göre değişiklik gösterebilir. Ancak elde edilen net kârın %30'luk pay oranı sabittir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative z-10 py-32 px-4">
          <div className="max-w-4xl mx-auto text-center backdrop-blur-xl bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent border border-white/10 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -ml-32 -mb-32"></div>
            
            <div className="relative z-10">
              <Handshake className="w-16 h-16 text-white/80 mx-auto mb-8" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ekibimize Katılmaya Hazır Mısın?</h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Hemen uygulamayı indir, partner hesabını oluştur ve kendi topluluğunu kurarak sınırsız kazanç elde etmeye başla.
              </p>
              
              <Link href="/" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                <span>Uygulamayı İndir</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
    </div>
  );
}

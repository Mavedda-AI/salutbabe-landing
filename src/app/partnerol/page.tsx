'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Share2, Users, Wallet, PieChart, ArrowRight, Download, Handshake, CheckCircle2, Loader2 } from 'lucide-react';
import { apiUrl } from '@/lib/api';

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    socialMediaHandle: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(apiUrl('/common/partner-application/apply'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.request?.requestResult) {
        throw new Error(data.message || 'Başvuru sırasında bir hata oluştu.');
      }
      
      setSubmitSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', socialMediaHandle: '' });
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30 font-sans overflow-x-hidden">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-32 pb-20 px-4">
          <div className="max-w-5xl mx-auto text-center animate-fade-in-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
              <span className="text-sm font-medium text-gray-300 tracking-wide uppercase">Salutbabe Partner Programı</span>
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
              <a href="#apply-form" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                <span>Hemen Başvur</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link href="/" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all duration-300">
                <span>Uygulamayı İndir</span>
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
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Share2 className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">1. Başvurunu Yap</h3>
                <p className="text-gray-400 leading-relaxed">
                  Aşağıdaki formu doldurarak partnerlik başvurunu yap. Onaylandığında özel referans kodun oluşturulacaktır.
                </p>
              </div>

              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">2. Arkadaşlarını Davet Et</h3>
                <p className="text-gray-400 leading-relaxed">
                  Davet kodunu sosyal medyada veya arkadaş gruplarında paylaş. Kayıt olurken kodunu girmelerini sağla.
                </p>
              </div>

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

        {/* Application Form Section */}
        <section id="apply-form" className="relative z-10 py-32 px-4">
          <div className="max-w-3xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -ml-32 -mb-32"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-10">
                <Handshake className="w-16 h-16 text-white/80 mx-auto mb-6" />
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Partnerlik Başvurusu</h2>
                <p className="text-gray-300">
                  Aşağıdaki formu doldurarak Salutbabe Partner programına ilk adımı atın. Ekibimiz başvurunuzu en kısa sürede değerlendirecektir.
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-12 px-6 bg-green-500/10 border border-green-500/20 rounded-3xl">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">Başvurunuz Alındı!</h3>
                  <p className="text-gray-300">
                    Partnerlik başvurunuz başarıyla sistemimize iletildi. İnceleme sürecinden sonra sizinle e-posta üzerinden iletişime geçeceğiz.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Adınız</label>
                      <input 
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                        placeholder="Örn: Ayşe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Soyadınız</label>
                      <input 
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                        placeholder="Örn: Yılmaz"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">E-Posta Adresiniz</label>
                    <input 
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                      placeholder="iletisim@ornek.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Instagram / Tiktok Kullanıcı Adınız</label>
                    <input 
                      required
                      name="socialMediaHandle"
                      value={formData.socialMediaHandle}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                      placeholder="@kullaniciadi"
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full group relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Gönderiliyor...</span>
                      </>
                    ) : (
                      <>
                        <span>Başvuruyu Tamamla</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
    </div>
  );
}

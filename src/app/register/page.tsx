"use client";

import React, {useState} from "react";
import Link from "next/link";
import {useThemeLanguage} from "../../context/ThemeLanguageContext";

export default function RegisterSellerPage() {
  const { t } = useThemeLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [storeName, setStoreName] = useState("Bebek Butiğim");
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(false);

  const steps = [
    { id: 1, title: 'Mağaza Tercihleri', desc: "Hadi başlayalım. Bize kendinden ve mağazandan bahset." },
    { id: 2, title: 'Mağazanı İsimlendir', desc: "Şimdilik bir isim belirleyebilir, daha sonra değiştirebilirsin." },
    { id: 3, title: "Ödeme Yöntemi", desc: "Şu an emin değilsen bu adımı daha sonra tamamlayabilirsin." },
    { id: 4, title: 'Mağaza Güvenliği', desc: "Şu an emin değilsen bu adımı daha sonra tamamlayabilirsin." },
  ];

  const handleNext = () => {
     if(currentStep <= 4) setCurrentStep(currentStep + 1);
  };
  
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl md:text-2xl font-black text-text-primary mb-1">Mağaza Tercihleri</h2>
            <p className="text-xs md:text-sm text-text-secondary mb-8">Hadi başlayalım! Bize biraz mağazandan bahset.</p>
            
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-xs md:text-sm font-bold text-text-primary mb-2">Mağaza Dili</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 rounded-xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none font-medium text-sm">
                    <option>Türkçe</option>
                    <option>English</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </div>
                <p className="text-[10px] md:text-xs text-text-secondary mt-2">Müşterilerinizin göreceği varsayılan dili seçin.</p>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-text-primary mb-2">Ülke</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 rounded-xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none font-medium text-sm">
                    <option>Türkiye</option>
                    <option>United States</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </div>
                <p className="text-[10px] md:text-xs text-text-secondary mt-2">Mağazanızın bulunduğu veya gönderim yapacağınız ülkeyi seçin.</p>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-text-primary mb-2">Para Birimi</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 rounded-xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none font-medium text-sm">
                    <option>₺ Türk Lirası</option>
                    <option>$ Amerikan Doları</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </div>
                <p className="text-[10px] md:text-xs text-text-secondary mt-2">Salutbabe'de satacağınız ürünleri fiyatlandırmak için kullanacağınız para birimi.</p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl md:text-2xl font-black text-text-primary mb-1">Mağazanı İsimlendir</h2>
            <p className="text-xs md:text-sm text-text-secondary mb-8">İlk izlenim önemlidir. Müşterilerin mağazanı nasıl tanıyacak?</p>

            <div className="max-w-md">
               <label className="block text-xs md:text-sm font-bold text-text-primary mb-2">Mağaza Adı</label>
               <input 
                 type="text" 
                 value={storeName}
                 onChange={(e) => {
                   setStoreName(e.target.value);
                   setNameAvailable(e.target.value.length > 5);
                 }}
                 className="w-full px-4 py-3 rounded-xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium text-sm"
               />
               
               <ul className="list-disc pl-5 mt-4 text-[10px] md:text-xs text-text-secondary space-y-1">
                 <li>4-20 karakter arasında olmalıdır</li>
                 <li>Özel karakterler veya noktalama işaretleri içermemelidir</li>
               </ul>

               {storeName.length > 0 && !nameAvailable && (
                 <p className="text-xs md:text-sm text-red-500 font-medium mt-4 flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                   Görünüşe göre "{storeName}" ismi zaten alınmış.
                 </p>
               )}
               {storeName.length > 0 && nameAvailable && (
                 <p className="text-xs md:text-sm text-green-500 font-medium mt-4 flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Harika, bu ismi kullanabilirsin!
                 </p>
               )}

               {storeName.length > 0 && !nameAvailable && (
                 <div className="mt-6">
                   <p className="text-[10px] md:text-xs font-bold text-text-primary mb-3">Şu Benzer Seçenekleri Deneyebilirsin</p>
                   <div className="flex flex-wrap gap-2">
                     {[`${storeName} Mağazası`, `${storeName} Butik`, `${storeName}123`, `${storeName} 124`].map((suggestion, i) => (
                       <button key={i} onClick={() => { setStoreName(suggestion); setNameAvailable(true); }} className="px-3 py-1.5 rounded-full border border-border-color text-xs font-medium text-text-secondary hover:text-text-primary hover:border-text-primary transition-colors">
                         {suggestion}
                       </button>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl md:text-2xl font-black text-text-primary mb-1">Ödeme Alma Yöntemi</h2>
            <p className="text-xs md:text-sm text-text-secondary mb-8">Ödemelerinizi yerel banka hesabınıza güvenle alın.</p>

            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-xs md:text-sm font-bold text-text-primary mb-2">Yöntem</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 rounded-xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none font-medium text-sm">
                    <option>Banka Transferi (Havale/EFT)</option>
                    <option>Kredi Kartı / IBAN</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </div>
                <p className="text-[10px] md:text-xs text-text-secondary mt-2">Tüm yerel bankalarla ve para birimleriyle uyumludur</p>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-bold text-text-primary mb-2">Ülke</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 rounded-xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none font-medium text-sm">
                    <option>Türkiye</option>
                    <option>United States</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <h2 className="text-xl md:text-2xl font-black text-text-primary mb-1">Mağazanı ekstra güvende tut</h2>
            <p className="text-xs md:text-sm text-text-secondary mb-2">İki faktörlü kimlik doğrulamayı (2FA) açarak topluluğumuzu güvende tutmamıza yardımcı ol.</p>
            <Link href="#" className="text-xs md:text-sm font-bold text-orange-500 hover:underline mb-8 inline-block">2FA nasıl çalışır?</Link>

            <div className="space-y-8 max-w-md">
              <div>
                <label className="block text-xs md:text-sm font-bold text-text-primary mb-2">Başlamak için bir seçenek belirleyin</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 rounded-xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none font-medium text-sm">
                    <option>Kimlik Doğrulayıcı Uygulama</option>
                    <option>SMS ile Doğrulama</option>
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </div>
              </div>

              <div>
                <h3 className="text-xs md:text-sm font-bold text-text-primary mb-1">1. Doğrulayıcı uygulamanızı açın.</h3>
                <p className="text-[10px] md:text-xs text-text-secondary mb-4">Ardından, bu QR kodu okutun.</p>
                <div className="w-32 h-32 bg-white rounded-lg p-2 border border-border-color flex items-center justify-center">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=salutbabe-2fa" alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
              </div>

              <div>
                <h3 className="text-xs md:text-sm font-bold text-text-primary mb-1">2. Uygulamanızdaki 6 haneli kodu girin.</h3>
                <p className="text-[10px] md:text-xs text-text-secondary mb-4">QR kodu okuttuktan sonra uygulamanızda beliren güncel kodu buraya yazın.</p>
                <input type="text" placeholder="Kodu Girin" className="w-full px-4 py-3 rounded-xl bg-background border border-border-color focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium text-sm" />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-background flex flex-col md:items-center justify-start md:justify-center p-0 md:p-8 relative">
      
      {/* SUCCESS MODAL OVERLAY */}
      {currentStep === 5 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-[400px] bg-white dark:bg-surface rounded-3xl shadow-2xl p-8 text-center animate-scale-in flex flex-col items-center">
            <div className="mb-6 relative">
              <div className="text-[80px] leading-none">🎉</div>
              <div className="absolute -top-2 -right-2 text-2xl">✨</div>
            </div>
            
            <h2 className="text-2xl font-black text-text-primary mb-3">Mağazanız Satışa Açıldı!</h2>
            <p className="text-sm text-text-secondary mb-8 leading-relaxed">
              Tebrikler! Mağazanız başarıyla oluşturuldu. Salutbabe'de hemen satış yapmaya başlamak için paneli keşfedin.
            </p>
            
            <Link 
              href="/dashboard/sysop"
              className="px-8 py-3.5 w-full md:w-auto rounded-full font-bold text-sm transition-all bg-text-primary text-background hover:opacity-90 active:scale-95 shadow-lg shadow-black/10"
            >
              Paneli Keşfet
            </Link>
          </div>
        </div>
      )}

      <div className={`w-full max-w-6xl bg-white dark:bg-surface md:rounded-3xl shadow-none md:shadow-xl overflow-hidden min-h-screen md:min-h-[85vh] flex flex-col relative transition-all duration-500 ${currentStep === 5 ? 'scale-[0.98] blur-[2px]' : ''}`}>
        
        {/* Top Header inside Card */}
        <div className="flex items-center justify-between p-6 md:px-10 py-5 border-b border-border-color/30">
          <Link href="/" className="text-2xl font-black tracking-tighter text-text-primary">
            salutbabe
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border-color">
              <div className="w-6 h-6 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center text-primary border border-primary/20">
                 <img src="https://ui-avatars.com/api/?name=Jenny+Wilson&background=random" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block text-xs">
                <p className="font-bold text-text-primary leading-tight">Satıcı Profili</p>
                <p className="text-text-secondary/70 leading-tight">satici@salutbabe.com</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-text-secondary ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1">
          {/* Left Sidebar (Stepper) */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border-color/30 bg-surface/30 md:bg-transparent p-6 md:p-10 flex flex-col justify-between shrink-0">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-text-primary mb-6 md:mb-8">Mağazanı Kur</h1>
              
              <div className="space-y-6 md:space-y-8 relative">
                {/* Connecting line for Desktop */}
                <div className="hidden md:block absolute left-[15px] top-4 bottom-8 w-px bg-border-color -z-10"></div>
                
                {steps.map((step) => {
                  const isCompleted = step.id < currentStep;
                  const isActive = step.id === currentStep;
                  return (
                    <div key={step.id} className="flex gap-4 cursor-pointer group" onClick={() => setCurrentStep(step.id)}>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2
                        ${isCompleted ? 'bg-text-primary border-text-primary text-background' : 
                          isActive ? 'bg-background border-text-primary text-text-primary' : 'bg-background border-border-color text-text-secondary group-hover:border-text-secondary'}
                      `}>
                        {isCompleted ? (
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                        ) : (
                          step.id
                        )}
                      </div>
                      <div>
                        <h3 className={`text-[13px] md:text-sm font-bold ${isActive || isCompleted ? 'text-text-primary' : 'text-text-secondary'} group-hover:text-primary transition-colors`}>{step.title}</h3>
                        <p className="text-[10px] md:text-[11px] text-text-secondary mt-1 max-w-[180px] leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="hidden md:flex mt-12">
               <div className="px-3 py-1.5 rounded-full border border-border-color flex items-center gap-2 text-[11px] font-bold text-text-primary cursor-pointer hover:bg-surface transition-colors">
                 🇹🇷 Türkçe (TR)
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-text-secondary"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
               </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-6 md:p-12 relative flex flex-col bg-background/50 md:bg-transparent">
            <div className="flex-1">
              {renderStepContent()}
            </div>

            <div className="mt-12 flex justify-end">
               <button 
                 onClick={handleNext}
                 className="px-6 md:px-8 py-3 rounded-full font-bold text-sm transition-all
                   bg-[#E5E7EB] dark:bg-border-color text-text-primary hover:bg-text-primary hover:text-background active:scale-95
                 "
                 style={{
                   backgroundColor: currentStep === 4 ? "var(--color-text-primary)" : "",
                   color: currentStep === 4 ? "var(--color-background)" : ""
                 }}
               >
                 {currentStep === 4 ? "Kurulumu Tamamla" : "Kaydet ve Devam Et"}
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

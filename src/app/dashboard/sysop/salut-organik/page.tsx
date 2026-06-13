"use client";

import React, {useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {useToast} from "../../../../context/ToastContext";
import {
  Cancel01Icon,
  CheckmarkBadge01Icon,
  Image01Icon,
  Leaf01Icon,
  Location01Icon,
  Search01Icon,
  Store01Icon,
  TickDouble01Icon,
  UserGroupIcon
} from "hugeicons-react";

export default function SalutOrganikManagementPage() {
  const { t } = useThemeLanguage();
  const { showToast } = useToast();
  
  const [currentTab, setCurrentTab] = useState<'producers' | 'products' | 'campaigns' | 'lab' | 'map'>('producers');
  const [selectedProducer, setSelectedProducer] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Placeholder Data
  const pendingProducers = [
    { id: 1, name: "Ahmet Yılmaz", farmName: "Yılmaz Organik Çiftliği", location: "İzmir, Seferihisar", status: "pending", certificate: "EkoTar Sertifikası" },
    { id: 2, name: "Ayşe Demir", farmName: "Ayşe'nin Doğal Ürünleri", location: "Aydın, Söke", status: "pending", certificate: "Organik Tarım Belgesi" }
  ];

  const pendingProducts = [
    { id: 101, title: "El Yapımı Domates Salçası", category: "Salça & Sos", producer: "Yılmaz Organik Çiftliği", price: "250 TL" },
    { id: 102, title: "Soğuk Sıkım Zeytinyağı 5L", category: "Zeytinyağı", producer: "Ege İncisi Tarım", price: "1200 TL" }
  ];

  const handleApprove = (id: number, type: string) => {
    showToast(`${type === 'producer' ? 'Üretici' : 'İlan'} başarıyla onaylandı!`, "success");
  };

  const handleReject = (id: number, type: string) => {
    showToast(`${type === 'producer' ? 'Üretici' : 'İlan'} başvurusu reddedildi.`, "error");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative pb-20">
      <div className="absolute top-0 inset-x-0 h-[250px] bg-gradient-to-b from-gray-200/50 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none -z-10" />
      
      <div className="px-6 lg:px-8 py-8 md:py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shrink-0 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Leaf01Icon className="text-gray-900 dark:text-white" size={36} />
            Salut Organik Yönetimi
          </h1>
          <p className="text-sm md:text-base font-medium text-gray-500 dark:text-white/60 max-w-xl">
            Mobil uygulamadaki organik ürün pazarını, yerel üreticileri ve organik sertifikaları buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      <div className="px-6 lg:px-8 mb-6">
        <div className="inline-flex bg-gray-100/50 dark:bg-white/5 p-1 rounded-2xl backdrop-blur-md border border-gray-200/50 dark:border-white/10 shadow-sm relative z-10 overflow-x-auto max-w-full">
          <button 
            onClick={() => setCurrentTab('producers')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${currentTab === 'producers' ? 'bg-white dark:bg-[#1A1E1F] text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200/50 dark:ring-white/10' : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80'}`}
          >
            <UserGroupIcon size={18} />
            Üretici Başvuruları
          </button>
          <button 
            onClick={() => setCurrentTab('products')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${currentTab === 'products' ? 'bg-white dark:bg-[#1A1E1F] text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200/50 dark:ring-white/10' : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80'}`}
          >
            <Store01Icon size={18} />
            Organik İlanlar
          </button>
          <button 
            onClick={() => setCurrentTab('campaigns')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${currentTab === 'campaigns' ? 'bg-white dark:bg-[#1A1E1F] text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200/50 dark:ring-white/10' : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80'}`}
          >
            <Image01Icon size={18} />
            Kampanya & Afiş
          </button>
          <button 
            onClick={() => setCurrentTab('lab')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${currentTab === 'lab' ? 'bg-white dark:bg-[#1A1E1F] text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200/50 dark:ring-white/10' : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80'}`}
          >
            <CheckmarkBadge01Icon size={18} />
            Laboratuvar & Doğrulama
          </button>
          <button 
            onClick={() => setCurrentTab('map')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${currentTab === 'map' ? 'bg-white dark:bg-[#1A1E1F] text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-200/50 dark:ring-white/10' : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80'}`}
          >
            <Location01Icon size={18} />
            Canlı Hasat Haritası
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 lg:px-8 pb-20 custom-scrollbar relative z-10">
        
        {/* ÜRETİCİ TABI */}
        {currentTab === 'producers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingProducers.map((producer) => (
              <div key={producer.id} className="group flex flex-col bg-white dark:bg-[#101516] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="p-6 pb-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-1000/10 flex items-center justify-center shrink-0 border border-gray-200 dark:border-white/20">
                        <Leaf01Icon className="text-gray-900 dark:text-white" size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                          {producer.farmName}
                        </div>
                        <div className="text-xs font-medium text-gray-500 dark:text-white/50 mt-0.5">
                          {producer.name} • {producer.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-white/30 mb-1">
                      Sertifika Belgesi
                    </div>
                    <div className="text-xs font-bold text-gray-700 dark:text-white/80">
                      {producer.certificate}
                    </div>
                    <button onClick={() => setSelectedProducer(producer)} className="mt-3 text-xs font-bold text-gray-900 dark:text-white hover:underline">
                      Tüm Başvuru Detaylarını Gör &rarr;
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-gray-100 dark:border-white/10">
                  <button 
                    onClick={() => handleReject(producer.id, 'producer')}
                    className="flex items-center justify-center gap-2 p-4 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-500/10 transition-colors"
                  >
                    <Cancel01Icon size={18} />
                    <span>Reddet</span>
                  </button>
                  <button 
                    onClick={() => handleApprove(producer.id, 'producer')}
                    className="flex items-center justify-center gap-2 p-4 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-1000/10 transition-colors border-l border-gray-100 dark:border-white/10"
                  >
                    <TickDouble01Icon size={18} />
                    <span>Onayla</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ÜRÜNLER TABI */}
        {currentTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingProducts.map((product) => (
              <div key={product.id} className="group flex flex-col bg-white dark:bg-[#101516] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-900/10 text-gray-900 dark:text-white border border-gray-900/20 dark:border-white/20">
                      {product.category}
                    </span>
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      {product.price}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {product.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-white/60">
                    Üretici: <span className="font-semibold">{product.producer}</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 border-t border-gray-100 dark:border-white/10">
                  <button onClick={() => setSelectedProduct(product)} className="flex items-center justify-center gap-2 p-4 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/10 col-span-2">
                    Detayları Görüntüle
                  </button>
                  <button onClick={() => handleReject(product.id, 'product')}
                    className="flex items-center justify-center gap-2 p-4 text-sm font-bold text-gray-600 dark:text-white/60 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500/10 transition-colors"
                  >
                    <Cancel01Icon size={18} />
                    <span>Kaldır</span>
                  </button>
                  <button 
                    onClick={() => handleApprove(product.id, 'product')}
                    className="flex items-center justify-center gap-2 p-4 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-1000/10 transition-colors border-l border-gray-100 dark:border-white/10"
                  >
                    <TickDouble01Icon size={18} />
                    <span>Onayla</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* KAMPANYA TABI */}
        {currentTab === 'campaigns' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#101516] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Mevcut Kampanya Afişleri</h3>
              <div className="space-y-4">
                <div className="group relative rounded-2xl overflow-hidden aspect-video border border-gray-200 dark:border-white/10">
                  <img src="https://images.unsplash.com/photo-1472476443507-c7a5948772fc?q=80&w=600" className="w-full h-full object-cover" alt="Doğal Salça" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4">
                    <h4 className="text-white font-bold">Doğal Salça Neden Önemli?</h4>
                    <p className="text-white/80 text-xs mt-1">Geleneksel odun ateşinde saatlerce kaynatılan gerçek lezzet</p>
                  </div>
                  <button className="absolute top-3 right-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Cancel01Icon size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#101516] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Yeni Afiş Ekle</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wider">Afiş Başlığı</label>
                  <input type="text" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" placeholder="Örn: Zeytinyağı Hasadı Başladı" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wider">Alt Başlık (Açıklama)</label>
                  <input type="text" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" placeholder="Örn: Erken hasat, soğuk sıkım doğal lezzet..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wider">Görsel URL veya Yükle</label>
                  <div className="w-full border-2 border-dashed border-gray-200 dark:border-white/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <Image01Icon className="text-gray-400 dark:text-white/40 mb-2" size={24} />
                    <span className="text-sm font-medium text-gray-500 dark:text-white/60">Görsel yüklemek için tıklayın</span>
                  </div>
                </div>
                <button className="w-full py-4 mt-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold rounded-xl shadow-sm transition-all flex justify-center items-center gap-2">
                  <TickDouble01Icon size={18} />
                  Afişi Yayınla
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LAB TABI */}
        {currentTab === 'lab' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-[#101516] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <CheckmarkBadge01Icon size={32} className="text-gray-500 dark:text-white/60" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Pestisit & Laboratuvar Raporları</h3>
              <p className="text-sm text-gray-500 dark:text-white/50 max-w-lg mb-6">
                Üreticilerin sisteme yüklediği ilaç kalıntı (pestisit) raporlarını ve sertifika bitiş tarihlerini doğrulayabileceğiniz otomasyon merkezi buraya entegre edilecektir.
              </p>
              <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-sm transition-all">
                Laboratuvar Partneri API Bağla
              </button>
            </div>
          </div>
        )}

        {/* HARİTA TABI */}
        {currentTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-100 dark:bg-[#1A1E1F] rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col relative h-[500px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <Location01Icon size={48} className="text-gray-400 dark:text-white/20 mb-4" />
                <h3 className="text-2xl font-black text-gray-400 dark:text-white/20">Harita Yükleniyor...</h3>
              </div>
              <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
                <div className="flex-1 bg-white dark:bg-[#101516] rounded-2xl p-2 px-4 shadow-lg border border-gray-200 dark:border-white/10 flex items-center gap-2">
                  <Search01Icon size={20} className="text-gray-400" />
                  <input type="text" placeholder="Üretici veya bölge ara (Örn: Ege Bölgesi)" className="bg-transparent border-none outline-none text-sm w-full font-bold dark:text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#101516] rounded-3xl p-6 border border-gray-200 dark:border-white/10 flex flex-col gap-4 h-[500px] overflow-y-auto custom-scrollbar">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Bölgesel Yoğunluk</h3>
              
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900 dark:text-white">Ege Bölgesi</span>
                  <span className="text-xs font-bold px-2 py-1 bg-gray-900 text-white rounded-lg">14 Üretici</span>
                </div>
                <div className="text-xs text-gray-500">Zeytinyağı, İncir, Domates ağırlıklı</div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-900 dark:text-white">Karadeniz Bölgesi</span>
                  <span className="text-xs font-bold px-2 py-1 bg-gray-900 text-white rounded-lg">8 Üretici</span>
                </div>
                <div className="text-xs text-gray-500">Bal, Fındık, Çay ağırlıklı</div>
              </div>

              <div className="p-4 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/20 flex flex-col items-center justify-center text-center mt-auto py-8">
                <span className="text-xs text-gray-500 font-bold mb-2">Taze Gönderim / Soğuk Zincir</span>
                <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg w-full">Kargo Bölgelerini Çiz</button>
              </div>
            </div>
          </div>
        )}

      </div>
    
      {/* PRODUCER DETAILS MODAL */}
      {selectedProducer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProducer(null)} />
          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-[#101516] p-8 text-left shadow-2xl border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Başvuru Detayları</h3>
                <p className="text-sm text-gray-500 dark:text-white/50 mt-1">{selectedProducer?.farmName} ({selectedProducer?.name})</p>
              </div>
              <button onClick={() => setSelectedProducer(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 bg-gray-50 dark:bg-white/5 rounded-full"><Cancel01Icon size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <div className="text-[10px] font-black uppercase text-gray-500 dark:text-white/40 mb-1">Lokasyon</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProducer?.location}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <div className="text-[10px] font-black uppercase text-gray-500 dark:text-white/40 mb-1">Sertifika Türü</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProducer?.certificate}</div>
                </div>
              </div>
              <div className="p-6 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                <Image01Icon className="text-gray-400 mb-3" size={32} />
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">Sertifika Belgesi (PDF / GÖRSEL)</div>
                <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg shadow-sm">Belgeyi İndir / Aç</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          <div className="relative w-full max-w-xl transform overflow-hidden rounded-3xl bg-white dark:bg-[#101516] p-8 text-left shadow-2xl border border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">İlan Detayları</h3>
                <p className="text-sm text-gray-500 dark:text-white/50 mt-1">{selectedProduct?.title}</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 bg-gray-50 dark:bg-white/5 rounded-full"><Cancel01Icon size={24} /></button>
            </div>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <Image01Icon className="text-gray-400" size={48} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-500 mb-1">Kategori</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProduct?.category}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-gray-500 mb-1">Fiyat</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProduct?.price}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] font-black uppercase text-gray-500 mb-1">Üretici</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProduct?.producer}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

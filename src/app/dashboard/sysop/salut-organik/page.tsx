"use client";

import React, {useState, useEffect} from "react";
import {API_BASE_URL, apiUrl} from "../../../../lib/api";
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

  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [pendingProducers, setPendingProducers] = useState<any[]>([]);
  const [loadingProducers, setLoadingProducers] = useState(false);

  const fetchPendingProducts = async () => {
    try {
      setLoadingProducts(true);
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl("/salut-organic/admin/products/pending?page=1&limit=50"), {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        setPendingProducts(data.payload?.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchPendingProducers = async () => {
    try {
      setLoadingProducers(true);
      const token = localStorage.getItem("auth_token");
      const res = await fetch(apiUrl("/salut-organic/admin/farmers/pending?page=1&limit=50"), {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        setPendingProducers(data.payload?.producers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducers(false);
    }
  };

  useEffect(() => {
    if (currentTab === 'products') fetchPendingProducts();
    if (currentTab === 'producers') fetchPendingProducers();
  }, [currentTab]);

  const handleApprove = async (id: string | number, type: string) => {
    if (type === 'product') {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(apiUrl(`/salut-organic/admin/products/${id}/approve`), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "X-Device-Type": "web"
          }
        });
        const data = await res.json();
        if (data.request?.requestResult) {
          setPendingProducts(prev => prev.filter(p => p.id !== id));
          showToast(`İlan başarıyla onaylandı!`, "success");
        } else {
          showToast(`Onaylanamadı: ${data.request?.requestMessage}`, "error");
        }
      } catch (e) {
        console.error(e);
        showToast("Bir hata oluştu", "error");
      }
    } else {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(apiUrl(`/salut-organic/admin/farmers/${id}/approve`), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "X-Device-Type": "web"
          }
        });
        const data = await res.json();
        if (data.request?.requestResult) {
          setPendingProducers(prev => prev.filter(p => p.storeID !== id));
          showToast(`Üretici başarıyla onaylandı!`, "success");
        } else {
          showToast(`Onaylanamadı: ${data.request?.requestMessage}`, "error");
        }
      } catch (e) {
        console.error(e);
        showToast("Bir hata oluştu", "error");
      }
    }
  };

  const handleReject = async (id: string | number, type: string) => {
    if (type === 'product') {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(apiUrl(`/salut-organic/admin/products/${id}/reject`), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "X-Device-Type": "web",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ reason: "Sistem tarafından reddedildi." })
        });
        const data = await res.json();
        if (data.request?.requestResult) {
          setPendingProducts(prev => prev.filter(p => p.id !== id));
          showToast(`İlan reddedildi.`, "error");
        } else {
          showToast(`Reddedilemedi: ${data.request?.requestMessage}`, "error");
        }
      } catch (e) {
        console.error(e);
        showToast("Bir hata oluştu", "error");
      }
    } else {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(apiUrl(`/salut-organic/admin/farmers/${id}/reject`), {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "X-Device-Type": "web",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ reason: "Sistem tarafından reddedildi." })
        });
        const data = await res.json();
        if (data.request?.requestResult) {
          setPendingProducers(prev => prev.filter(p => p.storeID !== id));
          showToast(`Üretici başvurusu reddedildi.`, "error");
        } else {
          showToast(`Reddedilemedi: ${data.request?.requestMessage}`, "error");
        }
      } catch (e) {
        console.error(e);
        showToast("Bir hata oluştu", "error");
      }
    }
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
              <div key={producer.storeID} className="group flex flex-col bg-white dark:bg-[#101516] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="p-6 pb-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-1000/10 flex items-center justify-center shrink-0 border border-gray-200 dark:border-white/20">
                        <Leaf01Icon className="text-gray-900 dark:text-white" size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                          {producer.storeName}
                        </div>
                        <div className="text-xs font-medium text-gray-500 dark:text-white/50 mt-0.5">
                          {producer.owner?.userName} {producer.owner?.userSurname} • {producer.owner?.eMail}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-white/30 mb-1">
                      Sertifika Belgesi
                    </div>
                    <div className="text-xs font-bold text-gray-700 dark:text-white/80">
                      {producer.organicCertificates && producer.organicCertificates.length > 0 ? `${producer.organicCertificates.length} Sertifika Eklendi` : 'Belge Yok'}
                    </div>
                    <button onClick={() => setSelectedProducer(producer)} className="mt-3 text-xs font-bold text-gray-900 dark:text-white hover:underline">
                      Tüm Başvuru Detaylarını Gör &rarr;
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-gray-100 dark:border-white/10">
                  <button 
                    onClick={() => handleReject(producer.storeID, 'producer')}
                    className="flex items-center justify-center gap-2 p-4 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-500/10 transition-colors"
                  >
                    <Cancel01Icon size={18} />
                    <span>Reddet</span>
                  </button>
                  <button 
                    onClick={() => handleApprove(producer.storeID, 'producer')}
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
                    Üretici: <span className="font-semibold">{product.store?.storeName || product.producer}</span>
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
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#101516] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm text-center px-4">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Image01Icon size={32} className="text-gray-400 dark:text-white/40" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Çok Yakında</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-white/60 max-w-md">
              Kampanya ve Afiş yönetimi modülü şu anda geliştirme aşamasındadır. Yakında bu alandan tüm kampanya görsel operasyonlarınızı yönetebileceksiniz.
            </p>
          </div>
        )}

        {/* LAB TABI */}
        {currentTab === 'lab' && (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#101516] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm text-center px-4">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
              <CheckmarkBadge01Icon size={32} className="text-gray-400 dark:text-white/40" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Çok Yakında</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-white/60 max-w-md">
              Laboratuvar partneri API entegrasyonu ve otomatik pestisit raporu doğrulama sistemi şu anda yapım aşamasındadır.
            </p>
          </div>
        )}

        {/* HARİTA TABI */}
        {currentTab === 'map' && (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#101516] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm text-center px-4">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Location01Icon size={32} className="text-gray-400 dark:text-white/40" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Çok Yakında</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-white/60 max-w-md">
              Canlı hasat haritası ve bölgesel üretici yoğunluğu analiz ekranı yakın zamanda yayına alınacaktır.
            </p>
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
                <p className="text-sm text-gray-500 dark:text-white/50 mt-1">{selectedProducer?.storeName} ({selectedProducer?.owner?.userName} {selectedProducer?.owner?.userSurname})</p>
              </div>
              <button onClick={() => setSelectedProducer(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 bg-gray-50 dark:bg-white/5 rounded-full"><Cancel01Icon size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <div className="text-[10px] font-black uppercase text-gray-500 dark:text-white/40 mb-1">Lokasyon</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProducer?.owner?.eMail || "Tanımsız"}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <div className="text-[10px] font-black uppercase text-gray-500 dark:text-white/40 mb-1">Sertifika Türü</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProducer?.organicCertificates && selectedProducer.organicCertificates.length > 0 ? `${selectedProducer.organicCertificates.length} Sertifika` : 'Belge Yok'}</div>
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
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProduct?.store?.storeName || selectedProduct?.producer}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

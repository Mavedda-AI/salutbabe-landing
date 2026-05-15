"use client";
import React, {useState, useEffect} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";

export default function CategoryManagementPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const [expandedCats, setExpandedCats] = useState<string[]>(['CAT-1']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState<any>(null);

  const isDark = theme === 'dark';

  useEffect(() => { setTimeout(() => setLoading(false), 400); }, []);
  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  // Mock Category Tree
  const categories = [
    {
      id: 'CAT-1', name: 'Giyim & Tekstil', productCount: 12450, status: 'Aktif',
      subcategories: [
        { id: 'SUB-101', name: 'Zıbın & Tulum', productCount: 4200, status: 'Aktif' },
        { id: 'SUB-102', name: 'Hastane Çıkışı', productCount: 1850, status: 'Aktif' },
        { id: 'SUB-103', name: 'Mont & Kaban', productCount: 890, status: 'Aktif' }
      ]
    },
    {
      id: 'CAT-2', name: 'Bebek Arabası & Taşıma', productCount: 3200, status: 'Aktif',
      subcategories: [
        { id: 'SUB-201', name: 'Pusetler', productCount: 1200, status: 'Aktif' },
        { id: 'SUB-202', name: 'Travel Sistem', productCount: 850, status: 'Aktif' },
        { id: 'SUB-203', name: 'Kanguru & Sling', productCount: 1150, status: 'Aktif' }
      ]
    },
    {
      id: 'CAT-3', name: 'Beslenme & Emzirme', productCount: 5600, status: 'Aktif',
      subcategories: [
        { id: 'SUB-301', name: 'Biberon & Emzik', productCount: 2400, status: 'Aktif' },
        { id: 'SUB-302', name: 'Mama Sandalyesi', productCount: 950, status: 'Aktif' },
        { id: 'SUB-303', name: 'Göğüs Pompası (Sıfır)', productCount: 650, status: 'Pasif' }
      ]
    }
  ];

  const toggleCat = (id: string) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const filteredCategories = categories.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchCat = c.name.toLowerCase().includes(q);
    const matchSub = c.subcategories.some(sub => sub.name.toLowerCase().includes(q));
    return matchCat || matchSub;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         <div>
           <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1A1D1F]'}`}>Kategori & Alt Kategori Yönetimi</h1>
           <p className={`text-[13px] font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pazaryerindeki ana ve alt kategorileri, ağaç (tree) yapısında düzenleyin.</p>
         </div>
         <div className="flex gap-3">
           <button onClick={() => setShowModal({type: 'new'})} className="w-full md:w-auto px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              + Yeni Kategori Ekle
           </button>
         </div>
      </div>

      <div className={`${cardClass} p-2 mb-6 w-full overflow-hidden`}>
         <div className="px-2 md:px-4 w-full">
            <div className={`relative flex items-center w-full h-12 rounded-xl border transition-colors ${isDark ? 'bg-[#1A1D1F] border-white/10 focus-within:border-primary/50' : 'bg-gray-50 border-gray-200 focus-within:border-primary/50 focus-within:bg-white'}`}>
               <svg className={`w-5 h-5 ml-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input 
                 type="text" 
                 placeholder="Kategori veya Alt Kategori Ara..." 
                 value={searchQuery}
                 onChange={(e) => {
                   setSearchQuery(e.target.value);
                   if (e.target.value) setExpandedCats(categories.map(c => c.id));
                 }}
                 className="w-full h-full bg-transparent border-none outline-none px-4 text-[13px] font-bold placeholder:text-gray-400 text-inherit"
               />
            </div>
         </div>
      </div>

      <div className={`${cardClass} overflow-hidden`}>
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm font-medium">Kategori ağacı yükleniyor...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm font-medium">Aranan kriterde kategori bulunamadı.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredCategories.map(cat => (
                <div key={cat.id} className={`rounded-2xl border transition-all ${isDark ? 'border-white/5 bg-[#1A1D1F]' : 'border-gray-200 bg-gray-50/50'}`}>
                  {/* Main Category Row */}
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-2xl"
                    onClick={() => toggleCat(cat.id)}
                  >
                    <div className="flex items-center gap-4">
                      <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${expandedCats.includes(cat.id) ? 'rotate-90' : ''} ${isDark ? 'bg-white/10 text-white' : 'bg-white shadow-sm text-gray-600'}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </button>
                      <div className="flex flex-col">
                        <span className={`text-[14px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{cat.name}</span>
                        <span className={`text-[11px] font-medium mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{cat.id} • {cat.productCount.toLocaleString()} Ürün</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <span className={`hidden md:inline-flex px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${cat.status === 'Aktif' ? (isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-100') : (isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100')}`}>
                         {cat.status}
                       </span>
                       <button onClick={(e) => { e.stopPropagation(); setShowModal({type: 'edit', data: cat}); }} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm'}`}>
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                       </button>
                    </div>
                  </div>

                  {/* Subcategories (Alt Kategoriler) */}
                  {expandedCats.includes(cat.id) && (
                    <div className={`border-t p-4 md:pl-16 pl-6 flex flex-col gap-2 ${isDark ? 'border-white/5 bg-[#121214]/50' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                         <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Alt Kategoriler</span>
                         <button onClick={() => setShowModal({type: 'new_sub', parentId: cat.id})} className="text-[11px] font-bold text-primary hover:underline">+ Yeni Ekle</button>
                      </div>
                      
                      {cat.subcategories.map(sub => (
                        <div key={sub.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rounded-full ${sub.status === 'Aktif' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div className="flex flex-col">
                              <span className={`text-[13px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{sub.name}</span>
                              <span className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{sub.productCount.toLocaleString()} Ürün</span>
                            </div>
                          </div>
                          <button onClick={() => setShowModal({type: 'edit_sub', data: sub})} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${isDark ? 'border-white/10 text-gray-400 hover:bg-white/10 hover:text-white' : 'border-gray-200 text-gray-600 hover:bg-white shadow-sm'}`}>
                            Düzenle
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up" onClick={() => setShowModal(null)}>
          <div className={`w-full max-w-md p-6 rounded-[24px] shadow-2xl border ${isDark ? 'bg-[#1A1D1F] border-white/10' : 'bg-white border-gray-100'}`} onClick={e => e.stopPropagation()}>
            <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {showModal.type === 'new' ? 'Yeni Kategori' : showModal.type === 'edit' ? 'Kategori Düzenle' : 'Alt Kategori İşlemi'}
            </h3>
            <p className={`text-[12px] mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Kategori adını ve durumunu buradan güncelleyebilirsiniz.</p>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className={`block text-[11px] font-bold uppercase mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Kategori Adı</label>
                <input type="text" defaultValue={showModal.data?.name || ''} className={`w-full h-12 rounded-xl px-4 text-[13px] font-bold border outline-none focus:border-primary transition-colors ${isDark ? 'bg-[#121214] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="Örn: Bebek Giyim" />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Durum</label>
                <select className={`w-full h-12 rounded-xl px-4 text-[13px] font-bold border outline-none focus:border-primary transition-colors appearance-none ${isDark ? 'bg-[#121214] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                  <option value="Aktif">Aktif (Yayında)</option>
                  <option value="Pasif">Pasif (Gizli)</option>
                </select>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowModal(null)} className={`flex-1 p-3 rounded-xl font-bold text-[13px] transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>İptal</button>
                <button onClick={() => setShowModal(null)} className="flex-1 p-3 rounded-xl font-bold text-[13px] bg-primary hover:bg-primary/90 text-white transition-colors shadow-lg shadow-primary/20">Kaydet</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

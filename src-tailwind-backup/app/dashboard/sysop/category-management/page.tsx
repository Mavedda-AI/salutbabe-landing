'use client';

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {PageHeader} from "../../components/ui/PageHeader";
import {FilterTabs, SearchInput} from "../../components/ui/FilterBar";
import {ActionModal, StatusBadge} from "../../components/ui/StatusBadge";
import {Edit02Icon} from "@hugeicons/react";

interface SubCategory {
  id: string;
  name: string;
  productCount: number;
  status: string;
}

interface Category {
  id: string;
  name: string;
  productCount: number;
  status: string;
  subcategories: SubCategory[];
}

export default function CategoryManagementPage() {
  const { theme } = useThemeLanguage();
  const [loading, setLoading] = useState(true);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const isDark = theme === 'dark';

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token === "mock_token" || !token) {
      setCategories([]);
      setLoading(false);
      return;
    }
    
    // API entegrasyonu sonrasında burası güncellenecek
    setLoading(true);
    setTimeout(() => {
      setCategories([]);
      setLoading(false);
    }, 400);
  }, []);

  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  const toggleCat = (id: string) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const filteredCategories = categories.filter(c => {
    if (activeFilter === 'bebek' && !c.name.toLowerCase().includes('bebek')) return false;
    if (activeFilter === 'cocuk' && !c.name.toLowerCase().includes('çocuk')) return false;
    if (activeFilter === 'organik' && !c.name.toLowerCase().includes('organik') && !c.subcategories.some(sub => sub.name.toLowerCase().includes('organik'))) return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const matchCat = c.name.toLowerCase().includes(q);
    const matchSub = c.subcategories.some(sub => sub.name.toLowerCase().includes(q));
    return matchCat || matchSub;
  });

  const filterTabs = [
    { id: 'all', label: 'Tümü' },
    { id: 'bebek', label: 'Bebek' },
    { id: 'cocuk', label: 'Çocuk' },
    { id: 'organik', label: 'Organik' }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto pb-12">
      <PageHeader 
        title="Kategori & Alt Kategori Yönetimi"
        description="Pazaryerindeki ana ve alt kategorileri, ağaç (tree) yapısında düzenleyin."
        actions={
          <button 
            onClick={() => setShowModal({type: 'new'})} 
            className="w-full md:w-auto px-5 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            + Yeni Kategori Ekle
          </button>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <FilterTabs 
          tabs={filterTabs} 
          activeTab={activeFilter} 
          onChange={(id) => setActiveFilter(id)} 
        />
        <div className="flex-1" />
        <SearchInput 
          value={searchQuery} 
          onChange={(val) => {
            setSearchQuery(val);
            if (val) setExpandedCats(categories.map(c => c.id));
          }} 
          placeholder="Kategori veya Alt Kategori Ara..." 
        />
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
                       <StatusBadge status={cat.status} type={cat.status === 'Aktif' ? 'success' : 'danger'} />
                       <button onClick={(e) => { e.stopPropagation(); setShowModal({type: 'edit', data: cat}); }} className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-white shadow-sm'}`}>
                         <Edit02Icon size={20} />
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

      <ActionModal
        isOpen={!!showModal}
        onClose={() => setShowModal(null)}
        title={showModal?.type === 'new' ? 'Yeni Kategori' : showModal?.type === 'edit' ? 'Kategori Düzenle' : 'Alt Kategori İşlemi'}
        description="Kategori adını ve durumunu buradan güncelleyebilirsiniz."
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className={`block text-[11px] font-bold uppercase mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Kategori Adı</label>
            <input type="text" defaultValue={showModal?.data?.name || ''} className={`w-full h-12 rounded-xl px-4 text-[13px] font-bold border outline-none focus:border-primary transition-colors ${isDark ? 'bg-[#121214] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} placeholder="Örn: Bebek Giyim" />
          </div>
          <div>
            <label className={`block text-[11px] font-bold uppercase mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Durum</label>
            <select defaultValue={showModal?.data?.status || 'Aktif'} className={`w-full h-12 rounded-xl px-4 text-[13px] font-bold border outline-none focus:border-primary transition-colors appearance-none ${isDark ? 'bg-[#121214] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
              <option value="Aktif">Aktif (Yayında)</option>
              <option value="Pasif">Pasif (Gizli)</option>
            </select>
          </div>
          
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowModal(null)} className={`flex-1 p-3 rounded-xl font-bold text-[13px] transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}>İptal</button>
            <button onClick={() => setShowModal(null)} className="flex-1 p-3 rounded-xl font-bold text-[13px] bg-primary hover:bg-primary/90 text-white transition-colors shadow-lg shadow-primary/20">Kaydet</button>
          </div>
        </div>
      </ActionModal>
    </div>
  );
}

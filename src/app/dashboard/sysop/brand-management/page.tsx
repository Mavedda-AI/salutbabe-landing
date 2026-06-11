"use client";

import React, {useEffect, useState} from "react";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {useToast} from "../../../../context/ToastContext";
import {apiUrl} from "../../../../lib/api";

interface Brand {
  brandID: string;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  isPopular: boolean;
  isActive: boolean;
  listingCount?: number;
}

const LOGO_DEV_TOKEN = "pk_abc123";

const generateSlug = (text: string) => {
  return text.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

const hashColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#54E6D4', '#5FC8C0', '#6366F1', '#EC4899', '#F59E0B',
    '#10B981', '#8B5CF6', '#EF4444', '#3B82F6', '#14B8A6',
  ];
  return colors[Math.abs(hash) % colors.length];
};

export default function AdminBrandsPage() {
  const { theme, t } = useThemeLanguage();
  const { showToast } = useToast();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPopular, setFilterPopular] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('AZ');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Partial<Brand> | null>(null);
  const [saving, setSaving] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const getToken = () => localStorage.getItem("token") || localStorage.getItem("auth_token");

  const fetchBrands = async () => {
    try {
      const token = getToken();
      const res = await fetch(apiUrl("/admin/brands"), {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      const data = await res.json();
      if (data.payload) {
        setBrands(data.payload);
      }
    } catch (e) {
      console.error(e);
      showToast("Markalar yüklenirken hata oluştu", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAdd = () => {
    setCurrentBrand({
      name: '',
      slug: '',
      domain: '',
      isPopular: false,
      isActive: true,
    });
    setLogoError(false);
    setIsModalOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setCurrentBrand(JSON.parse(JSON.stringify(brand)));
    setLogoError(false);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentBrand?.name) {
      showToast("Marka adı zorunludur", "error");
      return;
    }
    setSaving(true);
    try {
      const token = getToken();
      const method = currentBrand.brandID ? "PUT" : "POST";
      const url = currentBrand.brandID
        ? apiUrl(`/admin/brands/${currentBrand.brandID}`)
        : apiUrl("/admin/brands");

      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Device-Type": "web"
        },
        body: JSON.stringify({
          name: currentBrand.name,
          slug: currentBrand.slug,
          domain: currentBrand.domain || undefined,
          isPopular: currentBrand.isPopular,
          isActive: currentBrand.isActive,
        })
      });

      if (res.ok) {
        showToast(currentBrand.brandID ? "Marka güncellendi" : "Marka oluşturuldu", "success");
        setIsModalOpen(false);
        fetchBrands();
      } else {
        const errData = await res.json().catch(() => null);
        showToast(errData?.message || "Kaydetme başarısız oldu", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Bir hata oluştu", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu markayı silmek istediğinizden emin misiniz?")) return;
    try {
      const token = getToken();
      const res = await fetch(apiUrl(`/admin/brands/${id}`), {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      if (res.ok) {
        showToast("Marka silindi", "success");
        fetchBrands();
      } else {
        showToast("Silme başarısız oldu", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Bir hata oluştu", "error");
    }
  };

  const handleTogglePopular = async (brand: Brand) => {
    try {
      const token = getToken();
      const res = await fetch(apiUrl(`/admin/brands/${brand.brandID}/toggle-popular`), {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      if (res.ok) {
        showToast(brand.isPopular ? "Popülerlikten çıkarıldı" : "Popüler olarak işaretlendi", "success");
        fetchBrands();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (brand: Brand) => {
    try {
      const token = getToken();
      const res = await fetch(apiUrl(`/admin/brands/${brand.brandID}/toggle-active`), {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Device-Type": "web"
        }
      });
      if (res.ok) {
        showToast(brand.isActive ? "Marka pasif yapıldı" : "Marka aktif yapıldı", "success");
        fetchBrands();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getLogoUrl = (domain?: string) => {
    if (!domain) return null;
    return `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=64&format=png`;
  };

  // Stats
  const totalBrands = brands.length;
  const popularCount = brands.filter(b => b.isPopular).length;
  const activeCount = brands.filter(b => b.isActive).length;

  // Filtering
  const filteredBrands = brands.filter(brand => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ? true : (
      brand.name.toLowerCase().includes(q) ||
      brand.slug.toLowerCase().includes(q) ||
      (brand.domain && brand.domain.toLowerCase().includes(q))
    );
    const matchesStatus = filterStatus === 'ALL' ? true : (filterStatus === 'ACTIVE' ? brand.isActive : !brand.isActive);
    const matchesPopular = filterPopular === 'ALL' ? true : (filterPopular === 'POPULAR' ? brand.isPopular : !brand.isPopular);
    return matchesSearch && matchesStatus && matchesPopular;
  }).sort((a, b) => {
    if (sortOrder === 'AZ') return a.name.localeCompare(b.name, 'tr');
    return b.name.localeCompare(a.name, 'tr');
  });

  // Loading state
  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 w-16 h-16 border-4 border-gray-100 dark:border-white/5 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-[#54E6D4] border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute w-6 h-6 bg-[#54E6D4]/20 rounded-full animate-pulse"></div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-[14px] font-black tracking-[0.2em] uppercase text-[#101516] dark:text-white">{t('dashboard.sysop.loading_data') || 'Yükleniyor'}</span>
        <span className="text-[11px] font-bold text-gray-400">Marka verileri hazırlanıyor...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B0C10] text-[#101516] dark:text-white p-4 md:p-8 pt-24 font-sans">
      <div className="max-w-7xl mx-auto">
        {!isModalOpen ? (
          <div className="space-y-6 animate-fade-in">

            {/* KPI Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Brands */}
              <div className="relative overflow-hidden rounded-2xl border bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-gray-200 dark:border-white/5 shadow-sm p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#54E6D4]/10 dark:bg-[#54E6D4]/20 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-[#54E6D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.659A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Toplam Marka</p>
                    <p className="text-2xl font-black text-[#101516] dark:text-white leading-tight">{totalBrands}</p>
                  </div>
                </div>
              </div>

              {/* Popular Count */}
              <div className="relative overflow-hidden rounded-2xl border bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-gray-200 dark:border-white/5 shadow-sm p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Popüler</p>
                    <p className="text-2xl font-black text-[#101516] dark:text-white leading-tight">{popularCount}</p>
                  </div>
                </div>
              </div>

              {/* Active Count */}
              <div className="relative overflow-hidden rounded-2xl border bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-gray-200 dark:border-white/5 shadow-sm p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Aktif</p>
                    <p className="text-2xl font-black text-[#101516] dark:text-white leading-tight">{activeCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filter Bar */}
            <div className="w-full flex flex-wrap xl:flex-nowrap items-center gap-3 p-2 mb-6 bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/5 rounded-3xl shadow-sm">

              {/* Search */}
              <div className="flex-1 min-w-[280px] flex items-center h-12 px-4 rounded-xl bg-gray-50/50 dark:bg-transparent">
                <svg className="w-5 h-5 text-gray-400 dark:text-[#64748B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Marka ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none pl-3 text-[14px] text-gray-700 dark:text-gray-200 font-medium placeholder-gray-400 dark:placeholder-[#64748B]"
                />
              </div>

              <div className="hidden xl:block w-[1px] h-8 bg-gray-200 dark:bg-white/10 shrink-0"></div>

              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 px-2 xl:px-0">

                {/* Status Dropdown */}
                <div className="flex flex-col justify-center h-12 px-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 min-w-[120px] relative group cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-all">
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Durum</span>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value="ALL">Tümü</option>
                    <option value="ACTIVE">Aktif</option>
                    <option value="PASSIVE">Pasif</option>
                  </select>
                  <div className="flex items-center justify-between pointer-events-none">
                    <span className="text-[13px] font-bold text-gray-700 dark:text-white">{filterStatus === 'ALL' ? 'Tümü' : filterStatus === 'ACTIVE' ? 'Aktif' : 'Pasif'}</span>
                  </div>
                </div>

                {/* Popular Dropdown */}
                <div className="flex flex-col justify-center h-12 px-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 min-w-[130px] relative group cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-all">
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Popüler</span>
                  <select
                    value={filterPopular}
                    onChange={e => setFilterPopular(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value="ALL">Tümü</option>
                    <option value="POPULAR">Popüler</option>
                    <option value="NOT_POPULAR">Popüler Değil</option>
                  </select>
                  <div className="flex items-center justify-between pointer-events-none">
                    <span className="text-[13px] font-bold text-gray-700 dark:text-white">{filterPopular === 'ALL' ? 'Tümü' : filterPopular === 'POPULAR' ? 'Popüler' : 'Değil'}</span>
                  </div>
                </div>

                <div className="w-[1px] h-8 bg-gray-200 dark:bg-white/10 mx-2 shrink-0"></div>

                {/* Sort Segmented */}
                <div className="flex items-center p-1 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 shrink-0">
                  <button
                    onClick={() => setSortOrder('AZ')}
                    className={`px-4 h-10 rounded-xl text-[13px] font-bold transition-all ${sortOrder === 'AZ' ? 'bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    A-Z
                  </button>
                  <button
                    onClick={() => setSortOrder('ZA')}
                    className={`px-4 h-10 rounded-xl text-[13px] font-bold transition-all ${sortOrder === 'ZA' ? 'bg-white dark:bg-white/10 text-gray-800 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    Z-A
                  </button>
                </div>

                <div className="w-[1px] h-8 bg-gray-200 dark:bg-white/10 mx-2 shrink-0"></div>

                {/* Clear */}
                <button
                  onClick={() => { setSearchQuery(''); setFilterStatus('ALL'); setFilterPopular('ALL'); setSortOrder('AZ'); }}
                  className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl text-gray-400 dark:text-[#64748B] hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  title="Filtreleri Temizle"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Create Button */}
                <button
                  onClick={handleAdd}
                  className="h-12 px-6 shrink-0 rounded-2xl bg-[#54E6D4] hover:bg-[#E66000] text-white font-bold text-[13px] shadow-[0_4px_12px_rgba(255,107,0,0.3)] flex items-center justify-center transition-all ml-1"
                >
                  Yeni Ekle
                </button>

                {/* Refresh Button */}
                <button
                  onClick={() => { setIsLoading(true); fetchBrands(); }}
                  className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl text-gray-400 dark:text-[#64748B] hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  title="Yenile"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
              </div>
            </div>

            {/* Main Table Container (Glassmorphism) */}
            <div className="rounded-3xl border overflow-x-auto bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-white/20 dark:border-white/5 shadow-sm relative z-10">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-white/5">
                    <th className="px-6 py-4 text-[12px] font-medium text-gray-500 uppercase rounded-tl-3xl">LOGO</th>
                    <th className="px-6 py-4 text-[12px] font-medium text-gray-500 uppercase">MARKA BİLGİLERİ</th>
                    <th className="px-6 py-4 text-[12px] font-medium text-gray-500 uppercase">DOMAIN</th>
                    <th className="px-6 py-4 text-[12px] font-medium text-gray-500 uppercase">POPÜLER</th>
                    <th className="px-6 py-4 text-[12px] font-medium text-gray-500 uppercase">DURUM</th>
                    <th className="px-6 py-4 text-[12px] font-medium text-gray-500 uppercase text-right rounded-tr-3xl">İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredBrands.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-32 text-center relative overflow-hidden">
                        <div className="py-24 flex flex-col items-center justify-center text-center px-4">
                          <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.659A2.25 2.25 0 009.568 3z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 6h.008v.008H6V6z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-black text-[#101516] dark:text-white mb-2">Marka Bulunamadı</h3>
                          <p className="text-sm font-medium text-gray-500 max-w-[300px] mb-6">Arama kriterlerinize uyan veya sistemde kayıtlı marka bulunamadı.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBrands.map((brand) => (
                      <tr key={brand.brandID} className="transition-all hover:bg-gray-50/50 dark:hover:bg-white/5 group">
                        {/* Logo */}
                        <td className="px-6 py-4">
                          <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-[#0B0C10] shadow-sm border border-gray-100 dark:border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300">
                            {brand.domain ? (
                              <BrandLogo domain={brand.domain} name={brand.name} />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-white font-black text-[16px]"
                                style={{ backgroundColor: hashColor(brand.name) }}
                              >
                                {brand.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Brand Name + Slug */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[14px] font-semibold text-[#101516] dark:text-white leading-tight">{brand.name}</span>
                            <span className="text-[12px] font-mono font-medium text-gray-400 dark:text-gray-500 truncate max-w-[250px]">{brand.slug}</span>
                            {brand.listingCount !== undefined && (
                              <div className="mt-0.5">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
                                  {brand.listingCount} ilan
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Domain */}
                        <td className="px-6 py-4">
                          <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                            {brand.domain || <span className="text-gray-300 dark:text-gray-600 italic">Yok</span>}
                          </span>
                        </td>

                        {/* Popular */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleTogglePopular(brand)}
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${
                              brand.isPopular
                                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500 border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20'
                                : 'bg-gray-50/50 dark:bg-white/5 text-gray-300 dark:text-gray-600 border-gray-100 dark:border-white/10 hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-500/20'
                            }`}
                            title={brand.isPopular ? 'Popülerlikten çıkar' : 'Popüler yap'}
                          >
                            <svg className="w-4 h-4" fill={brand.isPopular ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </button>
                        </td>

                        {/* Active Status */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleActive(brand)}
                            className="flex items-center gap-2 group/status"
                            title={brand.isActive ? 'Pasif yap' : 'Aktif yap'}
                          >
                            <div className="relative flex items-center justify-center w-2.5 h-2.5">
                              <div className={`absolute inset-0 rounded-full ${brand.isActive ? 'bg-[#34C759] animate-ping opacity-30' : 'hidden'}`}></div>
                              <div className={`relative w-2 h-2 rounded-full ${brand.isActive ? 'bg-[#34C759]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            </div>
                            <span className={`text-[12px] font-medium ${brand.isActive ? 'text-[#34C759]' : 'text-gray-400'}`}>
                              {brand.isActive ? 'Aktif' : 'Pasif'}
                            </span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => handleEdit(brand)}
                              className="w-9 h-9 rounded-lg bg-gray-50/50 dark:bg-white/5 text-gray-400 hover:text-[#54E6D4] hover:bg-[#54E6D4]/10 dark:hover:bg-[#54E6D4]/20 border border-transparent hover:border-[#54E6D4]/20 transition-all flex items-center justify-center shadow-sm"
                              title="Düzenle"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button
                              onClick={() => handleDelete(brand.brandID)}
                              className="w-9 h-9 rounded-lg bg-gray-50/50 dark:bg-white/5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all flex items-center justify-center shadow-sm"
                              title="Sil"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Inline Detail View (Create / Edit) */
          currentBrand && (
            <div className="w-full flex flex-col rounded-[2rem] border animate-zoom-in bg-white dark:bg-[#12141C] border-gray-200 dark:border-white/10 shadow-sm overflow-hidden mb-8">

              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0 bg-white dark:bg-[#12141C] relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#54E6D4] via-[#FF9EBE] to-[#5FC8C0]"></div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-2 text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:text-[#54E6D4] dark:hover:text-[#54E6D4] hover:bg-white dark:hover:bg-white/10 hover:border-[#54E6D4]/30 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Geri Dön
                  </button>
                  <div>
                    <h3 className="text-xl font-bold text-[#101516] dark:text-white tracking-tight">
                      {currentBrand.brandID ? 'Markayı Düzenle' : 'Yeni Marka Ekle'}
                    </h3>
                    <p className="text-[13px] font-medium text-gray-500 mt-0.5">
                      {currentBrand.brandID ? `ID: ${currentBrand.brandID.split('-')[0]}...` : 'Tüm alanları doldurun'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar relative">
                <div className="space-y-6 animate-fade-in">

                  {/* Logo Preview */}
                  <div className="flex items-center gap-6 pb-8 border-b border-gray-100 dark:border-white/10">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#0B0C10] border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-sm relative shrink-0">
                      {currentBrand.domain && !logoError ? (
                        <img
                          src={getLogoUrl(currentBrand.domain)!}
                          alt="Logo"
                          className="w-full h-full object-contain p-2"
                          onError={() => setLogoError(true)}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white font-black text-[24px]"
                          style={{ backgroundColor: currentBrand.name ? hashColor(currentBrand.name) : '#CBD5E1' }}
                        >
                          {currentBrand.name ? currentBrand.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-bold text-[#101516] dark:text-white mb-1">Logo Önizleme</h4>
                      <p className="text-[12px] text-gray-500">
                        {currentBrand.domain
                          ? 'Logo, domain alanından otomatik olarak çekilir.'
                          : 'Logo görmek için aşağıya domain girin.'}
                      </p>
                      {logoError && currentBrand.domain && (
                        <p className="text-[11px] text-amber-500 mt-1 font-medium">Logo yüklenemedi, yedek görsel kullanılıyor.</p>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-8 border-b border-gray-100 dark:border-white/10">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">Marka Adı</label>
                      <input
                        type="text"
                        placeholder="Örn: Nike"
                        value={currentBrand.name || ''}
                        onChange={e => {
                          const name = e.target.value;
                          setCurrentBrand({
                            ...currentBrand,
                            name,
                            slug: generateSlug(name),
                          });
                        }}
                        className="w-full h-11 px-4 rounded-xl outline-none font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#54E6D4] focus:ring-2 focus:ring-[#54E6D4]/20 shadow-sm"
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">Slug</label>
                      <input
                        type="text"
                        placeholder="otomatik-olusturulur"
                        value={currentBrand.slug || ''}
                        onChange={e => setCurrentBrand({ ...currentBrand, slug: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl outline-none font-mono font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#54E6D4] focus:ring-2 focus:ring-[#54E6D4]/20 shadow-sm"
                      />
                      <p className="text-[11px] font-medium text-gray-400 ml-1">İsim girildiğinde otomatik oluşturulur, elle de düzenlenebilir.</p>
                    </div>

                    {/* Domain */}
                    <div className="space-y-1.5 lg:col-span-2">
                      <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">Domain</label>
                      <input
                        type="text"
                        placeholder="Örn: nike.com"
                        value={currentBrand.domain || ''}
                        onChange={e => {
                          setCurrentBrand({ ...currentBrand, domain: e.target.value });
                          setLogoError(false);
                        }}
                        className="w-full h-11 px-4 rounded-xl outline-none font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#54E6D4] focus:ring-2 focus:ring-[#54E6D4]/20 shadow-sm"
                      />
                      <p className="text-[11px] font-medium text-gray-400 ml-1">
                        Logo için marka web sitesi (örn: <span className="text-[#54E6D4]">nike.com</span>)
                      </p>
                    </div>
                  </div>

                  {/* Toggle Buttons */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* isPopular */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">Popüler Marka</label>
                      <div className="flex items-center gap-1 p-1 h-11 bg-gray-50/50 dark:bg-[#0B0C10] rounded-xl border border-gray-200 dark:border-white/10 relative z-0">
                        <button
                          onClick={() => setCurrentBrand({ ...currentBrand, isPopular: true })}
                          className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${currentBrand.isPopular ? 'bg-white dark:bg-white/10 shadow-sm text-amber-600 dark:text-amber-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                          Evet
                        </button>
                        <button
                          onClick={() => setCurrentBrand({ ...currentBrand, isPopular: false })}
                          className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${!currentBrand.isPopular ? 'bg-white dark:bg-white/10 shadow-sm text-gray-600 dark:text-gray-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                          Hayır
                        </button>
                      </div>
                    </div>

                    {/* isActive */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1">Sistem Durumu</label>
                      <div className="flex items-center gap-1 p-1 h-11 bg-gray-50/50 dark:bg-[#0B0C10] rounded-xl border border-gray-200 dark:border-white/10 relative z-0">
                        <button
                          onClick={() => setCurrentBrand({ ...currentBrand, isActive: true })}
                          className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${currentBrand.isActive ? 'bg-white dark:bg-white/10 shadow-sm text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                          Aktif
                        </button>
                        <button
                          onClick={() => setCurrentBrand({ ...currentBrand, isActive: false })}
                          className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${!currentBrand.isActive ? 'bg-white dark:bg-white/10 shadow-sm text-red-600 dark:text-red-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                          Pasif
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#12141C] flex items-center justify-end gap-3 shrink-0 relative z-20">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="h-11 px-6 rounded-xl font-semibold text-[13px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-11 px-8 rounded-xl bg-[#54E6D4] text-white font-bold text-[13px] hover:bg-[#E66000] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center min-w-[140px] shadow-[0_4px_12px_rgba(255,107,0,0.3)]"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Kaydet
                    </span>
                  )}
                </button>
              </div>

            </div>
          )
        )}
      </div>
    </div>
  );
}

/* Sub-component for brand logo with onError fallback */
function BrandLogo({ domain, name }: { domain: string; name: string }) {
  const [error, setError] = useState(false);
  const logoUrl = `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=64&format=png`;

  if (error) {
    return (
      <div
        className="w-full h-full flex items-center justify-center text-white font-black text-[16px]"
        style={{ backgroundColor: hashColor(name) }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={name}
      className="w-full h-full object-contain p-1.5"
      onError={() => setError(true)}
    />
  );
}

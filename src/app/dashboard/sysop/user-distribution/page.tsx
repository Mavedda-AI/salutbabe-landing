'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

// --- DATA ---
const regionData: Record<string, { users: number; color: string; cities: Record<string, { users: number; districts: Record<string, { users: number; neighborhoods: string[] }> }> }> = {
  'Marmara': { users: 4820, color: '#111827', cities: {
    'İstanbul': { users: 3200, districts: { 'Kadıköy': { users: 820, neighborhoods: ['Caferağa','Moda','Fenerbahçe','Koşuyolu','Acıbadem'] }, 'Beşiktaş': { users: 610, neighborhoods: ['Levent','Etiler','Bebek','Ortaköy','Sinanpaşa'] }, 'Üsküdar': { users: 480, neighborhoods: ['Çengelköy','Kuzguncuk','Beylerbeyi','Altunizade','Ünalan'] }, 'Bakırköy': { users: 390, neighborhoods: ['Ataköy','Yeşilköy','Florya','Zuhuratbaba','Osmaniye'] }, 'Şişli': { users: 350, neighborhoods: ['Mecidiyeköy','Nişantaşı','Teşvikiye','Bomonti','Halaskargazi'] }, 'Fatih': { users: 280, neighborhoods: ['Sultanahmet','Aksaray','Laleli','Beyazıt','Vefa'] }, 'Diğer': { users: 270, neighborhoods: ['Sarıyer','Kartal','Pendik','Maltepe','Ataşehir'] } }},
    'Bursa': { users: 620, districts: { 'Osmangazi': { users: 240, neighborhoods: ['Çekirge','Heykel','Kükürtlü'] }, 'Nilüfer': { users: 210, neighborhoods: ['Görükle','Beşevler','Özlüce'] }, 'Yıldırım': { users: 170, neighborhoods: ['Esenevler','Millet','Yiğitler'] } }},
    'Kocaeli': { users: 480, districts: { 'İzmit': { users: 280, neighborhoods: ['Yahyakaptan','Yenişehir','Körfez'] }, 'Gebze': { users: 200, neighborhoods: ['Güzeller','Osman Yılmaz','Beylikbağı'] } }},
    'Tekirdağ': { users: 280, districts: { 'Süleymanpaşa': { users: 180, neighborhoods: ['Hürriyet','Aydoğdu'] }, 'Çorlu': { users: 100, neighborhoods: ['Reşadiye','Muhittin'] } }},
    'Edirne': { users: 240, districts: { 'Merkez': { users: 240, neighborhoods: ['Kaleiçi','Sarayiçi','Yıldırım'] } }},
  }},
  'Ege': { users: 2140, color: '#2563EB', cities: {
    'İzmir': { users: 1400, districts: { 'Konak': { users: 420, neighborhoods: ['Alsancak','Basmane','Kemeraltı','Güzelyalı'] }, 'Karşıyaka': { users: 380, neighborhoods: ['Bostanlı','Mavişehir','Nergiz'] }, 'Bornova': { users: 320, neighborhoods: ['Erzene','Kazımdirik','Evka-3'] }, 'Buca': { users: 280, neighborhoods: ['Şirinyer','Adatepe','Kozağaç'] } }},
    'Denizli': { users: 380, districts: { 'Merkezefendi': { users: 220, neighborhoods: ['Sümer','Akkonak'] }, 'Pamukkale': { users: 160, neighborhoods: ['Kınıklı','Siteler'] } }},
    'Muğla': { users: 360, districts: { 'Bodrum': { users: 200, neighborhoods: ['Gümbet','Bitez','Yalıkavak'] }, 'Fethiye': { users: 160, neighborhoods: ['Çalış','Hisarönü','Ölüdeniz'] } }},
  }},
  'İç Anadolu': { users: 1860, color: '#D97706', cities: {
    'Ankara': { users: 1200, districts: { 'Çankaya': { users: 480, neighborhoods: ['Kızılay','Tunalı','Bahçelievler','Ümitköy'] }, 'Keçiören': { users: 320, neighborhoods: ['Etlik','Subayevleri','Kalaba'] }, 'Yenimahalle': { users: 240, neighborhoods: ['Batıkent','Demetevler','Ostim'] }, 'Mamak': { users: 160, neighborhoods: ['Abidinpaşa','Natoyolu','Kutlu'] } }},
    'Konya': { users: 340, districts: { 'Selçuklu': { users: 180, neighborhoods: ['Bosna Hersek','Yazır'] }, 'Meram': { users: 160, neighborhoods: ['Havzan','Yenişehir'] } }},
    'Eskişehir': { users: 320, districts: { 'Tepebaşı': { users: 200, neighborhoods: ['Batıkent','Şirintepe'] }, 'Odunpazarı': { users: 120, neighborhoods: ['Akarbaşı','Emek'] } }},
  }},
  'Akdeniz': { users: 1520, color: '#059669', cities: {
    'Antalya': { users: 680, districts: { 'Muratpaşa': { users: 320, neighborhoods: ['Lara','Konyaaltı','Güzeloba'] }, 'Kepez': { users: 200, neighborhoods: ['Varsak','Şafak'] }, 'Konyaaltı': { users: 160, neighborhoods: ['Hurma','Liman','Sarısu'] } }},
    'Mersin': { users: 420, districts: { 'Yenişehir': { users: 240, neighborhoods: ['Forum','Palmiye'] }, 'Mezitli': { users: 180, neighborhoods: ['Viranşehir','Tece'] } }},
    'Adana': { users: 420, districts: { 'Seyhan': { users: 240, neighborhoods: ['Reşatbey','Kurtuluş'] }, 'Çukurova': { users: 180, neighborhoods: ['Beyazevler','Toros'] } }},
  }},
  'Karadeniz': { users: 980, color: '#7C3AED', cities: {
    'Trabzon': { users: 380, districts: { 'Ortahisar': { users: 240, neighborhoods: ['Boztepe','Kemerkaya','Pazarkapı'] }, 'Akçaabat': { users: 140, neighborhoods: ['Söğütlü','Derecik'] } }},
    'Samsun': { users: 340, districts: { 'İlkadım': { users: 200, neighborhoods: ['Kale','Pazar'] }, 'Atakum': { users: 140, neighborhoods: ['Kurupelit','Balaç'] } }},
    'Rize': { users: 260, districts: { 'Merkez': { users: 260, neighborhoods: ['Müftü','Piriçelebi','Taşlıdere'] } }},
  }},
  'Güneydoğu': { users: 720, color: '#DC2626', cities: {
    'Gaziantep': { users: 380, districts: { 'Şahinbey': { users: 220, neighborhoods: ['Kolejtepe','Binevler'] }, 'Şehitkamil': { users: 160, neighborhoods: ['İbrahimli','Karşıyaka'] } }},
    'Diyarbakır': { users: 200, districts: { 'Bağlar': { users: 120, neighborhoods: ['Şeyh Şamil','Huzurevleri'] }, 'Kayapınar': { users: 80, neighborhoods: ['Peyas','Huzurevleri'] } }},
    'Şanlıurfa': { users: 140, districts: { 'Eyyübiye': { users: 80, neighborhoods: ['Süleymaniye','Bamyasuyu'] }, 'Haliliye': { users: 60, neighborhoods: ['Devteşti','Paşabağı'] } }},
  }},
  'Doğu Anadolu': { users: 460, color: '#EA580C', cities: {
    'Van': { users: 180, districts: { 'İpekyolu': { users: 120, neighborhoods: ['Şabaniye','Hafiziye'] }, 'Tuşba': { users: 60, neighborhoods: ['Kalecik','Abdurrahman Gazi'] } }},
    'Erzurum': { users: 160, districts: { 'Yakutiye': { users: 100, neighborhoods: ['Lalapaşa','Mumcu'] }, 'Palandöken': { users: 60, neighborhoods: ['Yıldızkent','Saltuklu'] } }},
    'Malatya': { users: 120, districts: { 'Battalgazi': { users: 70, neighborhoods: ['Uçbağlar','Çöşnük'] }, 'Yeşilyurt': { users: 50, neighborhoods: ['Bostanbaşı','Çilesiz'] } }},
  }},
};

const totalUsers = Object.values(regionData).reduce((s, r) => s + r.users, 0);

// Simplified Turkey SVG regions (viewBox coordinates)
const regionPaths: Record<string, { d: string; labelX: number; labelY: number }> = {
  'Marmara': { d: 'M120,80 L200,60 L240,80 L260,110 L240,140 L200,150 L160,140 L120,120 Z', labelX: 185, labelY: 110 },
  'Ege': { d: 'M80,140 L160,140 L200,150 L200,220 L160,260 L100,280 L60,240 L60,180 Z', labelX: 130, labelY: 210 },
  'Akdeniz': { d: 'M160,260 L200,220 L300,220 L380,240 L420,260 L380,300 L280,310 L200,290 Z', labelX: 290, labelY: 265 },
  'İç Anadolu': { d: 'M240,140 L340,120 L420,140 L440,180 L420,220 L380,240 L300,220 L200,220 L200,150 Z', labelX: 320, labelY: 175 },
  'Karadeniz': { d: 'M260,50 L340,40 L440,50 L540,60 L580,80 L540,100 L440,110 L340,120 L260,110 Z', labelX: 420, labelY: 80 },
  'Doğu Anadolu': { d: 'M440,110 L540,100 L620,120 L640,170 L620,210 L540,220 L440,180 Z', labelX: 540, labelY: 160 },
  'Güneydoğu': { d: 'M420,220 L440,180 L540,220 L620,210 L620,260 L560,290 L480,300 L420,260 Z', labelX: 520, labelY: 250 },
};

type DrillLevel = 'region' | 'city' | 'district' | 'neighborhood';

export default function UserDistributionPage() {
  const router = useRouter();
  const [level, setLevel] = useState<DrillLevel>('region');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleRegionClick = (name: string) => {
    setSelectedRegion(name); setSelectedCity(null); setSelectedDistrict(null); setLevel('city');
  };
  const handleCityClick = (name: string) => {
    setSelectedCity(name); setSelectedDistrict(null); setLevel('district');
  };
  const handleDistrictClick = (name: string) => {
    setSelectedDistrict(name); setLevel('neighborhood');
  };
  const goBack = () => {
    if (level === 'neighborhood') { setSelectedDistrict(null); setLevel('district'); }
    else if (level === 'district') { setSelectedCity(null); setLevel('city'); }
    else if (level === 'city') { setSelectedRegion(null); setLevel('region'); }
  };

  const breadcrumb = [
    { label: 'Türkiye', onClick: () => { setSelectedRegion(null); setSelectedCity(null); setSelectedDistrict(null); setLevel('region'); } },
    ...(selectedRegion ? [{ label: selectedRegion, onClick: () => { setSelectedCity(null); setSelectedDistrict(null); setLevel('city'); } }] : []),
    ...(selectedCity ? [{ label: selectedCity, onClick: () => { setSelectedDistrict(null); setLevel('district'); } }] : []),
    ...(selectedDistrict ? [{ label: selectedDistrict, onClick: () => {} }] : []),
  ];

  // Current data based on drill level
  const getCurrentItems = (): { name: string; users: number; color: string; onClick: (n: string) => void }[] => {
    if (level === 'region') {
      return Object.entries(regionData).map(([n, d]) => ({ name: n, users: d.users, color: d.color, onClick: handleRegionClick }));
    }
    if (level === 'city' && selectedRegion) {
      const cities = regionData[selectedRegion]?.cities || {};
      const color = regionData[selectedRegion]?.color || '#111827';
      return Object.entries(cities).map(([n, d]) => ({ name: n, users: d.users, color, onClick: handleCityClick }));
    }
    if (level === 'district' && selectedRegion && selectedCity) {
      const districts = regionData[selectedRegion]?.cities[selectedCity]?.districts || {};
      const color = regionData[selectedRegion]?.color || '#111827';
      return Object.entries(districts).map(([n, d]) => ({ name: n, users: d.users, color, onClick: handleDistrictClick }));
    }
    if (level === 'neighborhood' && selectedRegion && selectedCity && selectedDistrict) {
      const neighborhoods = regionData[selectedRegion]?.cities[selectedCity]?.districts[selectedDistrict]?.neighborhoods || [];
      const color = regionData[selectedRegion]?.color || '#111827';
      return neighborhoods.map((n, i) => ({ name: n, users: Math.floor(Math.random() * 50) + 10, color, onClick: () => {} }));
    }
    return [];
  };

  const items = getCurrentItems();
  const maxUsers = Math.max(...items.map(i => i.users), 1);
  const levelLabel = level === 'region' ? 'Bölge' : level === 'city' ? 'Şehir' : level === 'district' ? 'İlçe' : 'Mahalle';

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-fade-in pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard/sysop')} className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-[20px] md:text-[24px] font-black text-[#111827] tracking-tight">Kullanıcı Dağılımı</h1>
            <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Coğrafi Analiz • {totalUsers.toLocaleString('tr-TR')} Kullanıcı</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] font-bold">
        {breadcrumb.map((b, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>}
            <button onClick={b.onClick} className={`transition-colors ${i === breadcrumb.length - 1 ? 'text-[#111827] font-black' : 'text-gray-400 hover:text-gray-600'}`}>{b.label}</button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* MAP AREA */}
        <div className="lg:col-span-2 rounded-[16px] border border-gray-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-4 md:p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {level === 'region' ? 'TÜRKİYE HARİTASI' : `${breadcrumb[breadcrumb.length - 1]?.label?.toUpperCase()} • ${levelLabel}`}
            </h3>
            {level !== 'region' && (
              <button onClick={goBack} className="px-3 py-1.5 rounded-lg border border-gray-200 text-[10px] font-black text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                GERİ
              </button>
            )}
          </div>

          {/* SVG Map for Region level */}
          {level === 'region' ? (
            <div className="flex-1 flex items-center justify-center">
              <svg viewBox="40 20 620 310" className="w-full max-w-[600px] h-auto">
                {Object.entries(regionPaths).map(([name, path]) => {
                  const data = regionData[name];
                  const isHovered = hoveredItem === name;
                  return (
                    <g key={name} onClick={() => handleRegionClick(name)} onMouseEnter={() => setHoveredItem(name)} onMouseLeave={() => setHoveredItem(null)} className="cursor-pointer">
                      <path d={path.d} fill={isHovered ? data.color : '#E5E7EB'} stroke="white" strokeWidth="2" className="transition-all duration-300" style={{ opacity: isHovered ? 1 : 0.8 }} />
                      {/* Bubble */}
                      <circle cx={path.labelX} cy={path.labelY} r={Math.max(16, Math.min(28, data.users / 200))} fill={data.color} className="transition-all duration-300" style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)', transformOrigin: `${path.labelX}px ${path.labelY}px` }} />
                      <text x={path.labelX} y={path.labelY + 1} textAnchor="middle" dominantBaseline="middle" className="fill-white text-[10px] font-bold pointer-events-none select-none">{(data.users / 1000).toFixed(1)}K</text>
                      {isHovered && (
                        <text x={path.labelX} y={path.labelY - 28} textAnchor="middle" className="fill-[#111827] text-[9px] font-bold pointer-events-none">{name}</text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            /* Grid/Bubble view for deeper levels */
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 content-start py-4">
              {items.map((item) => {
                const sizeRatio = item.users / maxUsers;
                const bubbleSize = Math.max(40, Math.min(80, sizeRatio * 80));
                return (
                  <div key={item.name} onClick={() => item.onClick(item.name)} onMouseEnter={() => setHoveredItem(item.name)} onMouseLeave={() => setHoveredItem(null)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${hoveredItem === item.name ? 'border-gray-300 bg-gray-50 scale-[1.02]' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                    <div className="relative flex items-center justify-center mb-2 transition-transform duration-300" style={{ width: bubbleSize, height: bubbleSize, transform: hoveredItem === item.name ? 'scale(1.1)' : 'scale(1)' }}>
                      <div className="absolute inset-0 rounded-full opacity-15" style={{ backgroundColor: item.color }} />
                      <div className="w-[70%] h-[70%] rounded-full flex items-center justify-center" style={{ backgroundColor: item.color }}>
                        <span className="text-white text-[11px] font-black">{item.users >= 1000 ? `${(item.users/1000).toFixed(1)}K` : item.users}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-[#111827] text-center">{item.name}</span>
                    <span className="text-[9px] font-bold text-gray-400">{item.users.toLocaleString('tr-TR')} kullanıcı</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SIDEBAR - Top List */}
        <div className="rounded-[16px] border border-gray-100 bg-[#111827] shadow-[0_2px_12px_rgba(0,0,0,0.1)] p-4 md:p-5 flex flex-col max-h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {levelLabel} SIRALAMASI
            </h3>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
            {[...items].sort((a, b) => b.users - a.users).map((item, i) => (
              <div key={item.name} onClick={() => item.onClick(item.name)}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${hoveredItem === item.name ? 'bg-white/10' : 'hover:bg-white/5'}`}
                onMouseEnter={() => setHoveredItem(item.name)} onMouseLeave={() => setHoveredItem(null)}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: item.color + '33', color: item.color === '#111827' ? '#fff' : item.color }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-black text-white truncate">{item.name}</p>
                  <p className="text-[10px] font-bold text-gray-500">{item.users.toLocaleString('tr-TR')} kullanıcı</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.users / maxUsers) * 100}%`, backgroundColor: item.color }} />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 w-8 text-right">{Math.round((item.users / totalUsers) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500">Toplam</span>
              <span className="text-[12px] font-black text-white">{items.reduce((s, i) => s + i.users, 0).toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500">En Yoğun</span>
              <span className="text-[12px] font-black text-green-400">{[...items].sort((a, b) => b.users - a.users)[0]?.name || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

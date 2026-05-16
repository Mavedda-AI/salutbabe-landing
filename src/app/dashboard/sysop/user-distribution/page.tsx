'use client';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

// --- INITIAL DATA ---
const initialRegionData: Record<string, { users: number; color: string; cities: Record<string, { users: number; districts: Record<string, { users: number; neighborhoods: string[] }> }> }> = {
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
  
  // LIVE DATA STATE
  const [regionData, setRegionData] = useState(initialRegionData);

  useEffect(() => {
    // Simulate real-time active users coming in/out
    const interval = setInterval(() => {
      setRegionData(prev => {
        const next = JSON.parse(JSON.stringify(prev));
        Object.keys(next).forEach(r => {
          // Add or remove random amount
          const rChange = Math.floor(Math.random() * 21) - 5; // -5 to +15 (growing trend)
          next[r].users = Math.max(10, next[r].users + rChange);
          
          Object.keys(next[r].cities).forEach(c => {
             const cChange = Math.floor(Math.random() * 9) - 2;
             next[r].cities[c].users = Math.max(5, next[r].cities[c].users + cChange);
             
             Object.keys(next[r].cities[c].districts).forEach(d => {
                const dChange = Math.floor(Math.random() * 5) - 1;
                next[r].cities[c].districts[d].users = Math.max(1, next[r].cities[c].districts[d].users + dChange);
             });
          });
        });
        return next;
      });
    }, 2500); // update every 2.5s
    
    return () => clearInterval(interval);
  }, []);

  const totalUsers = Object.values(regionData).reduce((s, r) => s + r.users, 0);

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
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans animate-fade-in relative">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push('/dashboard/sysop')} className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h1 className="text-[22px] font-black text-[#111827] tracking-tight">İnteraktif Kullanıcı Haritası</h1>
            <p className="text-[12px] font-bold text-gray-400">
              {breadcrumb.map((b, i) => (
                <span key={i}>
                  <button onClick={b.onClick} className="hover:text-gray-900 transition-colors">{b.label}</button>
                  {i < breadcrumb.length - 1 && <span className="mx-1.5 opacity-50">/</span>}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* MAP CONTAINER */}
        <div className="relative w-full h-[650px] bg-[#F4F5F5] rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-center">
          
          {/* Top Controls */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
            <div className="bg-white rounded-full p-1.5 flex items-center shadow-md border border-gray-100">
              <button className="px-6 py-2 rounded-full bg-[#111827] text-white text-[13px] font-bold shadow-sm">Kullanıcılar</button>
              <button className="px-6 py-2 rounded-full text-gray-500 text-[13px] font-bold hover:text-gray-900 transition-colors">Tedarikçiler</button>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[12px] font-bold text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Son güncellenme: 2 dk önce
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-8 left-8 flex flex-col gap-2 z-20">
            <button onClick={goBack} disabled={level === 'region'} className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all ${level === 'region' ? 'bg-white/50 text-gray-300' : 'bg-white text-gray-700 hover:scale-105'}`}>
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
            </button>
            <button className="w-11 h-11 bg-white rounded-2xl text-gray-700 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </button>
          </div>

          {/* Floating Notification */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#2D2D2D] rounded-[20px] pl-4 pr-3 py-3 flex items-center gap-4 shadow-2xl z-20 animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-[14px]">!</div>
            <div className="flex flex-col pr-2">
              <span className="text-white text-[13px] font-bold">Yeni veri mevcut</span>
              <span className="text-gray-400 text-[11px] font-medium">Bölge durumları güncellendi</span>
            </div>
            <button className="w-10 h-10 rounded-xl bg-[#1D9954] flex items-center justify-center text-white hover:bg-[#168244] transition-colors ml-2">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>

          {/* Right Floating Card */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-[280px] bg-[#222222] rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] p-5 z-20 border border-white/5">
             <div className="flex items-center justify-between mb-4">
               <div>
                 <h3 className="text-white text-[15px] font-bold">Top {levelLabel}lar</h3>
                 <div className="flex items-center gap-1.5 mt-1">
                   <div className="w-4 h-4 rounded bg-[#2D45B0] flex items-center justify-center">
                     <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                   </div>
                   <span className="text-gray-400 text-[11px] font-bold">En yüksek eşleşme</span>
                 </div>
               </div>
               <button className="w-8 h-8 rounded-full bg-[#1D9954] flex items-center justify-center text-white hover:scale-105 transition-transform">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
               </button>
             </div>

             <div className="space-y-1">
                {[...items].sort((a, b) => b.users - a.users).slice(0, 4).map((item, idx) => (
                  <div key={item.name} onClick={() => item.onClick(item.name)} onMouseEnter={() => setHoveredItem(item.name)} onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center gap-3 p-2 rounded-[14px] cursor-pointer transition-colors ${hoveredItem === item.name ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center border-2 border-[#222222]">
                         <img src={`https://i.pravatar.cc/150?u=${item.name}`} alt="" className="w-full h-full object-cover opacity-80" />
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#222222] ${idx === 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-[12px] font-bold truncate">{item.name}</p>
                      <p className="text-gray-400 text-[10px]">{item.users.toLocaleString('tr-TR')} kul.</p>
                    </div>
                    {hoveredItem === item.name && idx === 1 ? (
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#222222]"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                    ) : (
                      <span className="text-white text-[14px] font-black">{Math.round((item.users / totalUsers) * 100)}%</span>
                    )}
                  </div>
                ))}
             </div>
          </div>

          {/* SVG Map */}
          {level === 'region' ? (
            <svg viewBox="0 0 1050 480" className="w-full h-full object-contain px-12 py-12 z-10 drop-shadow-sm">
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Draw connection lines from active/hovered region to right panel */}
              {hoveredItem && regionData[hoveredItem] && (
                <g opacity="0.8">
                  {[120, 180, 240, 300].map((y, i) => {
                    const coords: Record<string, {x: number, y: number}> = {
                      'Marmara': { x: 140, y: 80 },
                      'Ege': { x: 80, y: 230 },
                      'Akdeniz': { x: 320, y: 330 },
                      'İç Anadolu': { x: 450, y: 180 },
                      'Karadeniz': { x: 620, y: 80 },
                      'Doğu Anadolu': { x: 850, y: 180 },
                      'Güneydoğu': { x: 720, y: 290 },
                    };
                    const hx = coords[hoveredItem]?.x || 0;
                    const hy = coords[hoveredItem]?.y || 0;
                    return (
                      <path key={i} d={`M${hx},${hy} Q${(hx + 1050) / 2},${(hy + y) / 2} 1050,${y}`} 
                            fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
                    );
                  })}
                </g>
              )}

              {/* Render 81 Cities Background */}
              <g>
                {require('../../../components/TurkeyMapData').default.map((city: any, i: number) => (
                  <path 
                    key={i} 
                    d={city.draw} 
                    fill="#D1D5DB" 
                    stroke="#F9FAFB" 
                    strokeWidth="1.5" 
                    className="transition-colors duration-300"
                  />
                ))}
              </g>

              {/* Render Regions Bubbles */}
              {Object.entries(regionPaths).map(([name, path]) => {
                const data = regionData[name];
                const isHovered = hoveredItem === name;
                
                const mapColor = isHovered ? '#4A4A4A' : '#D1D5DB';
                
                // Bubble logic: highest uses dark bubble (#1A1A1A), others use orange (#FBBF24)
                const isTop = name === 'Marmara';
                const actualBubbleColor = isTop ? '#1A1A1A' : '#FDBA74';

                // New Coordinates for 1050x480 ViewBox
                const coords: Record<string, {x: number, y: number}> = {
                  'Marmara': { x: 140, y: 80 },
                  'Ege': { x: 80, y: 230 },
                  'Akdeniz': { x: 320, y: 330 },
                  'İç Anadolu': { x: 450, y: 180 },
                  'Karadeniz': { x: 620, y: 80 },
                  'Doğu Anadolu': { x: 850, y: 180 },
                  'Güneydoğu': { x: 720, y: 290 },
                };

                const lx = coords[name]?.x || 0;
                const ly = coords[name]?.y || 0;

                return (
                  <g key={name} onClick={() => handleRegionClick(name)} onMouseEnter={() => setHoveredItem(name)} onMouseLeave={() => setHoveredItem(null)} className="cursor-pointer">
                    {/* Bubble background area to make it easily clickable */}
                    <circle cx={lx} cy={ly} r={40} fill="transparent" />
                    
                    {/* Bubble */}
                    <circle cx={lx} cy={ly} r={isTop ? 28 : 22} fill={actualBubbleColor} filter="url(#shadow)" className="transition-transform duration-300" style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)', transformOrigin: `${lx}px ${ly}px` }} />
                    <text x={lx} y={ly + 1} textAnchor="middle" dominantBaseline="middle" className={`text-[14px] font-bold pointer-events-none select-none ${isTop ? 'fill-white' : 'fill-[#111827]'}`}>
                      {Math.round(data.users / 1000) > 0 ? Math.round(data.users / 1000) : (data.users / 1000).toFixed(1)}
                    </text>

                    {/* Tooltips on Hover/Top */}
                    {isTop && (
                      <g>
                        <rect x={lx - 35} y={ly - 50} width="70" height="22" rx="4" fill="#222222" filter="url(#shadow)" />
                        <text x={lx} y={ly - 38} textAnchor="middle" fill="white" className="text-[9px] font-bold">Top bölge</text>
                        {/* Mini Avatars */}
                        <circle cx={lx - 25} cy={ly - 15} r={8} fill="#4A4A4A" stroke="#F4F5F5" strokeWidth="1.5" />
                        <circle cx={lx - 12} cy={ly - 25} r={8} fill="#6B7280" stroke="#F4F5F5" strokeWidth="1.5" />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          ) : (
            /* Deep Drill View */
            <div className="w-full h-full p-12 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items.map((item) => {
                  const sizeRatio = item.users / maxUsers;
                  const bubbleSize = Math.max(50, Math.min(100, sizeRatio * 100));
                  return (
                    <div key={item.name} onClick={() => item.onClick(item.name)}
                      className="flex flex-col items-center justify-center p-6 bg-white rounded-[20px] shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 hover:border-[#FDBA74]">
                      <div className="relative flex items-center justify-center mb-3" style={{ width: bubbleSize, height: bubbleSize }}>
                        <div className="absolute inset-0 rounded-full bg-[#FDBA74]/20"></div>
                        <div className="w-[70%] h-[70%] rounded-full bg-[#FDBA74] flex items-center justify-center shadow-md">
                           <span className="text-[#111827] text-[13px] font-black">{item.users >= 1000 ? `${(item.users/1000).toFixed(1)}K` : item.users}</span>
                        </div>
                      </div>
                      <span className="text-[14px] font-black text-[#111827]">{item.name}</span>
                      <span className="text-[11px] font-bold text-gray-400">{item.users}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

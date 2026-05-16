'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

type User = { id: number; name: string; email: string; phone: string; role: 'Normal' | 'Satıcı' | 'Kurumsal' | 'Kurucu'; status: 'AKTİF' | 'PASİF' | 'ASKIDA'; joinDate: string; lastLogin: string; orders: number; reviews: number; complaints: number };

const generateUsers = (): User[] => [
  { id: 1, name: 'Mustafa Şahin', email: 'mustafa@salutbabe.com', phone: '532 *** 01', role: 'Kurucu', status: 'AKTİF', joinDate: '01 Oca 2026', lastLogin: 'Bugün 14:30', orders: 0, reviews: 0, complaints: 0 },
  { id: 2, name: 'Büşra Kaya', email: 'busra@example.com', phone: '545 *** 32', role: 'Satıcı', status: 'AKTİF', joinDate: '15 Oca 2026', lastLogin: 'Bugün 11:45', orders: 42, reviews: 18, complaints: 1 },
  { id: 3, name: 'Ahmet Yılmaz', email: 'ahmet.y@example.com', phone: '555 *** 18', role: 'Normal', status: 'AKTİF', joinDate: '22 Şub 2026', lastLogin: 'Dün 19:20', orders: 12, reviews: 5, complaints: 0 },
  { id: 4, name: 'Cansu Demir', email: 'cansu.d@example.com', phone: '542 *** 44', role: 'Normal', status: 'PASİF', joinDate: '10 Mar 2026', lastLogin: '5 gün önce', orders: 3, reviews: 1, complaints: 0 },
  { id: 5, name: 'Elif Arslan', email: 'elif.a@example.com', phone: '533 *** 77', role: 'Satıcı', status: 'ASKIDA', joinDate: '28 Mar 2026', lastLogin: '12 Mayıs', orders: 8, reviews: 3, complaints: 4 },
  { id: 6, name: 'Zeynep Çelik', email: 'zeynep.c@example.com', phone: '541 *** 90', role: 'Satıcı', status: 'AKTİF', joinDate: '05 Nis 2026', lastLogin: 'Bugün 08:12', orders: 156, reviews: 42, complaints: 0 },
  { id: 7, name: 'Ali Öztürk', email: 'ali.o@example.com', phone: '537 *** 55', role: 'Normal', status: 'AKTİF', joinDate: '12 Nis 2026', lastLogin: 'Dün 22:10', orders: 7, reviews: 2, complaints: 0 },
  { id: 8, name: 'Fatma Yıldız', email: 'fatma.y@example.com', phone: '546 *** 88', role: 'Normal', status: 'AKTİF', joinDate: '20 Nis 2026', lastLogin: 'Bugün 16:55', orders: 25, reviews: 11, complaints: 1 },
  { id: 9, name: 'Mehmet Kara', email: 'mehmet.k@example.com', phone: '544 *** 66', role: 'Kurumsal', status: 'AKTİF', joinDate: '01 May 2026', lastLogin: 'Bugün 09:00', orders: 310, reviews: 0, complaints: 0 },
  { id: 10, name: 'Selin Taş', email: 'selin.t@example.com', phone: '539 *** 21', role: 'Normal', status: 'PASİF', joinDate: '08 May 2026', lastLogin: '2 gün önce', orders: 1, reviews: 0, complaints: 0 },
];

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(generateUsers);
  const [filter, setFilter] = useState<'all' | 'AKTİF' | 'PASİF' | 'ASKIDA' | 'Satıcı'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [modal, setModal] = useState<User | null>(null);
  const [kvkkModal, setKvkkModal] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const filtered = users
    .filter(u => {
      if (filter === 'AKTİF') return u.status === 'AKTİF';
      if (filter === 'PASİF') return u.status === 'PASİF';
      if (filter === 'ASKIDA') return u.status === 'ASKIDA';
      if (filter === 'Satıcı') return u.role === 'Satıcı' || u.role === 'Kurumsal';
      return true;
    })
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(u => u.id));

  const updateStatus = (id: number, status: User['status'], msg: string) => {
    setUsers(p => p.map(u => u.id === id ? { ...u, status } : u));
    setActionDone(msg);
    setTimeout(() => setActionDone(null), 2500);
    setModal(null);
  };

  const updateRole = (id: number, role: User['role']) => {
    setUsers(p => p.map(u => u.id === id ? { ...u, role } : u));
    setActionDone(`Kullanıcı rolü "${role}" olarak güncellendi.`);
    setTimeout(() => setActionDone(null), 2500);
  };

  const bulkSuspend = () => {
    setUsers(p => p.map(u => selected.includes(u.id) ? { ...u, status: 'ASKIDA' as const } : u));
    setActionDone(`${selected.length} kullanıcı askıya alındı.`);
    setSelected([]);
    setTimeout(() => setActionDone(null), 2500);
  };

  const cardClass = 'bg-white rounded-[20px] border border-gray-100 shadow-sm';
  const kpis = [
    { label: 'Aktif', value: users.filter(u => u.status === 'AKTİF').length, icon: '✅', color: 'text-green-600' },
    { label: 'Askıda', value: users.filter(u => u.status === 'ASKIDA').length, icon: '⏸️', color: 'text-orange-500' },
    { label: 'Satıcı', value: users.filter(u => u.role === 'Satıcı' || u.role === 'Kurumsal').length, icon: '🏪', color: 'text-blue-600' },
    { label: 'Pasif', value: users.filter(u => u.status === 'PASİF').length, icon: '💤', color: 'text-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {actionDone && <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">✅ {actionDone}</div>}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"><svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
          <div className="flex-1"><h1 className="text-[18px] font-black text-[#111827]">Kullanıcı Yönetimi</h1><p className="text-[11px] font-medium text-gray-400">Platform üyeleri, roller & KVKK yönetimi</p></div>
          <button onClick={() => setKvkkModal(true)} className="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 hover:bg-red-100 transition-colors">🗑️ KVKK Silme</button>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6 pb-20">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((k, i) => (<div key={i} className={`${cardClass} p-4 text-center`}><span className="text-[20px]">{k.icon}</span><p className="text-[10px] font-bold text-gray-400 uppercase mt-2 mb-1">{k.label}</p><p className={`text-[22px] font-black ${k.color}`}>{k.value}</p></div>))}
        </div>
        {/* Search */}
        <div className={`${cardClass} p-3 flex items-center gap-3`}>
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="İsim veya e-posta ara..." className="flex-1 bg-transparent outline-none text-[13px] font-medium text-gray-900 placeholder:text-gray-400" />
        </div>
        {/* Filters */}
        <div className={`${cardClass} p-2 flex gap-1 overflow-x-auto no-scrollbar`}>
          {([['all', 'Tümü'], ['AKTİF', '✅ Aktif'], ['ASKIDA', '⏸️ Askıda'], ['PASİF', '💤 Pasif'], ['Satıcı', '🏪 Satıcılar']] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setFilter(id as any); setSelected([]); }} className={`flex-none px-3 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${filter === id ? 'bg-[#111827] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>{label}</button>
          ))}
        </div>
        {/* Bulk */}
        {selected.length > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <span className="text-[12px] font-bold text-blue-700">{selected.length} kullanıcı seçili</span>
            <div className="flex gap-2 ml-auto">
              <button onClick={bulkSuspend} className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-[10px] font-bold">Toplu Askıya Al</button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 px-4">
          <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" />
          <span className="text-[11px] font-bold text-gray-400">Tümünü Seç ({filtered.length})</span>
        </div>
        {/* Table */}
        <div className={`${cardClass} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="pl-4 py-4 w-10"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" /></th>
                {['Kullanıcı', 'Rol', 'Durum', 'Siparişler', 'Son Giriş', 'İşlem'].map(h => (<th key={h} className="px-4 py-4 text-[10px] font-black text-gray-500 uppercase tracking-wider">{h}</th>))}
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => (
                  <tr key={u.id} className={`transition-colors ${selected.includes(u.id) ? 'bg-blue-50/50' : 'hover:bg-gray-50/50'}`}>
                    <td className="pl-4 py-3"><input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} className="w-4 h-4 rounded border-gray-300 accent-[#111827]" /></td>
                    <td className="px-4 py-3"><p className="text-[12px] font-bold text-gray-900">{u.name}</p><p className="text-[10px] text-gray-400">{u.email}</p></td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${u.role === 'Kurucu' ? 'bg-purple-50 text-purple-600' : u.role === 'Satıcı' ? 'bg-blue-50 text-blue-600' : u.role === 'Kurumsal' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-600'}`}>{u.role}</span></td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${u.status === 'AKTİF' ? 'bg-green-50 text-green-600' : u.status === 'ASKIDA' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>{u.status}</span></td>
                    <td className="px-4 py-3 text-[11px] font-bold text-gray-600">{u.orders}</td>
                    <td className="px-4 py-3 text-[11px] font-medium text-gray-500">{u.lastLogin}</td>
                    <td className="px-4 py-3"><button onClick={() => setModal(u)} className="text-[10px] font-black px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">DETAY</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-gray-900">{modal.name}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 space-y-3">
              {[['E-posta', modal.email], ['Telefon', modal.phone], ['Kayıt Tarihi', modal.joinDate], ['Son Giriş', modal.lastLogin], ['Siparişler', String(modal.orders)], ['Yorumlar', String(modal.reviews)], ['Şikayetler', String(modal.complaints)]].map(([l, v], i) => (
                <div key={i} className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-500">{l}</span><span className="text-[12px] font-black text-gray-900">{v}</span></div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500">Rol</span>
                <select value={modal.role} onChange={e => { updateRole(modal.id, e.target.value as User['role']); setModal({ ...modal, role: e.target.value as User['role'] }); }} className="px-3 py-1.5 rounded-lg border border-gray-200 text-[12px] font-bold text-[#111827] focus:outline-none">
                  <option>Normal</option><option>Satıcı</option><option>Kurumsal</option><option>Kurucu</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-800 font-bold text-[12px]">Kapat</button>
              {modal.status !== 'ASKIDA' && <button onClick={() => updateStatus(modal.id, 'ASKIDA', `${modal.name} askıya alındı.`)} className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-[12px]">Askıya Al</button>}
              {modal.status === 'ASKIDA' && <button onClick={() => updateStatus(modal.id, 'AKTİF', `${modal.name} aktifleştirildi.`)} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-bold text-[12px]">Aktifleştir</button>}
            </div>
          </div>
        </div>
      )}

      {/* KVKK Modal */}
      {kvkkModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setKvkkModal(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md p-6 rounded-2xl shadow-2xl bg-white text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-[18px] font-black text-gray-900 mb-2">KVKK Veri Silme Talebi</h3>
            <p className="text-[13px] text-gray-500 mb-4">6698 sayılı KVKK kapsamında kullanıcı verilerini kalıcı olarak silmek için ilgili kullanıcının e-posta adresini girin.</p>
            <input type="email" placeholder="kullanici@email.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-900 focus:outline-none focus:border-red-500 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setKvkkModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-800 font-bold text-[13px]">İptal</button>
              <button onClick={() => { setKvkkModal(false); setActionDone('KVKK silme talebi işleme alındı.'); setTimeout(() => setActionDone(null), 2500); }} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-[13px]">Kalıcı Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

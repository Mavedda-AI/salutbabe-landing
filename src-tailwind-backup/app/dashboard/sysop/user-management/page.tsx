'use client';
import {HugeiconsIcon} from '@hugeicons/react';
import React, {useEffect, useState} from 'react';
import {Delete01Icon, Moon01Icon, PauseCircleIcon, Store01Icon, Tick01Icon} from '@hugeicons/core-free-icons';
import {PageHeader} from '../../components/ui/PageHeader';
import {KPIGrid, KPIItem} from '../../components/ui/KPIGrid';
import {FilterTabs, SearchInput, TabItem} from '../../components/ui/FilterBar';
import {Column, DataTable} from '../../components/ui/DataTable';
import {ActionModal, StatusBadge} from '../../components/ui/StatusBadge';
import {apiUrl} from '../../../../lib/api';

type User = { 
  id: string; 
  name: string; 
  email: string; 
  phone: string; 
  role: string; 
  status: string; 
  joinDate: string; 
  lastLogin: string; 
  orders: number; 
  reviews: number; 
  complaints: number; 
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [modalUser, setModalUser] = useState<User | null>(null);
  const [kvkkModal, setKvkkModal] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || token === "mock_token") {
        setUsers([]); // API expected
        return;
      }
      
      const res = await fetch(apiUrl('/admin/users?page=1&limit=100'), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.payload && data.payload.users) {
        setUsers(data.payload.users.map((u: any) => ({
          id: u.userID,
          name: `${u.userName || ''} ${u.userSurname || ''}`.trim() || 'İsimsiz',
          email: u.eMail,
          phone: u.phoneNumber || '-',
          role: u.role || 'Normal',
          status: u.isBlocked ? 'ASKIDA' : 'AKTİF',
          joinDate: new Date(u.createdAt).toLocaleDateString('tr-TR'),
          lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('tr-TR') : '-',
          orders: 0, // from API later
          reviews: 0,
          complaints: 0
        })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users
    .filter(u => {
      if (filter === 'AKTİF') return u.status === 'AKTİF';
      if (filter === 'PASİF') return u.status === 'PASİF';
      if (filter === 'ASKIDA') return u.status === 'ASKIDA';
      if (filter === 'Satıcı') return u.role === 'Satıcı' || u.role === 'Kurumsal';
      return true;
    })
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleSelect = (id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(u => u.id));

  const updateStatus = async (id: string, newStatus: string, msg: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token && token !== "mock_token") {
        const endpoint = newStatus === 'ASKIDA' ? `/admin/users/${id}/block` : `/admin/users/${id}/unblock`;
        await fetch(apiUrl(endpoint), {
          method: 'POST',
          headers: { "Authorization": `Bearer ${token}` }
        });
      }
      setUsers(p => p.map(u => u.id === id ? { ...u, status: newStatus } : u));
      setActionDone(msg);
      setTimeout(() => setActionDone(null), 2500);
      setModalUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  const updateRole = async (id: string, role: string) => {
    try {
      const token = localStorage.getItem("token");
      if (token && token !== "mock_token") {
        await fetch(apiUrl(`/admin/users/${id}/role`), {
          method: 'PUT',
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ role })
        });
      }
      setUsers(p => p.map(u => u.id === id ? { ...u, role } : u));
      setActionDone(`Kullanıcı rolü "${role}" olarak güncellendi.`);
      setTimeout(() => setActionDone(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const kpis: KPIItem[] = [
    { label: 'AKTİF', value: users.filter(u => u.status === 'AKTİF').length, icon: <HugeiconsIcon icon={Tick01Icon} size={32} className="text-green-500" />, colorClass: 'text-green-500' },
    { label: 'ASKIDA', value: users.filter(u => u.status === 'ASKIDA').length, icon: <HugeiconsIcon icon={PauseCircleIcon} size={32} className="text-orange-500" />, colorClass: 'text-orange-500' },
    { label: 'SATICI', value: users.filter(u => u.role === 'Satıcı' || u.role === 'Kurumsal').length, icon: <HugeiconsIcon icon={Store01Icon} size={32} className="text-blue-600" />, colorClass: 'text-blue-600' },
    { label: 'PASİF', value: users.filter(u => u.status === 'PASİF').length, icon: <HugeiconsIcon icon={Moon01Icon} size={32} className="text-slate-600" />, colorClass: 'text-slate-600' },
  ];

  const tabs: TabItem[] = [
    { id: 'all', label: 'Tümü' },
    { id: 'AKTİF', label: <span className="flex items-center gap-1.5"><HugeiconsIcon icon={Tick01Icon} size={16} /> Aktif</span> },
    { id: 'ASKIDA', label: <span className="flex items-center gap-1.5"><HugeiconsIcon icon={PauseCircleIcon} size={16} /> Askıda</span> },
    { id: 'PASİF', label: <span className="flex items-center gap-1.5"><HugeiconsIcon icon={Moon01Icon} size={16} /> Pasif</span> },
    { id: 'Satıcı', label: <span className="flex items-center gap-1.5"><HugeiconsIcon icon={Store01Icon} size={16} /> Satıcılar</span> },
  ];

  const columns: Column<User>[] = [
    {
      header: 'Kullanıcı',
      accessor: (u) => (
        <div>
          <p className="text-[12px] font-bold text-gray-900 dark:text-white">{u.name}</p>
          <p className="text-[10px] text-gray-400">{u.email}</p>
        </div>
      )
    },
    {
      header: 'Rol',
      accessor: (u) => (
        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${u.role === 'Kurucu' ? 'bg-purple-50 text-purple-600' : u.role === 'Satıcı' ? 'bg-blue-50 text-blue-600' : u.role === 'Kurumsal' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-600'}`}>
          {u.role}
        </span>
      )
    },
    {
      header: 'Durum',
      accessor: (u) => <StatusBadge status={u.status} type={u.status === 'AKTİF' ? 'success' : u.status === 'ASKIDA' ? 'warning' : 'neutral'} />
    },
    {
      header: 'Siparişler',
      accessor: (u) => <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">{u.orders}</span>
    },
    {
      header: 'Son Giriş',
      accessor: (u) => <span className="text-[11px] font-medium text-gray-500">{u.lastLogin}</span>
    },
    {
      header: 'İşlem',
      className: 'text-right',
      accessor: (u) => (
        <button onClick={() => setModalUser(u)} className="text-[10px] font-black px-3 py-1.5 bg-gray-100 text-gray-700 dark:bg-[#1A1D1F] dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-white/10">
          DETAY
        </button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0C0E] font-sans">
      {actionDone && (
        <div className="fixed top-4 right-4 z-[200] bg-[#111827] text-white px-5 py-3 rounded-xl text-[13px] font-bold shadow-2xl animate-fade-in">
          <HugeiconsIcon icon={Tick01Icon} size={16} className="text-green-400 inline-block mr-2" /> 
          {actionDone}
        </div>
      )}
      
      <PageHeader 
        title="Kullanıcı Yönetimi" 
        description="Platform üyeleri, roller & KVKK yönetimi" 
        actions={
          <button onClick={() => setKvkkModal(true)} className="px-4 py-2.5 rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-[13px] font-bold border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/30 transition-colors flex items-center gap-2">
            <HugeiconsIcon icon={Delete01Icon} size={18} /> KVKK Silme
          </button>
        }
      />

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-5 pb-20">
        <KPIGrid items={kpis} />

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <FilterTabs tabs={tabs} activeTab={filter} onChange={id => { setFilter(id); setSelected([]); }} />
          <SearchInput value={search} onChange={setSearch} placeholder="İsim veya e-posta ara..." />
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl px-4 py-3">
            <span className="text-[12px] font-bold text-blue-700 dark:text-blue-400">{selected.length} kullanıcı seçili</span>
            <div className="flex gap-2 ml-auto">
              <button className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-[10px] font-bold">Toplu Askıya Al</button>
            </div>
          </div>
        )}

        <DataTable 
          data={filtered} 
          columns={columns} 
          keyExtractor={u => u.id}
          loading={loading}
          selectedIds={selected}
          onToggleSelect={toggleSelect}
          onToggleAll={toggleAll}
        />
      </div>

      <ActionModal 
        isOpen={!!modalUser} 
        onClose={() => setModalUser(null)} 
        title={modalUser?.name || ''} 
      >
        {modalUser && (
          <>
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
              {[
                ['E-posta', modalUser.email], 
                ['Telefon', modalUser.phone], 
                ['Kayıt Tarihi', modalUser.joinDate], 
                ['Son Giriş', modalUser.lastLogin], 
                ['Siparişler', String(modalUser.orders)], 
                ['Yorumlar', String(modalUser.reviews)], 
                ['Şikayetler', String(modalUser.complaints)]
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-gray-500">{l}</span>
                  <span className="text-[12px] font-black text-gray-900 dark:text-white">{v}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500">Rol</span>
                <select 
                  value={modalUser.role} 
                  onChange={e => updateRole(modalUser.id, e.target.value)} 
                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1D1F] text-[12px] font-bold text-[#111827] dark:text-white focus:outline-none"
                >
                  <option>Normal</option><option>Satıcı</option><option>Kurumsal</option><option>Kurucu</option><option>Admin</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => setModalUser(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white font-bold text-[12px]">Kapat</button>
              {modalUser.status !== 'ASKIDA' && <button onClick={() => updateStatus(modalUser.id, 'ASKIDA', `${modalUser.name} askıya alındı.`)} className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-[12px]">Askıya Al</button>}
              {modalUser.status === 'ASKIDA' && <button onClick={() => updateStatus(modalUser.id, 'AKTİF', `${modalUser.name} aktifleştirildi.`)} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-bold text-[12px]">Aktifleştir</button>}
            </div>
          </>
        )}
      </ActionModal>

      <ActionModal 
        isOpen={kvkkModal} 
        onClose={() => setKvkkModal(false)} 
        title="KVKK Veri Silme Talebi"
        description="6698 sayılı KVKK kapsamında kullanıcı verilerini kalıcı olarak silmek için ilgili kullanıcının e-posta adresini girin."
      >
        <input type="email" placeholder="kullanici@email.com" className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-[13px] font-bold text-gray-900 dark:text-white focus:outline-none focus:border-red-500 mb-4" />
        <div className="flex gap-3">
          <button onClick={() => setKvkkModal(false)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white font-bold text-[13px]">İptal</button>
          <button onClick={() => { setKvkkModal(false); setActionDone('KVKK silme talebi işleme alındı.'); setTimeout(() => setActionDone(null), 2500); }} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-[13px]">Kalıcı Sil</button>
        </div>
      </ActionModal>
    </div>
  );
}

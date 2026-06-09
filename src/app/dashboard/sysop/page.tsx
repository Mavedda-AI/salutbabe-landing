"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useAuthStore} from "../../../store/useAuthStore";
import {useThemeLanguage} from "../../../context/ThemeLanguageContext";
import {apiUrl} from "../../../lib/api";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {
    Alert01Icon,
    Cancel01Icon,
    ShoppingBag02Icon,
    Store01Icon,
    Tick02Icon,
    UserGroupIcon,
    Wallet01Icon
} from "hugeicons-react";

export default function SysopDashboard() {
  const { user } = useAuthStore();
  const { t } = useThemeLanguage();
  const [orderFilter, setOrderFilter] = useState("Tümü");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Users Modal State
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [modalUsers, setModalUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchModalUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(apiUrl("/admin/users"), {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`,
          "X-Device-Type": "web",
        }
      });
      const data = await res.json();
      if (data.request?.requestResult) {
        // Sadece aktif kullanıcıları veya tümünü gösterebiliriz. 
        // Kullanıcı "aktif kullanıcılar" dediği için isActive olanları filtreleyelim.
        const allUsers = data.payload?.users || [];
        const activeOnly = allUsers.filter((u: any) => u.isActive === true);
        setModalUsers(activeOnly);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (showUsersModal) {
      fetchModalUsers();
    }
  }, [showUsersModal]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(apiUrl("/admin/sysop-dashboard"), {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`
          }
        });
        const json = await res.json();
        if (json.request?.requestResult) {
          setDashboardData(json.payload);
        }
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();

    // Listen for global auto refresh event
    const handleAutoRefresh = () => {
      fetchDashboardData();
    };
    
    window.addEventListener('auto-refresh-triggered', handleAutoRefresh as EventListener);
    return () => window.removeEventListener('auto-refresh-triggered', handleAutoRefresh as EventListener);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { kpis: backendKpis, charts, recentOrders, pendingActions } = dashboardData || {};

  const revenueData = charts?.revenueTrend || [];
  const orderStatusData = charts?.orderStatuses || [];
  const actualRecentOrders = recentOrders || [];
  const actualPendingActions = pendingActions || [];

  const filteredOrders = orderFilter === "Tümü" 
    ? actualRecentOrders 
    : actualRecentOrders.filter((order: any) => order.status === orderFilter);

  const kpis = [
    { label: "Aylık Gelir", value: `₺${backendKpis?.revenue?.toLocaleString('tr-TR') || 0}`, icon: Wallet01Icon, color: "from-purple-500 to-fuchsia-400", shadow: "shadow-purple-500/20" },
    { label: "Aktif Siparişler", value: backendKpis?.activeOrders?.toString() || "0", icon: ShoppingBag02Icon, color: "from-blue-500 to-cyan-400", shadow: "shadow-blue-500/20" },
    { label: "Toplam Kullanıcı", value: backendKpis?.totalUsers?.toString() || "0", icon: UserGroupIcon, color: "from-green-500 to-emerald-400", shadow: "shadow-green-500/20", onClick: () => setShowUsersModal(true) },
    { label: "Onay Bekleyen", value: backendKpis?.pendingApprovals?.toString() || "0", icon: Alert01Icon, color: "from-orange-500 to-amber-400", shadow: "shadow-orange-500/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">


      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi: any, idx: number) => {
          const content = (
            <>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kpi.color} opacity-10 rounded-bl-[100px] group-hover:scale-125 transition-transform duration-700 ease-out`}></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[14px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{kpi.label}</p>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">{kpi.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${kpi.color} text-white shadow-lg ${kpi.shadow}`}>
                  <kpi.icon size={24} />
                </div>
              </div>
            </>
          );

          if (kpi.href) {
            return (
              <Link href={kpi.href} key={idx} className="bg-white dark:bg-[#1A1D27] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 block cursor-pointer">
                {content}
              </Link>
            );
          }

          if (kpi.onClick) {
            return (
              <div onClick={kpi.onClick} key={idx} className="bg-white dark:bg-[#1A1D27] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 block cursor-pointer">
                {content}
              </div>
            );
          }

          return (
            <div key={idx} className="bg-white dark:bg-[#1A1D27] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              {content}
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D27] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Gelir ve Sipariş Trendi</h2>
            <select className="select select-sm select-bordered bg-white dark:bg-[#12141C] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none">
              <option>Son 30 Gün</option>
              <option>Son 7 Gün</option>
              <option>Bu Yıl</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Doughnut Chart */}
        <div className="bg-white dark:bg-[#1A1D27] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Sipariş Durumları</h2>
          <div className="h-[280px] w-full flex-1 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {/* Optional gradients for pie cells to make them look more premium */}
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorShipping" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorPreparing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#d97706" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <Pie
                  data={orderStatusData}
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={6}
                  cornerRadius={10}
                  dataKey="value"
                  stroke="none"
                >
                  {orderStatusData.map((entry: any, index: number) => {
                    const gradientId = index === 0 ? "url(#colorCompleted)" : 
                                       index === 1 ? "url(#colorShipping)" : 
                                       index === 2 ? "url(#colorPreparing)" : "url(#colorCancelled)";
                    return <Cell key={`cell-${index}`} fill={gradientId} style={{ outline: 'none' }} />
                  })}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1f2937', borderRadius: '12px', border: 'none', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)' }}
                   itemStyle={{ color: '#fff', fontWeight: 600 }}
                />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
                  formatter={(value, entry: any) => <span className="text-gray-600 dark:text-gray-300 font-medium ml-1">{value} ({entry.payload?.value})</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tables & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D27] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Son Siparişler</h2>
            <div className="flex items-center gap-3">
              <select 
                className="select select-sm select-bordered bg-white dark:bg-[#12141C] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none"
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
              >
                <option value="Tümü">Tüm Durumlar</option>
                <option value="Tamamlandı">Tamamlandı</option>
                <option value="Kargoda">Kargoda</option>
                <option value="Hazırlanıyor">Hazırlanıyor</option>
                <option value="İptal">İptal</option>
              </select>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hidden sm:block">Tümünü Gör</button>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                  <th className="bg-transparent font-semibold pl-0">Sipariş No</th>
                  <th className="bg-transparent font-semibold">Müşteri</th>
                  <th className="bg-transparent font-semibold">Tarih</th>
                  <th className="bg-transparent font-semibold">Tutar</th>
                  <th className="bg-transparent font-semibold pr-0 text-right">Durum</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? filteredOrders.map((order: any, idx: number) => (
                  <tr key={idx} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="pl-0 font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="text-gray-600 dark:text-gray-300">{order.customer}</td>
                    <td className="text-gray-500 dark:text-gray-400">{order.date}</td>
                    <td className="font-semibold text-gray-900 dark:text-white">{order.amount}</td>
                    <td className="pr-0 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Bu duruma ait sipariş bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Actions List */}
        <div className="bg-white dark:bg-[#1A1D27] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Acil Aksiyonlar</h2>
            <span className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-lg">{actualPendingActions.length} Bekleyen</span>
          </div>
          <div className="space-y-4">
            {actualPendingActions.map((action: any) => (
              <div key={action.id} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#12141C] border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors group">
                
                {/* Thumbnail / Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-200/50 dark:border-orange-500/10">
                  {action.image ? (
                    <img src={action.image} alt={action.title} className="w-full h-full object-cover" />
                  ) : action.actionType === 'store' ? (
                    <Store01Icon size={22} />
                  ) : action.actionType === 'order' ? (
                    <ShoppingBag02Icon size={22} />
                  ) : (
                    <Alert01Icon size={22} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/20 px-2 py-0.5 rounded-md">
                      {action.type}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{action.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{action.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{action.subtitle}</p>
                  
                  {action.price && (
                    <p className="text-sm font-black text-gray-900 dark:text-white mt-1.5">{action.price}</p>
                  )}
                </div>

                <div className="flex gap-2 items-center self-center">
                  <button 
                    className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30 rounded-xl transition-all hover:scale-105 tooltip tooltip-top" 
                    data-tip="Onayla"
                  >
                    <Tick02Icon size={20} />
                  </button>
                  <button 
                    className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-xl transition-all hover:scale-105 tooltip tooltip-top" 
                    data-tip="Reddet"
                  >
                    <Cancel01Icon size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Tüm Aksiyonları Gör
          </button>
        </div>

      </div>

      {/* Active Users Modal */}
      {showUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1A1D27] w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-2xl">
                  <UserGroupIcon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">Aktif Kullanıcılar</h2>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Şu anda sistemde aktif olan kullanıcıların listesi</p>
                </div>
              </div>
              <button 
                onClick={() => setShowUsersModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-500"
              >
                <Cancel01Icon size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-black/20">
              {loadingUsers ? (
                <div className="flex flex-col items-center justify-center h-48 gap-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Kullanıcılar yükleniyor...</p>
                </div>
              ) : modalUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modalUsers.map((user: any) => (
                    <div key={user.userID} className="bg-white dark:bg-[#12141C] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col gap-4 hover:border-green-500/30 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                            {user.userName?.[0] || user.eMail[0].toUpperCase()}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#12141C] bg-green-500"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-gray-900 dark:text-white truncate">
                            {user.userName} {user.userSurname}
                          </h4>
                          <p className="text-xs font-bold text-green-500 truncate">@{user.userNickname || "anonim"}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <span className="truncate">{user.eMail}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-lg">
                            {(Array.isArray(user.userType) ? user.userType[0] : user.userType) || 'USER'}
                          </span>
                          <span className="text-sm font-black text-gray-900 dark:text-white">
                            ₺{user.balance?.toLocaleString('tr-TR') || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-400">
                    <UserGroupIcon size={32} />
                  </div>
                  <p className="text-gray-900 dark:text-white font-bold text-lg">Aktif Kullanıcı Bulunamadı</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Şu anda sistemde listelenecek aktif kullanıcı yok.</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A1D27] flex justify-end">
              <Link href="/dashboard/sysop/user-management" className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95" onClick={() => setShowUsersModal(false)}>
                Tüm Kullanıcıları Yönet
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


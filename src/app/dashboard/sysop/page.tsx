"use client";

import React from "react";
import {useAuthStore} from "../../../store/useAuthStore";
import {useThemeLanguage} from "../../../context/ThemeLanguageContext";
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

// Mock Data
const revenueData = [
  { name: "1 Haz", revenue: 4000, orders: 24 },
  { name: "5 Haz", revenue: 3000, orders: 18 },
  { name: "10 Haz", revenue: 5000, orders: 32 },
  { name: "15 Haz", revenue: 8780, orders: 45 },
  { name: "20 Haz", revenue: 6890, orders: 38 },
  { name: "25 Haz", revenue: 9390, orders: 50 },
  { name: "30 Haz", revenue: 11490, orders: 60 },
];

const orderStatusData = [
  { name: "Tamamlanan", value: 400, color: "#10b981" },
  { name: "Kargoda", value: 300, color: "#3b82f6" },
  { name: "Hazırlanıyor", value: 200, color: "#f59e0b" },
  { name: "İptal/İade", value: 50, color: "#ef4444" },
];

const recentOrders = [
  { id: "#ORD-8901", customer: "Ahmet Yılmaz", date: "2026-06-05", amount: "₺1,250", status: "Tamamlandı", statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" },
  { id: "#ORD-8902", customer: "Ayşe Kaya", date: "2026-06-05", amount: "₺840", status: "Kargoda", statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" },
  { id: "#ORD-8903", customer: "Mehmet Demir", date: "2026-06-04", amount: "₺3,450", status: "Hazırlanıyor", statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" },
  { id: "#ORD-8904", customer: "Elif Şahin", date: "2026-06-03", amount: "₺420", status: "İptal", statusColor: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" },
];

const pendingActions = [
  { 
    id: 1, 
    type: "Ürün Onayı", 
    title: "iPhone 15 Pro Max", 
    subtitle: "Satıcı: Gürgençler", 
    price: "₺74.999", 
    image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-max-blue-titanium-select?wid=256&hei=256&fmt=jpeg&qlt=95&.v=1692846360609", 
    date: "10 dk önce",
    actionType: "product"
  },
  { 
    id: 2, 
    type: "Mağaza Onayı", 
    title: "TeknoMarket", 
    subtitle: "Kategori: Elektronik", 
    date: "1 saat önce",
    actionType: "store",
    icon: Store01Icon
  },
  { 
    id: 3, 
    type: "İade Talebi", 
    title: "Sipariş: #ORD-8850", 
    subtitle: "Neden: Kusurlu Ürün", 
    price: "₺1.250",
    date: "3 saat önce",
    actionType: "order",
    icon: ShoppingBag02Icon
  },
];

export default function SysopDashboard() {
  const { user } = useAuthStore();
  const { t } = useThemeLanguage();

  const kpis = [
    { label: "Aylık Gelir", value: "₺142.500", icon: Wallet01Icon, color: "from-purple-500 to-fuchsia-400", shadow: "shadow-purple-500/20" },
    { label: "Aktif Siparişler", value: "1,204", icon: ShoppingBag02Icon, color: "from-blue-500 to-cyan-400", shadow: "shadow-blue-500/20" },
    { label: "Toplam Kullanıcı", value: "48.2K", icon: UserGroupIcon, color: "from-green-500 to-emerald-400", shadow: "shadow-green-500/20" },
    { label: "Onay Bekleyen", value: "32", icon: Alert01Icon, color: "from-orange-500 to-amber-400", shadow: "shadow-orange-500/20" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">


      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1A1D27] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${kpi.color} opacity-10 rounded-bl-[100px] group-hover:scale-125 transition-transform duration-700 ease-out`}></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[14px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{kpi.label}</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white">{kpi.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${kpi.color} text-white shadow-lg ${kpi.shadow}`}>
                <kpi.icon size={24} variant="stroke" />
              </div>
            </div>
          </div>
        ))}
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
                  {orderStatusData.map((entry, index) => {
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
                  formatter={(value) => <span className="text-gray-600 dark:text-gray-300 font-medium ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tables & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D27] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Son Siparişler</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Tümünü Gör</button>
          </div>
          <div className="overflow-x-auto">
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
                {recentOrders.map((order, idx) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Actions List */}
        <div className="bg-white dark:bg-[#1A1D27] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Acil Aksiyonlar</h2>
            <span className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-lg">3 Bekleyen</span>
          </div>
          <div className="space-y-4">
            {pendingActions.map((action) => (
              <div key={action.id} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#12141C] border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors group">
                
                {/* Thumbnail / Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-200/50 dark:border-orange-500/10">
                  {action.image ? (
                    <img src={action.image} alt={action.title} className="w-full h-full object-cover" />
                  ) : action.icon ? (
                    <action.icon size={22} variant="stroke" />
                  ) : (
                    <Alert01Icon size={22} variant="stroke" />
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
                    <Tick02Icon size={20} variant="stroke" />
                  </button>
                  <button 
                    className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-xl transition-all hover:scale-105 tooltip tooltip-top" 
                    data-tip="Reddet"
                  >
                    <Cancel01Icon size={20} variant="stroke" />
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
    </div>
  );
}


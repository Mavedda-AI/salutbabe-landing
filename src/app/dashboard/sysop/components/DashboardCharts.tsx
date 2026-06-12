import React from 'react';
import useSWR from 'swr';
import {apiUrl} from '../../../../lib/api';
import {useAuthStore} from '../../../../store/useAuthStore';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis
} from 'recharts';
import {AnalyticsUpIcon as ChartPieIcon, ChartLineData01Icon} from 'hugeicons-react';
import DisputesBox from './DisputesBox';

const fetcher = (url: string, token: string) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#121214] border border-gray-200 dark:border-white/10 p-4 rounded-2xl shadow-xl">
        <p className="text-gray-500 dark:text-white/60 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-4 justify-between mb-1 last:mb-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{entry.name}</span>
            </div>
            <span className="text-sm font-black text-gray-900 dark:text-white">
              {entry.name === 'Ciro' ? `₺${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardCharts() {
  const token = useAuthStore((state) => state.token);
  const { data, isLoading } = useSWR(
    token ? [apiUrl('/admin/sysop-dashboard'), token] : null,
    ([url, t]) => fetcher(url, t)
  );

  const chartsData = data?.payload?.charts;
  const revenueTrend = chartsData?.revenueTrend || [];
  const orderStatuses = chartsData?.orderStatuses || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/10 rounded-3xl p-6 h-96 animate-pulse" />
        <div className="lg:col-span-1 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/10 rounded-3xl p-6 h-96 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 items-start">
      
      {/* Revenue Trend Area Chart */}
      <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/10 rounded-3xl p-5 lg:p-6 shadow-sm dark:shadow-xl transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ChartLineData01Icon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Ciro & Sipariş Hacmi</h3>
              <p className="text-xs font-medium text-gray-500 dark:text-white/40">Son 30 günlük satış performansı analizi</p>
            </div>
          </div>
          <select className="bg-gray-100 dark:bg-[#121214] border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-white px-3 py-1.5 rounded-lg outline-none appearance-none cursor-pointer">
            <option>Son 30 Gün</option>
            <option>Son 7 Gün</option>
            <option>Bu Yıl</option>
          </select>
        </div>

        <div className="h-48 w-full relative z-10">
          {revenueTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-white/5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'currentColor' }} 
                  className="text-gray-400 dark:text-white/40" 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'currentColor' }} 
                  className="text-gray-400 dark:text-white/40" 
                  tickFormatter={(val) => `₺${val}`}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Ciro" 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-white/20">
              <ChartLineData01Icon size={48} className="mb-4 opacity-50" />
              <p className="text-sm font-medium">Yeterli veri bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Statuses Pie Chart & Disputes */}
      <div className="lg:col-span-1 flex flex-col gap-8">
        <div className="bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/10 rounded-3xl p-5 lg:p-6 shadow-sm dark:shadow-xl transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ChartPieIcon size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Sipariş Dağılımı</h3>
              <p className="text-xs font-medium text-gray-500 dark:text-white/40">Durumlara göre oranlar</p>
            </div>
          </div>

          <div className="h-56 w-full relative z-10">
            {orderStatuses.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatuses}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {orderStatuses.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={24} 
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-xs font-bold text-gray-600 dark:text-white/60 ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-white/20">
                <ChartPieIcon size={32} className="mb-4 opacity-50" />
                <p className="text-sm font-medium">Yeterli veri bulunmuyor</p>
              </div>
            )}
          </div>
        </div>

        <DisputesBox />
      </div>

    </div>
  );
}

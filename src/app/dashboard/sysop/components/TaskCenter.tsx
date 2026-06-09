import React from 'react';
import {ArrowRight01Icon, Task01Icon} from 'hugeicons-react';

const tasks = [
  { id: 1, title: 'Başarısız ödemeleri incele', impact: 'Yüksek', area: 'Finans' },
  { id: 2, title: 'Bekleyen faturaları kes', impact: 'Yüksek', area: 'Muhasebe' },
  { id: 3, title: 'İçerik üreticisi ödemesini onayla', impact: 'Orta', area: 'Pazaryeri' },
  { id: 4, title: 'Ayrılma oranındaki artışı araştır', impact: 'Yüksek', area: 'Büyüme' },
  { id: 5, title: 'Moderasyon kuyruğunu incele', impact: 'Düşük', area: 'Topluluk' },
];

export default function TaskCenter() {
  return (
    <div className="bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col h-full shadow-sm dark:shadow-none transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 rounded-xl">
          <Task01Icon size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Yapay Zeka Görev Listesi</h3>
      </div>
      
      <div className="flex flex-col gap-3 flex-1">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#121214] hover:bg-gray-100 dark:hover:bg-[#1A1D27] border border-gray-100 dark:border-white/5 cursor-pointer transition-colors group">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-gray-900 dark:text-white/90">{task.title}</span>
              <div className="flex gap-2 mt-1">
                <span className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full border ${
                  task.impact === 'Yüksek' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-transparent' :
                  task.impact === 'Orta' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-transparent' :
                  'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-transparent'
                }`}>
                  {task.impact} ETKİ
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 dark:text-white/40">{task.area}</span>
              </div>
            </div>
            <div className="text-gray-300 dark:text-white/20 group-hover:text-gray-600 dark:group-hover:text-white/60 transition-all group-hover:translate-x-1 duration-300">
              <ArrowRight01Icon size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

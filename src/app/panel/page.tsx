"use client";

import React, {useState} from "react";

export default function PanelDashboard() {
  const [activeTab, setActiveTab] = useState('All Orders');

  const shipments = [
    { id: 'SHP-5574', event: 2, status: 'In Progress', date: '04 Feb 2024', order: 'Order-12567', carrier: 'FedEx' },
    { id: 'SHP-5575', event: 3, status: 'Arrived', date: '04 Feb 2024', order: 'Order-12568', carrier: 'DHL' },
    { id: 'SHP-5576', event: 1, status: 'Canceled', date: '04 Feb 2024', order: 'Order-12569', carrier: 'N/A' },
    { id: 'SHP-5577', event: 4, status: 'In Progress', date: '04 Feb 2024', order: 'Order-12570', carrier: 'DHL', delay: true },
    { id: 'SHP-5578', event: 2, status: 'In Progress', date: '04 Feb 2024', order: 'Order-12571', carrier: 'TNT' },
    { id: 'SHP-5579', event: 3, status: 'Arrived', date: '04 Feb 2024', order: 'Order-12572', carrier: 'N/A' },
    { id: 'SHP-5580', event: 0, status: 'Draft', date: '04 Feb 2024', order: 'Order-12573', carrier: 'FedEx' },
    { id: 'SHP-5581', event: 4, status: 'Arrived', date: '04 Feb 2024', order: 'Order-12574', carrier: 'Aramex' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'In Progress': return 'text-blue-500 bg-blue-500/10';
      case 'Arrived': return 'text-green-500 bg-green-500/10';
      case 'Canceled': return 'text-red-500 bg-red-500/10';
      case 'Draft': return 'text-slate-400 bg-slate-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const tabs = ['All Orders', 'Pending', 'Arrived', 'View'];

  return (
    <div className="space-y-6">
      {/* Title & Primary Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-text-primary">Shipment</h1>
          <div className="flex items-center gap-2">
            <button className="p-1 text-text-secondary hover:text-text-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
            <button className="p-1 text-text-secondary hover:text-text-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg></button>
          </div>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[13px] flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Shipment
        </button>
      </div>

      {/* Tabs & Table Container */}
      <div className="bg-white dark:bg-surface rounded-3xl border border-border-color overflow-hidden shadow-sm">
        {/* Tab Bar */}
        <div className="flex items-center justify-between px-8 border-b border-border-color">
          <div className="flex gap-8">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-5 font-black text-[13px] relative transition-colors ${activeTab === tab ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {tab === 'View' ? <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> View</span> : tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-text-secondary text-[12px] font-bold">
            <button className="flex items-center gap-2 hover:text-text-primary transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              View Settings
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="p-6 flex flex-wrap items-center gap-4 bg-[#FAFBFC] dark:bg-background/50 border-b border-border-color">
          <div className="relative flex-1 max-w-[280px]">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-white dark:bg-surface border border-border-color outline-none py-2 pl-10 pr-4 rounded-xl text-[13px] font-bold focus:border-primary transition-colors"
            />
          </div>

          <button className="flex items-center gap-3 bg-text-primary text-background px-4 py-2 rounded-xl text-[12px] font-black shadow-sm">
            <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
            2 Feb - 14 Apr
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>

          <button className="flex items-center gap-3 bg-white dark:bg-surface border border-border-color px-4 py-2 rounded-xl text-[12px] font-black text-text-primary">
            All Shipment Status
            <svg className="w-3 h-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>

          <button className="flex items-center gap-3 bg-white dark:bg-surface border border-border-color px-4 py-2 rounded-xl text-[12px] font-black text-text-primary">
            Advanced Filters
            <svg className="w-3 h-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </button>

          <div className="flex-1" />

          <button className="text-[12px] font-black text-text-secondary hover:text-text-primary transition-colors">Hide</button>
          
          <button className="flex items-center gap-2 bg-white dark:bg-surface border border-border-color px-4 py-2 rounded-xl text-[12px] font-black text-text-primary shadow-sm hover:border-primary transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            Manage Table
          </button>
        </div>

        {/* Shipment Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#FAFBFC] dark:bg-background/30 text-[11px] font-black text-text-secondary/60 uppercase tracking-widest border-b border-border-color">
                <th className="px-8 py-4 font-black">Shipment ID <span className="ml-1 text-[8px]">⇅</span></th>
                <th className="px-8 py-4 font-black">Shipment Event <span className="ml-1 text-[8px]">⇅</span></th>
                <th className="px-8 py-4 font-black">Status</th>
                <th className="px-8 py-4 font-black">Expected arrived <span className="ml-1 text-[8px]">⇅</span></th>
                <th className="px-8 py-4 font-black">Order</th>
                <th className="px-8 py-4 font-black">Carrier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {shipments.map((shipment, i) => (
                <tr key={i} className="hover:bg-[#F8F9FB] dark:hover:bg-background/20 transition-colors group">
                  <td className="px-8 py-5 text-[13px] font-black text-text-primary">{shipment.id}</td>
                  <td className="px-8 py-5">
                    {/* Timeline Progress */}
                    <div className="flex items-center gap-0 w-32 relative">
                      {[0, 1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center flex-1 last:flex-none relative">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${step <= shipment.event ? 'bg-black text-white border-black' : 'bg-white dark:bg-surface border-border-color text-text-secondary/40'}`}>
                            {step === 0 && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.44c-.31.17-.69.17-1 0L3.53 17.38c-.32-.17-.53-.5-.53-.88V7.5c0-.38.21-.71.53-.88l7.97-4.44c.31-.17.69-.17 1 0l7.97 4.44c.32.17.53.5.53.88v9z"/></svg>}
                            {step === 1 && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>}
                            {step === 2 && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1zM18 16V9l-4-3v10l4-3z"/></svg>}
                            {step === 3 && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1z"/></svg>}
                            {step === 4 && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>}
                          </div>
                          {step < 4 && <div className={`h-1 flex-1 mx-[-1px] transition-colors ${step < shipment.event ? 'bg-black' : 'bg-border-color'}`} />}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black ${getStatusColor(shipment.status)}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      {shipment.status}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[13px] font-bold text-text-primary">
                    <div className="flex items-center gap-2">
                      {shipment.date}
                      {shipment.delay && <span className="bg-orange-500/10 text-orange-600 text-[9px] px-1.5 py-0.5 rounded-md flex items-center gap-1 font-black"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Delay</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[13px] font-black text-text-primary hover:text-primary cursor-pointer transition-colors underline decoration-transparent hover:decoration-primary">{shipment.order}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F3F5F9] dark:bg-background border border-border-color flex items-center justify-center text-[10px] font-black overflow-hidden group-hover:scale-110 transition-transform">
                        {shipment.carrier === 'FedEx' && <span className="text-[#4D148C]">F<span className="text-[#FF6200]">E</span></span>}
                        {shipment.carrier === 'DHL' && <span className="text-[#D40511] font-black italic">DHL</span>}
                        {shipment.carrier === 'TNT' && <span className="text-[#FF6200] font-black italic">TNT</span>}
                        {shipment.carrier === 'Aramex' && <span className="text-[#E31E24] font-black italic">A</span>}
                        {shipment.carrier === 'Regular' && <span className="text-text-secondary opacity-40 italic">REG</span>}
                        {shipment.carrier === 'N/A' && <span className="text-text-secondary opacity-40">N/A</span>}
                      </div>
                      <span className="text-[13px] font-bold text-text-primary">{shipment.carrier !== 'N/A' ? shipment.carrier : ''}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

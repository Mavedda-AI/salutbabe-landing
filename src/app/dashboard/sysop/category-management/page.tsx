"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../../lib/api";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {useToast} from "../../../../context/ToastContext";

export default function AdminCategories() {
  const { t, theme } = useThemeLanguage();
  const { showToast } = useToast();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"categories" | "attributes">("categories");

  // Category Form
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catParent, setCatParent] = useState("");

  // Attribute Form
  const [editingAttribute, setEditingAttribute] = useState<any>(null);
  const [attrNameKey, setAttrNameKey] = useState("");
  const [attrDisplayNameTr, setAttrDisplayNameTr] = useState("");
  const [attrDisplayNameEn, setAttrDisplayNameEn] = useState("");
  const [attrType, setAttrType] = useState("select");
  const [attrMobileComponent, setAttrMobileComponent] = useState("dropdown");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const headers = { 
        Authorization: `Bearer ${token}`,
        "X-Device-Type": "web"
      };

      const [catRes, attrRes] = await Promise.all([
        fetch(apiUrl("/admin/categories"), { headers }),
        fetch(apiUrl("/admin/attributes"), { headers })
      ]);

      const catData = await catRes.json();
      const attrData = await attrRes.json();

      if (catData.payload) setCategories(catData.payload);
      if (attrData.payload) setAttributes(attrData.payload);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttribute = async () => {
    try {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      const method = editingAttribute ? "PUT" : "POST";
      const url = editingAttribute 
        ? apiUrl(`/admin/attributes/${editingAttribute.attributeID}`)
        : apiUrl("/admin/attributes");

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nameKey: attrNameKey,
          displayedName: { tr: attrDisplayNameTr, en: attrDisplayNameEn },
          type: attrType,
          mobileComponent: attrMobileComponent
        })
      });

      if (res.ok) {
        showToast(t('dashboard.success'), "success");
        setEditingAttribute(null);
        resetAttrForm();
        fetchData();
      } else {
        showToast(t('dashboard.error'), "error");
      }
    } catch (e) {
      console.error(e);
      showToast(t('dashboard.error'), "error");
    }
  };

  const resetAttrForm = () => {
    setAttrNameKey("");
    setAttrDisplayNameTr("");
    setAttrDisplayNameEn("");
    setAttrType("select");
    setAttrMobileComponent("dropdown");
  };

  if (loading) return <div className="p-12 text-center text-[14px] font-black tracking-widest uppercase text-text-secondary animate-pulse">{t('dashboard.sysop.loading_data')}</div>;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className={`p-6 md:p-8 rounded-[2.5rem] border flex flex-col md:flex-row justify-between items-center gap-6 bg-white border-border-color shadow-sm dark:bg-[#12141C] dark:border-white/5 dark:shadow-2xl`}>
        <h1 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">{t('dashboard.sysop.cat_mgmt')}</h1>
        <div className={`flex gap-2 p-1.5 rounded-2xl bg-gray-100 dark:bg-white/5`}>
          <button 
            onClick={() => setView("categories")}
            className={`px-6 py-2.5 rounded-xl text-[13px] font-black transition-all ${view === "categories" ? 'bg-white text-primary shadow-sm dark:bg-[#1A1D27] dark:text-primary dark:shadow-md' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {t('dashboard.sysop.categories')}
          </button>
          <button 
            onClick={() => setView("attributes")}
            className={`px-6 py-2.5 rounded-xl text-[13px] font-black transition-all ${view === "attributes" ? 'bg-white text-primary shadow-sm dark:bg-[#1A1D27] dark:text-primary dark:shadow-md' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {t('dashboard.sysop.attributes')}
          </button>
        </div>
      </div>

      {view === "categories" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 rounded-[2.5rem] border overflow-x-auto bg-white border-border-color shadow-sm dark:bg-[#12141C] dark:border-white/5`}>
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className={theme === 'light' ? 'bg-gray-50/50 border-b border-border-color' : 'bg-white/5 border-b border-white/5'}>
                  <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.sysop.cat_name')}</th>
                  <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.sysop.cat_parent')}</th>
                  <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.sysop.cat_slug')}</th>
                  <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] text-right">{t('dashboard.sysop.cat_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color dark:divide-white/5">
                {categories.map(cat => (
                  <tr key={cat.categoryID} className={`transition-colors hover:bg-gray-50 dark:hover:bg-white/5`}>
                    <td className="p-6 font-black text-text-primary text-[14px]">
                      {cat.displayedName?.tr || cat.name}
                    </td>
                    <td className="p-6 text-[13px] font-bold text-text-secondary">
                      {cat.parent?.displayedName?.tr || "-"}
                    </td>
                    <td className="p-6 text-[12px] font-mono font-bold text-text-secondary/60 bg-black/5 dark:bg-white/5 rounded-lg w-fit inline-block mt-4 ml-6 mb-4">{cat.slug}</td>
                    <td className="p-6 text-right">
                      <button className="text-[12px] font-black text-primary hover:underline uppercase tracking-widest">{t('dashboard.sysop.btn_edit')}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className={`rounded-[2.5rem] p-8 border h-fit bg-gray-50 border-border-color dark:bg-white/5 dark:border-white/5`}>
             <h2 className="text-xl font-black mb-2 text-text-primary">{t('dashboard.sysop.add_category')}</h2>
             <p className="text-[13px] font-bold text-text-secondary mb-8">{t('dashboard.sysop.add_category_desc')}</p>
             <div className="space-y-6">
               <div className="group">
                 <label className="block text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] mb-3 group-focus-within:text-primary transition-colors">Name (TR)</label>
                 <input className={`w-full h-14 px-6 rounded-2xl outline-none text-[14px] font-black transition-all border bg-white border-transparent focus:border-primary/30 shadow-sm dark:bg-[#1A1D27] dark:border-transparent dark:focus:border-white/20`} placeholder="e.g. Ayakkabı" />
               </div>
               <div className="group">
                 <label className="block text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] mb-3 group-focus-within:text-primary transition-colors">Slug</label>
                 <input className={`w-full h-14 px-6 rounded-2xl outline-none text-[14px] font-black transition-all border bg-white border-transparent focus:border-primary/30 shadow-sm dark:bg-[#1A1D27] dark:border-transparent dark:focus:border-white/20`} placeholder="e.g. ayakkabi" />
               </div>
               <button className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all text-[14px] uppercase tracking-widest mt-4">
                 {t('dashboard.sysop.btn_save')}
               </button>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 rounded-[2.5rem] border overflow-x-auto bg-white border-border-color shadow-sm dark:bg-[#12141C] dark:border-white/5`}>
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className={theme === 'light' ? 'bg-gray-50/50 border-b border-border-color' : 'bg-white/5 border-b border-white/5'}>
                  <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.sysop.attributes')}</th>
                  <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.sysop.attr_mobile_comp')}</th>
                  <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em]">{t('dashboard.sysop.attr_type')}</th>
                  <th className="p-6 text-[11px] font-black text-text-secondary/50 uppercase tracking-[0.2em] text-right">{t('dashboard.sysop.cat_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color dark:divide-white/5">
                {attributes.map(attr => (
                  <tr key={attr.attributeID} className={`transition-colors hover:bg-gray-50 dark:hover:bg-white/5`}>
                    <td className="p-6">
                      <div className="font-black text-text-primary text-[14px] mb-1">{attr.displayedName?.tr || attr.nameKey}</div>
                      <div className="text-[11px] font-mono font-bold text-text-secondary/60">{attr.nameKey}</div>
                    </td>
                    <td className="p-6">
                       <span className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-wider">
                         {attr.mobileComponent || 'dropdown'}
                       </span>
                    </td>
                    <td className="p-6 text-[13px] font-bold text-text-secondary uppercase tracking-widest">{attr.type}</td>
                    <td className="p-6 flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingAttribute(attr);
                          setAttrNameKey(attr.nameKey);
                          setAttrDisplayNameTr(attr.displayedName?.tr || "");
                          setAttrDisplayNameEn(attr.displayedName?.en || "");
                          setAttrType(attr.type);
                          setAttrMobileComponent(attr.mobileComponent || "dropdown");
                        }}
                        className="text-[12px] mt-4 font-black text-primary hover:underline uppercase tracking-widest"
                      >
                        {t('dashboard.sysop.btn_edit')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`rounded-[2.5rem] p-8 border h-fit bg-gray-50 border-border-color dark:bg-white/5 dark:border-white/5`}>
             <h2 className="text-xl font-black mb-8 text-text-primary">{editingAttribute ? t('dashboard.sysop.edit_attribute') : t('dashboard.sysop.add_attribute')}</h2>
             <div className="space-y-6">
               <div className="group">
                 <label className="block text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] mb-3 group-focus-within:text-primary transition-colors">{t('dashboard.sysop.attr_name_key')}</label>
                 <input 
                   value={attrNameKey}
                   onChange={(e) => setAttrNameKey(e.target.value)}
                   className={`w-full h-14 px-6 rounded-2xl outline-none text-[14px] font-black transition-all border bg-white border-transparent focus:border-primary/30 shadow-sm dark:bg-[#1A1D27] dark:border-transparent dark:focus:border-white/20`} 
                   placeholder="e.g. color" 
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="group">
                   <label className="block text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] mb-3 group-focus-within:text-primary transition-colors">Name (TR)</label>
                   <input 
                     value={attrDisplayNameTr}
                     onChange={(e) => setAttrDisplayNameTr(e.target.value)}
                     className={`w-full h-14 px-6 rounded-2xl outline-none text-[14px] font-black transition-all border bg-white border-transparent focus:border-primary/30 shadow-sm dark:bg-[#1A1D27] dark:border-transparent dark:focus:border-white/20`} 
                     placeholder="Renk" 
                   />
                 </div>
                 <div className="group">
                   <label className="block text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] mb-3 group-focus-within:text-primary transition-colors">Name (EN)</label>
                   <input 
                     value={attrDisplayNameEn}
                     onChange={(e) => setAttrDisplayNameEn(e.target.value)}
                     className={`w-full h-14 px-6 rounded-2xl outline-none text-[14px] font-black transition-all border bg-white border-transparent focus:border-primary/30 shadow-sm dark:bg-[#1A1D27] dark:border-transparent dark:focus:border-white/20`} 
                     placeholder="Color" 
                   />
                 </div>
               </div>
               <div className="group">
                 <label className="block text-[11px] font-black text-text-secondary/40 uppercase tracking-[0.2em] mb-3 group-focus-within:text-primary transition-colors">{t('dashboard.sysop.attr_type')}</label>
                 <select 
                   value={attrType}
                   onChange={(e) => setAttrType(e.target.value)}
                   className={`w-full h-14 px-6 rounded-2xl outline-none text-[14px] font-black transition-all border appearance-none bg-white border-transparent focus:border-primary/30 shadow-sm dark:bg-[#1A1D27] dark:border-transparent dark:focus:border-white/20`}
                 >
                   <option value="select">Select (Single)</option>
                   <option value="multiselect">Multiselect</option>
                   <option value="text">Text Input</option>
                 </select>
               </div>
               <div className="group">
                 <label className="block text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-3">{t('dashboard.sysop.attr_mobile_comp')}</label>
                 <select 
                   value={attrMobileComponent}
                   onChange={(e) => setAttrMobileComponent(e.target.value)}
                   className={`w-full h-14 px-6 rounded-2xl outline-none text-[14px] font-black text-primary transition-all border appearance-none bg-primary/10 border-primary/20 shadow-sm dark:bg-primary/20 dark:border-primary/20`}
                 >
                   <option value="dropdown">Default Dropdown</option>
                   <option value="horizontal_list">Horizontal Chips</option>
                   <option value="grid">Grid Selection</option>
                   <option value="color_picker">Color Palette</option>
                   <option value="size_selector">Size Grid</option>
                 </select>
               </div>
               <div className="flex gap-4 pt-4">
                 {editingAttribute && (
                   <button 
                     onClick={() => { setEditingAttribute(null); resetAttrForm(); }}
                     className={`flex-1 h-14 rounded-2xl text-[13px] font-black transition-all uppercase tracking-widest bg-gray-200 text-text-primary hover:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20`}
                   >
                     {t('dashboard.sysop.btn_cancel')}
                   </button>
                 )}
                 <button 
                  onClick={handleSaveAttribute}
                  className="flex-1 h-14 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all text-[13px] uppercase tracking-widest"
                 >
                   {editingAttribute ? t('dashboard.sysop.btn_save') : t('dashboard.sysop.btn_save')}
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

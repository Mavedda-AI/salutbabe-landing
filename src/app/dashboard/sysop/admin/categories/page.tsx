"use client";

import React, {useEffect, useState} from "react";
import {apiUrl} from "../../../../lib/api";

export default function AdminCategories() {
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
        setEditingAttribute(null);
        resetAttrForm();
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetAttrForm = () => {
    setAttrNameKey("");
    setAttrDisplayNameTr("");
    setAttrDisplayNameEn("");
    setAttrType("select");
    setAttrMobileComponent("dropdown");
  };

  if (loading) return <div className="p-8 font-bold text-slate-500">Loading Categories & Attributes...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-900">Category & Attribute Management</h1>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setView("categories")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === "categories" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Categories
          </button>
          <button 
            onClick={() => setView("attributes")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === "attributes" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Attributes
          </button>
        </div>
      </div>

      {view === "categories" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Parent</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Slug</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.categoryID} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900">
                      {cat.displayedName?.tr || cat.name}
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      {cat.parent?.displayedName?.tr || "-"}
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">{cat.slug}</td>
                    <td className="p-4">
                      <button className="text-xs font-bold text-indigo-500 hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-fit">
             <h2 className="text-xl font-black mb-4">Add Category</h2>
             <p className="text-slate-500 text-sm mb-4">Create a new category for products.</p>
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name (TR)</label>
                 <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Ayakkabı" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Slug</label>
                 <input className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. ayakkabi" />
               </div>
               <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">Save Category</button>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Attribute</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Mobile Component</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attributes.map(attr => (
                  <tr key={attr.attributeID} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{attr.displayedName?.tr || attr.nameKey}</div>
                      <div className="text-xs text-slate-400 font-mono">{attr.nameKey}</div>
                    </td>
                    <td className="p-4">
                       <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black uppercase tracking-tighter">
                         {attr.mobileComponent || 'dropdown'}
                       </span>
                    </td>
                    <td className="p-4 text-slate-600 text-sm">{attr.type}</td>
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingAttribute(attr);
                          setAttrNameKey(attr.nameKey);
                          setAttrDisplayNameTr(attr.displayedName?.tr || "");
                          setAttrDisplayNameEn(attr.displayedName?.en || "");
                          setAttrType(attr.type);
                          setAttrMobileComponent(attr.mobileComponent || "dropdown");
                        }}
                        className="text-xs font-bold text-indigo-500 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-fit">
             <h2 className="text-xl font-black mb-4">{editingAttribute ? 'Edit Attribute' : 'Add Attribute'}</h2>
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name Key (Technical)</label>
                 <input 
                   value={attrNameKey}
                   onChange={(e) => setAttrNameKey(e.target.value)}
                   className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                   placeholder="e.g. color" 
                 />
               </div>
               <div className="grid grid-cols-2 gap-2">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name (TR)</label>
                   <input 
                     value={attrDisplayNameTr}
                     onChange={(e) => setAttrDisplayNameTr(e.target.value)}
                     className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                     placeholder="Renk" 
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name (EN)</label>
                   <input 
                     value={attrDisplayNameEn}
                     onChange={(e) => setAttrDisplayNameEn(e.target.value)}
                     className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                     placeholder="Color" 
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                 <select 
                   value={attrType}
                   onChange={(e) => setAttrType(e.target.value)}
                   className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 >
                   <option value="select">Select (Single)</option>
                   <option value="multiselect">Multiselect</option>
                   <option value="text">Text Input</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1 text-indigo-600">Mobile UI Component</label>
                 <select 
                   value={attrMobileComponent}
                   onChange={(e) => setAttrMobileComponent(e.target.value)}
                   className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 text-sm font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm shadow-indigo-100"
                 >
                   <option value="dropdown">Default Dropdown</option>
                   <option value="horizontal_list">Horizontal Chips</option>
                   <option value="grid">Grid Selection</option>
                   <option value="color_picker">Color Palette (Hex Selection)</option>
                   <option value="size_selector">Size Grid</option>
                 </select>
                 <p className="mt-1 text-[10px] text-slate-400 leading-tight">Determines how this attribute renders in the mobile app listing form.</p>
               </div>
               <div className="flex gap-2">
                 <button 
                  onClick={handleSaveAttribute}
                  className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                 >
                   {editingAttribute ? 'Update' : 'Create'} Attribute
                 </button>
                 {editingAttribute && (
                   <button 
                     onClick={() => { setEditingAttribute(null); resetAttrForm(); }}
                     className="bg-slate-200 text-slate-700 font-bold px-4 rounded-xl hover:bg-slate-300 transition-colors"
                   >
                     Cancel
                   </button>
                 )}
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

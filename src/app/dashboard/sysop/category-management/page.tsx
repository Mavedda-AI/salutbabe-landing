"use client";

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {apiUrl} from "../../../../lib/api";
import {useThemeLanguage} from "../../../../context/ThemeLanguageContext";
import {useToast} from "../../../../context/ToastContext";

/* ───────────────────── Interfaces ───────────────────── */

interface Category {
  categoryID: string;
  name: string;
  displayedName?: { tr?: string; en?: string; fr?: string };
  parentCategoryID?: string | null;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  allowOutfit: boolean;
  children?: Category[];
  parent?: Category;
  categoryAttributes?: CategoryAttributeMapping[];
}

interface Attribute {
  attributeID: string;
  nameKey: string;
  displayedName?: { tr?: string; en?: string; fr?: string };
  type: string;
  mobileComponent?: string;
  values?: AttributeValue[];
}

interface AttributeValue {
  valueID: string;
  attributeID: string;
  valueKey: string;
  displayedValue?: { tr?: string; en?: string; fr?: string };
  order: number;
  metaData?: { hexCode?: string; [key: string]: any };
}

interface CategoryAttributeMapping {
  mappingID: string;
  categoryID: string;
  attributeID: string;
  isRequired: boolean;
  attribute?: Attribute;
}

/* ───────────────────── Helpers ───────────────────── */

const generateSlug = (text: string, parentSlug?: string) => {
  const base = text.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  return parentSlug ? `${parentSlug}-${base}` : base;
};

const getHeaders = (json = false) => {
  const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
  const h: Record<string, string> = { Authorization: `Bearer ${token}`, "X-Device-Type": "web" };
  if (json) h["Content-Type"] = "application/json";
  return h;
};

const INPUT = "w-full h-11 px-4 rounded-xl outline-none font-medium text-[14px] transition-all border bg-white dark:bg-[#0B0C10] border-gray-200 dark:border-white/10 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 shadow-sm text-[#1A2332] dark:text-white";
const LABEL = "text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-1";

const typeBadge = (type: string) => {
  const m: Record<string, string> = {
    select: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    multiselect: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
    text: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  };
  return m[type] || m.text;
};

/* ───────────────────── Main Component ───────────────────── */

export default function CategoryManagementPage() {
  const { t } = useThemeLanguage();
  const { showToast } = useToast();

  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);

  // UI
  type TabKey = "tree" | "attributes" | "mapping";
  const [activeTab, setActiveTab] = useState<TabKey>("tree");
  const [searchQuery, setSearchQuery] = useState("");

  // Tree
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Drag and Drop
  const [draggedCatId, setDraggedCatId] = useState<string | null>(null);
  const [dragOverCatId, setDragOverCatId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'inside' | 'after' | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [catFormOpen, setCatFormOpen] = useState(false);

  // Attribute form
  const [editingAttribute, setEditingAttribute] = useState<Partial<Attribute> | null>(null);
  const [attrFormOpen, setAttrFormOpen] = useState(false);
  const [expandedAttr, setExpandedAttr] = useState<Set<string>>(new Set());
  const [newValue, setNewValue] = useState<{valueKey: string; displayedValueTr: string; order: number; hexCode: string}>({valueKey: "", displayedValueTr: "", order: 0, hexCode: ""});

  // Mapping
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [catAttrs, setCatAttrs] = useState<CategoryAttributeMapping[]>([]);
  const [mappingLoading, setMappingLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  /* ───────────────────── Data Fetching ───────────────────── */

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, attrRes] = await Promise.all([
        fetch(apiUrl("/admin/categories"), { headers: getHeaders() }),
        fetch(apiUrl("/admin/attributes"), { headers: getHeaders() }),
      ]);
      const catData = await catRes.json();
      const attrData = await attrRes.json();
      console.log("catData", catData);
      console.log("attrData", attrData);
      if (catData.payload) setCategories(catData.payload);
      if (attrData.payload) setAttributes(attrData.payload);
    } catch (e) {
      console.error("fetchData error", e);
      showToast("Veri yüklenirken hata oluştu", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ───── Build flat list for parent dropdown & tree roots ───── */

  const flatCategories = useMemo(() => {
    const flat: Category[] = [];
    const walk = (cats: Category[], depth = 0) => {
      for (const c of cats) {
        (c as any)._depth = depth;
        flat.push(c);
        if (c.children?.length) walk(c.children, depth + 1);
      }
    };
    walk(categories);
    return flat;
  }, [categories]);

  const rootCategories = useMemo(() => {
    const roots = categories.filter(c => !c.parentCategoryID);
    return Array.from(new Map(roots.map(r => [r.categoryID, r])).values());
  }, [categories]);

  /* ───────────────────── Category CRUD ───────────────────── */

  const openCategoryForm = (cat?: Category, parentId?: string) => {
    if (cat) {
      setEditingCategory({ ...cat });
    } else {
      const parent = parentId ? flatCategories.find(c => c.categoryID === parentId) : undefined;
      setEditingCategory({
        name: "",
        displayedName: { tr: "", en: "", fr: "" },
        slug: "",
        parentCategoryID: parentId || null,
        description: "",
        icon: "",
        isActive: true,
        allowOutfit: false,
      });
      // Will generate slug on name change
    }
    setCatFormOpen(true);
  };

  const handleCatNameChange = (name: string) => {
    if (!editingCategory) return;
    const parent = editingCategory.parentCategoryID
      ? flatCategories.find(c => c.categoryID === editingCategory.parentCategoryID)
      : undefined;
    setEditingCategory({
      ...editingCategory,
      name,
      slug: generateSlug(name, parent?.slug),
    });
  };

  const handleSaveCategory = async () => {
    if (!editingCategory?.name) return;
    setSaving(true);
    try {
      const isEdit = !!(editingCategory as Category).categoryID;
      const url = isEdit
        ? apiUrl(`/admin/categories/${(editingCategory as Category).categoryID}`)
        : apiUrl("/admin/categories");

      const body: any = {
        name: editingCategory.name,
        displayedName: editingCategory.displayedName,
        slug: editingCategory.slug,
        parentCategoryID: editingCategory.parentCategoryID || null,
        description: editingCategory.description || "",
        icon: editingCategory.icon || "",
        isActive: editingCategory.isActive ?? true,
        allowOutfit: editingCategory.allowOutfit ?? false,
      };

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: getHeaders(true),
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast(isEdit ? "Kategori güncellendi" : "Kategori oluşturuldu", "success");
        setCatFormOpen(false);
        setEditingCategory(null);
        fetchData();
      } else {
        const err = await res.json().catch(() => null);
        showToast(err?.message || "İşlem başarısız", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Bir hata oluştu", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz? Alt kategorileri varsa silinemez.")) return;
    setDeleting(id);
    try {
      const res = await fetch(apiUrl(`/admin/categories/${id}`), { method: "DELETE", headers: getHeaders() });
      if (res.ok) {
        showToast("Kategori silindi", "success");
        fetchData();
      } else {
        const err = await res.json().catch(() => null);
        showToast(err?.message || "Silme başarısız (alt kategorileri olabilir)", "error");
      }
    } catch (e) {
      showToast("Silme hatası", "error");
    } finally {
      setDeleting(null);
    }
  };

  /* ───────────────────── Attribute CRUD ───────────────────── */

  const openAttrForm = (attr?: Attribute) => {
    if (attr) {
      setEditingAttribute({ ...attr, values: attr.values ? [...attr.values] : [] });
    } else {
      setEditingAttribute({ nameKey: "", displayedName: { tr: "", en: "" }, type: "select", mobileComponent: "dropdown", values: [] });
    }
    setAttrFormOpen(true);
  };

  const handleSaveAttribute = async () => {
    if (!editingAttribute?.nameKey) return;
    setSaving(true);
    try {
      const isEdit = !!(editingAttribute as Attribute).attributeID;
      const url = isEdit
        ? apiUrl(`/admin/attributes/${(editingAttribute as Attribute).attributeID}`)
        : apiUrl("/admin/attributes");

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: getHeaders(true),
        body: JSON.stringify({
          nameKey: editingAttribute.nameKey,
          displayedName: editingAttribute.displayedName,
          type: editingAttribute.type,
          mobileComponent: editingAttribute.mobileComponent,
          values: editingAttribute.values || [],
        }),
      });

      if (res.ok) {
        showToast(isEdit ? "Özellik güncellendi" : "Özellik oluşturuldu", "success");
        setAttrFormOpen(false);
        setEditingAttribute(null);
        fetchData();
      } else {
        showToast("İşlem başarısız", "error");
      }
    } catch (e) {
      showToast("Bir hata oluştu", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAttribute = async (id: string) => {
    if (!confirm("Bu özelliği silmek istediğinize emin misiniz?")) return;
    setDeleting(id);
    try {
      const res = await fetch(apiUrl(`/admin/attributes/${id}`), { method: "DELETE", headers: getHeaders() });
      if (res.ok) {
        showToast("Özellik silindi", "success");
        fetchData();
      } else {
        showToast("Silme başarısız", "error");
      }
    } catch (e) {
      showToast("Silme hatası", "error");
    } finally {
      setDeleting(null);
    }
  };

  const addValueToAttr = () => {
    if (!editingAttribute || !newValue.valueKey) return;
    const vals = [...(editingAttribute.values || [])];
    vals.push({
      valueID: `temp-${Date.now()}`,
      attributeID: (editingAttribute as Attribute).attributeID || "",
      valueKey: newValue.valueKey,
      displayedValue: { tr: newValue.displayedValueTr },
      order: newValue.order || vals.length,
      metaData: newValue.hexCode ? { hexCode: newValue.hexCode } : undefined,
    });
    setEditingAttribute({ ...editingAttribute, values: vals });
    setNewValue({ valueKey: "", displayedValueTr: "", order: 0, hexCode: "" });
  };

  const removeValueFromAttr = (idx: number) => {
    if (!editingAttribute) return;
    const vals = [...(editingAttribute.values || [])];
    vals.splice(idx, 1);
    setEditingAttribute({ ...editingAttribute, values: vals });
  };

  /* ───────────────────── Mapping CRUD ───────────────────── */

  const fetchCatAttrs = async (catId: string) => {
    setMappingLoading(true);
    setSelectedCatId(catId);
    try {
      const res = await fetch(apiUrl(`/admin/categories/${catId}/attributes`), { headers: getHeaders() });
      const data = await res.json();
      if (data.payload) setCatAttrs(data.payload);
      else setCatAttrs([]);
    } catch (e) {
      console.error(e);
      setCatAttrs([]);
    } finally {
      setMappingLoading(false);
    }
  };

  const assignAttr = async (attrId: string, isRequired = false) => {
    if (!selectedCatId) return;
    try {
      const res = await fetch(apiUrl(`/admin/categories/${selectedCatId}/attributes`), {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({ attributeID: attrId, isRequired }),
      });
      if (res.ok) {
        showToast("Özellik atandı", "success");
        fetchCatAttrs(selectedCatId);
      } else {
        showToast("Atama başarısız", "error");
      }
    } catch (e) {
      showToast("Hata oluştu", "error");
    }
  };

  const removeAttrFromCat = async (attrId: string) => {
    if (!selectedCatId) return;
    try {
      const res = await fetch(apiUrl(`/admin/categories/${selectedCatId}/attributes/${attrId}`), {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        showToast("Özellik kaldırıldı", "success");
        fetchCatAttrs(selectedCatId);
      } else {
        showToast("Kaldırma başarısız", "error");
      }
    } catch (e) {
      showToast("Hata oluştu", "error");
    }
  };

  const assignedAttrIds = useMemo(() => new Set(catAttrs.map(ca => ca.attributeID)), [catAttrs]);
  const unassignedAttrs = useMemo(() => attributes.filter(a => !assignedAttrIds.has(a.attributeID)), [attributes, assignedAttrIds]);

  /* ───────────────────── Tree toggle ───────────────────── */

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ───────────────────── Filtered tree search ───────────────────── */

  const filterTree = useCallback((cats: Category[], q: string): Category[] => {
    if (!q) return cats;
    return cats.reduce<Category[]>((acc, cat) => {
      const name = (cat.displayedName?.tr || cat.name).toLowerCase();
      const childMatch = cat.children?.length ? filterTree(cat.children, q) : [];
      if (name.includes(q.toLowerCase()) || childMatch.length > 0) {
        acc.push({ ...cat, children: childMatch.length ? childMatch : cat.children });
      }
      return acc;
    }, []);
  }, []);

  const filteredRoots = useMemo(() => filterTree(rootCategories, searchQuery), [rootCategories, searchQuery, filterTree]);

  /* ───────────────────── Drag & Drop ───────────────────── */

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedCatId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedCatId === id || !draggedCatId) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    let position: 'before' | 'inside' | 'after' = 'inside';
    if (y < height * 0.25) position = 'before';
    else if (y > height * 0.75) position = 'after';
    
    setDragOverCatId(id);
    setDropPosition(position);
  };

  const handleDragLeave = () => {
    setDragOverCatId(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedCatId(null);
    setDragOverCatId(null);
    setDropPosition(null);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    // Calculate position synchronously
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    let calcPosition: 'before' | 'inside' | 'after' = 'inside';
    if (y < height * 0.25) calcPosition = 'before';
    else if (y > height * 0.75) calcPosition = 'after';

    if (!draggedCatId || draggedCatId === targetId) {
      handleDragEnd();
      return;
    }

    setIsReordering(true);
    try {
      const sourceCat = flatCategories.find(c => c.categoryID === draggedCatId);
      const targetCat = flatCategories.find(c => c.categoryID === targetId);

      if (!sourceCat || !targetCat) return;

      // Prevent dropping a category inside its own descendant
      let currentParent = targetCat.parentCategoryID;
      while (currentParent) {
        if (currentParent === draggedCatId) {
          showToast("Bir kategoriyi kendi alt kategorisinin içine taşıyamazsınız", "error");
          handleDragEnd();
          setIsReordering(false);
          return;
        }
        const p = flatCategories.find(c => c.categoryID === currentParent);
        currentParent = p ? p.parentCategoryID : null;
      }

      let newParentId = sourceCat.parentCategoryID;
      let targetSiblings: Category[] = [];

      if (calcPosition === 'inside') {
        newParentId = targetId;
        targetSiblings = targetCat.children || [];
      } else {
        newParentId = targetCat.parentCategoryID;
        targetSiblings = newParentId 
          ? (flatCategories.find(c => c.categoryID === newParentId)?.children || [])
          : rootCategories;
      }

      let newSiblings = targetSiblings.filter(c => c.categoryID !== draggedCatId);

      if (calcPosition === 'inside') {
        newSiblings.push(sourceCat);
      } else {
        const targetIndex = newSiblings.findIndex(c => c.categoryID === targetId);
        if (calcPosition === 'before') {
          newSiblings.splice(targetIndex !== -1 ? targetIndex : 0, 0, sourceCat);
        } else {
          newSiblings.splice(targetIndex !== -1 ? targetIndex + 1 : newSiblings.length, 0, sourceCat);
        }
      }

      const updates = newSiblings.map((c, index) => ({
        id: c.categoryID,
        parentCategoryID: newParentId || null,
        displayOrder: index
      }));

      const res = await fetch(apiUrl('/admin/categories/reorder'), {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ updates })
      });

      if (res.ok) {
        showToast("Kategoriler yeniden sıralandı", "success");
        await fetchData();
        if (calcPosition === 'inside') setExpanded(new Set([...Array.from(expanded), targetId]));
      } else {
        const errData = await res.json().catch(() => null);
        console.error("Backend Error:", errData);
        const errMsg = errData?.request?.resultMessage || errData?.message || "Sıralama güncellenemedi";
        showToast(errMsg, "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Sıralama hatası", "error");
    } finally {
      setIsReordering(false);
      handleDragEnd();
    }
  };

  /* ───────────────────── Loading ───────────────────── */

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 w-16 h-16 border-4 border-gray-100 dark:border-white/5 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute w-6 h-6 bg-[#FF6B00]/20 rounded-full animate-pulse"></div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-[14px] font-black tracking-[0.2em] uppercase text-[#1A2332] dark:text-white">{t('dashboard.sysop.loading_data') || 'Yükleniyor'}</span>
        <span className="text-[11px] font-bold text-gray-400">Kategori verileri hazırlanıyor...</span>
      </div>
    </div>
  );

  /* ═══════════════════ Category Form (Inline Detail View) ═══════════════════ */

  if (catFormOpen && editingCategory) {
    const isEdit = !!(editingCategory as Category).categoryID;
    return (
      <div className="h-full bg-gray-50/50 dark:bg-[#0B0C10] text-[#1A2332] dark:text-white p-4 md:p-6 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="w-full flex flex-col rounded-[2rem] border animate-zoom-in bg-white dark:bg-[#12141C] border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0 bg-white dark:bg-[#12141C] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B00] via-[#FF9EBE] to-[#5FC8C0]"></div>
              <div className="flex items-center gap-4">
                <button onClick={() => { setCatFormOpen(false); setEditingCategory(null); }} className="h-10 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-2 text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] hover:bg-white dark:hover:bg-white/10 hover:border-[#FF6B00]/30 transition-all shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Geri Dön
                </button>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2332] dark:text-white tracking-tight">
                    {isEdit ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                  </h3>
                  <p className="text-[13px] font-medium text-gray-500 mt-0.5">
                    {isEdit ? `Slug: ${editingCategory.slug}` : 'Tüm alanları doldurun'}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              <div className="space-y-6 animate-fade-in">

                {/* Name + Slug */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-8 border-b border-gray-100 dark:border-white/10">
                  <div className="space-y-1.5">
                    <label className={LABEL}>Kategori Adı</label>
                    <input type="text" placeholder="Örn: Ayakkabı" value={editingCategory.name || ""} onChange={e => handleCatNameChange(e.target.value)} className={INPUT} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={LABEL}>Slug</label>
                    <input type="text" placeholder="otomatik-oluşturulur" value={editingCategory.slug || ""} onChange={e => setEditingCategory({...editingCategory, slug: e.target.value})} className={`${INPUT} font-mono`} />
                  </div>
                </div>

                {/* Displayed Names */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-8 border-b border-gray-100 dark:border-white/10">
                  <div className="space-y-1.5">
                    <label className={LABEL}>Görüntü Adı (TR)</label>
                    <input type="text" placeholder="Türkçe ad" value={editingCategory.displayedName?.tr || ""} onChange={e => setEditingCategory({...editingCategory, displayedName: {...editingCategory.displayedName, tr: e.target.value}})} className={INPUT} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={LABEL}>Görüntü Adı (EN)</label>
                    <input type="text" placeholder="English name" value={editingCategory.displayedName?.en || ""} onChange={e => setEditingCategory({...editingCategory, displayedName: {...editingCategory.displayedName, en: e.target.value}})} className={INPUT} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={LABEL}>Görüntü Adı (FR)</label>
                    <input type="text" placeholder="Nom français" value={editingCategory.displayedName?.fr || ""} onChange={e => setEditingCategory({...editingCategory, displayedName: {...editingCategory.displayedName, fr: e.target.value}})} className={INPUT} />
                  </div>
                </div>

                {/* Parent, Icon, Description */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-8 border-b border-gray-100 dark:border-white/10">
                  <div className="space-y-1.5">
                    <label className={LABEL}>Üst Kategori</label>
                    <select value={editingCategory.parentCategoryID || ""} onChange={e => {
                      const parentId = e.target.value || null;
                      const parent = parentId ? flatCategories.find(c => c.categoryID === parentId) : undefined;
                      setEditingCategory({
                        ...editingCategory,
                        parentCategoryID: parentId,
                        slug: generateSlug(editingCategory.name || "", parent?.slug),
                      });
                    }} className={`${INPUT} appearance-none`}>
                      <option value="">— Kök Kategori —</option>
                      {flatCategories.filter(c => c.categoryID !== (editingCategory as Category).categoryID).map(c => (
                        <option key={c.categoryID} value={c.categoryID}>
                          {"—".repeat((c as any)._depth || 0)} {c.displayedName?.tr || c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={LABEL}>İkon</label>
                    <input type="text" placeholder="Örn: shoe-icon" value={editingCategory.icon || ""} onChange={e => setEditingCategory({...editingCategory, icon: e.target.value})} className={INPUT} />
                  </div>
                  <div className="space-y-1.5 lg:col-span-2">
                    <label className={LABEL}>Açıklama</label>
                    <textarea placeholder="Kategori açıklaması..." value={editingCategory.description || ""} onChange={e => setEditingCategory({...editingCategory, description: e.target.value})} className={`${INPUT} h-24 py-3 resize-none`} />
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className={LABEL}>Durum</label>
                    <div className="flex items-center gap-1 p-1 h-11 bg-gray-50/50 dark:bg-[#0B0C10] rounded-xl border border-gray-200 dark:border-white/10">
                      <button onClick={() => setEditingCategory({...editingCategory, isActive: true})} className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${editingCategory.isActive ? 'bg-white dark:bg-white/10 shadow-sm text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        Aktif
                      </button>
                      <button onClick={() => setEditingCategory({...editingCategory, isActive: false})} className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${!editingCategory.isActive ? 'bg-white dark:bg-white/10 shadow-sm text-red-600 dark:text-red-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        Pasif
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={LABEL}>Kombin İzni</label>
                    <div className="flex items-center gap-1 p-1 h-11 bg-gray-50/50 dark:bg-[#0B0C10] rounded-xl border border-gray-200 dark:border-white/10">
                      <button onClick={() => setEditingCategory({...editingCategory, allowOutfit: true})} className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${editingCategory.allowOutfit ? 'bg-white dark:bg-white/10 shadow-sm text-[#FF6B00]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        Evet
                      </button>
                      <button onClick={() => setEditingCategory({...editingCategory, allowOutfit: false})} className={`flex-1 h-full rounded-lg font-semibold text-[13px] transition-all duration-300 ${!editingCategory.allowOutfit ? 'bg-white dark:bg-white/10 shadow-sm text-gray-700 dark:text-gray-300' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                        Hayır
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#12141C] flex items-center justify-end gap-3 shrink-0">
              <button onClick={() => { setCatFormOpen(false); setEditingCategory(null); }} className="h-11 px-6 rounded-xl font-semibold text-[13px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                İptal
              </button>
              <button onClick={handleSaveCategory} disabled={saving} className="h-11 px-8 rounded-xl bg-[#FF6B00] text-white font-bold text-[13px] hover:bg-[#E66000] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center min-w-[140px] shadow-[0_4px_12px_rgba(255,107,0,0.3)]">
                {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Kaydet
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════ Attribute Form (Inline Detail View) ═══════════════════ */

  if (attrFormOpen && editingAttribute) {
    const isEdit = !!(editingAttribute as Attribute).attributeID;
    return (
      <div className="h-full bg-gray-50/50 dark:bg-[#0B0C10] text-[#1A2332] dark:text-white p-4 md:p-6 font-sans">
        <div className="max-w-5xl mx-auto">
          <div className="w-full flex flex-col rounded-[2rem] border animate-zoom-in bg-white dark:bg-[#12141C] border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0 bg-white dark:bg-[#12141C] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B00] via-[#FF9EBE] to-[#5FC8C0]"></div>
              <div className="flex items-center gap-4">
                <button onClick={() => { setAttrFormOpen(false); setEditingAttribute(null); }} className="h-10 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-2 text-[13px] font-bold text-gray-600 dark:text-gray-300 hover:text-[#FF6B00] dark:hover:text-[#FF6B00] hover:bg-white dark:hover:bg-white/10 hover:border-[#FF6B00]/30 transition-all shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Geri Dön
                </button>
                <div>
                  <h3 className="text-xl font-bold text-[#1A2332] dark:text-white tracking-tight">
                    {isEdit ? 'Özelliği Düzenle' : 'Yeni Özellik Ekle'}
                  </h3>
                  <p className="text-[13px] font-medium text-gray-500 mt-0.5">
                    {isEdit ? `Key: ${editingAttribute.nameKey}` : 'Özellik detaylarını girin'}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              <div className="space-y-6 animate-fade-in">

                {/* Basic info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-8 border-b border-gray-100 dark:border-white/10">
                  <div className="space-y-1.5">
                    <label className={LABEL}>Name Key</label>
                    <input type="text" placeholder="Örn: color" value={editingAttribute.nameKey || ""} onChange={e => setEditingAttribute({...editingAttribute, nameKey: e.target.value})} className={`${INPUT} font-mono`} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={LABEL}>Tip</label>
                    <select value={editingAttribute.type || "select"} onChange={e => setEditingAttribute({...editingAttribute, type: e.target.value})} className={`${INPUT} appearance-none`}>
                      <option value="select">Select (Tekli)</option>
                      <option value="multiselect">Multiselect (Çoklu)</option>
                      <option value="text">Text Input</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={LABEL}>Görüntü Adı (TR)</label>
                    <input type="text" placeholder="Renk" value={editingAttribute.displayedName?.tr || ""} onChange={e => setEditingAttribute({...editingAttribute, displayedName: {...editingAttribute.displayedName, tr: e.target.value}})} className={INPUT} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={LABEL}>Görüntü Adı (EN)</label>
                    <input type="text" placeholder="Color" value={editingAttribute.displayedName?.en || ""} onChange={e => setEditingAttribute({...editingAttribute, displayedName: {...editingAttribute.displayedName, en: e.target.value}})} className={INPUT} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={LABEL}>Mobil Bileşen</label>
                    <select value={editingAttribute.mobileComponent || "dropdown"} onChange={e => setEditingAttribute({...editingAttribute, mobileComponent: e.target.value})} className={`${INPUT} appearance-none`}>
                      <option value="dropdown">Default Dropdown</option>
                      <option value="horizontal_list">Horizontal Chips</option>
                      <option value="grid">Grid Selection</option>
                      <option value="color_picker">Color Palette</option>
                      <option value="size_selector">Size Grid</option>
                    </select>
                  </div>
                </div>

                {/* Values management */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[15px] font-bold text-[#1A2332] dark:text-white">Değerler</h4>
                    <span className="text-[12px] font-medium text-gray-400">{editingAttribute.values?.length || 0} değer</span>
                  </div>

                  {/* Existing values */}
                  <div className="space-y-2">
                    {editingAttribute.values?.map((v, idx) => (
                      <div key={v.valueID || idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 group">
                        {v.metaData?.hexCode && (
                          <div className="w-7 h-7 rounded-lg border border-gray-200 dark:border-white/20 shrink-0" style={{ backgroundColor: v.metaData.hexCode }}></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-[13px] font-semibold text-[#1A2332] dark:text-white">{v.displayedValue?.tr || v.valueKey}</span>
                          <span className="text-[11px] font-mono text-gray-400 ml-2">{v.valueKey}</span>
                        </div>
                        <span className="text-[11px] font-medium text-gray-400">#{v.order}</span>
                        <button onClick={() => removeValueFromAttr(idx)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add new value */}
                  <div className="p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 space-y-3">
                    <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Yeni Değer Ekle</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <input type="text" placeholder="valueKey" value={newValue.valueKey} onChange={e => setNewValue({...newValue, valueKey: e.target.value})} className={`${INPUT} text-[13px]`} />
                      <input type="text" placeholder="TR Adı" value={newValue.displayedValueTr} onChange={e => setNewValue({...newValue, displayedValueTr: e.target.value})} className={`${INPUT} text-[13px]`} />
                      <input type="number" placeholder="Sıra" value={newValue.order || ""} onChange={e => setNewValue({...newValue, order: parseInt(e.target.value) || 0})} className={`${INPUT} text-[13px]`} />
                      <div className="flex gap-2">
                        <input type="text" placeholder="#HEX" value={newValue.hexCode} onChange={e => setNewValue({...newValue, hexCode: e.target.value})} className={`${INPUT} text-[13px] flex-1`} />
                        {newValue.hexCode && <div className="w-11 h-11 rounded-xl border border-gray-200 dark:border-white/10 shrink-0" style={{ backgroundColor: newValue.hexCode }}></div>}
                      </div>
                    </div>
                    <button onClick={addValueToAttr} disabled={!newValue.valueKey} className="h-9 px-4 rounded-lg bg-gray-100 dark:bg-white/5 text-[#1A2332] dark:text-white font-semibold text-[13px] hover:bg-[#FF6B00] hover:text-white transition-all flex items-center gap-2 shadow-sm disabled:opacity-40">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      Değer Ekle
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#12141C] flex items-center justify-end gap-3 shrink-0">
              <button onClick={() => { setAttrFormOpen(false); setEditingAttribute(null); }} className="h-11 px-6 rounded-xl font-semibold text-[13px] text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                İptal
              </button>
              <button onClick={handleSaveAttribute} disabled={saving} className="h-11 px-8 rounded-xl bg-[#FF6B00] text-white font-bold text-[13px] hover:bg-[#E66000] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center min-w-[140px] shadow-[0_4px_12px_rgba(255,107,0,0.3)]">
                {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Kaydet
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════ Tree Node Renderer ═══════════════════ */

  const renderTreeNode = (cat: Category, level: number = 0): React.ReactNode => {
    const hasChildren = cat.children && cat.children.length > 0;
    const isExpanded = expanded.has(cat.categoryID);
    const displayName = cat.displayedName?.tr || cat.name;
    const isDeleting = deleting === cat.categoryID;

    const isDragging = draggedCatId === cat.categoryID;
    const isDragOver = dragOverCatId === cat.categoryID;
    let dragClasses = "";
    if (isDragOver && dropPosition) {
      if (dropPosition === 'before') dragClasses = "border-t-2 border-t-[#FF6B00]";
      else if (dropPosition === 'after') dragClasses = "border-b-2 border-b-[#FF6B00]";
      else if (dropPosition === 'inside') dragClasses = "bg-[#FF6B00]/10 border border-[#FF6B00]/30 scale-[1.02] shadow-sm z-10";
    }

    return (
      <div key={cat.categoryID} className="relative">
        <div 
          draggable={!searchQuery}
          onDragStart={(e) => handleDragStart(e, cat.categoryID)}
          onDragOver={(e) => handleDragOver(e, cat.categoryID)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, cat.categoryID)}
          className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${!searchQuery ? 'cursor-grab active:cursor-grabbing' : ''} ${dragClasses} ${isDragging ? 'opacity-40 grayscale scale-95 border border-dashed border-gray-300 dark:border-white/20' : 'hover:bg-gray-50 dark:hover:bg-white/5'} ${level > 0 ? 'ml-8 border-l-2 border-gray-200 dark:border-white/10 pl-5' : ''} ${level > 1 ? 'ml-16' : ''}`}
        >

          {/* Expand/Collapse */}
          <button onClick={(e) => { e.stopPropagation(); hasChildren && toggleExpand(cat.categoryID); }} className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${hasChildren ? 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 cursor-pointer' : 'text-gray-300 dark:text-white/10 cursor-default'}`}>
            <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Icon placeholder */}
          <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/10 dark:bg-[#FF6B00]/20 flex items-center justify-center shrink-0">
            {cat.icon ? (
              <span className="text-[11px] font-bold text-[#FF6B00]">{cat.icon.slice(0, 2).toUpperCase()}</span>
            ) : (
              <svg className="w-4 h-4 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            )}
          </div>

          {/* Name & Slug */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-[#1A2332] dark:text-white truncate">{displayName}</span>
              {/* Active badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative flex items-center justify-center w-2.5 h-2.5">
                  <div className={`absolute inset-0 rounded-full ${cat.isActive ? 'bg-[#34C759] animate-ping opacity-30' : 'hidden'}`}></div>
                  <div className={`relative w-2 h-2 rounded-full ${cat.isActive ? 'bg-[#34C759]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                </div>
                <span className={`text-[10px] font-medium ${cat.isActive ? 'text-[#34C759]' : 'text-gray-400'}`}>{cat.isActive ? 'Aktif' : 'Pasif'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-mono font-medium text-gray-400 dark:text-gray-500">{cat.slug}</span>
              {cat.allowOutfit && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[#5FC8C0]/10 text-[#5FC8C0] border border-[#5FC8C0]/20">Outfit</span>
              )}
              {hasChildren && (
                <span className="text-[10px] font-medium text-gray-400">{cat.children!.length} alt</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
            <button onClick={() => openCategoryForm(cat)} className="w-8 h-8 rounded-lg bg-gray-50/50 dark:bg-white/5 text-gray-400 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 dark:hover:bg-[#FF6B00]/20 border border-transparent hover:border-[#FF6B00]/20 transition-all flex items-center justify-center" title="Düzenle">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button onClick={() => openCategoryForm(undefined, cat.categoryID)} className="w-8 h-8 rounded-lg bg-gray-50/50 dark:bg-white/5 text-gray-400 hover:text-[#5FC8C0] hover:bg-[#5FC8C0]/10 dark:hover:bg-[#5FC8C0]/20 border border-transparent hover:border-[#5FC8C0]/20 transition-all flex items-center justify-center" title="Alt Kategori Ekle">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </button>
            <button onClick={() => { setActiveTab("mapping"); setSelectedCatId(cat.categoryID); fetchCatAttrs(cat.categoryID); }} className="w-8 h-8 rounded-lg bg-gray-50/50 dark:bg-white/5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20 transition-all flex items-center justify-center" title="Özellikleri Gör">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            </button>
            <button onClick={() => handleDeleteCategory(cat.categoryID)} disabled={isDeleting} className="w-8 h-8 rounded-lg bg-gray-50/50 dark:bg-white/5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all flex items-center justify-center disabled:opacity-30" title="Sil">
              {isDeleting ? <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div> : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Children rendering */}
        {hasChildren && isExpanded && (
          <div className="mt-1 flex flex-col gap-1">
            {Array.from(new Map(cat.children!.map(c => [c.categoryID, c])).values()).map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  /* ═══════════════════ Mapping Tree Node (Simplified) ═══════════════════ */

  const renderMappingTreeNode = (cat: Category, level: number = 0): React.ReactNode => {
    const hasChildren = cat.children && cat.children.length > 0;
    const isExpanded = expanded.has(cat.categoryID);
    const isSelected = selectedCatId === cat.categoryID;

    return (
      <div key={cat.categoryID}>
        <button onClick={() => fetchCatAttrs(cat.categoryID)} className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-left transition-all ${isSelected ? 'bg-[#FF6B00]/10 border border-[#FF6B00]/20' : 'hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent'} ${level > 0 ? 'ml-5' : ''}`}>
          {hasChildren && (
            <button onClick={(e) => { e.stopPropagation(); toggleExpand(cat.categoryID); }} className="w-5 h-5 flex items-center justify-center shrink-0">
              <svg className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
          {!hasChildren && <div className="w-5 shrink-0"></div>}
          <span className={`text-[13px] font-semibold truncate ${isSelected ? 'text-[#FF6B00]' : 'text-[#1A2332] dark:text-white'}`}>
            {cat.displayedName?.tr || cat.name}
          </span>
        </button>
        {hasChildren && isExpanded && (
          <div>{cat.children!.map(child => renderMappingTreeNode(child, level + 1))}</div>
        )}
      </div>
    );
  };

  /* ═══════════════════ Main Layout ═══════════════════ */

  return (
    <div className="h-full bg-gray-50/50 dark:bg-[#0B0C10] text-[#1A2332] dark:text-white p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

        {/* ─── Filter Bar ─── */}
        <div className="w-full flex flex-wrap xl:flex-nowrap items-center gap-3 p-2 bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/5 rounded-3xl shadow-sm">

          {/* Search */}
          <div className="flex-1 min-w-[240px] flex items-center h-12 px-4 rounded-xl bg-gray-50/50 dark:bg-transparent">
            <svg className="w-5 h-5 text-gray-400 dark:text-[#64748B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Kategori veya özellik ara..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full h-full bg-transparent border-none outline-none pl-3 text-[14px] text-gray-700 dark:text-gray-200 font-medium placeholder-gray-400 dark:placeholder-[#64748B]" />
          </div>

          <div className="hidden xl:block w-[1px] h-8 bg-gray-200 dark:bg-white/10 shrink-0"></div>

          {/* Tabs */}
          <div className="flex items-center p-1 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 shrink-0">
            {([
              { key: "tree" as TabKey, label: "Kategori Ağacı" },
              { key: "attributes" as TabKey, label: "Özellikler" },
              { key: "mapping" as TabKey, label: "Eşleştirme" },
            ]).map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 h-10 rounded-xl text-[13px] font-bold transition-all ${activeTab === tab.key ? 'bg-white dark:bg-white/10 text-[#FF6B00] shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="hidden xl:block w-[1px] h-8 bg-gray-200 dark:bg-white/10 shrink-0"></div>

          {/* Clear */}
          <button onClick={() => setSearchQuery("")} className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl text-gray-400 dark:text-[#64748B] hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Temizle">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* CTA */}
          {activeTab === "tree" && (
            <button onClick={() => openCategoryForm()} className="h-12 px-6 shrink-0 rounded-2xl bg-[#FF6B00] hover:bg-[#E66000] text-white font-bold text-[13px] shadow-[0_4px_12px_rgba(255,107,0,0.3)] flex items-center justify-center transition-all gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Yeni Ana Kategori
            </button>
          )}
          {activeTab === "attributes" && (
            <button onClick={() => openAttrForm()} className="h-12 px-6 shrink-0 rounded-2xl bg-[#FF6B00] hover:bg-[#E66000] text-white font-bold text-[13px] shadow-[0_4px_12px_rgba(255,107,0,0.3)] flex items-center justify-center transition-all gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Yeni Özellik
            </button>
          )}

          {/* Refresh */}
          <button onClick={fetchData} className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl text-gray-400 dark:text-[#64748B] hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Yenile">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>

        {/* ════════════ TAB 1: Category Tree ════════════ */}
        {activeTab === "tree" && (
          <div className="rounded-3xl border overflow-hidden bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-white/20 dark:border-white/5 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#FF6B00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                </div>
                <span className="text-[12px] font-medium text-gray-500 uppercase tracking-wider">Kategori Hiyerarşisi</span>
              </div>
              <span className="text-[12px] font-medium text-gray-400">{flatCategories.length} kategori</span>
            </div>
            <div className="p-4 space-y-1">
              {filteredRoots.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  </div>
                  <h3 className="text-lg font-black text-[#1A2332] dark:text-white mb-2">Kategori Bulunamadı</h3>
                  <p className="text-sm font-medium text-gray-500 max-w-[300px]">Arama kriterlerinize uyan kategori bulunamadı.</p>
                </div>
              ) : (
                filteredRoots.map(cat => renderTreeNode(cat, 0))
              )}
            </div>
          </div>
        )}

        {/* ════════════ TAB 2: Attributes ════════════ */}
        {activeTab === "attributes" && (
          <div className="rounded-3xl border overflow-x-auto bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-white/20 dark:border-white/5 shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-white/5">
                  <th className="px-6 py-4 text-[12px] font-medium text-gray-500 rounded-tl-3xl">ÖZELLİK</th>
                  <th className="px-6 py-4 text-[12px] font-medium text-gray-500">TİP</th>
                  <th className="px-6 py-4 text-[12px] font-medium text-gray-500">MOBİL BİLEŞEN</th>
                  <th className="px-6 py-4 text-[12px] font-medium text-gray-500">DEĞERLER</th>
                  <th className="px-6 py-4 text-[12px] font-medium text-gray-500 text-right rounded-tr-3xl">İŞLEMLER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {attributes.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                      <p className="text-[14px] font-bold text-gray-500">Henüz özellik oluşturulmamış</p>
                    </div>
                  </td></tr>
                ) : (
                  attributes.filter(a => !searchQuery || (a.displayedName?.tr || a.nameKey).toLowerCase().includes(searchQuery.toLowerCase())).map(attr => {
                    const isAttrExpanded = expandedAttr.has(attr.attributeID);
                    return (
                      <React.Fragment key={attr.attributeID}>
                        <tr className="transition-all hover:bg-gray-50/50 dark:hover:bg-white/5 group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[14px] font-semibold text-[#1A2332] dark:text-white">{attr.displayedName?.tr || attr.nameKey}</span>
                              <span className="text-[11px] font-mono font-medium text-gray-400">{attr.nameKey}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${typeBadge(attr.type)}`}>
                              {attr.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/20">
                              {attr.mobileComponent || 'dropdown'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => {
                              setExpandedAttr(prev => {
                                const next = new Set(prev);
                                next.has(attr.attributeID) ? next.delete(attr.attributeID) : next.add(attr.attributeID);
                                return next;
                              });
                            }} className="flex items-center gap-2 group/val">
                              <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center font-semibold text-[12px] text-gray-600 dark:text-gray-300">
                                {attr.values?.length || 0}
                              </div>
                              <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isAttrExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button onClick={() => openAttrForm(attr)} className="w-9 h-9 rounded-lg bg-gray-50/50 dark:bg-white/5 text-gray-400 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 dark:hover:bg-[#FF6B00]/20 border border-transparent hover:border-[#FF6B00]/20 transition-all flex items-center justify-center shadow-sm" title="Düzenle">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                              <button onClick={() => handleDeleteAttribute(attr.attributeID)} disabled={deleting === attr.attributeID} className="w-9 h-9 rounded-lg bg-gray-50/50 dark:bg-white/5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all flex items-center justify-center shadow-sm disabled:opacity-30" title="Sil">
                                {deleting === attr.attributeID ? <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div> : (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded values */}
                        {isAttrExpanded && attr.values && attr.values.length > 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-0">
                              <div className="py-4 pl-4 border-l-2 border-[#FF6B00]/20 ml-2 space-y-2 animate-fade-in">
                                {attr.values.map(v => (
                                  <div key={v.valueID} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                                    {v.metaData?.hexCode && (
                                      <div className="w-6 h-6 rounded-md border border-gray-200 dark:border-white/20 shrink-0" style={{ backgroundColor: v.metaData.hexCode }}></div>
                                    )}
                                    <span className="text-[13px] font-semibold text-[#1A2332] dark:text-white">{v.displayedValue?.tr || v.valueKey}</span>
                                    <span className="text-[11px] font-mono text-gray-400">{v.valueKey}</span>
                                    <span className="text-[10px] font-medium text-gray-400 ml-auto">Sıra: {v.order}</span>
                                    {v.metaData?.hexCode && (
                                      <span className="text-[10px] font-mono text-gray-400">{v.metaData.hexCode}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ════════════ TAB 3: Category-Attribute Mapping ════════════ */}
        {activeTab === "mapping" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Category Tree */}
            <div className="rounded-3xl border overflow-hidden bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-white/20 dark:border-white/5 shadow-sm h-fit">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                <span className="text-[12px] font-medium text-gray-500 uppercase tracking-wider">Kategori Seçin</span>
              </div>
              <div className="p-3 max-h-[600px] overflow-y-auto no-scrollbar space-y-0.5">
                {rootCategories.length === 0 ? (
                  <p className="text-[13px] text-gray-400 text-center py-8">Kategori yok</p>
                ) : (
                  rootCategories.map(cat => renderMappingTreeNode(cat, 0))
                )}
              </div>
            </div>

            {/* Right: Mapping Details */}
            <div className="lg:col-span-2 space-y-6">
              {!selectedCatId ? (
                <div className="rounded-3xl border bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-white/20 dark:border-white/5 shadow-sm py-24 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A2332] dark:text-white mb-1">Kategori Seçin</h3>
                  <p className="text-sm font-medium text-gray-500">Soldan bir kategori seçerek özellik eşleştirmesi yapın</p>
                </div>
              ) : mappingLoading ? (
                <div className="rounded-3xl border bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-white/20 dark:border-white/5 shadow-sm py-16 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Assigned */}
                  <div className="rounded-3xl border overflow-hidden bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-white/20 dark:border-white/5 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#34C759]"></div>
                        <span className="text-[12px] font-medium text-gray-500 uppercase tracking-wider">Atanmış Özellikler</span>
                      </div>
                      <span className="text-[12px] font-medium text-gray-400">{catAttrs.length} özellik</span>
                    </div>
                    <div className="p-4 space-y-2">
                      {catAttrs.length === 0 ? (
                        <p className="text-[13px] text-gray-400 text-center py-6">Bu kategoriye henüz özellik atanmamış</p>
                      ) : (
                        catAttrs.map(ca => (
                          <div key={ca.mappingID} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 group">
                            <div className="flex-1 min-w-0">
                              <span className="text-[13px] font-semibold text-[#1A2332] dark:text-white">{ca.attribute?.displayedName?.tr || ca.attribute?.nameKey || ca.attributeID}</span>
                              {ca.attribute?.nameKey && <span className="text-[11px] font-mono text-gray-400 ml-2">{ca.attribute.nameKey}</span>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${ca.isRequired ? 'bg-red-50 text-red-500 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : 'bg-gray-50 text-gray-400 border-gray-100 dark:bg-white/5 dark:text-gray-500 dark:border-white/10'}`}>
                                {ca.isRequired ? 'Zorunlu' : 'Opsiyonel'}
                              </span>
                              <button onClick={() => removeAttrFromCat(ca.attributeID)} className="w-8 h-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center" title="Kaldır">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Unassigned */}
                  <div className="rounded-3xl border overflow-hidden bg-white/80 dark:bg-[#12141C]/80 backdrop-blur-2xl border-white/20 dark:border-white/5 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                        <span className="text-[12px] font-medium text-gray-500 uppercase tracking-wider">Kullanılabilir Özellikler</span>
                      </div>
                      <span className="text-[12px] font-medium text-gray-400">{unassignedAttrs.length} özellik</span>
                    </div>
                    <div className="p-4 space-y-2">
                      {unassignedAttrs.length === 0 ? (
                        <p className="text-[13px] text-gray-400 text-center py-6">Tüm özellikler zaten atanmış</p>
                      ) : (
                        unassignedAttrs.map(attr => (
                          <div key={attr.attributeID} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/5 transition-all group">
                            <div className="flex-1 min-w-0">
                              <span className="text-[13px] font-semibold text-[#1A2332] dark:text-white">{attr.displayedName?.tr || attr.nameKey}</span>
                              <span className="text-[11px] font-mono text-gray-400 ml-2">{attr.nameKey}</span>
                              <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${typeBadge(attr.type)}`}>{attr.type}</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <button onClick={() => assignAttr(attr.attributeID, false)} className="h-8 px-3 rounded-lg bg-gray-100 dark:bg-white/5 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:bg-[#5FC8C0]/10 hover:text-[#5FC8C0] transition-all border border-transparent hover:border-[#5FC8C0]/20">
                                Opsiyonel
                              </button>
                              <button onClick={() => assignAttr(attr.attributeID, true)} className="h-8 px-3 rounded-lg bg-[#FF6B00]/10 text-[11px] font-bold text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-all border border-[#FF6B00]/20">
                                Zorunlu
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

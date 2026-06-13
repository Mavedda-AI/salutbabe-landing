import re

file_path = "src/app/dashboard/sysop/salut-organik/page.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Add states for modals
imports_pattern = r'import React, { useState } from "react";'
new_imports = '''import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";'''
content = content.replace(imports_pattern, new_imports)

states_pattern = r"const \[currentTab, setCurrentTab\] = useState<'producers' \| 'products' \| 'campaigns'>\('producers'\);"
new_states = '''const [currentTab, setCurrentTab] = useState<'producers' | 'products' | 'campaigns'>('producers');
  const [selectedProducer, setSelectedProducer] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);'''
content = content.replace(states_pattern, new_states)

# Add onClick to view document/details
view_doc_pattern = r'<button className="mt-3 text-xs font-bold text-gray-900 dark:text-white hover:underline">\s*Belgeyi Görüntüle &rarr;\s*</button>'
new_view_doc = '''<button onClick={() => setSelectedProducer(producer)} className="mt-3 text-xs font-bold text-gray-900 dark:text-white hover:underline">
                      Tüm Başvuru Detaylarını Gör &rarr;
                    </button>'''
content = re.sub(view_doc_pattern, new_view_doc, content)

# Also add details button to product
product_btn_pattern = r'<button \s*onClick=\{\(\) => handleReject\(product\.id, \'product\'\)\}'
new_product_btn = '''<button onClick={() => setSelectedProduct(product)} className="flex items-center justify-center gap-2 p-4 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/10 col-span-2">
                    Detayları Görüntüle
                  </button>
                  <button onClick={() => handleReject(product.id, 'product')}'''
content = re.sub(product_btn_pattern, new_product_btn, content)

# Add Modals before final </div>
modals = '''
      {/* PRODUCER DETAILS MODAL */}
      <Transition appear show={!!selectedProducer} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedProducer(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-[#101516] p-8 text-left align-middle shadow-2xl transition-all border border-gray-200 dark:border-white/10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <Dialog.Title as="h3" className="text-2xl font-black text-gray-900 dark:text-white">Başvuru Detayları</Dialog.Title>
                      <p className="text-sm text-gray-500 dark:text-white/50 mt-1">{selectedProducer?.farmName} ({selectedProducer?.name})</p>
                    </div>
                    <button onClick={() => setSelectedProducer(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 bg-gray-50 dark:bg-white/5 rounded-full"><Cancel01Icon size={24} /></button>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                        <div className="text-[10px] font-black uppercase text-gray-500 dark:text-white/40 mb-1">Lokasyon</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProducer?.location}</div>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                        <div className="text-[10px] font-black uppercase text-gray-500 dark:text-white/40 mb-1">Sertifika Türü</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProducer?.certificate}</div>
                      </div>
                    </div>
                    <div className="p-6 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                      <Image01Icon className="text-gray-400 mb-3" size={32} />
                      <div className="text-sm font-bold text-gray-900 dark:text-white mb-2">Sertifika Belgesi (PDF / GÖRSEL)</div>
                      <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg hover:scale-105 transition-transform">Belgeyi İndir / Aç</button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* PRODUCT DETAILS MODAL */}
      <Transition appear show={!!selectedProduct} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setSelectedProduct(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-3xl bg-white dark:bg-[#101516] p-8 text-left align-middle shadow-2xl transition-all border border-gray-200 dark:border-white/10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <Dialog.Title as="h3" className="text-2xl font-black text-gray-900 dark:text-white">İlan Detayları</Dialog.Title>
                      <p className="text-sm text-gray-500 dark:text-white/50 mt-1">{selectedProduct?.title}</p>
                    </div>
                    <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 bg-gray-50 dark:bg-white/5 rounded-full"><Cancel01Icon size={24} /></button>
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                      <Image01Icon className="text-gray-400" size={48} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] font-black uppercase text-gray-500 mb-1">Kategori</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProduct?.category}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase text-gray-500 mb-1">Fiyat</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProduct?.price}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[10px] font-black uppercase text-gray-500 mb-1">Üretici</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{selectedProduct?.producer}</div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
'''
content = content.replace("</div>\n  );\n}", modals + "\n    </div>\n  );\n}")

with open(file_path, "w") as f:
    f.write(content)


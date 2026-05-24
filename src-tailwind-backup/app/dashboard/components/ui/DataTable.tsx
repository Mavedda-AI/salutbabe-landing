import React from 'react';
import {useThemeLanguage} from '../../../../../context/ThemeLanguageContext';

export interface Column<T> {
  header: React.ReactNode;
  accessor: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectedIds?: (string | number)[];
  onToggleSelect?: (id: string | number) => void;
  onToggleAll?: () => void;
}

export function DataTable<T>({ 
  columns, 
  data, 
  keyExtractor, 
  loading, 
  emptyMessage = "Kayıt bulunamadı.", 
  onRowClick,
  selectedIds,
  onToggleSelect,
  onToggleAll
}: DataTableProps<T>) {
  const { theme } = useThemeLanguage();
  const isDark = theme === 'dark';

  const cardClass = `rounded-[20px] border transition-all duration-300 ${isDark ? 'bg-[#121214] border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'}`;

  const hasSelection = selectedIds !== undefined && onToggleSelect !== undefined && onToggleAll !== undefined;
  const allSelected = hasSelection && data.length > 0 && selectedIds.length === data.length;

  return (
    <div className={`${cardClass} overflow-hidden w-full max-w-full`}>
      <div className="overflow-x-auto w-full no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${isDark ? 'bg-[#1A1D1F] border-white/5' : 'bg-gray-50/80 border-gray-100'}`}>
              {hasSelection && (
                <th className="pl-4 py-4 md:py-5 w-12">
                  <input 
                    type="checkbox" 
                    checked={allSelected} 
                    onChange={onToggleAll} 
                    className="w-4 h-4 rounded border-gray-300 accent-[#111827]" 
                  />
                </th>
              )}
              {columns.map((col, i) => (
                <th key={i} className={`px-4 md:px-6 py-4 md:py-5 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-500'} ${col.headerClassName || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-50'}`}>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (hasSelection ? 1 : 0)} className={`p-8 text-center text-[12px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Yükleniyor...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (hasSelection ? 1 : 0)} className={`p-12 text-center text-[13px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const id = keyExtractor(row);
                const isSelected = hasSelection && selectedIds.includes(id);
                return (
                  <tr 
                    key={id} 
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors group ${onRowClick ? 'cursor-pointer' : ''} ${isSelected ? (isDark ? 'bg-blue-500/10' : 'bg-blue-50/50') : (isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50/50')}`}
                  >
                    {hasSelection && (
                      <td className="pl-4 py-4" onClick={e => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          checked={isSelected} 
                          onChange={() => onToggleSelect(id)} 
                          className="w-4 h-4 rounded border-gray-300 accent-[#111827]" 
                        />
                      </td>
                    )}
                    {columns.map((col, i) => (
                      <td key={i} className={`px-4 md:px-6 py-4 ${col.className || ''}`}>
                        {col.accessor(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

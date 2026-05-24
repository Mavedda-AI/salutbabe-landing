export default function SysopLoading() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] animate-fade-in space-y-6">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        {/* Spinning gradient ring */}
        <div className="w-16 h-16 rounded-full border-[3px] border-transparent border-t-primary border-r-primary animate-spin"></div>
        {/* Inner static circle with brand initial or icon */}
        <div className="absolute w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
         <h3 className="text-[13px] font-black text-[#111827] dark:text-white uppercase tracking-widest">Sistem Yükleniyor</h3>
         <p className="text-[11px] font-bold text-gray-500">Veriler senkronize ediliyor, lütfen bekleyin...</p>
      </div>
    </div>
  );
}

import re

path = '/Users/mustafa/WebstormProjects/salutbabe-landing/src/app/dashboard/layout.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

imports = """
import {
  DashboardCircleIcon,
  UserGroupIcon,
  ShoppingCart01Icon,
  Store01Icon,
  Settings01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  Cancel01Icon,
  Menu01Icon,
  Sun01Icon,
  Moon01Icon,
  GlobalIcon,
  Notification03Icon,
  CheckmarkBadge01Icon,
  InboxIcon,
  PencilEdit01Icon,
  RefreshIcon,
  BulbIcon,
  Logout01Icon,
  InformationCircleIcon,
  Alert01Icon,
  TickDouble01Icon
} from 'hugeicons-react';
"""

content = content.replace('import Link from "next/link";', imports + '\nimport Link from "next/link";')

# Define regex patterns and replacements
replacements = [
    (r'<svg xmlns="http://www\.w3\.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\s*<path d="M10 3H3V10H10V3Z"[\s\S]*?</svg>', '<DashboardCircleIcon size={24} />'),
    (r'<svg xmlns="http://www\.w3\.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\s*<path d="M17 16V18C17 19\.1046[\s\S]*?</svg>', '<UserGroupIcon size={24} />'),
    (r'<svg xmlns="http://www\.w3\.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\s*<path d="M3 8\.5C3 7\.11929[\s\S]*?</svg>', '<ShoppingCart01Icon size={24} />'),
    (r'<svg xmlns="http://www\.w3\.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">\s*<path d="M12 2L3 7V17[\s\S]*?</svg>', '<Store01Icon size={24} />'),
    (r'<svg xmlns="http://www\.w3\.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1\.5">[\s\S]*?</svg>', '<Settings01Icon size={24} />'),
    (r'<svg className="w-3\.5 h-3\.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2\.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>', '<ArrowLeft01Icon size={14} />'),
    (r'<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>', '<Cancel01Icon size={24} />'),
    (r'<svg className="w-5 h-5 text-gray-700 dark:text-white drop-shadow-md translate-x-1 group-hover/expand:translate-x-0 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2\.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>', '<ArrowRight01Icon size={20} className="text-gray-700 dark:text-white drop-shadow-md translate-x-1 group-hover/expand:translate-x-0 transition-transform" />'),
    (r'<svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>', '<Menu01Icon className="w-full h-full" />'),
    (r'<svg className=\{`w-4 h-4 text-gray-400 transition-transform duration-300 \$\{isExpanded \? \'rotate-180\' : \'\'\}`\} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2\.5">\s*<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />\s*</svg>', '<ArrowDown01Icon size={16} className={`text-gray-400 transition-transform duration-300 ${isExpanded ? \'rotate-180\' : \'\'}`} />'),
    (r'<svg xmlns="http://www\.w3\.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15\.364 6\.364l-\.707-\.707M6\.343 6\.343l-\.707-\.707m12\.728 0l-\.707\.707M6\.343 17\.657l-\.707\.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>', '<Sun01Icon size={20} />'),
    (r'<svg xmlns="http://www\.w3\.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20\.354 15\.354A9 9 0 018\.646 3\.646 9\.003 9\.003 0 0012 21a9\.003 9\.003 0 008\.354-5\.646z" /></svg>', '<Moon01Icon size={20} />'),
    (r'<svg xmlns="http://www\.w3\.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1\.048 9\.5A18\.022 18\.022 0 016\.412 9m6\.088 9h7M11 21l5-10 5 10M12\.751 5C11\.783 10\.77 8\.07 15\.61 3 18\.129" /></svg>', '<GlobalIcon size={20} />'),
    (r'<svg xmlns="http://www\.w3\.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>', '<Menu01Icon size={24} />'),
    (r'<svg xmlns="http://www\.w3\.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1\.8" className=\{`transition-transform origin-top \$\{unreadCount > 0 \? \'animate-\[bell_2s_ease-in-out_infinite\]\' : \'group-hover:rotate-12\'\}`\}>\s*<path strokeLinecap="round" strokeLinejoin="round" d="M14\.857 17\.082a23\.848 23\.848 0 005\.454-1\.31A8\.967 8\.967 0 0118 9\.75v-\.7V9A6 6 0 006 9v\.75a8\.967 8\.967 0 01-2\.312 6\.022c1\.733\.64 3\.56 1\.085 5\.455 1\.31m5\.714 0a24\.255 24\.255 0 01-5\.714 0m5\.714 0a3 3 0 11-5\.714 0" />\s*</svg>', '<Notification03Icon size={22} className={`transition-transform origin-top ${unreadCount > 0 ? \'animate-[bell_2s_ease-in-out_infinite]\' : \'group-hover:rotate-12\'}`} />'),
    (r'<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2\.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>', '<CheckmarkBadge01Icon size={16} />'),
    (r'<svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1\.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2\.586a1 1 0 00-\.707\.293l-2\.414 2\.414a1 1 0 01-\.707\.293h-3\.172a1 1 0 01-\.707-\.293l-2\.414-2\.414A1 1 0 006\.586 13H4" /></svg>', '<InboxIcon size={32} className="text-gray-300 dark:text-gray-600" />'),
    (r'<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1\.405-1\.405A2\.032 2\.032 0 0118 14\.158V11a6\.002 6\.002 0 00-4-5\.659V5a2 2 0 10-4 0v\.341C7\.67 6\.165 6 8\.388 6 11v3\.159c0 \.538-\.214 1\.055-\.595 1\.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>', '<ArrowRight01Icon size={20} />'),
    (r'<svg className="w-5 h-5 text-gray-400 group-hover:text-\[#FF6B00\] dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15\.232 5\.232l3\.536 3\.536m-2\.036-5\.036a2\.5 2\.5 0 113\.536 3\.536L6\.5 21\.036H3v-3\.572L16\.732 3\.732z" /></svg>', '<PencilEdit01Icon size={20} className="text-gray-400 group-hover:text-[#FF6B00] dark:group-hover:text-white" />'),
    (r'<svg className="w-5 h-5 text-gray-400 group-hover:text-\[#FF6B00\] dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h\.582m15\.356 2A8\.001 8\.001 0 004\.582 9m0 0H9m11 11v-5h-\.581m0 0a8\.003 8\.003 0 01-15\.357-2m15\.357 2H15" /></svg>', '<RefreshIcon size={20} className="text-gray-400 group-hover:text-[#FF6B00] dark:group-hover:text-white" />'),
    (r'<svg className="w-5 h-5 text-gray-400 group-hover:text-\[#FF6B00\] dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5\.882V19\.24a1\.76 1\.76 0 01-3\.417\.592l-2\.147-6\.15M18 13a3 3 0 100-6M5\.436 13\.683A4\.001 4\.001 0 017 6h1\.832c4\.1 0 7\.625-1\.234 9\.168-3v14c-1\.543-1\.766-5\.067-3-9\.168-3H7a3\.988 3\.988 0 01-1\.564-\.317z" /></svg>', '<BulbIcon size={20} className="text-gray-400 group-hover:text-[#FF6B00] dark:group-hover:text-white" />'),
    (r'<svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 dark:group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>', '<Logout01Icon size={20} className="text-gray-400 group-hover:text-red-500 dark:group-hover:text-white" />'),
    (r'<svg className="w-3\.5 h-3\.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2\.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h\.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>', '<InformationCircleIcon size={14} />'),
    (r'<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2\.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h\.01m-6\.938 4h13\.856c1\.54 0 2\.502-1\.667 1\.732-3L13\.732 4c-\.77-1\.333-2\.694-1\.333-3\.464 0L3\.34 16c-\.77 1\.333\.192 3 1\.732 3z" /></svg>', '<Alert01Icon size={24} />'),
    (r'<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>', '<TickDouble01Icon size={24} />'),
    (r'<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2\.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>', '<Cancel01Icon size={16} />')
]

for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)


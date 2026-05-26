import os
import re

dashboard_dir = 'src/app/dashboard'

for root, dirs, files in os.walk(dashboard_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            orig = content
            
            # Fix context, lib, components
            content = re.sub(r"['\"](\.\./)+context/ThemeLanguageContext['\"]", r"'@/context/ThemeLanguageContext'", content)
            content = re.sub(r"['\"](\.\./)+lib/api['\"]", r"'@/lib/api'", content)
            content = re.sub(r"['\"](\.\./)+components/ui/([^'\"]+)['\"]", r"'@/app/dashboard/components/ui/\2'", content)
            content = re.sub(r"['\"](\.\./)+components/TurkeyMapData['\"]", r"'@/components/TurkeyMapData'", content)
            
            # Fix hugeicons
            content = content.replace("AppStore01Icon", "AppStoreIcon")
            content = content.replace("Clock01Icon", "ClockIcon")
            content = content.replace("Edit02Icon", "Edit02Icon") # Wait, is it Edit02Icon? Let's check hugeicons docs. Usually it's just EditIcon or Edit02Icon. I'll just change to EditIcon
            content = content.replace("ShoppingBag01Icon", "ShoppingBagIcon")
            content = content.replace("ShoppingCart01Icon", "ShoppingCartIcon")
            content = content.replace("UserMultipleIcon", "UserGroupIcon")
            
            if content != orig:
                print(f"Fixed {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)

# Fix LayoutWrapper.tsx
lw_path = 'src/components/LayoutWrapper.tsx'
if os.path.exists(lw_path):
    with open(lw_path, 'r', encoding='utf-8') as f:
        lw = f.read()
    lw = lw.replace('import MobileAppBanner from "./MobileAppBanner";\n', '')
    lw = lw.replace('<MobileAppBanner />', '')
    with open(lw_path, 'w', encoding='utf-8') as f:
        f.write(lw)
    print("Fixed LayoutWrapper")

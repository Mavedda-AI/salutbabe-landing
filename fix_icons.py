import os

dashboard_dir = 'src/app/dashboard'

for root, dirs, files in os.walk(dashboard_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            orig = content
            
            # Replace @hugeicons/react with @hugeicons/core-free-icons for the specific icons
            if "from '@hugeicons/react'" in content or 'from "@hugeicons/react"' in content:
                # We can just change all these to core-free-icons since the icons are there.
                # BUT wait, HugeiconsIcon is exported from @hugeicons/react!
                # So we cannot just replace the whole string if HugeiconsIcon is in the same import.
                # Instead, we will separate them.
                pass
            
            # The easiest way:
            content = content.replace("AppStore01Icon", "Store01Icon")
            content = content.replace("Edit02Icon", "PencilIcon")
            content = content.replace("Clock01Icon", "Time01Icon")
            content = content.replace("ShoppingCart01Icon", "ShoppingBag01Icon")
            
            # For user-distribution/page.tsx:
            if 'import {Clock01Icon, ShoppingBag01Icon, ShoppingCart01Icon, UserMultipleIcon} from "@hugeicons/react";' in content:
                content = content.replace('import {Clock01Icon, ShoppingBag01Icon, ShoppingCart01Icon, UserMultipleIcon} from "@hugeicons/react";', 'import {ShoppingBag01Icon, UserMultipleIcon} from "@hugeicons/core-free-icons";\nimport {HugeiconsIcon} from "@hugeicons/react";')
            
            # For category-management/page.tsx:
            if 'import {Edit02Icon} from "@hugeicons/react";' in content:
                content = content.replace('import {Edit02Icon} from "@hugeicons/react";', 'import {PencilIcon} from "@hugeicons/core-free-icons";')
            
            # For product-management/page.tsx:
            if 'from \'@hugeicons/react\';' in content and 'AppStore01Icon' in orig:
                content = content.replace("from '@hugeicons/react'", "from '@hugeicons/core-free-icons'")
            
            if content != orig:
                print(f"Fixed {path}")
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)

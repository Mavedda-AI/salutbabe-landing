import glob
import re

files = glob.glob('src/components/**/*.tsx', recursive=True)
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    if "import { from 'react';" in content:
        content = content.replace("import { from 'react';", "")
        changed = True
        
    if "Bu hafta popüler" in content:
        content = content.replace("Bu hafta popüler", "{t('widgets.ranking_popular_week')}")
        changed = True
        
    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Fixed imports and remaining text!")

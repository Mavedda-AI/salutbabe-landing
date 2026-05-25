import glob
import re

files = glob.glob('src/components/widgets/*.tsx')
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "import { from 'react';" in content:
        content = content.replace("import { from 'react';", "")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Fixed imports!")

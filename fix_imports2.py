import glob
import re

files = glob.glob('src/components/**/*.tsx', recursive=True)
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "import {, {" in content:
        content = content.replace("import {, {", "import React, {")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Fixed more imports!")

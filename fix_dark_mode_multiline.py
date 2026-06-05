import os
import re

def walk(d):
    results = []
    for root, dirs, files in os.walk(d):
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                results.append(os.path.join(root, f))
    return results

sysop_dir = '/Users/hidirektor/WebstormProjects/salutbabe-landing/src/app/dashboard/sysop'
files = walk(sysop_dir)

def replace_ternary(match):
    light_classes = match.group(2)
    dark_classes = match.group(4)
    
    d_classes = []
    for c in dark_classes.split():
        if not c: continue
        if c.startswith('dark:'):
            d_classes.append(c)
        else:
            d_classes.append('dark:' + c)
            
    return light_classes + ' ' + ' '.join(d_classes)

def replace_inner(match):
    light_classes = match.group(2)
    dark_classes = match.group(4)
    
    d_classes = []
    for c in dark_classes.split():
        if not c: continue
        if c.startswith('dark:'):
            d_classes.append(c)
        else:
            d_classes.append('dark:' + c)
            
    return "'" + light_classes + " " + " ".join(d_classes) + "'"

# Update regex to handle \s* around operators
pattern1 = re.compile(r"\$\{theme === ['\"]light['\"]\s*\?\s*(['\"`])([^'\"`]+)\1\s*:\s*(['\"`])([^'\"`]+)\3\}")
pattern2 = re.compile(r"\(theme === ['\"]light['\"]\s*\?\s*(['\"`])([^'\"`]+)\1\s*:\s*(['\"`])([^'\"`]+)\3\)")

count = 0
for f in files:
    if 'system-settings' in f or f.endswith('sysop/page.tsx'):
        continue
        
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        
    original_content = content
    
    content = pattern1.sub(replace_ternary, content)
    content = pattern2.sub(replace_inner, content)
    
    content = content.replace('dark:bg-surface', 'dark:bg-[#12141C]')
    content = content.replace('dark:bg-[#121214]/60', 'dark:bg-[#12141C]/60')
    content = content.replace('dark:bg-[#121214]', 'dark:bg-[#12141C]')
    content = content.replace('dark:bg-[#1a1a1f]', 'dark:bg-[#1A1D27]')
    
    if content != original_content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
        count += 1

print(f"Finished updating {count} files.")

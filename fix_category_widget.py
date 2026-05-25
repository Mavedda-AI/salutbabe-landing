with open('src/components/widgets/CategoryFilterWidget.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to move categoryConfigs and categories inside the CategoryFilterWidget function.
# Let's find "const categoryConfigs" and the function definition.

import re

# Find the function definition
match = re.search(r'export default function CategoryFilterWidget\([^)]*\)\s*\{\s*const { t } = useThemeLanguage\(\);', content)
if match:
    # Everything before export default is imports and categoryConfigs etc
    before_func = content[:match.start()]
    func_start = match.end()
    
    # We want to extract categoryConfigs and categories from before_func
    # and put them into the function.
    # Actually, let's just use regex to move them.
    config_match = re.search(r'(const categoryConfigs\s*=\s*\{.*?\n\s*\};\s*\n\s*const categories\s*=\s*\[.*?\];\s*)', content, flags=re.DOTALL)
    if config_match:
        config_text = config_match.group(1)
        # Remove from top
        content = content.replace(config_text, "")
        
        # Insert after `const { t } = useThemeLanguage();`
        replacement = match.group(0) + "\n" + config_text
        content = content.replace(match.group(0), replacement)

with open('src/components/widgets/CategoryFilterWidget.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed CategoryFilterWidget!")

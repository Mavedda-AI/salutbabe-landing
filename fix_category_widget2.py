import re

with open('src/components/widgets/CategoryFilterWidget.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to move CATEGORY_BANNERS and categories inside CategoryFilterWidget
# Find export default function CategoryFilterWidget
match = re.search(r'(export default function CategoryFilterWidget\([^)]*\)\s*\{)(.*?)$', content, flags=re.DOTALL)
if match:
    func_def = match.group(1)
    func_body = match.group(2)
    
    # Extract everything from `export const CATEGORY_BANNERS` up to the function definition
    extract_match = re.search(r'(export const CATEGORY_BANNERS.*?;)\s*(export default function)', content, flags=re.DOTALL)
    if extract_match:
        extracted = extract_match.group(1)
        # Remove it from outside
        content = content.replace(extracted, "")
        
        # We need to remove the `export ` keyword from it since it's now inside a function
        extracted = extracted.replace('export const CATEGORY_BANNERS', 'const CATEGORY_BANNERS')
        
        # Insert inside the function right after `const { t } = useThemeLanguage();`
        content = content.replace("const { t } = useThemeLanguage();", "const { t } = useThemeLanguage();\n" + extracted)

with open('src/components/widgets/CategoryFilterWidget.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed CategoryFilterWidget again!")

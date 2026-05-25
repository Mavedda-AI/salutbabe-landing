with open('src/components/widgets/CategoryFilterWidget.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change `export const CATEGORY_BANNERS:` to `const getCategoryBanners = (t: any): Record<...`
content = content.replace("export const CATEGORY_BANNERS: Record<string, { image: string; title: string; text: string; buttonText: string; bg: string; color: string; btnBg: string; btnColor: string; dotColorActive: string; dotColorInactive: string }> = {", "const getCategoryBanners = (t: any): Record<string, { image: string; title: string; text: string; buttonText: string; bg: string; color: string; btnBg: string; btnColor: string; dotColorActive: string; dotColorInactive: string }> => ({")

# Close the object and function
content = content.replace("  }\n};\n\ninterface Props", "  }\n});\n\ninterface Props")

# Inside the component, call getCategoryBanners(t)
content = content.replace("const { t } = useThemeLanguage();", "const { t } = useThemeLanguage();\n  const CATEGORY_BANNERS = getCategoryBanners(t);")

with open('src/components/widgets/CategoryFilterWidget.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed CategoryFilterWidget the right way!")

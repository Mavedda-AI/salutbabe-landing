import glob
import re

files = glob.glob('src/components/**/*.tsx', recursive=True)
for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove `import React from 'react';` if `import React, {` is present
    if "import React," in content and "import React from 'react';" in content:
        content = content.replace("import React from 'react';\n", "")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
    # Or if there are two `import React from 'react';`
    elif content.count("import React from 'react';") > 1:
        content = content.replace("import React from 'react';\n", "", 1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Fixed duplicate React imports!")

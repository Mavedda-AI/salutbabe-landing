import re

filepath = 'src/components/Header.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import {, {useState} from 'react';", "import React, {useState} from 'react';")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)


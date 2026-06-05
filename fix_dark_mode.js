const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const sysopDir = '/Users/hidirektor/WebstormProjects/salutbabe-landing/src/app/dashboard/sysop';
const files = walk(sysopDir);

let count = 0;

for (const file of files) {
    if (file.includes('system-settings') || file.endsWith('sysop/page.tsx')) continue;

    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Pattern 1: ${theme === 'light' ? 'A' : 'B'}
    // We will extract A and B, and merge them into: A + dark:B (splitting B into words)
    const regex = /\$\{theme === ['"]light['"] \? (['"`])([^'"`]+)\1 : (['"`])([^'"`]+)\3\}/g;
    
    content = content.replace(regex, (match, q1, lightClasses, q2, darkClasses) => {
        const dClasses = darkClasses.split(/\s+/).map(c => {
            if (!c) return '';
            // If the dark class doesn't already have dark:, add it
            if (c.startsWith('dark:')) return c;
            // Also, some classes might be identical, we could filter them but tailwind doesn't care
            return `dark:${c}`;
        }).join(' ');
        
        return `${lightClasses} ${dClasses}`;
    });
    
    // Pattern 2: ${view === "categories" ? (theme === 'light' ? 'A' : 'B') : 'C'}
    // This is trickier. We can just replace the inner theme check
    const innerRegex = /\(theme === ['"]light['"] \? (['"`])([^'"`]+)\1 : (['"`])([^'"`]+)\3\)/g;
    content = content.replace(innerRegex, (match, q1, lightClasses, q2, darkClasses) => {
        const dClasses = darkClasses.split(/\s+/).map(c => {
            if (!c) return '';
            if (c.startsWith('dark:')) return c;
            return `dark:${c}`;
        }).join(' ');
        
        return `'${lightClasses} ${dClasses}'`;
    });

    // Replace instances where we might have leftover `bg-surface` with `bg-[#12141C]` since it's hardcoded to white
    content = content.replace(/dark:bg-surface/g, 'dark:bg-[#12141C]');
    
    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
        count++;
    }
}

console.log(`Finished updating ${count} files.`);

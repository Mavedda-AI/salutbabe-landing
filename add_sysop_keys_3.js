const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = ['tr.json', 'en.json', 'fr.json', 'de.json'];

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  if (fs.existsSync(filePath)) {
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.dashboard.shipping) data.dashboard.shipping = {};
    
    if (file === 'tr.json') {
      data.dashboard.shipping.logo_desc = "Şirket logosu faturalarda ve kargo takip ekranlarında görünür. En iyi sonuç için şeffaf PNG kullanın.";
      data.dashboard.shipping.no_logo = "LOGO YOK";
    } else if (file === 'fr.json') {
      data.dashboard.shipping.logo_desc = "Le logo de l'entreprise apparaît sur les factures et le suivi. Utilisez un PNG transparent pour un meilleur résultat.";
      data.dashboard.shipping.no_logo = "PAS DE LOGO";
    } else {
      data.dashboard.shipping.logo_desc = "Company logo appears on invoices and tracking screens. Use a transparent PNG for best results.";
      data.dashboard.shipping.no_logo = "NO LOGO";
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${file}`);
  }
});

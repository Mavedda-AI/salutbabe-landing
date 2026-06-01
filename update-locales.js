const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/locales');
const locales = ['tr', 'en', 'fr', 'de'];

const newKeys = {
  maintenance: {
    title: "Sunucu Bağlantısı Bekleniyor",
    desc: "Sistemlerimizde geçici bir bakım çalışması yapılmaktadır. Bağlantı arka planda otomatik olarak kontrol ediliyor.",
    while_waiting: "Bağlantı beklenirken Salutbabe:",
    feature_1: "Anneden anneye doğrudan ve %100 güvenli alışveriş imkanı.",
    feature_2: "Sıfır komisyon! Sattığınız ürünün geliri kesintisiz hesabınızda.",
    feature_3: "Türkiye'nin her yerine avantajlı PTT Kargo entegrasyonu.",
    feature_4: "Bebeğinizin küçülenleriyle aile bütçenize ve doğaya katkı sağlayın.",
    scanning: "SİSTEM DURUMU TARANIYOR..."
  }
};

const enKeys = {
  maintenance: {
    title: "Waiting for Server Connection",
    desc: "Temporary maintenance work is being carried out on our systems. The connection is being checked automatically in the background.",
    while_waiting: "While waiting, here's Salutbabe:",
    feature_1: "Direct and 100% secure mother-to-mother shopping.",
    feature_2: "Zero commission! Your sales revenue goes directly to your account.",
    feature_3: "Advantageous PTT Cargo integration all over the country.",
    feature_4: "Contribute to your family budget and nature with your baby's outgrown clothes.",
    scanning: "SCANNING SYSTEM STATUS..."
  }
};

locales.forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    content.maintenance = lang === 'tr' ? newKeys.maintenance : enKeys.maintenance;
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`Updated ${lang}.json`);
  }
});

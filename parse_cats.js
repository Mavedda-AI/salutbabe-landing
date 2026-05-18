const fs = require('fs');

const input = `
# 👶 BEBEK (\`bebek\`)

## Bebek Giyim & Tekstil (\`giyim-tekstil\`)
### Yenidoğan Giyim (\`yenidogan-giyim\`)
- Hastane Çıkış Seti (\`hastane-cikis-seti\`)
- Yenidoğan Tulum (\`yenidogan-tulum\`)
- Yenidoğan Takım (\`yenidogan-takim\`)

### Tulum (\`tulum\`)
- Kısa Tulum (\`kisa-tulum\`)
- Patiksiz Tulum (\`patiksiz-tulum\`)
- Pijama Tulum (\`pijama-tulum\`)

### Pijama & İç Giyim (\`pijama-ic-giyim\`)
- Pijama Takımı (\`pijama-takimi\`)
- İç Giyim (\`ic-giyim\`)

### Alt Üst Takım (\`alt-ust-takim\`)
- Şortlu Takım (\`sortlu-takim\`)
- Eşofman Takımı (\`esofman-takimi\`)
- Salopetli Takım (\`salopetli-takim\`)

### Üst Giyim (\`ust-giyim\`)
- Body (\`body\`)
- Tişört (\`tisort\`)

### Çorap (\`corap\`)
- Soket Çorap (\`soket-corap\`)
- Külotlu Çorap (\`kulotlu-corap\`)
- Bilek Çorap (\`bilek-corap\`)

### Dış Giyim (\`dis-giyim\`)
- Yağmurluk (\`yagmurluk\`)
- Ceket (\`ceket\`)

### Alt Giyim (\`alt-giyim\`)
- Şort (\`sort\`)
- Eşofman Altı (\`esofman-alti\`)
- Tayt (\`tayt\`)

### Ayakkabı (\`ayakkabi\`)
- Sandalet (\`sandalet\`)
- İlk Adım Ayakkabısı (\`ilk-adim-ayakkabisi\`)
- Deniz Ayakkabısı (\`deniz-ayakkabisi\`)


## Bebek Araç & Gereç (\`arac-gerec\`)
### Bebek Arabaları (\`bebek-arabalari\`)
- Baston Bebek Arabası (\`baston-bebek-arabasi\`)
- Kabin Bebek Arabaları (\`kabin-bebek-arabalari\`)
- Travel Sistem Bebek Arabası (\`travel-sistem-bebek-arabasi\`)
- İkiz Bebek Arabası (\`ikiz-bebek-arabasi\`)
- Bebek Arabası Aksesuarları (\`bebek-arabasi-aksesuarlari\`)
- Bebek Arabası Yağmurluğu (\`bebek-arabasi-yagmurlugu\`)
- Bebek Arabası Minderi (\`bebek-arabasi-minderi\`)
- Tüm Bebek Arabaları (\`tum-bebek-arabalari\`)
- Bebek Arabası Tavsiyeleri (\`bebek-arabasi-tavsiyeleri\`)

### Oto Koltuğu (\`oto-koltugu\`)
- Bebek Oto Koltuğu (\`bebek-oto-koltugu\`)
- Oto Koltuğu Yükseltici (\`oto-koltugu-yukseltici\`)
- Oto Koltuğu Aksesuarları (\`oto-koltugu-aksesuarlari\`)

### Mama Sandalyesi (\`mama-sandalyesi\`)
- Portatif Mama Sandalyesi (\`portatif-mama-sandalyesi\`)
- Mama Sandalyesi Minderi & Kılıfı (\`mama-sandalyesi-minderi-kilifi\`)
- Mama Sandalyesi Oyuncağı (\`mama-sandalyesi-oyuncagi\`)
- Fonksiyonel Mama Sandalyesi (\`fonksiyonel-mama-sandalyesi\`)

### Bebek Taşıma Gereçleri (\`bebek-tasima-gerecleri\`)
- Kanguru (\`kanguru\`)
- Portbebe (\`portbebe\`)
- Sling (\`sling\`)

### Yürüteçler (\`yurutecler\`)
- Örümcek Yürüteç (\`orumcek-yurutec\`)

### Ana Kucağı (\`ana-kucagi\`)
- Otomatik Sallanan Ana Kucağı (\`otomatik-sallanan-ana-kucagi\`)
- Ev Tipi Ana Kucağı (\`ev-tipi-ana-kucagi\`)
- Bebek Salıncakları (\`bebek-salincaklari\`)

### Park Yatak (\`park-yatak\`)
- Anne Yanı Park Yatak (\`anne-yani-park-yatak\`)
- Park Beşik (\`park-besik\`)

### Beşik & Hamak (\`besik-hamak\`)
- Sallanan Beşik (\`sallanan-besik\`)
- Bebek Yatağı (\`bebek-yatagi\`)


## Bebek Bez & Mendil (\`bez-mendil\`)
### Bebek Bezi (\`bebek-bezi\`)
- Bebek Bezi (\`bebek-bezi\`)
- Külot Bebek Bez (\`kulot-bebek-bez\`)
- Mayo Bebek Bezi (\`mayo-bebek-bezi\`)

### Islak Mendil (\`islak-mendil\`)
- Yenidoğan Islak Mendil (\`yenidogan-islak-mendil\`)
- Bebek Temizleme Pamuğu (\`bebek-temizleme-pamugu\`)
- Günlük Kullanım (\`gunluk-kullanim\`)

### Bez Değiştirme (\`bez-degistirme\`)
- Bebek Alt Açma Örtüsü (\`bebek-alt-acma-ortusu\`)
- Kirli Bebek Bezi Atık Sistemi (\`kirli-bebek-bezi-atik-sistemi\`)


## Bebek Oyuncak & Kitap (\`oyuncak-kitap\`)
### Oyuncak Kategorileri (\`oyuncak-kategorileri\`)
- Eğitici Oyuncaklar (\`egitici-oyuncaklar\`)
- Pelüşlar (\`peluslar\`)
- Oyun Setleri (\`oyun-setleri\`)
- Oyuncak Bebekler (\`oyuncak-bebekler\`)
- Akülü Araçlar (\`akulu-araclar\`)
- Müzikli Oyuncaklar (\`muzikli-oyuncaklar\`)
- Ahşap Oyuncaklar (\`ahsap-oyuncaklar\`)
- Yürüme Oyuncakları (\`yurume-oyuncaklari\`)
- Bahçe ve Plaj Oyuncakları (\`bahce-ve-plaj-oyuncaklari\`)
- Boyalar ve Boya Kalemleri (\`boyalar-ve-boya-kalemleri\`)
- Oyun Halıları (\`oyun-halilari\`)

### Bebek Gelişim Alanları (\`bebek-gelisim-alanlari\`)
- Zihinsel Gelişim Oyuncakları (\`zihinsel-gelisim-oyuncaklari\`)
- Dil Gelişimi Oyuncakları (\`dil-gelisimi-oyuncaklari\`)
- Sosyal ve Duygusal Gelişim (\`sosyal-ve-duygusal-gelisim\`)
- Duyu Gelişimi Oyuncakları (\`duyu-gelisimi-oyuncaklari\`)
- Kaba Motor Kas Gelişimi (\`kaba-motor-kas-gelisimi\`)
- İnce Motor Gelişimi (\`ince-motor-gelisimi\`)

### Kitap Kategorileri (\`kitap-kategorileri\`)
- Yenidoğan Kitapları (\`yenidogan-kitaplari\`)
- Boyama & Aktivite Kitapları (\`boyama-aktivite-kitaplari\`)
- Resimli Hikâye & Masallar (\`resimli-hikaye-masallar\`)
- Gelişim Kitapları & Setleri (\`gelisim-kitaplari-setleri\`)
- Sesli & Hareketli Kitaplar (\`sesli-hareketli-kitaplar\`)
- İlk Kitaplar (\`ilk-kitaplar\`)
- İngilizce Kitaplar (\`ingilizce-kitaplar\`)
- Ebeveyn Kitapları (\`ebeveyn-kitaplari\`)


## Bebek Beslenme (\`beslenme\`)
### Bebek Mamaları (\`bebek-mamalari\`)
- Biberon Mamaları (\`biberon-mamalari\`)
- Keçi Sütü Mamaları (\`keci-sutu-mamalari\`)
- Kavanoz Mamaları (\`kavanoz-mamalari\`)
- Kaşık Mamaları (\`kasik-mamalari\`)
- Atıştırmalık Mamalar (\`atistirmalik-mamalar\`)
- Organik Beslenme Ürünleri (\`organik-beslenme-urunleri\`)
- Gıda Takviyesi (\`gida-takviyesi\`)
- Glutensiz Ürünler (\`glutensiz-urunler\`)

### Biberon (\`biberon\`)
- Biberonlar (\`biberonlar\`)
- Biberon Emziği (\`biberon-emzigi\`)
- Biberon Aksesuarları (\`biberon-aksesuarlari\`)
- Biberon & Emzik Temizleyici (\`biberon-emzik-temizleyici\`)

### Emzik (\`emzik\`)
- Silikon Emzik (\`silikon-emzik\`)
- Kauçuk Emzik (\`kaucuk-emzik\`)

### Beslenme Gereçleri (\`beslenme-gerecleri\`)
- Bebek Sebze Meyve Filesi (\`bebek-sebze-meyve-filesi\`)
- Bebek Mama Taşıma Kabı (\`bebek-mama-tasima-kabi\`)
- Bebek Tabak, Çatal, Kaşık (\`bebek-tabak-catal-kasik\`)

### Bebek Önlükleri (\`bebek-onlukleri\`)
- Bebek Önlükleri (\`bebek-onlukleri\`)

### Termos ve Bardak (\`termos-ve-bardak\`)
- Termal Saklama Termosu (\`termal-saklama-termosu\`)
- Bebek Alıştırma Bardağı (\`bebek-alistirma-bardagi\`)

### Pratik Anneler (\`pratik-anneler\`)
- Mama Hazırlayıcılar (\`mama-hazirlayicilar\`)
- Buharlı Pişirici (\`buharli-pisirici\`)
- Mama Isıtıcı (\`mama-isitici\`)
- Sterilizatör (\`sterilizator\`)


## Bebek Banyo & Bakım (\`banyo-bakim\`)
### Banyo Saati (\`banyo-saati\`)
- Bebek Küveti (\`bebek-kuveti\`)
- Bebek Küvet Filesi (\`bebek-kuvet-filesi\`)
- Bebek Kovası (\`bebek-kovasi\`)
- Bebek Küvet Oturağı (\`bebek-kuvet-oturagi\`)
- Bebek Banyo Süngerleri (\`bebek-banyo-sungerleri\`)
- Bebek Sabunları (\`bebek-sabunlari\`)
- Bebek Şampuanı (\`bebek-sampuani\`)
- Bebek Yağı (\`bebek-yagi\`)
- Bebek Tarağı (\`bebek-taragi\`)
- Bebek Vücut Kremi (\`bebek-vucut-kremi\`)
- Banyo Oyuncakları (\`banyo-oyuncaklari\`)

### Sağlık Ürünleri (\`saglik-urunleri\`)
- Bebek Ateş Ölçer (\`bebek-ates-olcer\`)
- Bebek Sağlığı Ürünleri (\`bebek-sagligi-urunleri\`)
- Bebek Buhar Makinesi (\`bebek-buhar-makinesi\`)
- Oda Termometresi (\`oda-termometresi\`)
- Bebek Burun Aspiratörü (\`bebek-burun-aspiratoru\`)

### Tuvalet Eğitimi (\`tuvalet-egitimi\`)
- Bebek Lazımlıkları (\`bebek-lazimliklari\`)
- Bebek Alıştırma Külodu (\`bebek-alistirma-kulodu\`)

### Bakım Ürünleri (\`bakim-urunleri\`)
- Bebek Bakım Ürünleri (\`bebek-bakim-urunleri\`)
- Bebek Güneş Kremi (\`bebek-gunes-kremi\`)
- Sinek Kovucuları (\`sinek-kovuculari\`)
- Bebek Pişik Kremi (\`bebek-pisik-kremi\`)

### Anne Bakım (\`anne-bakim\`)
- Çatlak Önleyici Krem (\`catlak-onleyici-krem\`)
- Hijyenik Ped (\`hijyenik-ped\`)
- Saç Bakım (\`sac-bakim\`)
- Cilt Bakım (\`cilt-bakim\`)
- Kişisel Bakım (\`kisisel-bakim\`)

### Ağız Bakım Ürünleri (\`agiz-bakim-urunleri\`)
- Bebek Diş Fırçası (\`bebek-dis-fircasi\`)
- Bebek Diş Macunu (\`bebek-dis-macunu\`)

### Temizlik Ürünleri (\`temizlik-urunleri\`)
- Temizlik Ürünleri (\`temizlik-urunleri\`)
- Bebek Leke Çıkarıcı (\`bebek-leke-cikarici\`)
- Bebek Deterjanlar (\`bebek-deterjanlar\`)
- Biberon & Emzik Temizleyici (\`biberon-emzik-temizleyici\`)


## Bebek Emzirme (\`emzirme\`)
### Kategoriler (\`kategoriler\`)
- Emzirme Ürünleri (\`emzirme-urunleri\`)
- Tekli Elektrikli Süt Pompası (\`tekli-elektrikli-sut-pompasi\`)
- Çiftli Elektrikli Süt Pompası (\`ciftli-elektrikli-sut-pompasi\`)
- Manuel Süt Pompası (\`manuel-sut-pompasi\`)

### Emziren Anneler (\`emziren-anneler\`)
- Süt Saklama Poşeti ve Kabı (\`sut-saklama-poseti-ve-kabi\`)
- Süt Pompası (\`sut-pompasi\`)
- Emzirme Önlüğü (\`emzirme-onlugu\`)
- Emziren Anne İçecekleri (\`emziren-anne-icecekleri\`)
- Emzirme Minderi (\`emzirme-minderi\`)
- Emzirme Sütyeni (\`emzirme-sutyeni\`)

### Anne Sağlığı (\`anne-sagligi\`)
- Göğüs Koruyucu (\`gogus-koruyucu\`)
- Göğüs Kremi (\`gogus-kremi\`)
- Göğüs Pedi (\`gogus-pedi\`)


## Bebek Odası Mobilya (\`mobilya\`)
### Bebek Odası Mobilyaları (\`bebek-odasi-mobilyalari\`)
- Beşik (\`besik\`)
- Bebek Yatağı (\`bebek-yatagi\`)
- Karyola (\`karyola\`)
- Dolap (\`dolap\`)
- Şifonyer (\`sifonyer\`)
- Çocuk Masa & Sandalye (\`cocuk-masa-sandalye\`)
- Oyuncak Dolapları (\`oyuncak-dolaplari\`)
- Kitaplıklar (\`kitapliklar\`)

### Bebek Odası Tamamlayıcıları (\`bebek-odasi-tamamlayicilari\`)
- Bebek Odası Aksesuarları (\`bebek-odasi-aksesuarlari\`)
- Aydınlatma (\`aydinlatma\`)
- Bebek Cibinlik (\`bebek-cibinlik\`)
- Çadır ve Tenteler (\`cadir-ve-tenteler\`)
- Bebek Uyku Seti (\`bebek-uyku-seti\`)


## Bebek Güvenlik (\`guvenlik\`)
### Ev ve Araba Güvenliği (\`ev-ve-araba-guvenligi\`)
- Evde Güvenlik Ürünleri (\`evde-guvenlik-urunleri\`)
- Araba İçin Güvenlik Ürünleri (\`araba-icin-guvenlik-urunleri\`)

### Arabada Güvenlik (\`arabada-guvenlik\`)
- Araba Güneşliği (\`araba-gunesligi\`)
- Bebek Araba Aynası (\`bebek-araba-aynasi\`)
- Otomobil Aksesuarları (\`otomobil-aksesuarlari\`)

### Güvenli Evler (\`guvenli-evler\`)
- Bebek Köşe Koruyucuları (\`bebek-kose-koruyuculari\`)
- Bebek Emekleme Dizliği (\`bebek-emekleme-dizligi\`)
- Bebek Çekmece Kilidi (\`bebek-cekmece-kilidi\`)
- Bebek Priz Koruyucuları (\`bebek-priz-koruyuculari\`)
- Bebek Güvenlik Kapısı (\`bebek-guvenlik-kapisi\`)
- Bebek Güvenli Yatış Yastığı (\`bebek-guvenli-yatis-yastigi\`)

### Telsizler (\`telsizler\`)
- Kameralı Telsiz (\`kamerali-telsiz\`)
- Dijital Bebek Telsizi (\`dijital-bebek-telsizi\`)

---
---

# 🧒 ÇOCUK (\`cocuk\`)

## Kız Çocuk Giyim (\`kiz-cocuk-giyim\`)
### Üst Giyim (\`ust-giyim\`)
- Tişört (\`tisort\`)
- Kazak (\`kazak\`)
- Hırka (\`hirka\`)
- Sweatshirt (\`sweatshirt\`)
- Gömlek (\`gomlek\`)
- Bluz (\`bluz\`)

### Alt Giyim (\`alt-giyim\`)
- Pantolon (\`pantolon\`)
- Jean (\`jean\`)
- Eşofman Altı (\`esofman-alti\`)
- Tayt (\`tayt\`)
- Şort (\`sort\`)
- Etek (\`etek\`)

### Dış Giyim (\`dis-giyim\`)
- Mont (\`mont\`)
- Kaban (\`kaban\`)
- Yağmurluk (\`yagmurluk\`)
- Ceket (\`ceket\`)
- Yelek (\`yelek\`)

### Elbise & Tulum (\`elbise-tulum\`)
- Günlük Elbise (\`gunluk-elbise\`)
- Abiye Elbise (\`abiye-elbise\`)
- Tulum (\`tulum\`)
- Salopet (\`salopet\`)

### İç Giyim & Ev Giyimi (\`ic-giyim-ev-giyimi\`)
- Pijama Takımı (\`pijama-takimi\`)
- İç Çamaşırı (\`ic-camasiri\`)
- Atlet (\`atlet\`)
- Bornoz & Havlu (\`bornoz-havlu\`)
- Ev Terliği (\`ev-terligi\`)

### Plaj Giyimi (\`plaj-giyimi\`)
- Mayo (\`mayo\`)
- Bikini (\`bikini\`)
- Haşema (\`hasema\`)
- Plaj Havlusu (\`plaj-havlusu\`)


## Erkek Çocuk Giyim (\`erkek-cocuk-giyim\`)
### Üst Giyim (\`ust-giyim\`)
- Tişört (\`tisort\`)
- Polo Yaka Tişört (\`polo-yaka-tisort\`)
- Kazak (\`kazak\`)
- Hırka (\`hirka\`)
- Sweatshirt (\`sweatshirt\`)
- Gömlek (\`gomlek\`)

### Alt Giyim (\`alt-giyim\`)
- Pantolon (\`pantolon\`)
- Jean (\`jean\`)
- Eşofman Altı (\`esofman-alti\`)
- Şort (\`sort\`)

### Dış Giyim (\`dis-giyim\`)
- Mont (\`mont\`)
- Kaban (\`kaban\`)
- Yağmurluk (\`yagmurluk\`)
- Ceket (\`ceket\`)
- Yelek (\`yelek\`)

### Takım Elbise & Smokin (\`takim-elbise-smokin\`)
- Takım Elbise (\`takim-elbise\`)
- Gömlek & Kravat Seti (\`gomlek-kravat-seti\`)
- Yelekli Takım (\`yelekli-takim\`)

### İç Giyim & Ev Giyimi (\`ic-giyim-ev-giyimi\`)
- Pijama Takımı (\`pijama-takimi\`)
- İç Çamaşırı (\`ic-camasiri\`)
- Atlet (\`atlet\`)
- Bornoz & Havlu (\`bornoz-havlu\`)

### Plaj Giyimi (\`plaj-giyimi\`)
- Deniz Şortu (\`deniz-sortu\`)
- Mayo (\`mayo\`)
- Plaj Havlusu (\`plaj-havlusu\`)


## Çocuk Ayakkabı (\`cocuk-ayakkabi\`)
### Günlük Ayakkabı (\`gunluk-ayakkabi\`)
- Sneaker (\`sneaker\`)
- Spor Ayakkabı (\`spor-ayakkabi\`)
- Bez Ayakkabı (\`bez-ayakkabi\`)
- Slip-on (\`slip-on\`)

### Kışlık Ayakkabı (\`kislik-ayakkabi\`)
- Bot (\`bot\`)
- Çizme (\`cizme\`)
- Kar Botu (\`kar-botu\`)

### Yazlık Ayakkabı (\`yazlik-ayakkabi\`)
- Sandalet (\`sandalet\`)
- Terlik (\`terlik\`)
- Deniz Ayakkabısı (\`deniz-ayakkabisi\`)

### Özel Gün Ayakkabısı (\`ozel-gun-ayakkabisi\`)
- Klasik Ayakkabı (\`klasik-ayakkabi\`)
- Babet (\`babet\`)
- Rugan Ayakkabı (\`rugan-ayakkabi\`)


## Çocuk Aksesuar (\`cocuk-aksesuar\`)
### Çanta & Cüzdan (\`canta-cuzdan\`)
- Sırt Çantası (\`sirt-cantasi\`)
- Bel Çantası (\`bel-cantasi\`)
- Postacı Çantası (\`postaci-cantasi\`)
- Cüzdan (\`cuzdan\`)

### Şapka, Atkı & Eldiven (\`sapka-atki-eldiven\`)
- Şapka & Bere (\`sapka-bere\`)
- Atkı & Boyunluk (\`atki-boyunluk\`)
- Eldiven (\`eldiven\`)

### Saç Aksesuarları (\`sac-aksesuarlari\`)
- Toka (\`toka\`)
- Taç (\`tac\`)
- Saç Bandı (\`sac-bandi\`)

### Takı & Saat (\`taki-saat\`)
- Çocuk Saati (\`cocuk-saati\`)
- Kolye (\`kolye\`)
- Bileklik (\`bileklik\`)
- Güneş Gözlüğü (\`gunes-gozlugu\`)


## Çocuk Eğitici & Eğlence (\`egitici-eglence\`)
### Eğitici & Zeka Oyunları (\`egitici-zeka-oyunlari\`)
- Kutu Oyunları (\`kutu-oyunlari\`)
- Yapboz & Puzzle (\`yapboz-puzzle\`)
- Bilim Setleri (\`bilim-setleri\`)
- Kodlama Oyuncakları (\`kodlama-oyuncaklari\`)

### Hobi & Sanat (\`hobi-sanat\`)
- Boyama Setleri (\`boyama-setleri\`)
- Kil & Oyun Hamuru (\`kil-oyun-hamuru\`)
- Takı Tasarım Setleri (\`taki-tasarim-setleri\`)
- Müzik Aletleri (\`muzik-aletleri\`)

### Aksiyon & Karakter (\`aksiyon-karakter\`)
- Aksiyon Figürleri (\`aksiyon-figurleri\`)
- Model Araçlar (\`model-araclar\`)
- Oyuncak Bebekler (\`oyuncak-bebekler\`)
- Uzaktan Kumandalı Araçlar (\`uzaktan-kumandali-araclar\`)

### Dış Mekan & Spor (\`dis-mekan-spor\`)
- Bisiklet (\`bisiklet\`)
- Scooter (\`scooter\`)
- Paten & Kaykay (\`paten-kaykay\`)
- Top Oyunları (\`top-oyunlari\`)
- Uçurtma (\`ucurtma\`)


## Çocuk Okul & Kırtasiye (\`okul-kirtasiye\`)
### Okul Çantaları (\`okul-cantalari\`)
- Çekçekli Çanta (\`cekcekli-canta\`)
- Beslenme Çantası (\`beslenme-cantasi\`)
- Kalem Kutusu (\`kalem-kutusu\`)

### Kırtasiye Ürünleri (\`kirtasiye-urunleri\`)
- Boya Kalemleri (\`boya-kalemleri\`)
- Defterler (\`defterler\`)
- Okul Setleri (\`okul-setleri\`)

### Kitaplar (\`kitaplar\`)
- Okuma Kitapları (\`okuma-kitaplari\`)
- Çizgi Romanlar (\`cizgi-romanlar\`)
- Test & Kaynak Kitapları (\`test-kaynak-kitaplari\`)


## Çocuk Odası (\`cocuk-odasi\`)
### Mobilya (\`mobilya\`)
- Çocuk Karyolası (\`cocuk-karyolasi\`)
- Çalışma Masası (\`calisma-masasi\`)
- Gardırop (\`gardirop\`)
- Kitaplık (\`kitaplik\`)
- Oyuncak Dolabı (\`oyuncak-dolabi\`)

### Ev Tekstili (\`ev-tekstili\`)
- Nevresim Takımı (\`nevresim-takimi\`)
- Yatak Örtüsü (\`yatak-ortusu\`)
- Çocuk Halısı (\`cocuk-halisi\`)
- Perde (\`perde\`)

### Dekorasyon & Aydınlatma (\`dekorasyon-aydinlatma\`)
- Gece Lambası (\`gece-lambasi\`)
- Masa Lambası (\`masa-lambasi\`)
- Duvar Süsleri (\`duvar-susleri\`)
- Tablo & Poster (\`tablo-poster\`)
`;

let output = '  const categories = [\n';
let currentCat = null;
let catId = 1;
let subId = 1;

const lines = input.split('\n');
for (let line of lines) {
  line = line.trim();
  if (line.startsWith('## ')) {
    if (currentCat) {
      output += '      ]\n    },\n';
    }
    const nameMatch = line.match(/## (.*?) \(/);
    let name = nameMatch ? nameMatch[1].trim() : line.replace('## ', '');
    // Replace "Giyim & Tekstil" with "Bebek Giyim & Tekstil" etc. if they are under BEBEK
    output += `    {\n      id: 'CAT-${catId}', name: '${name}', productCount: Math.floor(Math.random() * 5000 + 1000), status: 'Aktif',\n      subcategories: [\n`;
    catId++;
    subId = 1;
    currentCat = name;
  } else if (line.startsWith('- ')) {
    const subNameMatch = line.match(/- (.*?) \(/);
    let subName = subNameMatch ? subNameMatch[1].trim() : line.replace('- ', '');
    output += `        { id: 'SUB-${catId-1}${(subId < 10 ? '0' : '')}${subId}', name: '${subName}', productCount: Math.floor(Math.random() * 1000 + 100), status: 'Aktif' },\n`;
    subId++;
  }
}

if (currentCat) {
  output += '      ]\n    }\n  ];';
}

fs.writeFileSync('categories_output.txt', output);

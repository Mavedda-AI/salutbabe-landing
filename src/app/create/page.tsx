"use client";

import React, {useState} from 'react';
import styles from './page.module.css';

export default function CreateListingPage() {
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Satış Yap</h1>
        <p className={styles.subtitle}>Dolabını boşalt, aile bütçesine katkı sağla.</p>
      </header>

      <main className={styles.main}>
        {/* Photo Upload Section */}
        <section className={styles.section}>
          <div className={styles.photoUploadBox}>
            <div className={styles.photoUploadIcon}>+</div>
            <span className={styles.photoUploadText}>Fotoğraf Ekle</span>
            <span className={styles.photoUploadHint}>En fazla 20 fotoğraf</span>
          </div>
        </section>

        {/* Details Section */}
        <section className={styles.section}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Başlık</label>
            <input type="text" className={styles.input} placeholder="Örn: Zara 2 Yaş Kız Bebek Elbisesi" />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Açıklama</label>
            <textarea className={styles.textarea} placeholder="Ürünün durumu, kullanım süresi, herhangi bir defosu var mı?" rows={4}></textarea>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Fiyat (TL)</label>
              <input type="number" className={styles.input} placeholder="0" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Sıfır Fiyatı (Opsiyonel)</label>
              <input type="number" className={styles.input} placeholder="0" />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Kategori</label>
            <select className={styles.select}>
              <option>Kategori Seçin</option>
              <option>Kız Bebek Giyim</option>
              <option>Erkek Bebek Giyim</option>
              <option>Oyuncak</option>
              <option>Araç & Gereç</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Durum</label>
            <select className={styles.select}>
              <option>Mükemmel</option>
              <option>Yeni Etiketli</option>
              <option>İyi</option>
              <option>Kullanılmış</option>
            </select>
          </div>
        </section>

        {/* Publish Button */}
        <div className={styles.bottomFixed}>
          <button className={styles.publishButton}>İlanı Yükle</button>
        </div>
      </main>
    </div>
  );
}

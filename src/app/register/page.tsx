"use client";

import React from 'react';
import styles from './page.module.css';

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoCircle}>
          <span className={styles.logoText}>S</span>
        </div>
        
        <h1 className={styles.title}>Salutbabe'e Katıl</h1>
        <p className={styles.subtitle}>En büyük anne-çocuk "Super-App"ine katılmak için hemen hesabını oluştur.</p>

        <div className={styles.form}>
          <input type="text" className={styles.input} placeholder="Adın Soyadın" />
          <input type="email" className={styles.input} placeholder="E-posta Adresin" />
          <input type="password" className={styles.input} placeholder="Şifren" />
          
          <button className={styles.loginButton}>Kayıt Ol</button>
          
          <div className={styles.divider}>
            <span>veya</span>
          </div>

          <button className={styles.socialButton}>Google ile Devam Et</button>
          <button className={styles.socialButton}>Apple ile Devam Et</button>
        </div>
      </div>
    </div>
  );
}

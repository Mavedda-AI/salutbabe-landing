"use client";

import React, {useEffect, useState} from 'react';
import styles from './TopToastNotification.module.css';
import {Cancel01Icon, Notification01Icon} from 'hugeicons-react';

interface ToastData {
  id: string;
  title: string;
  message: string;
}

export default function TopToastNotification() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Simulation: Add a mock socket listener
  useEffect(() => {
    // This is where we will hook up Socket.io
    // e.g., socket.on('notification', (data) => addToast(data));
    
    // For demonstration, let's show a toast after 5 seconds
    const timer = setTimeout(() => {
      setToasts([{ id: '1', title: 'Yeni Teklif Geldi!', message: 'Dinozor Sepeti için 200 TL teklifiniz var.' }]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const removeToast = (id: string) => {
    setToasts(current => current.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map(toast => (
        <div key={toast.id} className={styles.toast}>
          <div className={styles.iconWrapper}>
            <Notification01Icon size={20} color="white" />
          </div>
          <div className={styles.content}>
            <span className={styles.title}>{toast.title}</span>
            <span className={styles.message}>{toast.message}</span>
          </div>
          <button className={styles.closeButton} onClick={() => removeToast(toast.id)}>
            <Cancel01Icon size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

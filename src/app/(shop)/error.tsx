"use client";

import {Alert01Icon} from 'hugeicons-react';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        backgroundColor: 'var(--background)',
        gap: '20px',
        padding: '40px 20px',
        textAlign: 'center',
        fontFamily: 'var(--font-family)',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--accent-pink)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Alert01Icon size={28} color="var(--price-red)" strokeWidth={2} />
      </div>

      <h2
        style={{
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Bir şeyler ters gitti
      </h2>

      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          maxWidth: '360px',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Sayfa yüklenirken bir hata oluştu. Lütfen tekrar deneyin.
      </p>

      <button
        onClick={() => reset()}
        style={{
          marginTop: '8px',
          padding: '12px 32px',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          backgroundColor: 'var(--text-primary)',
          border: 'none',
          borderRadius: 'var(--global-radius)',
          cursor: 'pointer',
          fontFamily: 'var(--font-family)',
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Tekrar Dene
      </button>
    </div>
  );
}

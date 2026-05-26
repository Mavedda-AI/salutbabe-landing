import Link from 'next/link';
import {Search01Icon} from 'hugeicons-react';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        gap: '20px',
        padding: '40px 20px',
        textAlign: 'center',
        fontFamily: 'var(--font-family)',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: 'var(--accent-beige)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Search01Icon size={30} color="var(--text-secondary)" strokeWidth={2} />
      </div>

      <h1
        style={{
          fontSize: '56px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
          lineHeight: 1,
          letterSpacing: '-2px',
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: '18px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        Sayfa Bulunamadı
      </h2>

      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          maxWidth: '380px',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        <br />
        <span style={{ fontSize: '13px', opacity: 0.7 }}>
          The page you are looking for does not exist or may have been moved.
        </span>
      </p>

      <Link
        href="/"
        style={{
          marginTop: '12px',
          padding: '12px 32px',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          backgroundColor: 'var(--text-primary)',
          border: 'none',
          borderRadius: 'var(--global-radius)',
          textDecoration: 'none',
          fontFamily: 'var(--font-family)',
          transition: 'opacity 0.2s ease',
          display: 'inline-block',
        }}
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

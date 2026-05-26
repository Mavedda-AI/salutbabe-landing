export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        backgroundColor: 'var(--background)',
        gap: '24px',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '3px solid var(--input-bg)',
          borderTopColor: 'var(--text-primary)',
          animation: 'loadingSpin 0.8s linear infinite',
        }}
      />
      <span
        style={{
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '2px',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-family)',
        }}
      >
        YÜKLENİYOR
      </span>

      <style>{`
        @keyframes loadingSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

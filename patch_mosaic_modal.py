import re

with open('src/components/widgets/MosaicWidget.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace MosaicItem props and onClick
content = content.replace(
    'function MosaicItem({ index }: { index: number }) {',
    'function MosaicItem({ index, onClick }: { index: number, onClick: () => void }) {'
)

content = content.replace(
    'onClick={() => showToast("Satın almak ve incelemek için uygulamasını indirin!", "info")}',
    'onClick={onClick}'
)

# Rewrite MosaicWidget
new_mosaic_widget = """export default function MosaicWidget() {
  const { t } = useThemeLanguage();
  const [showAppModal, setShowAppModal] = useState(false);

  return (
    <>
      <div className={styles.mosaicSection}>
        <h2 className={styles.sectionTitle} style={{ margin: '0 16px 16px 16px' }}>{t('home.for_you_picks')}</h2>
        <div className={styles.mosaicContainer}>
          {Array.from({ length: 48 }).map((_, i) => (
            <MosaicItem key={i} index={i} onClick={() => setShowAppModal(true)} />
          ))}
        </div>
      </div>

      {showAppModal && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
          onClick={() => setShowAppModal(false)}
        >
          <div 
            style={{
              background: '#fff', borderRadius: '24px', padding: '32px 24px',
              maxWidth: '360px', width: '100%', textAlign: 'center', position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowAppModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.05)',
                border: 'none', width: '32px', height: '32px', borderRadius: '16px',
                fontSize: '16px', cursor: 'pointer', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px', color: '#111' }}>
              {t('widgets.country_app_title')}
            </h3>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px', lineHeight: '1.5' }}>
              {t('widgets.country_app_desc')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a 
                href="https://apps.apple.com/us/app/salutbabe/id6759988511" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#000', color: '#fff', padding: '14px', borderRadius: '12px', textDecoration: 'none'
                }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: 32 }} />
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=com.salutbabe&hl=tr" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#000', color: '#fff', padding: '14px', borderRadius: '12px', textDecoration: 'none'
                }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: 32 }} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}"""

content = re.sub(r'export default function MosaicWidget\(\).*?}$', new_mosaic_widget, content, flags=re.DOTALL)

with open('src/components/widgets/MosaicWidget.tsx', 'w', encoding='utf-8') as f:
    f.write(content)


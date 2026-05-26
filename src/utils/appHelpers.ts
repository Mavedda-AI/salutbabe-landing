export const handleOpenApp = () => {
  if (typeof window !== 'undefined') {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      window.location.href = 'https://apps.apple.com/us/app/salutbabe/id6759988511';
      return;
    }
    
    // Android detection
    if (/android/i.test(userAgent)) {
      window.location.href = 'https://play.google.com/store/apps/details?id=com.salutbabe&hl=tr';
      return;
    }
    
    // Default fallback for desktop/other
    window.location.href = 'https://apps.apple.com/us/app/salutbabe/id6759988511';
  }
};

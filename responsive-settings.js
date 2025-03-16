/**
 * responsive-settings.js
 * Mobil görünüm ayarlarını CSS değişkenlerine dönüştürür
 */

// Uygulama başlangıcında ayarları yükle
document.addEventListener('DOMContentLoaded', function() {
  console.log('Responsive settings JS loaded 📱');
  loadResponsiveSettings();
});

// Ayarları veritabanından al ve CSS değişkenlerine uygula
async function loadResponsiveSettings() {
  try {
    // Sayfa yüklenirken mevcut ayarlar
    const settings = window.siteSettings || {};
    
    // VIP Site ayarları
    const vipMobileColumnsCount = settings.mobile_vip_sites_columns || '2';
    const vipMobileTitleSize = settings.vip_mobile_title_size || '16';
    const vipDesktopTitleSize = settings.vip_desktop_title_size || '24';
    const vipMobileDescSize = settings.vip_mobile_desc_size || '13';
    const vipDesktopDescSize = settings.vip_desktop_desc_size || '16';
    const vipMobileButtonSize = settings.vip_mobile_button_size || '13';
    const vipDesktopButtonSize = settings.vip_desktop_button_size || '16';
    const vipMobilePadding = settings.vip_mobile_padding || '15';
    const vipDesktopPadding = settings.vip_desktop_padding || '30';
    const vipMobileLogoWidth = settings.vip_mobile_logo_width || '100';
    const vipMobileLogoHeight = settings.vip_mobile_logo_height || '50';
    const vipDesktopLogoWidth = settings.vip_desktop_logo_width || '160';
    const vipDesktopLogoHeight = settings.vip_desktop_logo_height || '80';
    const vipShowMobileTitle = settings.vip_show_mobile_title !== '0' ? '1' : '0';
    const vipShowMobileDesc = settings.vip_show_mobile_desc !== '0' ? '1' : '0';
    
    // Güvenilir Site ayarları
    const trustedMobileColumnsCount = settings.mobile_trusted_sites_columns || '2';
    const trustedMobileTitleSize = settings.trusted_mobile_title_size || '16';
    const trustedDesktopTitleSize = settings.trusted_desktop_title_size || '22';
    const trustedMobileDescSize = settings.trusted_mobile_desc_size || '13';
    const trustedDesktopDescSize = settings.trusted_desktop_desc_size || '16';
    const trustedMobileButtonSize = settings.trusted_mobile_button_size || '13';
    const trustedDesktopButtonSize = settings.trusted_desktop_button_size || '16';
    const trustedMobilePadding = settings.trusted_mobile_padding || '15';
    const trustedDesktopPadding = settings.trusted_desktop_padding || '25';
    const trustedMobileLogoWidth = settings.trusted_mobile_logo_width || '100';
    const trustedMobileLogoHeight = settings.trusted_mobile_logo_height || '50';
    const trustedDesktopLogoWidth = settings.trusted_desktop_logo_width || '160';
    const trustedDesktopLogoHeight = settings.trusted_desktop_logo_height || '80';
    const trustedShowMobileTitle = settings.trusted_show_mobile_title !== '0' ? '1' : '0';
    const trustedShowMobileDesc = settings.trusted_show_mobile_desc !== '0' ? '1' : '0';
    
    // CSS değişkenlerini ayarla
    document.documentElement.style.setProperty('--vip-mobile-title-size', `${vipMobileTitleSize}px`);
    document.documentElement.style.setProperty('--vip-desktop-title-size', `${vipDesktopTitleSize}px`);
    document.documentElement.style.setProperty('--vip-mobile-desc-size', `${vipMobileDescSize}px`);
    document.documentElement.style.setProperty('--vip-desktop-desc-size', `${vipDesktopDescSize}px`);
    document.documentElement.style.setProperty('--vip-mobile-button-size', `${vipMobileButtonSize}px`);
    document.documentElement.style.setProperty('--vip-desktop-button-size', `${vipDesktopButtonSize}px`);
    document.documentElement.style.setProperty('--vip-mobile-padding', `${vipMobilePadding}px`);
    document.documentElement.style.setProperty('--vip-desktop-padding', `${vipDesktopPadding}px`);
    document.documentElement.style.setProperty('--vip-mobile-logo-width', `${vipMobileLogoWidth}px`);
    document.documentElement.style.setProperty('--vip-mobile-logo-height', `${vipMobileLogoHeight}px`);
    document.documentElement.style.setProperty('--vip-desktop-logo-width', `${vipDesktopLogoWidth}px`);
    document.documentElement.style.setProperty('--vip-desktop-logo-height', `${vipDesktopLogoHeight}px`);
    
    document.documentElement.style.setProperty('--trusted-mobile-title-size', `${trustedMobileTitleSize}px`);
    document.documentElement.style.setProperty('--trusted-desktop-title-size', `${trustedDesktopTitleSize}px`);
    document.documentElement.style.setProperty('--trusted-mobile-desc-size', `${trustedMobileDescSize}px`);
    document.documentElement.style.setProperty('--trusted-desktop-desc-size', `${trustedDesktopDescSize}px`);
    document.documentElement.style.setProperty('--trusted-mobile-button-size', `${trustedMobileButtonSize}px`);
    document.documentElement.style.setProperty('--trusted-desktop-button-size', `${trustedDesktopButtonSize}px`);
    document.documentElement.style.setProperty('--trusted-mobile-padding', `${trustedMobilePadding}px`);
    document.documentElement.style.setProperty('--trusted-desktop-padding', `${trustedDesktopPadding}px`);
    document.documentElement.style.setProperty('--trusted-mobile-logo-width', `${trustedMobileLogoWidth}px`);
    document.documentElement.style.setProperty('--trusted-mobile-logo-height', `${trustedMobileLogoHeight}px`);
    document.documentElement.style.setProperty('--trusted-desktop-logo-width', `${trustedDesktopLogoWidth}px`);
    document.documentElement.style.setProperty('--trusted-desktop-logo-height', `${trustedDesktopLogoHeight}px`);
    
    // Data özniteliklerini ayarla (görünürlük için)
    document.body.setAttribute('data-vip-mobile-title', vipShowMobileTitle);
    document.body.setAttribute('data-vip-mobile-desc', vipShowMobileDesc);
    document.body.setAttribute('data-trusted-mobile-title', trustedShowMobileTitle);
    document.body.setAttribute('data-trusted-mobile-desc', trustedShowMobileDesc);
    
    console.log('Responsive settings applied ✅');
  } catch (error) {
    console.error('Error loading responsive settings:', error);
  }
}

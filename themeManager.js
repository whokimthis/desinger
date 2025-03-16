/**
 * Gelişmiş Tema Yönetim Sistemi
 * 
 * Bu modül, web sitesinin temasını dinamik olarak değiştirmek için
 * kullanılan fonksiyonları ve dosya sisteminden tema bilgilerini okumak
 * için gerekli araçları içerir.
 */

import fs from 'fs';
import path from 'path';

// Tema dizini
const THEMES_DIR = path.join(process.cwd(), 'src', 'themes');

// Site tema ayarlarını saklayacağımız dosya
const THEME_SETTINGS_PATH = path.join(process.cwd(), 'site-theme-settings.json');
const SRC_THEME_SETTINGS_PATH = path.join(process.cwd(), 'src', 'site-theme-settings.json');

// Varsayılan tema
const DEFAULT_THEME = 'hebtema'; // varsayılan temayı değiştirdim

/**
 * Dosya sisteminden tüm temaları okur ve önbelleğe alır
 * @returns {Array} - Temaların listesi
 */
let cachedThemes = null;
let cachedThemesTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 dakika

export function getAllThemes() {
  // Önbellek kontrolü
  const now = Date.now();
  if (cachedThemes && (now - cachedThemesTimestamp < CACHE_DURATION)) {
    return cachedThemes;
  }
  
  try {
    // Tema klasörlerini al
    const themeFolders = fs.readdirSync(THEMES_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // Her klasördeki theme.json dosyasını oku
    const themes = themeFolders
      .map(folder => {
        const jsonPath = path.join(THEMES_DIR, folder, 'theme.json');
        if (fs.existsSync(jsonPath)) {
          try {
            const themeContent = fs.readFileSync(jsonPath, 'utf8');
            const themeData = JSON.parse(themeContent);
            
            // Validasyon: Gerekli alanların kontrolü
            if (!themeData.id || !themeData.name || !themeData.colors) {
              console.error(`Eksik veya geçersiz tema: ${folder}. Temel alanlar eksik.`);
              return null;
            }
            
            // Renk paletinde gerekli renkler var mı kontrol et
            const requiredColors = ['primary', 'secondary', 'accent', 'background', 'backgroundSecondary', 'text'];
            const missingColors = requiredColors.filter(color => !themeData.colors[color]);
            
            if (missingColors.length > 0) {
              console.warn(`Tema ${themeData.id}: Eksik renkler: ${missingColors.join(', ')}`);
              
              // Eksik renkleri varsayılan değerlerle doldur
              missingColors.forEach(colorName => {
                if (colorName === 'primary') themeData.colors[colorName] = '#3ebcfa';
                else if (colorName === 'secondary') themeData.colors[colorName] = '#3efa9f';
                else if (colorName === 'accent') themeData.colors[colorName] = '#ff3366';
                else if (colorName === 'background') themeData.colors[colorName] = '#000e1c';
                else if (colorName === 'backgroundSecondary') themeData.colors[colorName] = '#001528';
                else if (colorName === 'text') themeData.colors[colorName] = '#ffffff';
              });
            }
            
            // Karanlık/açık renkler yoksa hesapla (primary için primaryDark, primaryLight vb.)
            const colorKeys = Object.keys(themeData.colors);
            
            colorKeys.forEach(colorKey => {
              // primaryDark yoksa üret
              if (colorKey === 'primary' && !themeData.colors['primaryDark']) {
                themeData.colors['primaryDark'] = darkenColor(themeData.colors[colorKey], 20);
              }
              
              // secondaryDark yoksa üret
              if (colorKey === 'secondary' && !themeData.colors['secondaryDark']) {
                themeData.colors['secondaryDark'] = darkenColor(themeData.colors[colorKey], 20);
              }
            });
            
            return {
              ...themeData,
              path: folder,
              valid: true
            };
          } catch (error) {
            console.error(`Tema JSON okuma hatası: ${folder}`, error);
            return null;
          }
        }
        return null;
      })
      .filter(theme => theme !== null);
    
    // Önbelleğe al
    cachedThemes = themes;
    cachedThemesTimestamp = now;
    
    return themes;
  } catch (error) {
    console.error("Tema klasörleri okunamadı:", error);
    // Hata durumunda önbelleği kullan (eğer varsa)
    return cachedThemes || [];
  }
}

/**
 * CSS HEX renk değerini koyulaştırır (veya açar)
 * @param {string} color - HEX renk değeri (#RRGGBB)
 * @param {number} percent - Koyulaştırma yüzdesi (pozitif = koyulaştır, negatif = aç)
 * @returns {string} - Yeni HEX renk değeri
 */
function darkenColor(color, percent) {
  // # işaretini kaldır
  let hex = color.replace('#', '');
  
  // HEX değerini RGB değerlerine dönüştür
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Koyulaştır veya aç
  r = Math.max(0, Math.min(255, Math.round(r - (r * (percent / 100)))));
  g = Math.max(0, Math.min(255, Math.round(g - (g * (percent / 100)))));
  b = Math.max(0, Math.min(255, Math.round(b - (b * (percent / 100)))));
  
  // RGB değerlerini HEX formatına dönüştür
  return `#${(r).toString(16).padStart(2, '0')}${(g).toString(16).padStart(2, '0')}${(b).toString(16).padStart(2, '0')}`;
}

/**
 * Kullanılabilir (aktif) temaları döndürür
 * @returns {Array} - Aktif temaların listesi
 */
export function getAvailableThemes() {
  return getAllThemes();
}

/**
 * Aktif temayı site ayarları dosyasından okur
 * @returns {string} - Aktif temanın ID'si
 */
function getStoredActiveTheme() {
  try {
    // Önce ana dizindeki ayarları kontrol et
    if (fs.existsSync(THEME_SETTINGS_PATH)) {
      const settingsContent = fs.readFileSync(THEME_SETTINGS_PATH, 'utf8');
      const settings = JSON.parse(settingsContent);
      
      // Tema gerçekten var mı kontrol et
      const themes = getAllThemes();
      const themeExists = themes.some(theme => theme.id === settings.activeTheme);
      
      if (themeExists) {
        return settings.activeTheme;
      } else {
        console.warn(`Ana dizindeki ayarlardaki tema bulunamadı: ${settings.activeTheme}, alternatif ayarlara bakılıyor`);
      }
    }
    
    // Sonra src dizinindeki ayarları kontrol et
    if (fs.existsSync(SRC_THEME_SETTINGS_PATH)) {
      const settingsContent = fs.readFileSync(SRC_THEME_SETTINGS_PATH, 'utf8');
      const settings = JSON.parse(settingsContent);
      
      // Tema gerçekten var mı kontrol et
      const themes = getAllThemes();
      const themeExists = themes.some(theme => theme.id === settings.activeTheme);
      
      if (themeExists) {
        return settings.activeTheme;
      } else {
        console.warn(`Src dizinindeki ayarlardaki tema bulunamadı: ${settings.activeTheme}, varsayılan tema kullanılacak`);
      }
    }
  } catch (error) {
    console.error("Tema ayarları okunamadı:", error);
  }
  
  // Varsayılan olarak 'hebtema' temasını kullan
  return DEFAULT_THEME;
}

/**
 * Aktif temayı döndürür.
 * Önce çerezden, sonra site ayarlarından kontrol eder.
 * Hiçbir yerde kayıt yoksa varsayılan temayı döndürür.
 * 
 * @param {Object} cookies - Astro.cookies nesnesi (opsiyonel)
 * @returns {string} - Aktif temanın ID'si
 */
export function getActiveTheme(cookies) {
  // 1. Çerezden kontrol et (tarayıcı isteği varsa)
  if (cookies) {
    const cookieTheme = cookies.get('site-theme');
    if (cookieTheme && cookieTheme.value) {
      // Bu temanın gerçekten var olduğunu kontrol et
      const themes = getAllThemes();
      if (themes.some(theme => theme.id === cookieTheme.value)) {
        return cookieTheme.value;
      }
    }
  }
  
  // 2. Kayıtlı site ayarlarından aktif temayı al
  return getStoredActiveTheme();
}

/**
 * Aktif temayı değiştirir ve kaydeder
 * @param {string} themeId - Ayarlanacak temanın ID'si
 * @returns {boolean} - İşlem başarılı mı
 */
export function setActiveTheme(themeId) {
  try {
    // Theme ID'nin geçerli olup olmadığını kontrol et
    const allThemes = getAllThemes();
    const themeExists = allThemes.some(theme => theme.id === themeId);
    
    if (!themeExists) {
      console.error(`Tema bulunamadı: ${themeId}`);
      return false;
    }
    
    // Site ayarları dosyasına kaydet
    const settings = {
      activeTheme: themeId,
      updatedAt: new Date().toISOString()
    };
    
    // Ana dizine kaydet
    fs.writeFileSync(THEME_SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf8');
    
    // src dizinine de kaydet (yedekleme amaçlı)
    fs.writeFileSync(SRC_THEME_SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf8');
    
    // Önbelleği temizle (bir sonraki getActiveThemeObject çağrısında yeniden yüklensin)
    cachedActiveTheme = null;
    
    return true;
  } catch (error) {
    console.error("Tema değiştirme hatası:", error);
    return false;
  }
}

/**
 * Belirli bir temayı getirir
 * @param {string} themeId - Temanın ID'si
 * @returns {Object|null} - Tema nesnesi veya bulunamazsa null
 */
export function getThemeById(themeId) {
  const allThemes = getAllThemes();
  return allThemes.find(theme => theme.id === themeId) || null;
}

/**
 * Aktif tema nesnesini önbellekle ve döndür
 */
let cachedActiveTheme = null;
let cachedActiveThemeId = null;

/**
 * Aktif tema nesnesini tam olarak döndürür
 * @param {Object} cookies - Astro.cookies nesnesi (opsiyonel)
 * @returns {Object} - Aktif tema nesnesi
 */
export function getActiveThemeObject(cookies) {
  const activeThemeId = getActiveTheme(cookies);
  
  // Önbellek kontrolü
  if (cachedActiveTheme && cachedActiveThemeId === activeThemeId) {
    return cachedActiveTheme;
  }
  
  const theme = getThemeById(activeThemeId);
  
  // Tema bulunamazsa varsayılan temayı döndür
  if (!theme) {
    const defaultTheme = getThemeById(DEFAULT_THEME) || getAllThemes()[0];
    
    // Önbelleğe al
    cachedActiveTheme = defaultTheme;
    cachedActiveThemeId = defaultTheme ? defaultTheme.id : null;
    
    return defaultTheme;
  }
  
  // Önbelleğe al
  cachedActiveTheme = theme;
  cachedActiveThemeId = activeThemeId;
  
  return theme;
}

/**
 * Temanın CSS dosyasının yolunu döndürür (Web URL olarak)
 * @param {string} themeId - Tema ID'si
 * @returns {string} - CSS dosyasının yolu
 */
export function getThemeCssPath(themeId) {
  const theme = getThemeById(themeId);
  if (!theme) return `/themes/${DEFAULT_THEME}/styles/global.css`;
  
  return `/themes/${theme.path}/styles/global.css`;
}

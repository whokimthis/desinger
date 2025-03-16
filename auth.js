// PostgreSQL destekli oturum yönetimi ve rol tabanlı yetkilendirme
import { init } from '../db/database.js';
import AdminUserModel from '../db/postgresql/admin-user.model.js';
import UserRoleModel from '../db/postgresql/user-role.model.js';
import crypto from 'crypto';

// Tek bir database başlatma flag'i
let dbInitialized = false;

// Veritabanını bir kez başlat
async function ensureDBInit() {
  if (!dbInitialized) {
    await init();
    dbInitialized = true;
    console.log('Veritabanı başlatıldı (auth.js)');
  }
}

// Rastgele bir token oluştur (güvenlik için)
function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Oturum kontrolü
export async function checkAdminAuth(Astro) {
  try {
    // Veritabanı başlatma
    await ensureDBInit();
    
    // Cookie'den token al
    const cookies = Astro.request.headers.get('cookie') || '';
    const tokenMatch = cookies.match(/adminToken=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    
    if (!token) {
      return { authenticated: false };
    }
    
    // Token doğrulama
    try {
      // Base64 decode
      const decoded = atob(token);
      const [username, timestamp, tokenId] = decoded.split('|');
      
      // Kullanıcı kontrol et
      const user = await AdminUserModel.getByUsername(username);
      if (!user) {
        console.log('Kullanıcı bulunamadı:', username);
        return { authenticated: false };
      }
      
      // Süre kontrolü - 24 saat
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      if (now - tokenTime > 24 * 60 * 60 * 1000) {
        console.log('Token süresi dolmuş');
        return { authenticated: false };
      }
      
      // Geçerli token
      return { 
        authenticated: true,
        user
      };
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      return { authenticated: false };
    }
  } catch (error) {
    console.error('checkAdminAuth hatası:', error);
    return { authenticated: false };
  }
}

// Token oluştur (geliştirilmiş güvenlik)
export function createAdminToken(username) {
  // Base64 encode: username|timestamp|uniqueId
  const tokenId = generateRandomToken(16); // Rastgele bir değer ekle
  const tokenData = `${username}|${Date.now()}|${tokenId}`;
  return btoa(tokenData);
}

// Login işlemi
export async function loginAdmin(username, password) {
  try {
    // Veritabanını başlat
    await ensureDBInit();
    
    // Kullanıcı adı ve şifreyi doğrula
    const user = await AdminUserModel.authenticate(username, password);
    
    if (!user) {
      return { success: false, message: 'Geçersiz kullanıcı adı veya şifre' };
    }
    
    // Token oluştur
    const token = createAdminToken(user.username);
    
    return {
      success: true,
      user,
      token
    };
  } catch (error) {
    console.error('loginAdmin hatası:', error);
    return { success: false, message: 'Giriş işlemi sırasında bir hata oluştu' };
  }
}

// Rol bazlı yetkilendirme kontrolü - izinlere dayalı
export async function checkPermission(user, requiredPermission) {
  try {
    // Admin rolü her zaman tüm yetkilere sahiptir
    if (user && user.role === 'admin') {
      return true;
    }
    
    // Kullanıcı rolünü kontrol et
    if (!user || !user.role) {
      return false;
    }
    
    // Kullanıcının rolünü al
    const role = await UserRoleModel.getByName(user.role);
    if (!role) {
      return false;
    }
    
    // Rolün izinlerini kontrol et
    let permissions = [];
    
    try {
      // String ise JSON'a çevir
      if (typeof role.permissions === 'string') {
        permissions = JSON.parse(role.permissions);
      } else if (Array.isArray(role.permissions)) {
        permissions = role.permissions;
      }
    } catch (e) {
      console.error('İzinler JSON formatından çevrilemedi:', e);
    }
    
    // İstenilen izin tekil string ise
    if (typeof requiredPermission === 'string') {
      return permissions.includes(requiredPermission);
    }
    
    // İstenilen izin bir dizi ise, herhangi biri eşleşirse true döndür
    if (Array.isArray(requiredPermission)) {
      return requiredPermission.some(perm => permissions.includes(perm));
    }
    
    return false;
  } catch (error) {
    console.error('İzin kontrolü hatası:', error);
    return false;
  }
}

// İzin tabanlı yetkisiz erişim kontrolü middleware
export function requirePermission(requiredPermission) {
  return async (Astro) => {
    try {
      const { authenticated, user } = await checkAdminAuth(Astro);
      
      // Oturum kontrolü
      if (!authenticated) {
        return Astro.redirect(`/admin/login?redirect=${Astro.url.pathname}`);
      }
      
      // İzin kontrolü
      const hasPermission = await checkPermission(user, requiredPermission);
      if (!hasPermission) {
        return Astro.redirect('/admin/unauthorized');
      }
      
      // Yetkili kullanıcı, devam et
      return;
    } catch (error) {
      console.error('Yetkilendirme hatası:', error);
      return Astro.redirect('/admin/unauthorized');
    }
  };
}

// Sadece giriş yapmış kullanıcı kontrolü
export function requireAuth() {
  return async (Astro) => {
    const { authenticated } = await checkAdminAuth(Astro);
    
    if (!authenticated) {
      return Astro.redirect(`/admin/login?redirect=${Astro.url.pathname}`);
    }
    
    return;
  };
}
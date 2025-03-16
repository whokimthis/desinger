// Session yönetimi için basit bir util

// Admin oturumları saklanacak obje
const sessions = new Map();

export const SessionManager = {
  // Yeni oturum oluştur
  createSession: (user) => {
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const session = {
      id: sessionId,
      userId: user.id,
      username: user.username,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 saat geçerli
    };
    
    sessions.set(sessionId, session);
    return session;
  },
  
  // Oturumu getir
  getSession: (sessionId) => {
    const session = sessions.get(sessionId);
    
    if (!session) {
      return null;
    }
    
    // Süresi dolmuş mu kontrol et
    if (new Date() > session.expiresAt) {
      sessions.delete(sessionId);
      return null;
    }
    
    return session;
  },
  
  // Oturumu sonlandır
  destroySession: (sessionId) => {
    sessions.delete(sessionId);
  }
};

// Admin oturumunu kontrol et (Astro middleware)
export function isAuthenticated(Astro) {
  // Cookie'den session ID'yi al
  const cookies = Astro.request.headers.get('cookie') || '';
  const sessionIdMatch = cookies.match(/adminSessionId=([^;]+)/);
  const sessionId = sessionIdMatch ? sessionIdMatch[1] : null;
  
  if (!sessionId) {
    return false;
  }
  
  // Session'ı kontrol et
  const session = SessionManager.getSession(sessionId);
  if (!session) {
    return false;
  }
  
  return true;
}

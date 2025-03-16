/**
 * Telegram Bildirim Gönderme Yardımcı Sınıfı
 * Bu sınıf, form yanıtlarını veya diğer bildirimleri Telegram'a göndermek için kullanılır.
 */
export class TelegramNotifier {
  /**
   * Telegram Notifier sınıfını başlatır
   * @param {string} botToken - Telegram bot token
   * @param {string} chatId - Mesajın gönderileceği chat ID
   */
  constructor(botToken, chatId) {
    this.botToken = botToken;
    this.chatId = chatId;
    this.apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  }
  
  /**
   * Telegram'a mesaj gönderir
   * @param {string} message - Gönderilecek mesaj
   * @param {boolean} parseMode - HTML veya Markdown formatı (varsayılan: HTML)
   * @returns {Promise<Object>} - API yanıtı
   */
  async sendMessage(message, parseMode = 'HTML') {
    try {
      // Bot token veya chat ID yoksa hata ver
      if (!this.botToken || !this.chatId) {
        console.warn('Telegram bildirimi gönderilemedi: Bot token veya chat ID tanımlanmamış.');
        return {
          ok: false,
          error: 'Bot token veya chat ID tanımlanmamış'
        };
      }
      
      // API isteği gönder
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: parseMode
        })
      });
      
      const data = await response.json();
      
      if (!data.ok) {
        console.error('Telegram API hatası:', data);
        return {
          ok: false,
          error: data.description || 'Bilinmeyen hata'
        };
      }
      
      return {
        ok: true,
        result: data.result
      };
    } catch (error) {
      console.error('Telegram bildirimi gönderilirken hata oluştu:', error);
      return {
        ok: false,
        error: error.message
      };
    }
  }
  
  /**
   * Form yanıtlarını formatlar ve Telegram'a gönderir
   * @param {Object} formData - Form verileri
   * @param {Object} responseData - Form yanıtı verileri
   * @returns {Promise<Object>} - API yanıtı
   */
  async sendFormResponse(formData, responseData) {
    try {
      // Form başlığını ve açıklamasını getir
      const formTitle = formData.title || 'Form Yanıtı';
      const formSlug = formData.slug || '';
      
      // Formun yanıtlarını insan dostu hale getir
      const fieldRows = Object.entries(responseData).map(([key, value]) => {
        // Boolean değerler için özel durum
        if (typeof value === 'boolean') {
          value = value ? '✅ Evet' : '❌ Hayır';
        }
        
        return `<b>${key}:</b> ${value}`;
      }).join('\n');
      
      // Mesajı oluştur
      const message = `
🔔 <b>YENİ FORM YANITI</b> 🔔

<b>Form:</b> ${formTitle}
<b>Tarih:</b> ${new Date().toLocaleString('tr-TR')}

${fieldRows}

<a href="https://hebele-hub.com/admin/form-responses/${formData.id}">➡️ Tüm yanıtları görüntüle</a>
`;
      
      // Mesajı gönder
      return await this.sendMessage(message);
      
    } catch (error) {
      console.error('Form yanıtı bildirimi hazırlanırken hata oluştu:', error);
      return {
        ok: false,
        error: error.message
      };
    }
  }
  
  /**
   * Site ayarlarından bir Telegram Notifier örneği oluşturur
   * @param {Object} siteSettings - Site ayarları objesi
   * @returns {TelegramNotifier} TelegramNotifier örneği veya null
   */
  static fromSiteSettings(siteSettings) {
    const botToken = siteSettings?.telegram_bot_token;
    const chatId = siteSettings?.telegram_chat_id;
    
    if (!botToken || !chatId) {
      return null;
    }
    
    return new TelegramNotifier(botToken, chatId);
  }
}

export default TelegramNotifier;
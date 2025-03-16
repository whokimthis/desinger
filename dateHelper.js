/**
 * Tarih işlemleri için yardımcı fonksiyonlar
 */

const DateHelper = {
  /**
   * Tarih ve saati formatla
   * @param {string|Date} dateString - ISO formatında tarih string veya Date objesi
   * @param {string} [format='full'] - Tarih formatı: 'full', 'date', 'time', 'short'
   * @param {string} [locale='tr-TR'] - Kullanılacak lokalizasyon
   * @returns {string} Formatlanmış tarih
   */
  format(dateString, format = 'full', locale = 'tr-TR') {
    if (!dateString) return '';

    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

      // Geçerli bir tarih mi?
      if (isNaN(date.getTime())) return '';

      switch (format) {
        case 'date':
          return date.toLocaleDateString(locale);
        case 'time':
          return date.toLocaleTimeString(locale);
        case 'short':
          return date.toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        case 'full':
        default:
          return date.toLocaleString(locale);
      }
    } catch (error) {
      console.error('Tarih formatlama hatası:', error);
      return '';
    }
  },

  /**
   * ISO tarihini input için uygun formata çevir
   * @param {string|Date} dateString - ISO formatında tarih string veya Date objesi
   * @returns {string} 'YYYY-MM-DDThh:mm' formatında tarih
   */
  formatForInput(dateString) {
    if (!dateString) return '';

    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

      // Geçerli bir tarih mi?
      if (isNaN(date.getTime())) return '';

      // Yerel saat dilimine göre formatla, UTC değil
      const year = date.getFullYear();
      // Ay 0'dan başladığı için +1 ekliyoruz ve iki basamaklı yapıyoruz
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      // 2023-12-31T23:59 formatında döndür
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Input tarih formatlama hatası:', error);
      return '';
    }
  },

  /**
   * Türkçe ay ve gün adlarıyla insancıl tarih formatla
   * @param {string|Date} dateString - ISO formatında tarih string veya Date objesi
   * @returns {string} '12 Haziran 2023, Pazartesi' formatında tarih
   */
  formatReadable(dateString) {
    if (!dateString) return '';

    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

      // Geçerli bir tarih mi?
      if (isNaN(date.getTime())) return '';

      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
      });
    } catch (error) {
      console.error('Okunabilir tarih formatlama hatası:', error);
      return '';
    }
  },

  /**
   * Tarih aralığı formatla
   * @param {string|Date} startDate - Başlangıç tarihi
   * @param {string|Date} endDate - Bitiş tarihi
   * @param {string} [format='short'] - Tarih formatı: 'full', 'date', 'time', 'short'
   * @returns {string} '10.06.2023 - 15.06.2023' formatında tarih aralığı
   */
  formatDateRange(startDate, endDate, format = 'short') {
    const start = this.format(startDate, format);
    const end = this.format(endDate, format);

    if (!start && !end) return '';
    if (!start) return `... - ${end}`;
    if (!end) return `${start} - ...`;

    return `${start} - ${end}`;
  },

  /**
   * İki tarih arasında mı kontrol et
   * @param {Date} date - Kontrol edilecek tarih
   * @param {Date|null} startDate - Başlangıç tarihi (null olabilir)
   * @param {Date|null} endDate - Bitiş tarihi (null olabilir)
   * @returns {boolean} Tarih aralıkta mı
   */
  isDateBetween(date, startDate, endDate) {
    const now = date || new Date();

    // Başlangıç kontrolü
    if (startDate && new Date(startDate) > now) {
      return false;
    }

    // Bitiş kontrolü
    if (endDate && new Date(endDate) < now) {
      return false;
    }

    return true;
  }
};

// formatDate fonksiyonu için alias (takma ad) ekle
// Böylece mevcut kodların çalışmaya devam etmesini sağlar
DateHelper.formatDate = DateHelper.format;

export default DateHelper;
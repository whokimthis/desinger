// src/utils/imageProcessor.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Yüklenen resimleri işleyip dosya sistemine kaydeden yardımcı modül
 */
const ImageProcessor = {
  /**
   * Yüklenen dosyaları işle ve kaydet
   * @param {FormData} formData - Form verileri
   * @param {Object} options - İşleme seçenekleri
   * @returns {Object} - İşlenen dosyaların URL'leri
   */
  async processUploadedImages(formData, options = {}) {
    const result = {};
    const fileFields = options.fileFields || [];
    
    // Görsel dosyaları için public klasörü altında dizin oluştur
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events');
    
    // Dizin yoksa oluştur
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Her dosya alanı için işlem yap
    for (const field of fileFields) {
      const fileField = `${field}_file`;
      const urlField = field;
      
      // Mevcut URL değeri (varsa, güncelleme durumunda)
      const existingUrl = formData.get(urlField);
      
      // Dosya var mı kontrol et
      const file = formData.get(fileField);
      
      // Dosya yoksa ve mevcut URL varsa, URL'yi koru
      if (!file && existingUrl) {
        result[urlField] = existingUrl;
        continue;
      }
      
      // Dosya yoksa veya geçerli bir dosya değilse atla
      if (!file || !(file instanceof Blob) || file.size === 0) {
        result[urlField] = existingUrl || null;
        continue;
      }
      
      try {
        // Dosya bilgilerini al
        const buffer = Buffer.from(await file.arrayBuffer());
        const originalName = file.name;
        const fileExt = path.extname(originalName).toLowerCase();
        
        // Sadece izin verilen dosya uzantılarını kabul et
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        if (!allowedExtensions.includes(fileExt)) {
          console.warn(`Desteklenmeyen dosya türü: ${fileExt}`);
          result[urlField] = existingUrl || null;
          continue;
        }
        
        // Benzersiz dosya adı oluştur
        const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 10);
        const timestamp = Date.now();
        const newFilename = `${field}_${hash}_${timestamp}${fileExt}`;
        
        // Dosyayı kaydet
        const filePath = path.join(uploadDir, newFilename);
        await fs.promises.writeFile(filePath, buffer);
        
        // URL'yi oluştur
        const fileUrl = `/uploads/events/${newFilename}`;
        result[urlField] = fileUrl;
        
      } catch (error) {
        console.error(`Dosya işleme hatası (${field}):`, error);
        result[urlField] = existingUrl || null;
      }
    }
    
    return result;
  }
};

export default ImageProcessor;

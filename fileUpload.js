import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dosya yükleme klasörü
const UPLOAD_DIR = path.join(dirname(__dirname), '../public/uploads');

// Klasörün varlığını kontrol et ve oluştur
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const FileUpload = {
  /**
   * Dosyayı yükle ve dosya yolunu döndür
   * @param {Buffer} fileBuffer Dosya buffer'ı
   * @param {string} fileName Dosya adı
   * @param {string} fileType Dosya MIME tipi
   * @returns {string} Yüklenen dosyanın yolu
   */
  saveFile: (fileBuffer, fileName, fileType) => {
    // Dosya adını güvenli hale getir
    const fileExtension = path.extname(fileName).toLowerCase();
    const safeFileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, safeFileName);
    
    // Dosya içeriğini kaydet
    fs.writeFileSync(filePath, fileBuffer);
    
    // Web tarafından erişilebilecek yolu döndür
    return `/uploads/${safeFileName}`;
  },
  
  /**
   * Belirtilen dosyayı sil
   * @param {string} filePath Silinecek dosyanın yolu (/uploads/... formatında)
   * @returns {boolean} Başarı durumu
   */
  deleteFile: (filePath) => {
    try {
      if (!filePath || !filePath.startsWith('/uploads/')) {
        return false;
      }
      
      const fileName = path.basename(filePath);
      const fullPath = path.join(UPLOAD_DIR, fileName);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Dosya silme hatası:', error);
      return false;
    }
  }
};

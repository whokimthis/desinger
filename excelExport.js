import ExcelJS from 'exceljs';

export class ExcelExport {
  /**
   * JSON verilerini Excel dosyasına dönüştürür
   * @param {Array} data - Excel'e dönüştürülecek veri dizisi
   * @param {string} worksheetName - Excel çalışma sayfası adı
   * @param {Object} options - Ek seçenekler
   * @returns {Buffer} Excel dosyası buffer'ı
   */
  static async jsonToExcel(data, worksheetName = 'Veri', options = {}) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Geçerli veri sağlanmadı');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(worksheetName);

    // Sütun başlıklarını belirle
    const columns = Object.keys(data[0]).map(key => ({
      header: this.formatColumnHeader(key),
      key: key,
      width: 20 // Varsayılan genişlik
    }));
    worksheet.columns = columns;

    // Verileri ekle
    worksheet.addRows(data);

    // Başlık satırını biçimlendir
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Sütun genişliklerini otomatik ayarla
    if (options.autoWidth !== false) { // Varsayılan olarak otomatik genişliği etkinleştir
      worksheet.columns.forEach(column => {
        let maxLength = column.header ? column.header.length : 10;
        worksheet.getColumn(column.key).eachCell((cell, rowIndex) => {
          if (rowIndex > 1) { // Başlığı atla
            const cellLength = cell.value ? cell.value.toString().length : 0;
            if (cellLength > maxLength) {
              maxLength = cellLength;
            }
          }
        });
        column.width = Math.min(maxLength + 2, 50); // Maksimum 50 genişlik
      });
    }

    // Tüm satırları biçimlendir
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Başlık satırı dışındaki satırlar için
        if (rowNumber > 1) {
          cell.alignment = { vertical: 'middle' };
        }
      });
    });

    // Excel buffer'ını oluştur
    console.log("Excel dosyası oluşturuluyor...");
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      console.log("Excel buffer boyutu:", buffer.byteLength);
      return buffer;
    } catch (error) {
      console.error("Excel buffer oluşturma hatası:", error);
      throw error;
    }
  }

  /**
   * Sütun anahtarını kullanıcı dostu başlığa dönüştürür
   * @param {string} key - Sütun anahtarı
   * @returns {string} Formatlanmış başlık
   */
  static formatColumnHeader(key) {
    // Özel durumları kontrol et
    if (key === 'id') return 'ID';
    if (key === 'created_at') return 'Oluşturma Tarihi';
    if (key === 'ip_address') return 'IP Adresi';
    
    // Genel dönüşüm
    return key
      .replace(/_/g, ' ') // Alt çizgileri boşluğa dönüştür
      .replace(/([A-Z])/g, ' $1') // camelCase'i boşluklarla ayır
      .replace(/^./, str => str.toUpperCase()) // İlk harfi büyük yap
      .trim();
  }

  /**
   * Belirtilen formun yanıtlarını Excel formatına dönüştürür
   * @param {Array} responses - Form yanıtları
   * @param {Object} formData - Form bilgileri
   * @returns {Buffer} Excel dosyası buffer'ı
   */
  static async exportFormResponses(responses, formData) {
    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      throw new Error('Excel\'e aktarılacak yanıt bulunamadı');
    }
    
    // Bu form için özel başlık eşleştirmeleri
    const customHeaders = {};
    
    if (formData && formData.form_config) {
      const config = typeof formData.form_config === 'string' ? 
        JSON.parse(formData.form_config) : formData.form_config;
      
      // Form yapılandırmasından alan adları ve etiketleri al
      if (config.fields && Array.isArray(config.fields)) {
        config.fields.forEach(field => {
          if (field.name && field.label) {
            customHeaders[field.name] = field.label;
          }
        });
      }
    }
    
    // Kullanıcı dostu başlıkları oluştur
    const formattedData = responses.map(item => {
      const result = {};
      
      // Önce sabit alanları ekle
      if (item.id) {
        result['ID'] = item.id;
      }
      if (item.created_at) {
        const date = new Date(item.created_at);
        result['Oluşturma Tarihi'] = date.toLocaleString('tr-TR');
      }
      if (item.ip_address) {
        result['IP Adresi'] = item.ip_address;
      }
      
      // Şimdi yanıt verilerini ekle
      Object.keys(item).forEach(key => {
        if (key !== 'id' && key !== 'created_at' && key !== 'ip_address') {
          // Özel başlık varsa kullan, yoksa varsayılan biçimlendirme
          const header = customHeaders[key] || this.formatColumnHeader(key);
          result[header] = item[key];
        }
      });
      
      return result;
    });
    
    const titlePrefix = formData?.title || 'Form';
    return await this.jsonToExcel(
      formattedData, 
      `${titlePrefix} Yanıtları`, 
      { autoWidth: true }
    );
  }
}
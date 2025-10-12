/* eslint-disable @typescript-eslint/no-require-imports */
// Диагностическая функция для проверки imageService
export function diagnoseImageService() {
  console.log('🔍 Диагностика imageService...');
  
  // Проверяем localStorage
  console.log('📦 Содержимое localStorage:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('image_')) {
      const value = localStorage.getItem(key);
      console.log(`  ${key}: ${value ? 'данные найдены' : 'данные пусты'}`);
    }
  }
  
  // Проверяем CMS категории
  console.log('📂 Проверка категорий CMS:');
  try {
    const { cms } = require('../lib/cms');
    const categories = cms.getCategories();
    categories.forEach(cat => {
      console.log(`  Категория ${cat.name}: изображение = ${cat.image}`);
      if (cat.image) {
        const { imageService } = require('../lib/imageService');
        const url = imageService.getImageUrl(cat.image);
        console.log(`    URL: ${url}`);
      }
    });
  } catch (error) {
    console.log('❌ Ошибка при проверке CMS:', error);
  }
  
  // Проверяем поддержку браузера
  console.log('🌐 Проверка поддержки браузера:');
  console.log(`  localStorage: ${typeof Storage !== 'undefined' ? '✅' : '❌'}`);
  console.log(`  FileReader: ${typeof FileReader !== 'undefined' ? '✅' : '❌'}`);
  console.log(`  Canvas: ${typeof HTMLCanvasElement !== 'undefined' ? '✅' : '❌'}`);
  
  return true;
}

// Экспортируем для использования в браузере
if (typeof window !== 'undefined') {
  window.diagnoseImageService = diagnoseImageService;
}
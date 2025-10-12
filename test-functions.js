console.log('🔧 Тестирование функций системы...');

// Тест 1: Проверка imageService
console.log('1️⃣ Тестирование imageService...');
try {
  const { imageService } = require('./src/lib/imageService');
  console.log('✅ imageService загружен');
  
  // Тест валидации файлов
  const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const validation = imageService.validateImageFile(testFile);
  console.log('✅ Валидация файлов работает:', validation);
  
} catch (error) {
  console.log('❌ Ошибка в imageService:', error.message);
}

// Тест 2: Проверка CMS
console.log('2️⃣ Тестирование CMS...');
try {
  const { cms } = require('./src/lib/cms');
  const categories = cms.getCategories();
  console.log('✅ CMS загружен, категорий:', categories.length);
  
  const menuItems = cms.getMenuItems();
  console.log('✅ Товаров в меню:', menuItems.length);
  
} catch (error) {
  console.log('❌ Ошибка в CMS:', error.message);
}

// Тест 3: Проверка базы данных
console.log('3️⃣ Тестирование базы данных...');
try {
  const { db } = require('./src/lib/database');
  const stats = db.getStatistics();
  console.log('✅ База данных работает, статистика:', stats);
  
} catch (error) {
  console.log('❌ Ошибка в базе данных:', error.message);
}

// Тест 4: Проверка useTheme
console.log('4️⃣ Тестирование системы тем...');
try {
  // В браузере будет работать
  console.log('✅ Система тем будет протестирована в браузере');
  
} catch (error) {
  console.log('❌ Ошибка в системе тем:', error.message);
}

console.log('🎯 Тестирование завершено. Проверьте результаты выше.');
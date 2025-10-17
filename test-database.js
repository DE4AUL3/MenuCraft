// Скрипт для тестирования PostgreSQL API
const API_BASE = 'http://localhost:3000/api/test-db';

// Тестовые данные
const testCategory = {
  nameRu: 'Основные блюда',
  nameTk: 'Esasy aşlar',
  descriptionRu: 'Вкусные основные блюда нашего ресторана',
  descriptionTk: 'Restoranymyzyň tagamly esasy aşlary',
  imageCard: '/images/categories/main-dishes.jpg',
  imageBackground: '/images/backgrounds/main-bg.jpg',
  order: 1,
  status: true
};

const testMeal = {
  nameRu: 'Плов с бараниной',
  nameTk: 'Goýun etli palaw',
  categoryId: '', // Заполним после создания категории
  price: 25.50,
  descriptionRu: 'Традиционный узбекский плов с сочной бараниной',
  descriptionTk: 'Şireli goýun etli däp bişirilen özbekiň däp palowy',
  image: '/images/meals/plov.jpg'
};

const testOrder = {
  phoneNumber: '+99365123456',
  products: [
    {
      id: '', // Заполним после создания блюда
      amount: 2
    }
  ]
};

async function testAPI() {
  console.log('🚀 Начинаем тестирование PostgreSQL API...\n');

  try {
    // 1. Тестируем создание категории
    console.log('1️⃣ Создаем категорию...');
    const categoryResponse = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCategory)
    });

    if (!categoryResponse.ok) {
      throw new Error(`Ошибка создания категории: ${categoryResponse.status}`);
    }

    const categoryResult = await categoryResponse.json();
    console.log('✅ Категория создана:', categoryResult.data);
    const categoryId = categoryResult.data.id;

    // 2. Тестируем получение категорий
    console.log('\n2️⃣ Получаем список категорий...');
    const categoriesResponse = await fetch(`${API_BASE}/categories`);
    const categoriesResult = await categoriesResponse.json();
    console.log('✅ Категории получены:', categoriesResult.data.length, 'шт.');

    // 3. Тестируем создание блюда
    console.log('\n3️⃣ Создаем блюдо...');
    testMeal.categoryId = categoryId;
    const mealResponse = await fetch(`${API_BASE}/meals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMeal)
    });

    if (!mealResponse.ok) {
      throw new Error(`Ошибка создания блюда: ${mealResponse.status}`);
    }

    const mealResult = await mealResponse.json();
    console.log('✅ Блюдо создано:', mealResult.data);
    const mealId = mealResult.data.id;

    // 4. Тестируем получение блюд
    console.log('\n4️⃣ Получаем список блюд...');
    const mealsResponse = await fetch(`${API_BASE}/meals`);
    const mealsResult = await mealsResponse.json();
    console.log('✅ Блюда получены:', mealsResult.data.length, 'шт.');

    // 5. Тестируем создание заказа
    console.log('\n5️⃣ Создаем заказ...');
    testOrder.products[0].id = mealId;
    const orderResponse = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder)
    });

    if (!orderResponse.ok) {
      throw new Error(`Ошибка создания заказа: ${orderResponse.status}`);
    }

    const orderResult = await orderResponse.json();
    console.log('✅ Заказ создан:', orderResult.data);

    // 6. Тестируем получение заказов
    console.log('\n6️⃣ Получаем список заказов...');
    const ordersResponse = await fetch(`${API_BASE}/orders`);
    const ordersResult = await ordersResponse.json();
    console.log('✅ Заказы получены:', ordersResult.data.length, 'шт.');

    console.log('\n🎉 Все тесты прошли успешно! PostgreSQL API работает корректно.');

  } catch (error) {
    console.error('❌ Ошибка во время тестирования:', error.message);
  }
}

// Запускаем тесты при вызове скрипта
if (typeof window !== 'undefined') {
  // Браузер
  window.testAPI = testAPI;
  console.log('Функция testAPI() доступна в консоли браузера');
} else {
  // Node.js
  testAPI();
}
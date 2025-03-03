// Скрипт для генерации заглушек изображений
// Создает SVG-файлы для тестирования

const fs = require('fs');
const path = require('path');

// Функция для создания SVG изображения
function createSVG(text, color) {
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="600" fill="${color}" />
    <text x="400" y="300" font-family="Arial" font-size="36" text-anchor="middle" fill="white">${text}</text>
  </svg>`;
}

// Создает изображение и сохраняет его
function createImage(filePath, text, color) {
  // Меняем расширение с jpg на svg
  filePath = filePath.replace('.jpg', '.svg');
  
  // Создаем директорию, если она не существует
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Создаем SVG и сохраняем его напрямую как файл
  const svg = createSVG(text, color);
  fs.writeFileSync(filePath, svg);
  
  console.log(`Создана заглушка: ${filePath}`);
}

// Основная функция
function main() {
  const publicDir = path.join(__dirname, '../public');
  
  // Категории
  const categories = [
    { name: 'rolls', color: '#e74c3c', text: 'Роллы' },
    { name: 'sushi', color: '#3498db', text: 'Суши' },
    { name: 'sets', color: '#9b59b6', text: 'Сеты' },
    { name: 'drinks', color: '#2ecc71', text: 'Напитки' }
  ];
  
  categories.forEach(cat => {
    createImage(
      path.join(publicDir, `images/categories/${cat.name}.jpg`),
      cat.text,
      cat.color
    );
  });
  
  // Продукты
  const products = [
    { name: 'philadelphia', color: '#f39c12', text: 'Филадельфия' },
    { name: 'philadelphia-set', color: '#d35400', text: 'Набор Филадельфия' },
    { name: 'california', color: '#c0392b', text: 'Калифорния' },
    { name: 'salmon', color: '#e67e22', text: 'Лосось' }
  ];
  
  products.forEach(prod => {
    createImage(
      path.join(publicDir, `images/products/${prod.name}.jpg`),
      prod.text,
      prod.color
    );
  });
  
  // Акции
  const promotions = [
    { name: 'first-order', color: '#16a085', text: 'Первый заказ' },
    { name: 'sets-promo', color: '#27ae60', text: 'Акция на сеты' }
  ];
  
  promotions.forEach(promo => {
    createImage(
      path.join(publicDir, `images/promotions/${promo.name}.jpg`),
      promo.text,
      promo.color
    );
  });
  
  // Общие изображения
  const common = [
    { name: 'default-product', color: '#7f8c8d', text: 'Товар' },
    { name: 'promo-1', color: '#2980b9', text: 'Акция 1' },
    { name: 'promo-2', color: '#8e44ad', text: 'Акция 2' }
  ];
  
  common.forEach(item => {
    createImage(
      path.join(publicDir, `images/${item.name}.jpg`),
      item.text,
      item.color
    );
  });
  
  console.log('Заглушки изображений созданы успешно!');
}

main(); 
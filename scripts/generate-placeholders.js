// Скрипт для генерации заглушек изображений
// Создает SVG-файлы для тестирования

const fs = require('fs');
const path = require('path');

// Функция для создания директории, если она не существует
function ensureDirExists(dirPath) {
  const fullPath = path.resolve(process.cwd(), dirPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Функция для создания заглушки изображения
function createPlaceholder(filePath, text) {
  const fullPath = path.resolve(process.cwd(), filePath);
  
  // Проверяем, существует ли файл
  if (fs.existsSync(fullPath)) {
    console.log(`File already exists: ${filePath}`);
    return;
  }
  
  // Создаем простой SVG как заглушку
  const svgContent = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f0f0f0"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="#666">${text}</text>
</svg>`;
  
  fs.writeFileSync(fullPath, svgContent);
  console.log(`Created placeholder: ${filePath}`);
}

// Создаем необходимые директории
ensureDirExists('public/images');
ensureDirExists('public/images/categories');
ensureDirExists('public/images/products');
ensureDirExists('public/images/products/rolls');
ensureDirExists('public/images/products/sushi');
ensureDirExists('public/images/products/sets');
ensureDirExists('public/images/products/drinks');
ensureDirExists('public/images/promotions');

// Создаем заглушки для категорий
const categories = ['rolls', 'sushi', 'sets', 'drinks'];
categories.forEach(category => {
  createPlaceholder(`public/images/categories/category-${category}.jpg`, `${category.toUpperCase()}`);
});

// Создаем заглушки для продуктов
const products = {
  rolls: ['philadelphia', 'california', 'dragon', 'spicy-salmon'],
  sushi: ['nigiri-salmon', 'nigiri-tuna', 'nigiri-shrimp'],
  sets: ['philadelphia-set', 'california-set', 'assorted-set'],
  drinks: ['green-tea', 'cola', 'sprite']
};

Object.entries(products).forEach(([category, items]) => {
  items.forEach(item => {
    createPlaceholder(`public/images/products/${category}/${item}.jpg`, item);
  });
});

// Создаем заглушки для акций
const promotions = ['promo-first-order', 'promo-free-delivery', 'promo-birthday'];
promotions.forEach(promo => {
  createPlaceholder(`public/images/promotions/${promo}.jpg`, promo);
});

// Создаем дефолтные заглушки
createPlaceholder('public/images/default-product.jpg', 'Product');
createPlaceholder('public/images/category-default.jpg', 'Category');

console.log('All placeholder images created successfully!'); 
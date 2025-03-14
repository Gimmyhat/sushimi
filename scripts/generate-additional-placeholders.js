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
ensureDirExists('public/images/products/rolls');
ensureDirExists('public/images/products/sushi');
ensureDirExists('public/images/products/sets');
ensureDirExists('public/images/products/drinks');

// Создаем заглушки для продуктов по ID
const productIds = {
  rolls: ['roll-001', 'roll-002', 'roll-003', 'roll-004', 'roll-005', 'roll-default'],
  sushi: ['sushi-001', 'sushi-002', 'sushi-003', 'sushi-004', 'sushi-default'],
  sets: ['set-001', 'set-002', 'set-003', 'set-default'],
  drinks: ['drink-001', 'drink-002', 'drink-003', 'drink-default']
};

Object.entries(productIds).forEach(([category, items]) => {
  items.forEach(item => {
    createPlaceholder(`public/images/products/${category}/${item}.jpg`, item);
  });
});

console.log('All additional placeholder images created successfully!'); 
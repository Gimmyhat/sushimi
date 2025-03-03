/**
 * Утилиты для работы с изображениями
 */

/**
 * Преобразует путь к изображению в локальный URL
 */
export function getLocalImageUrl(path: string): string {
  // Если URL уже полный (начинается с http или https), возвращаем его без изменений
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }
  
  // Если путь не указан, возвращаем путь к изображению по умолчанию
  if (!path) {
    return '/images/default-product.jpg';
  }
  
  // Если путь не начинается с "/", добавляем его
  if (!path.startsWith('/')) {
    return `/${path}`;
  }
  
  // Иначе возвращаем путь без изменений
  return path;
} 
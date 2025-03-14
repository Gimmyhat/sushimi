/**
 * Скрипт для остановки проекта локально
 * Останавливает базу данных
 */

const { execSync } = require('child_process');

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  fg: {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
  }
};

// Функция для логирования с цветом
function log(message, color = colors.fg.white) {
  console.log(`${color}${message}${colors.reset}`);
}

// Функция для проверки, запущен ли контейнер с базой данных
function isPostgresRunning() {
  try {
    const output = execSync('docker ps --filter "name=sushi_db" --format "{{.Names}}"').toString().trim();
    return output === 'sushi_db';
  } catch (error) {
    return false;
  }
}

// Функция для остановки базы данных
function stopDatabase() {
  log('Проверка статуса базы данных...', colors.fg.cyan);
  
  if (isPostgresRunning()) {
    log('Остановка базы данных PostgreSQL...', colors.fg.yellow);
    try {
      execSync('docker-compose down', { stdio: 'inherit' });
      log('База данных PostgreSQL успешно остановлена.', colors.fg.green);
    } catch (error) {
      log(`Ошибка при остановке базы данных: ${error.message}`, colors.fg.red);
      process.exit(1);
    }
  } else {
    log('База данных PostgreSQL уже остановлена.', colors.fg.green);
  }
}

// Основная функция
function main() {
  log('\n=== ОСТАНОВКА ПРОЕКТА SUSHIMI ===\n', colors.fg.magenta + colors.bright);
  
  stopDatabase();
  
  log('\nПроект успешно остановлен.', colors.fg.green);
}

// Запуск скрипта
main(); 
/**
 * Скрипт для запуска проекта локально
 * Запускает базу данных, инициализирует её и запускает приложение
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

// Функция для логирования с цветом
function log(message, color = colors.fg.white) {
  console.log(`${color}${message}${colors.reset}`);
}

// Функция для проверки, запущен ли Docker
function isDockerRunning() {
  try {
    execSync('docker info', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
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

// Функция для запуска базы данных
function startDatabase() {
  log('Проверка статуса Docker...', colors.fg.cyan);
  
  if (!isDockerRunning()) {
    log('Docker не запущен. Пожалуйста, запустите Docker и попробуйте снова.', colors.fg.red);
    process.exit(1);
  }
  
  log('Docker запущен.', colors.fg.green);
  
  if (isPostgresRunning()) {
    log('База данных PostgreSQL уже запущена.', colors.fg.green);
  } else {
    log('Запуск базы данных PostgreSQL...', colors.fg.cyan);
    try {
      execSync('docker-compose up -d', { stdio: 'inherit' });
      log('База данных PostgreSQL успешно запущена.', colors.fg.green);
    } catch (error) {
      log(`Ошибка при запуске базы данных: ${error.message}`, colors.fg.red);
      process.exit(1);
    }
  }
}

// Функция для ожидания запуска базы данных
async function waitForDatabase() {
  log('Ожидание запуска базы данных...', colors.fg.cyan);
  
  // Максимальное количество попыток
  const maxRetries = 10;
  // Интервал между попытками в миллисекундах
  const retryInterval = 2000;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      log(`Попытка подключения к базе данных (${attempt}/${maxRetries})...`, colors.fg.yellow);
      // Проверяем доступность базы данных
      execSync('docker exec sushi_db pg_isready -U postgres', { stdio: 'pipe' });
      log('База данных готова к подключению!', colors.fg.green);
      return true;
    } catch (error) {
      if (attempt < maxRetries) {
        log(`База данных еще не готова, ожидание ${retryInterval/1000} секунд...`, colors.fg.yellow);
        // Ждем перед следующей попыткой
        await new Promise(resolve => setTimeout(resolve, retryInterval));
      } else {
        log('Превышено максимальное количество попыток подключения к базе данных.', colors.fg.red);
        return false;
      }
    }
  }
  
  return false;
}

// Функция для инициализации базы данных
async function initDatabase() {
  log('Инициализация базы данных...', colors.fg.cyan);
  
  // Ждем, пока база данных будет готова
  const isDatabaseReady = await waitForDatabase();
  if (!isDatabaseReady) {
    log('База данных не готова, пропуск инициализации.', colors.fg.red);
    process.exit(1);
  }
  
  try {
    execSync('node scripts/manual-db-init.js', { stdio: 'inherit' });
    log('База данных успешно инициализирована.', colors.fg.green);
  } catch (error) {
    log(`Ошибка при инициализации базы данных: ${error.message}`, colors.fg.red);
    process.exit(1);
  }
}

// Функция для запуска приложения
function startApp() {
  log('Запуск приложения...', colors.fg.cyan);
  
  const nextProcess = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit',
    shell: true
  });
  
  nextProcess.on('error', (error) => {
    log(`Ошибка при запуске приложения: ${error.message}`, colors.fg.red);
    process.exit(1);
  });
  
  // Обработка сигналов завершения
  process.on('SIGINT', () => {
    log('\nЗавершение работы приложения...', colors.fg.yellow);
    nextProcess.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('\nЗавершение работы приложения...', colors.fg.yellow);
    nextProcess.kill('SIGTERM');
    process.exit(0);
  });
}

// Функция для остановки всех процессов перед запуском
function stopAllProcesses() {
  log('Остановка всех процессов перед запуском...', colors.fg.cyan);
  try {
    execSync('node scripts/local/stop.js', { stdio: 'inherit' });
  } catch (error) {
    log(`Предупреждение: не удалось остановить все процессы: ${error.message}`, colors.fg.yellow);
    // Продолжаем выполнение, даже если не удалось остановить процессы
  }
}

// Основная функция
async function main() {
  log('\n=== ЗАПУСК ПРОЕКТА SUSHIMI ===\n', colors.fg.magenta + colors.bright);
  
  // Сначала останавливаем все процессы
  stopAllProcesses();
  
  startDatabase();
  await initDatabase();
  startApp();
}

// Запуск скрипта
main().catch(error => {
  log(`Критическая ошибка: ${error.message}`, colors.fg.red);
  process.exit(1);
}); 
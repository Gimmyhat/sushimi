/**
 * Скрипт для остановки проекта локально
 * Останавливает базу данных и процесс Next.js
 */

const { execSync, exec } = require('child_process');
const os = require('os');

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

// Функция для остановки процесса Next.js
function stopNextJs() {
  log('Проверка и остановка процесса Next.js...', colors.fg.cyan);
  
  try {
    // Команды для разных ОС
    let command;
    if (os.platform() === 'win32') {
      // Windows - PowerShell
      command = 'Get-NetTCPConnection -LocalPort 3000 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }';
      try {
        execSync(command, { stdio: 'pipe', shell: 'powershell.exe' });
        log('Процесс Next.js на порту 3000 остановлен.', colors.fg.green);
      } catch (error) {
        // Пробуем альтернативный метод с taskkill
        try {
          execSync('netstat -ano | findstr :3000 | findstr LISTENING > temp.txt', { stdio: 'pipe', shell: true });
          const data = execSync('type temp.txt', { stdio: 'pipe', shell: true }).toString();
          execSync('del temp.txt', { stdio: 'pipe', shell: true });
          
          if (data) {
            const lines = data.split('\n');
            if (lines.length > 0) {
              const parts = lines[0].trim().split(/\s+/);
              if (parts.length >= 5) {
                const pid = parts[4];
                execSync(`taskkill /F /PID ${pid}`, { stdio: 'pipe', shell: true });
                log('Процесс Next.js на порту 3000 остановлен (альтернативный метод).', colors.fg.green);
              }
            }
          }
        } catch (taskKillError) {
          // Проверяем порт 3001
          command = 'Get-NetTCPConnection -LocalPort 3001 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }';
          try {
            execSync(command, { stdio: 'pipe', shell: 'powershell.exe' });
            log('Процесс Next.js на порту 3001 остановлен.', colors.fg.green);
          } catch (innerError) {
            // Пробуем альтернативный метод с taskkill для порта 3001
            try {
              execSync('netstat -ano | findstr :3001 | findstr LISTENING > temp.txt', { stdio: 'pipe', shell: true });
              const data = execSync('type temp.txt', { stdio: 'pipe', shell: true }).toString();
              execSync('del temp.txt', { stdio: 'pipe', shell: true });
              
              if (data) {
                const lines = data.split('\n');
                if (lines.length > 0) {
                  const parts = lines[0].trim().split(/\s+/);
                  if (parts.length >= 5) {
                    const pid = parts[4];
                    execSync(`taskkill /F /PID ${pid}`, { stdio: 'pipe', shell: true });
                    log('Процесс Next.js на порту 3001 остановлен (альтернативный метод).', colors.fg.green);
                  }
                }
              }
            } catch (finalError) {
              log('Процесс Next.js не найден или уже остановлен.', colors.fg.yellow);
            }
          }
        }
      }
    } else {
      // Linux/Mac
      command = "lsof -i :3000 -t | xargs -r kill -9";
      try {
        execSync(command, { stdio: 'pipe' });
        log('Процесс Next.js на порту 3000 остановлен.', colors.fg.green);
      } catch (error) {
        // Проверяем порт 3001
        command = "lsof -i :3001 -t | xargs -r kill -9";
        try {
          execSync(command, { stdio: 'pipe' });
          log('Процесс Next.js на порту 3001 остановлен.', colors.fg.green);
        } catch (innerError) {
          log('Процесс Next.js не найден или уже остановлен.', colors.fg.yellow);
        }
      }
    }
  } catch (error) {
    log(`Ошибка при остановке процесса Next.js: ${error.message}`, colors.fg.red);
  }
}

// Основная функция
function main() {
  log('\n=== ОСТАНОВКА ПРОЕКТА SUSHIMI ===\n', colors.fg.magenta + colors.bright);
  
  stopNextJs();
  stopDatabase();
  
  log('\nПроект успешно остановлен.', colors.fg.green);
}

// Запуск скрипта
main(); 
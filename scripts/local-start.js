const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Функция для проверки, запущен ли Docker
async function isDockerRunning() {
  return new Promise((resolve) => {
    exec('docker info', (error) => {
      resolve(!error);
    });
  });
}

// Функция для проверки, запущен ли контейнер
async function isContainerRunning(containerName) {
  return new Promise((resolve) => {
    exec(`docker ps --filter "name=${containerName}" --format "{{.Names}}"`, (error, stdout) => {
      resolve(stdout.trim() === containerName);
    });
  });
}

// Функция для генерации заглушек изображений
async function generateImagePlaceholders() {
  console.log('Генерация заглушек изображений...');
  try {
    // Проверяем наличие скриптов
    const placeholderScript = path.join(__dirname, 'generate-placeholders.js');
    const additionalPlaceholderScript = path.join(__dirname, 'generate-additional-placeholders.js');
    
    if (fs.existsSync(placeholderScript)) {
      await new Promise((resolve) => {
        exec(`node ${placeholderScript}`, (error) => {
          if (error) {
            console.error('Ошибка при генерации основных заглушек:', error);
          } else {
            console.log('Основные заглушки изображений созданы');
          }
          resolve();
        });
      });
    }
    
    if (fs.existsSync(additionalPlaceholderScript)) {
      await new Promise((resolve) => {
        exec(`node ${additionalPlaceholderScript}`, (error) => {
          if (error) {
            console.error('Ошибка при генерации дополнительных заглушек:', error);
          } else {
            console.log('Дополнительные заглушки изображений созданы');
          }
          resolve();
        });
      });
    }
  } catch (error) {
    console.error('Ошибка при генерации заглушек изображений:', error);
  }
}

// Основная функция запуска
async function startLocal() {
  try {
    // Проверяем, запущен ли Docker
    const dockerRunning = await isDockerRunning();
    if (!dockerRunning) {
      console.error('Docker не запущен. Пожалуйста, запустите Docker и попробуйте снова.');
      process.exit(1);
    }

    // Генерируем заглушки изображений
    await generateImagePlaceholders();

    // Проверяем, запущен ли контейнер с PostgreSQL
    const postgresRunning = await isContainerRunning('sushimi-postgres');
    
    // Если контейнер не запущен, запускаем его
    if (!postgresRunning) {
      console.log('Запуск контейнера PostgreSQL...');
      
      // Запускаем контейнер
      const dockerProcess = spawn('docker', [
        'run',
        '--name', 'sushimi-postgres',
        '-e', 'POSTGRES_PASSWORD=postgres',
        '-e', 'POSTGRES_USER=postgres',
        '-e', 'POSTGRES_DB=sushimi',
        '-p', '5432:5432',
        '-d',
        'postgres:15'
      ], { stdio: 'inherit' });
      
      // Ждем завершения запуска контейнера
      await new Promise((resolve, reject) => {
        dockerProcess.on('close', (code) => {
          if (code === 0) {
            console.log('Контейнер PostgreSQL успешно запущен');
            resolve();
          } else {
            reject(new Error(`Ошибка запуска контейнера PostgreSQL, код: ${code}`));
          }
        });
      });
      
      // Ждем 3 секунды, чтобы PostgreSQL успел запуститься
      console.log('Ожидание запуска PostgreSQL...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log('Контейнер PostgreSQL уже запущен');
    }
    
    // Инициализируем базу данных
    console.log('Инициализация базы данных...');
    const dbInitProcess = spawn('node', [path.join(__dirname, 'manual-db-init.js')], { stdio: 'inherit' });
    
    await new Promise((resolve, reject) => {
      dbInitProcess.on('close', (code) => {
        if (code === 0) {
          console.log('База данных успешно инициализирована');
          resolve();
        } else {
          reject(new Error(`Ошибка инициализации базы данных, код: ${code}`));
        }
      });
    });
    
    // Запускаем Next.js приложение
    console.log('Запуск Next.js приложения...');
    const nextProcess = spawn('npm', ['run', 'dev'], { stdio: 'inherit' });
    
    // Обрабатываем завершение процесса Next.js
    nextProcess.on('close', (code) => {
      console.log(`Next.js приложение завершило работу с кодом: ${code}`);
      process.exit(code);
    });
    
    // Обрабатываем сигналы завершения
    process.on('SIGINT', () => {
      console.log('Получен сигнал SIGINT, завершение работы...');
      nextProcess.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      console.log('Получен сигнал SIGTERM, завершение работы...');
      nextProcess.kill('SIGTERM');
    });
    
  } catch (error) {
    console.error('Ошибка при запуске:', error);
    process.exit(1);
  }
}

// Запускаем
startLocal(); 
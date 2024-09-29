// app.js
const express = require('express');
const path = require('path');
const { PORT } = require('./config/env');
const botRoutes = require('./routes/botRoutes');
const bot = require('./bot/bot');
const { updateWebAppUrl } = require('./bot/bot');
const { fetchNgrokUrl } = require('./config/ngrok');

// Подключение переменных окружения
require('dotenv').config();

const app = express();
const isDevelopment = process.env.USE_NGROK === 'true';

// Подключение статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Настройка Pug для шаблонизатора
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Основной маршрут
app.get('/', (req, res) => {
  res.render('index', { title: 'Telegram Web App', message: 'Добро пожаловать!!!' });
});

// Подключение роутов бота
app.use('/api', botRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Express веб-сервер запущен на порту ${PORT}...`);

  // Если в режиме разработки, получаем URL ngrok и обновляем Web App URL в Telegram
  if (isDevelopment) {
    fetchNgrokUrl()
      .then((url) => {
        console.log(`ngrok туннель установлен на: ${url}`);

        // Обновляем URL Web App в Telegram
        updateWebAppUrl(url);
      })
      .catch((error) => {
        console.error('Ошибка при получении URL туннеля ngrok:', error);
      });
  }
});

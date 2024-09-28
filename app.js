require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

// Настройка Pug для шаблонизатора
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Подключение статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Пример маршрута
app.get('/', (req, res) => {
  res.render('index', { title: 'Telegram Web App', message: 'Добро пожаловать!!!' });
});

// Функция для получения URL ngrok туннеля
function fetchNgrokUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:4040/api/tunnels', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const tunnels = JSON.parse(data);
          if (tunnels.tunnels && tunnels.tunnels.length > 0) {
            resolve(tunnels.tunnels[0].public_url);
          } else {
            reject('No tunnels found');
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Функция для обновления Web App URL в меню Telegram
async function updateWebAppUrl(newUrl) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  try {
    const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/setChatMenuButton`, {
      menu_button: {
        type: 'web_app',
        text: 'Открыть приложение',  // Текст кнопки
        web_app: {
          url: newUrl  // URL Web App
        }
      }
    });
    console.log('Web App URL успешно обновлен в Telegram:', response.data);
  } catch (error) {
    console.error('Ошибка при обновлении Web App URL в Telegram:', error);
  }
}

// Инициализация Telegram Bot
const TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Это ваш Telegram бот.');
});

// Запуск сервера
app.listen(PORT, async () => {
  console.log(`Express веб-сервер запущен на порту ${PORT}...`);

  // Получаем текущий URL ngrok туннеля
  fetchNgrokUrl().then(url => {
    console.log(`ngrok туннель установлен на: ${url}`);

    // Обновляем Web App URL в Telegram
    updateWebAppUrl(url);
  }).catch(error => {
    console.error('Ошибка при получении URL туннеля ngrok:', error);
  });
});

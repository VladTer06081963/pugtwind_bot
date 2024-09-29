// bot/bot.js
const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_TOKEN } = require('../config/botConfig');
const axios = require('axios');

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Привет! Это ваш Telegram бот.');
});

// Функция для обновления Web App URL в меню Telegram
async function updateWebAppUrl(newUrl) {
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

module.exports = { bot, updateWebAppUrl };

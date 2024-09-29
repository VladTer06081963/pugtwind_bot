// routes/botRoutes.js
const express = require('express');
const router = express.Router();
const bot = require('../bot/bot');

// Пример роутера, если понадобится взаимодействие с ботом через веб-запросы
router.post('/bot', (req, res) => {
  // можно обработать запросы от Telegram
  res.send('Запрос к боту обработан');
});

module.exports = router;

// authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Подключите контроллеры

module.exports = (app) => {
  // Маршрут для регистрации новых пользователей
  router.post('/register', authController.register);
  router.post('/signin', authController.signin);
  // Маршрут для аутентификации пользователей


  // Добавьте другие маршруты аутентификации, если необходимо

  // Подключите маршруты к вашему приложению
  app.use('/api/auth', router);
 
};

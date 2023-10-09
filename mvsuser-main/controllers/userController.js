// userController.js
const User = require('../models/user'); // Adjust the import path as needed
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Controller function to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['UserName', 'Email'], // Include only UserName and Email fields
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while fetching users' });
  }
};


exports.updateUser = async (req, res) => {
    try {
      const userIdFromToken = req.user.userId; // Получите идентификатор пользователя из JWT-токена
      const { username, email } = req.body;
  
      // Проверьте, что идентификатор из токена совпадает с идентификатором, который пользователь пытается обновить
      if (userIdFromToken !== req.body.userId) {
        return res.status(403).json({ message: 'У вас нет разрешения на изменение данных этого пользователя' });
      }
  
      // Найдите пользователя по идентификатору
      const user = await User.findByPk(userIdFromToken);
  
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
  
      // Обновите данные пользователя
      user.UserName = username || user.UserName;
      user.Email = email || user.Email;
  
      // Сохраните обновленные данные пользователя
      await user.save();
  
      return res.status(200).json({ message: 'Данные пользователя успешно обновлены' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Произошла ошибка при обновлении данных пользователя' });
    }
  };
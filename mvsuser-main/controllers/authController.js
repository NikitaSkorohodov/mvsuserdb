// authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Подключите модель User
const Role = require('../models/roles'); // Подключите модель Role
const UserRole = require('../models/userRoles'); // Подключите модель UserRole
const secretKey = 'SECRET_KEY_RANDOM'; // Замените на ваш секретный ключ

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверьте, что все необходимые данные предоставлены
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
    }

    // Проверьте, что адрес электронной почты уникален
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким адресом электронной почты уже существует' });
    }

    // Хешируйте пароль пользователя
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создайте запись о новом пользователе в базе данных
    const newUser = await User.create({
      UserName: username,
      Email: email,
      PasswordHash: hashedPassword
    });

    // Получите RoleID роли "user" (или любой другой роли, которую вы хотите назначить)
    const userRole = await Role.findOne({ where: { RoleName: 'user' } });

    // Создайте запись в таблице UserRoles, связывая пользователя с ролью
    await UserRole.create({
      UserID: newUser.UserID,
      RoleID: userRole.RoleID
    });

    return res.status(201).json({ message: 'Регистрация успешно завершена' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Произошла ошибка при регистрации' });
  }
};
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверьте, что все необходимые данные предоставлены
    if (!email || !password) {
      return res.status(400).json({ message: 'Пожалуйста, введите адрес электронной почты и пароль' });
    }

    // Поиск пользователя по адресу электронной почты
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Пользователь с таким адресом электронной почты не найден' });
    }

    // Проверьте пароль
    const passwordMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    // Получите роль пользователя из базы данных или другого источника
    const userId = user.UserID;

    // Generate JWT token with user ID
    const token = jwt.sign(
      { userId, email: user.Email },
      secretKey,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Произошла ошибка при аутентификации' });
  }
};


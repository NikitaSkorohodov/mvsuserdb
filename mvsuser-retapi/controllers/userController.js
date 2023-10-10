const User = require('../models/user'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = 'SECRET_KEY_RANDOM'; 
const UserRole = require('../models/userRoles');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['UserName', 'Email'], 
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while fetching users' });
  }
};



exports.updateUserProfile = async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Token is missing.' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;
    const user = await User.findOne({ where: { UserID: userId } });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    if (req.body.username) {
      user.UserName = req.body.username;
    }
    if (req.body.email) {
      user.Email = req.body.email;
    }
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.PasswordHash = hashedPassword;
    }

    await user.save();

    return res.status(200).json({ message: 'Данные пользователя успешно обновлены.' });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};


exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Найдите пользователя по ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Удалите записи в таблице userroles, связанные с этим пользователем
    await UserRole.destroy({ where: { UserID: userId } });

    // Затем удалите самого пользователя
    await user.destroy();

    return res.status(200).json({ message: 'Пользователь успешно удален.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Произошла ошибка при удалении пользователя.' });
  }
};
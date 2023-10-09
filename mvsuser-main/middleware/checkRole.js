// authMiddleware.js

const jwt = require('jsonwebtoken');
const UserRole = require('../models/userRoles'); // Import your model here
const secretKey = 'SECRET_KEY_RANDOM'; // Replace with your actual secret key

exports.checkAdminRole = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. Token is missing.' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;

    // Check if the user has the 'admin' role (RoleID 2) in the UserRoles table
    const userRole = await UserRole.findOne({ where: { UserID: userId } });

    if (userRole && userRole.RoleID === 2) {
      // User has the 'admin' role, so allow them to proceed
      req.user = decodedToken;
      next();
    } else {
      // User does not have the 'admin' role, so return a 403 Forbidden response
      res.status(403).json({ message: 'у вас нет на это прав.' });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};

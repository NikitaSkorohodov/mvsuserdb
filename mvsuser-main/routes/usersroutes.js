const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 

module.exports = (app) => {
    router.get('/', userController.getAllUsers);
    router.put('/:userId', userController.updateUser);
app.use('/api/users', router);
 
};

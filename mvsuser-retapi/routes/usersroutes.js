const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const checkRole = require('../middleware/checkRole');

module.exports = (app) => {
    /**
     * @swagger
     * tags:
     *   name: Users
     *   description: Operations related to users
     */
    
    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Get all users
     *     tags: [Users]
     *     responses:
     *       '200':
     *         description: Successful operation
     */

    router.get('/', userController.getAllUsers);

    /**
     * @swagger
     * /api/users/update:
     *   put:
     *     summary: Update user profile
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       '200':
     *         description: User profile updated successfully
     *       '500':
     *         description: Internal server error
     */

    router.put('/update', userController.updateUserProfile);

    /**
     * @swagger
     * /api/users/{userId}:
     *   delete:
     *     summary: Delete a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: userId
     *         schema:
     *           type: integer
     *         required: true
     *         description: ID of the user to delete
     *     responses:
     *       '200':
     *         description: User deleted successfully
     *       '404':
     *         description: User not found
     *       '403':
     *         description: Forbidden. User does not have necessary permissions
     *       '500':
     *         description: Internal server error
     */

    router.delete('/:userId', checkRole.checkAdminRole, userController.deleteUser);
  
    app.use('/api/users', router);
};


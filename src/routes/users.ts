const express = require('express')
const router = express.Router()
const userController = require('../database/Mongo/Controllers/userController');

router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.get('/name/:username', userController.getUserByName);
router.get('/:id', userController.getUserById);
router.get('/', userController.getUsersByIds);

module.exports = router;
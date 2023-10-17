const express = require('express')
const router = express.Router()
const userController = require('../database/Mongo/Controllers/userController');

router.post('/signup', userController.signup);
router.get('/login', userController.login);

module.exports = router;
const express = require('express')
const router = express.Router()
const userController = require('../database/Mongo/Controllers/userController');

router.post('/create', userController.createUser);

module.exports = router;
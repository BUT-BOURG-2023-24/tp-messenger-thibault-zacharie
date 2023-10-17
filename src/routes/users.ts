const express = require('express')
const router = express.Router()
const userController = require('../database/Mongo/Controllers/userController');

router.get('/', userController.getUsers);

module.exports = router;
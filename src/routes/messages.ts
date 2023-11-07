const express = require('express')
const router = express.Router()
const messsageController = require('../database/Mongo/Controllers/messageController');
const auth = require('../auth');

router.post('/create', auth.checkAuth ,messsageController.createMessage);

module.exports = router;
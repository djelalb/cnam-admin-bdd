const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

router.post('/execute', queryController.execute);

module.exports = router;

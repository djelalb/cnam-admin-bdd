const express = require('express');
const router = express.Router();
const explorerController = require('../controllers/explorerController');

router.get('/databases', explorerController.getDatabases);
router.get('/logins', explorerController.getLogins);

module.exports = router;

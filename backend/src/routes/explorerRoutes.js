const express = require('express');
const router = express.Router();
const explorerController = require('../controllers/explorerController');

router.get('/databases', explorerController.getDatabases);
router.get('/logins', explorerController.getLogins);
router.get('/databases/:dbName/tables', explorerController.getTables);
router.get('/databases/:dbName/tables/:tableName', explorerController.getTableDetails);

module.exports = router;

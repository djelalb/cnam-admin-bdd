const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/databases/create', adminController.createDatabase);
router.post('/databases/drop', adminController.dropDatabase);
router.post('/logins/create', adminController.createLogin);
router.post('/logins/drop', adminController.dropLogin);
router.post('/databases/backup', adminController.backupDatabase);

module.exports = router;

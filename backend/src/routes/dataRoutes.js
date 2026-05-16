const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.post('/databases/:dbName/tables/:tableName/row', dataController.insertRow);
router.put('/databases/:dbName/tables/:tableName/row', dataController.updateRow);
router.delete('/databases/:dbName/tables/:tableName/row', dataController.deleteRow);

module.exports = router;

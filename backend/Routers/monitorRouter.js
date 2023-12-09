const express = require('express');
const router = express.Router();
const monitorController = require('../Controller/monitor_controller');



router.get('/', monitorController.getMonitor);


module.exports = router;
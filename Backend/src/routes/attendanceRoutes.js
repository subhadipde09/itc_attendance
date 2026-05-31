const express = require('express');
const controller = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

router.use(protect);
router.patch('/record', requireFields('entries'), controller.recordAttendance);
router.post('/save', requireFields('entries'), controller.saveAttendance);
router.get('/', controller.listAttendance);

module.exports = router;

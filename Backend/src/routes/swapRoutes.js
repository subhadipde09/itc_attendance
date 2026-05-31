const express = require('express');
const controller = require('../controllers/swapController');
const { protect } = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

router.use(protect);
router.post('/create', requireFields('employeeAId', 'employeeBId'), controller.create);
router.get('/history', controller.history);

module.exports = router;

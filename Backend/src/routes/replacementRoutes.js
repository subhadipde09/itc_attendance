const express = require('express');
const controller = require('../controllers/replacementController');
const { protect } = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

router.use(protect);
router.get('/suggestions', controller.suggestions);
router.post('/assign', requireFields('absentEmployeeId', 'replacementEmployeeId'), controller.assign);

module.exports = router;

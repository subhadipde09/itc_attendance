const express = require('express');
const controller = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/dashboard', controller.dashboard);

module.exports = router;

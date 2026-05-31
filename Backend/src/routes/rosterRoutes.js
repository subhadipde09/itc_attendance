const express = require('express');
const controller = require('../controllers/rosterController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.post('/generate', controller.generate);
router.get('/', controller.list);

module.exports = router;

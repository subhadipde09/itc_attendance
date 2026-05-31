const express = require('express');
const controller = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

router.use(protect);
router.get('/', controller.listEmployees);
router.post('/', requireFields('employeeId', 'name', 'email', 'phone', 'team', 'shift', 'weeklyOffDay'), controller.createEmployee);
router.put('/:id', controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

module.exports = router;

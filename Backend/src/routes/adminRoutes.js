const express = require('express');
const controller = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { allowRoles } = require('../middleware/rbac');
const { requireFields } = require('../middleware/validate');
const { ROLES } = require('../constants/enums');

const router = express.Router();

router.use(protect, allowRoles(ROLES.SUPER_ADMIN));
router.post('/', requireFields('firstName', 'lastName', 'email', 'password'), controller.createAdmin);
router.get('/', controller.listAdmins);
router.put('/:id', controller.updateAdmin);
router.patch('/:id/status', requireFields('isActive'), controller.setStatus);
router.patch('/:id/reset-password', requireFields('password'), controller.resetPassword);

module.exports = router;

const express = require('express');
const { protect } = require('../middleware/auth');
const { getTargetRoles, getTargetRoleById } = require('../controllers/targetRoleController');

const router = express.Router();

router.use(protect);
router.get('/', getTargetRoles);
router.get('/:id', getTargetRoleById);

module.exports = router;

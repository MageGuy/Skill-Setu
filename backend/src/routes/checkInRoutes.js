const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const {
  listAllCheckIns,
  getSummary,
  triggerCycle,
  updateAdminAction,
  getMyCheckIns,
  getCheckInById,
  respondToCheckIn
} = require('../controllers/checkInController');

// Admin endpoints
router.get('/admin/all', protect, restrictTo('admin'), listAllCheckIns);
router.get('/admin/summary', protect, restrictTo('admin'), getSummary);
router.post('/admin/run-cycle', protect, restrictTo('admin'), triggerCycle);
router.patch('/admin/:id', protect, restrictTo('admin'), updateAdminAction);

// Student/trainee endpoints
router.get('/me', protect, getMyCheckIns);

// Public check-in response endpoints (accessed via email link, no auth needed
// because the check-in ID itself is the "token")
router.get('/:id', getCheckInById);
router.patch('/:id/respond', respondToCheckIn);

module.exports = router;

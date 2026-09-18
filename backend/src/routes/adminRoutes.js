const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getRoster,
  approveStudentCredentials,
  getTelemetry,
  dossierLookup
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, restrictTo('admin'));
router.get('/roster', getRoster);
router.post('/roster/:id/approve', approveStudentCredentials);
router.get('/telemetry', getTelemetry);
router.get('/dossier-lookup/:skillSetuId', dossierLookup);

module.exports = router;

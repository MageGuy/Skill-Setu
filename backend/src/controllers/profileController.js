const asyncHandler = require('../utils/asyncHandler');

// Fields the student/trainee is allowed to self-edit. Government-issued
// identifiers (aicteId, regId, skillSetuId, rollNo) and cached scores are
// deliberately excluded — those come from institutional verification flows.
const EDITABLE_FIELDS = [
  'name',
  'hindiName',
  'email',
  'phone',
  'branch',
  'degree',
  'academicYear',
  'institution',
  'cgpa',
  'employmentStatus',
  'employmentSummary',
  'currentCompany',
  'currentRole',
  'currentPackage',
  'experienceYears',
  'avatarUrl',
  'priorCourses',
  'selfReportedSkills',
  'preferredJobLocations'
];

const SETTINGS_FIELDS = ['autoSyncDigilocker', 'recruiterVisibility', 'emailAlerts', 'smsAlerts'];

// GET /api/profile/me
const getMyProfile = asyncHandler(async (req, res) => {
  res.json({ profile: req.user.toPublicProfile() });
});

// PATCH /api/profile/me
const updateMyProfile = asyncHandler(async (req, res) => {
  EDITABLE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  await req.user.save();
  res.json({ profile: req.user.toPublicProfile() });
});

// PATCH /api/profile/settings
const updateSettings = asyncHandler(async (req, res) => {
  const next = { ...req.user.settings };
  SETTINGS_FIELDS.forEach((field) => {
    if (typeof req.body[field] === 'boolean') {
      next[field] = req.body[field];
    }
  });

  req.user.settings = next;
  await req.user.save();
  res.json({ settings: req.user.settings });
});

module.exports = { getMyProfile, updateMyProfile, updateSettings };

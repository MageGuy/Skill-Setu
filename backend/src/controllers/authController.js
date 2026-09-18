const User = require('../models/User');
const Otp = require('../models/Otp');
const asyncHandler = require('../utils/asyncHandler');
const { signToken, sendTokenCookie, clearTokenCookie } = require('../utils/token');
const { generateSkillSetuId, hashOtp, generateOtp } = require('../utils/ids');
const { deliverOtp } = require('../utils/otpGateway');

function issueSession(res, user) {
  const token = signToken(user._id.toString());
  sendTokenCookie(res, token);
  return token;
}

// POST /api/auth/register
// Creates a student/trainee account with a rich profile (CGPA, branch,
// institution, prior courses, self-reported skills, preferred locations).
// Admin accounts are never created through the public API — see
// scripts/createAdmin.js.
const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    accountType,
    // Optional profile fields collected at signup
    rollNo,
    branch,
    degree,
    academicYear,
    institution,
    cgpa,
    experienceYears,
    priorCourses,
    selfReportedSkills,
    preferredJobLocations
  } = req.body;

  if (!name || (!email && !phone)) {
    return res.status(400).json({ message: 'Name and at least one of email/phone are required.' });
  }

  if (accountType && !['student', 'trainee'].includes(accountType)) {
    return res.status(400).json({ message: 'accountType must be student or trainee.' });
  }

  const existing = await User.findOne({
    $or: [email ? { email } : null, phone ? { phone } : null].filter(Boolean)
  });
  if (existing) {
    return res.status(409).json({ message: 'An account with that email or phone already exists.' });
  }

  const user = new User({
    name,
    email: email || undefined,
    phone: phone || undefined,
    role: accountType || 'student',
    skillSetuId: generateSkillSetuId(),
    // Profile fields — all optional, validated below
    rollNo: rollNo || '',
    branch: branch || '',
    degree: degree || '',
    academicYear: academicYear || '',
    institution: institution || '',
    cgpa: typeof cgpa === 'number' && cgpa >= 0 && cgpa <= 10 ? cgpa : 0,
    experienceYears: typeof experienceYears === 'number' && experienceYears >= 0 ? experienceYears : 0,
    priorCourses: Array.isArray(priorCourses) ? priorCourses.filter((s) => typeof s === 'string' && s.trim()).slice(0, 30) : [],
    selfReportedSkills: Array.isArray(selfReportedSkills) ? selfReportedSkills.filter((s) => typeof s === 'string' && s.trim()).slice(0, 30) : [],
    preferredJobLocations: Array.isArray(preferredJobLocations) ? preferredJobLocations.filter((s) => typeof s === 'string' && s.trim()).slice(0, 10) : []
  });

  if (password) {
    await user.setPassword(password);
  }

  await user.save();
  issueSession(res, user);

  res.status(201).json({ user: user.toPublicProfile() });
});

// POST /api/auth/login  { identifier, password }
const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'identifier and password are required.' });
  }

  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { phone: identifier }]
  }).select('+passwordHash');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Incorrect credentials.' });
  }

  issueSession(res, user);
  res.json({ user: user.toPublicProfile() });
});

// POST /api/auth/otp/request  { identifier }
// Passwordless login path for students/trainees only (admins must use a password).
const requestOtp = asyncHandler(async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ message: 'identifier (email or phone) is required.' });
  }

  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { phone: identifier }]
  });

  if (!user) {
    return res.status(404).json({ message: 'No account found for that email/phone. Please register first.' });
  }

  if (user.role === 'admin') {
    return res.status(403).json({ message: 'Admin accounts must sign in with a password.' });
  }

  const otp = generateOtp();
  const salt = identifier;
  await Otp.create({
    identifier,
    otpHash: hashOtp(otp, salt),
    expiresAt: new Date(Date.now() + (Number(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000)
  });

  await deliverOtp(identifier, otp);

  const payload = { message: 'OTP sent.' };
  if (process.env.OTP_DEBUG_ECHO === 'true' && process.env.NODE_ENV !== 'production') {
    payload.devOtp = otp; // dev-only convenience since no SMS/email gateway is wired up
  }

  res.json(payload);
});

// POST /api/auth/otp/verify  { identifier, otp }
const verifyOtp = asyncHandler(async (req, res) => {
  const { identifier, otp } = req.body;
  if (!identifier || !otp) {
    return res.status(400).json({ message: 'identifier and otp are required.' });
  }

  const record = await Otp.findOne({ identifier }).sort({ createdAt: -1 });
  if (!record) {
    return res.status(400).json({ message: 'No OTP request found. Please request a new one.' });
  }

  if (record.expiresAt < new Date()) {
    await record.deleteOne();
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  }

  if (record.attempts >= 5) {
    return res.status(429).json({ message: 'Too many attempts. Please request a new OTP.' });
  }

  const expectedHash = hashOtp(otp, identifier);
  if (expectedHash !== record.otpHash) {
    record.attempts += 1;
    await record.save();
    return res.status(401).json({ message: 'Incorrect OTP.' });
  }

  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { phone: identifier }]
  });
  if (!user) {
    return res.status(404).json({ message: 'Account no longer exists.' });
  }

  await record.deleteOne();
  issueSession(res, user);
  res.json({ user: user.toPublicProfile() });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  res.json({ message: 'Logged out.' });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublicProfile() });
});

module.exports = { register, login, requestOtp, verifyOtp, logout, me };

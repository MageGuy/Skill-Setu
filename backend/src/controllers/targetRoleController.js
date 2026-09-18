const TargetRole = require('../models/TargetRole');
const Skill = require('../models/Skill');
const asyncHandler = require('../utils/asyncHandler');
const { annotateRoleMatch } = require('../utils/matching');

// GET /api/roles — catalog annotated with the current user's live match %
const getTargetRoles = asyncHandler(async (req, res) => {
  const [roles, mySkills] = await Promise.all([
    TargetRole.find().sort({ createdAt: 1 }),
    Skill.find({ user: req.user._id, status: 'VALIDATED' }).select('name score')
  ]);

  const annotated = roles.map((role) => {
    const { requiredSkills, matchPercentage } = annotateRoleMatch(mySkills, role.requiredSkills);
    return {
      id: role._id,
      title: role.title,
      tier: role.tier,
      targetReadiness: role.targetReadiness,
      currentMatch: matchPercentage,
      requiredSkills
    };
  });

  res.json({ roles: annotated });
});

// GET /api/roles/:id
const getTargetRoleById = asyncHandler(async (req, res) => {
  const role = await TargetRole.findById(req.params.id);
  if (!role) return res.status(404).json({ message: 'Target role not found.' });

  const mySkills = await Skill.find({ user: req.user._id, status: 'VALIDATED' }).select('name score');
  const { requiredSkills, matchPercentage } = annotateRoleMatch(mySkills, role.requiredSkills);

  res.json({
    role: {
      id: role._id,
      title: role.title,
      tier: role.tier,
      targetReadiness: role.targetReadiness,
      currentMatch: matchPercentage,
      requiredSkills
    }
  });
});

module.exports = { getTargetRoles, getTargetRoleById };

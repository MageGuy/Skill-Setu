const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    provider: { type: String, trim: true, default: '' },
    instructor: { type: String, trim: true, default: '' },
    duration: { type: String, trim: true, default: '' },
    credits: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    enrolledCount: { type: Number, default: 0 },
    bridgesSkills: { type: [String], default: [] },
    accreditation: { type: String, trim: true, default: '' },
    badgeColor: { type: String, trim: true, default: 'neutral' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);

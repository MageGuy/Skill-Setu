const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    originalName: { type: String, required: true },
    storedFilename: { type: String, required: true },
    mimeType: { type: String, default: '' },
    sizeBytes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['UPLOADED', 'PARSING', 'PARSED', 'FAILED'],
      default: 'UPLOADED'
    },
    failureReason: { type: String, default: '' },
    extractedSkills: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);

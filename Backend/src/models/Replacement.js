const mongoose = require('mongoose');

const replacementSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    absentEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    replacementEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    shift: { type: String, required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Suggested', 'Assigned'], default: 'Assigned' },
  },
  { timestamps: true }
);

replacementSchema.index({ date: 1, absentEmployee: 1 }, { unique: true });

module.exports = mongoose.model('Replacement', replacementSchema);

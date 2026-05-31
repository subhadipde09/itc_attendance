const mongoose = require('mongoose');
const { ATTENDANCE } = require('../constants/enums');

const attendanceEntrySchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    status: { type: String, enum: Object.values(ATTENDANCE), required: true },
    shift: { type: String, required: true },
    team: { type: String, required: true },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    entries: [attendanceEntrySchema],
    savedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

attendanceSchema.index({ date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

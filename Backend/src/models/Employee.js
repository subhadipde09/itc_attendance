const mongoose = require('mongoose');
const { SHIFTS, TEAMS, ATTENDANCE, WEEK_DAYS } = require('../constants/enums');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, sparse: true, trim: true },
    team: { type: String, enum: TEAMS, required: true },
    shift: { type: String, enum: Object.values(SHIFTS), required: true },
    attendanceStatus: { type: String, enum: Object.values(ATTENDANCE), default: ATTENDANCE.ABSENT },
    weeklyOffDay: { type: String, enum: WEEK_DAYS, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

employeeSchema.index({ name: 'text', employeeId: 'text', email: 'text', phone: 'text', team: 'text' });

module.exports = mongoose.model('Employee', employeeSchema);

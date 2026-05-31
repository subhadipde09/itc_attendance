const mongoose = require('mongoose');

const shiftSwapSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    employeeA: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeB: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    fromShift: { type: String, required: true },
    toShift: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShiftSwap', shiftSwapSchema);

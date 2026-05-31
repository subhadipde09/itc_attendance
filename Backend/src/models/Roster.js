const mongoose = require('mongoose');

const rosterSchema = new mongoose.Schema(
  {
    cycleStartDate: { type: String, required: true },
    weekNumber: { type: Number, required: true },
    team: { type: String, required: true },
    shift: { type: String, required: true },
    weeklyOffDay: { type: String, required: true },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

rosterSchema.index({ cycleStartDate: 1, weekNumber: 1, team: 1 }, { unique: true });

module.exports = mongoose.model('Roster', rosterSchema);

const Roster = require('../models/Roster');
const Employee = require('../models/Employee');
const { SHIFTS, TEAMS, WEEK_DAYS } = require('../constants/enums');
const { toDateKey } = require('../utils/date');

const rotations = [
  { 'Team A': SHIFTS.MORNING, 'Team B': SHIFTS.EVENING, 'Team C': SHIFTS.NIGHT },
  { 'Team A': SHIFTS.EVENING, 'Team B': SHIFTS.NIGHT, 'Team C': SHIFTS.MORNING },
  { 'Team A': SHIFTS.NIGHT, 'Team B': SHIFTS.MORNING, 'Team C': SHIFTS.EVENING },
  { 'Team A': SHIFTS.MORNING, 'Team B': SHIFTS.EVENING, 'Team C': SHIFTS.NIGHT },
];

const generateRoster = async (user, startDate = new Date()) => {
  const cycleStartDate = toDateKey(startDate);
  await Roster.deleteMany({ cycleStartDate });
  const docs = [];
  rotations.forEach((week, index) => {
    TEAMS.forEach((team, teamIndex) => {
      docs.push({
        cycleStartDate,
        weekNumber: index + 1,
        team,
        shift: week[team],
        weeklyOffDay: WEEK_DAYS[(teamIndex + index) % WEEK_DAYS.length],
        generatedBy: user?._id,
      });
    });
  });
  const roster = await Roster.insertMany(docs);

  const firstWeek = rotations[0];
  await Promise.all(
    TEAMS.map((team) => Employee.updateMany({ team }, { shift: firstWeek[team] }))
  );

  return roster;
};

const listRoster = (query = {}) => Roster.find(query).sort({ cycleStartDate: -1, weekNumber: 1, team: 1 });

module.exports = { generateRoster, listRoster };

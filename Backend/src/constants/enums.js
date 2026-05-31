const ROLES = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
});

const SHIFTS = Object.freeze({
  MORNING: 'Morning',
  EVENING: 'Evening',
  NIGHT: 'Night',
});

const TEAMS = Object.freeze(['Team A', 'Team B', 'Team C']);
const ATTENDANCE = Object.freeze({ PRESENT: 'Present', ABSENT: 'Absent' });
const WEEK_DAYS = Object.freeze(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);

module.exports = { ROLES, SHIFTS, TEAMS, ATTENDANCE, WEEK_DAYS };

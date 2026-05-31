const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const { toDateKey } = require('../utils/date');

const normalizeEntries = async (entries) => {
  const employeeIds = entries.map((entry) => entry.employeeId);
  const employees = await Employee.find({ _id: { $in: employeeIds }, active: true });
  const employeeMap = new Map(employees.map((employee) => [String(employee._id), employee]));

  return entries.map((entry) => {
    const employee = employeeMap.get(String(entry.employeeId));
    if (!employee) throw new Error(`Employee not found: ${entry.employeeId}`);
    return {
      employee: employee._id,
      status: entry.status,
      shift: employee.shift,
      team: employee.team,
    };
  });
};

const updateEmployeeStatuses = (entries) =>
  Promise.all(
    entries.map((entry) =>
      Employee.findByIdAndUpdate(entry.employee, { attendanceStatus: entry.status })
    )
  );

const saveAttendance = async ({ entries, user, date = toDateKey() }) => {
  const normalizedEntries = await normalizeEntries(entries);

  const attendance = await Attendance.findOneAndUpdate(
    { date },
    { date, entries: normalizedEntries, savedBy: user?._id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await updateEmployeeStatuses(normalizedEntries);

  return attendance.populate('entries.employee');
};

const recordAttendance = async ({ entries, user, date = toDateKey() }) => {
  const normalizedEntries = await normalizeEntries(entries);
  const existingAttendance = await Attendance.findOne({ date });
  const entriesByEmployee = new Map(
    (existingAttendance?.entries || []).map((entry) => [String(entry.employee), entry.toObject ? entry.toObject() : entry])
  );

  normalizedEntries.forEach((entry) => {
    entriesByEmployee.set(String(entry.employee), entry);
  });

  const attendance = await Attendance.findOneAndUpdate(
    { date },
    { date, entries: Array.from(entriesByEmployee.values()), savedBy: user?._id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await updateEmployeeStatuses(normalizedEntries);

  return attendance.populate('entries.employee');
};

const listAttendance = (query = {}) => Attendance.find(query).populate('entries.employee').sort({ date: -1 });

module.exports = { saveAttendance, recordAttendance, listAttendance };

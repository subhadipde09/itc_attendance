const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Replacement = require('../models/Replacement');
const AppError = require('../utils/appError');
const { ATTENDANCE } = require('../constants/enums');
const { dayName, toDateKey } = require('../utils/date');

const getSuggestions = async (date = toDateKey()) => {
  const attendance = await Attendance.findOne({ date }).populate('entries.employee');
  if (!attendance) return [];
  const assigned = await Replacement.find({ date }).distinct('replacementEmployee');
  const presentIds = attendance.entries
    .filter((entry) => entry.status === ATTENDANCE.PRESENT)
    .map((entry) => String(entry.employee._id));

  return attendance.entries
    .filter((entry) => entry.status === ATTENDANCE.ABSENT)
    .map((absent) => {
      const replacement = attendance.entries.find((entry) => {
        const employee = entry.employee;
        return (
          entry.status === ATTENDANCE.PRESENT &&
          String(employee._id) !== String(absent.employee._id) &&
          employee.team === absent.employee.team &&
          employee.shift === absent.employee.shift &&
          employee.weeklyOffDay !== dayName(date) &&
          !assigned.map(String).includes(String(employee._id)) &&
          presentIds.includes(String(employee._id))
        );
      });
      return {
        date,
        absentEmployee: absent.employee,
        suggestedReplacement: replacement?.employee || null,
        shift: absent.shift,
      };
    });
};

const assignReplacement = async ({ date = toDateKey(), absentEmployeeId, replacementEmployeeId, user }) => {
  const [absentEmployee, replacementEmployee] = await Promise.all([
    Employee.findById(absentEmployeeId),
    Employee.findById(replacementEmployeeId),
  ]);
  if (!absentEmployee || !replacementEmployee) throw new AppError('Employee not found', 404);
  if (replacementEmployee.weeklyOffDay === dayName(date)) {
    throw new AppError('Replacement employee is on weekly off', 400);
  }
  const attendance = await Attendance.findOne({ date });
  const replacementEntry = attendance?.entries.find((entry) => String(entry.employee) === String(replacementEmployeeId));
  if (!replacementEntry || replacementEntry.status !== ATTENDANCE.PRESENT) {
    throw new AppError('Replacement employee must be present', 400);
  }
  const alreadyAssigned = await Replacement.findOne({ date, replacementEmployee: replacementEmployeeId });
  if (alreadyAssigned) throw new AppError('Replacement employee is already assigned', 400);

  return Replacement.findOneAndUpdate(
    { date, absentEmployee: absentEmployeeId },
    {
      date,
      absentEmployee: absentEmployeeId,
      replacementEmployee: replacementEmployeeId,
      shift: absentEmployee.shift,
      assignedBy: user?._id,
      status: 'Assigned',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).populate('absentEmployee replacementEmployee');
};

module.exports = { getSuggestions, assignReplacement };

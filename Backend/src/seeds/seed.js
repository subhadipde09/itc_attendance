require('dotenv').config();
const mongoose = require('mongoose');
const speakeasy = require('speakeasy');
const connectDB = require('../config/db');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Replacement = require('../models/Replacement');
const ShiftSwap = require('../models/ShiftSwap');
const { encrypt } = require('../utils/crypto');
const { ROLES, SHIFTS, TEAMS, ATTENDANCE, WEEK_DAYS } = require('../constants/enums');
const rosterService = require('../services/rosterService');
const { toDateKey } = require('../utils/date');

const EMPLOYEE_COUNT = 100;

const upsertUser = async ({ email, password, role, firstName, lastName }) => {
  let user = await User.findOne({ email });
  if (!user) {
    const secret = role === ROLES.ADMIN ? speakeasy.generateSecret({ name: `ITC Workforce (${email})` }) : null;
    user = await User.create({
      email,
      password,
      role,
      firstName,
      lastName,
      totpSecret: secret ? encrypt(secret.base32) : undefined,
    });
    console.log(`Created ${role}: ${email}${secret ? ` | TOTP setup key: ${secret.base32}` : ''}`);
  }
  return user;
};

const seedEmployees = async () => {
  const docs = [];
  for (let i = 1; i <= EMPLOYEE_COUNT; i += 1) {
    const team = TEAMS[(i - 1) % TEAMS.length];
    const shift = [SHIFTS.MORNING, SHIFTS.EVENING, SHIFTS.NIGHT][(i - 1) % 3];
    docs.push({
      employeeId: `EMP${String(i).padStart(3, '0')}`,
      name: `ITC Employee ${String(i).padStart(3, '0')}`,
      email: `emp${String(i).padStart(3, '0')}@itc.com`,
      phone: `90000${String(i).padStart(5, '0')}`,
      team,
      shift,
      weeklyOffDay: WEEK_DAYS[i % WEEK_DAYS.length],
      active: true,
    });
  }
  await Promise.all(
    docs.map((doc) => Employee.findOneAndUpdate({ employeeId: doc.employeeId }, doc, { upsert: true, new: true, setDefaultsOnInsert: true }))
  );
  return Employee.find({ active: true }).sort('employeeId');
};

const seedAttendance = async (employees, user) => {
  for (let offset = 29; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const dateKey = toDateKey(date);
    const entries = employees.map((employee, index) => ({
      employee: employee._id,
      status: (index + offset) % 7 === 0 ? ATTENDANCE.ABSENT : ATTENDANCE.PRESENT,
      shift: employee.shift,
      team: employee.team,
    }));
    await Attendance.findOneAndUpdate(
      { date: dateKey },
      { date: dateKey, entries, savedBy: user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
};

const seedSamples = async (employees, user) => {
  const today = toDateKey();
  const absent = employees[0];
  const replacement = employees.find((employee) => employee.team === absent.team && !employee._id.equals(absent._id)) || employees[1];
  await Replacement.findOneAndUpdate(
    { date: today, absentEmployee: absent._id },
    { date: today, absentEmployee: absent._id, replacementEmployee: replacement._id, shift: absent.shift, assignedBy: user._id, status: 'Assigned' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await ShiftSwap.findOneAndUpdate(
    { date: today, employeeA: employees[1]._id, employeeB: employees[2]._id },
    { date: today, employeeA: employees[1]._id, employeeB: employees[2]._id, fromShift: employees[1].shift, toShift: employees[2].shift, createdBy: user._id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const run = async () => {
  await connectDB();
  const superAdmin = await upsertUser({
    email: 'superadmin@itc.com',
    password: 'superadmin@123',
    role: ROLES.SUPER_ADMIN,
    firstName: 'Super',
    lastName: 'Admin',
  });
  await upsertUser({ email: 'admin1@itc.com', password: 'admin1@123', role: ROLES.ADMIN, firstName: 'Admin', lastName: 'One' });
  await upsertUser({ email: 'admin2@itc.com', password: 'admin2@123', role: ROLES.ADMIN, firstName: 'Admin', lastName: 'Two' });
  const employees = await seedEmployees();
  await seedAttendance(employees, superAdmin);
  await rosterService.generateRoster(superAdmin, new Date());
  await seedSamples(employees, superAdmin);
  console.log('Seed completed successfully.');
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});

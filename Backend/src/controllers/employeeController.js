const Employee = require('../models/Employee');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');
const audit = require('../utils/audit');

const sanitizeEmployee = (employee) => {
  const data = employee.toObject ? employee.toObject() : employee;
  delete data.password;
  return data;
};

const employeePayload = (body) => {
  const { password, ...payload } = body;
  return payload;
};

exports.listEmployees = asyncHandler(async (req, res) => {
  const { search, team, shift, page = 1, limit = 50, sort = 'employeeId' } = req.query;
  const filter = { active: true };
  if (team) filter.team = team;
  if (shift) filter.shift = shift;
  if (search) filter.$text = { $search: search };
  const skip = (Number(page) - 1) * Number(limit);
  const [employees, total] = await Promise.all([
    Employee.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Employee.countDocuments(filter),
  ]);
  res.json({ success: true, employees: employees.map(sanitizeEmployee), total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

exports.createEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.create(employeePayload(req.body));
  await audit({ user: req.user, action: 'CREATE_EMPLOYEE', entity: 'Employee', entityId: employee._id, req });
  res.status(201).json({ success: true, employee: sanitizeEmployee(employee) });
});

exports.updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, employeePayload(req.body), { new: true, runValidators: true });
  if (!employee) throw new AppError('Employee not found', 404);
  await audit({ user: req.user, action: 'UPDATE_EMPLOYEE', entity: 'Employee', entityId: employee._id, req });
  res.json({ success: true, employee: sanitizeEmployee(employee) });
});

exports.deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!employee) throw new AppError('Employee not found', 404);
  await audit({ user: req.user, action: 'DELETE_EMPLOYEE', entity: 'Employee', entityId: employee._id, req });
  res.json({ success: true });
});

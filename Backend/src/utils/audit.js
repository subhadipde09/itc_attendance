const AuditLog = require('../models/AuditLog');

const audit = async ({ user, action, entity, entityId, metadata = {}, req }) => {
  try {
    await AuditLog.create({
      user: user?._id,
      action,
      entity,
      entityId,
      metadata,
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
  } catch (error) {
    console.warn('Audit log failed:', error.message);
  }
};

module.exports = audit;

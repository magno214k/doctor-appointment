import AuditLog from "../models/AuditLog";

export const logAction = (action, entityType) => async (req, res, next) => {
  try {
    await new AuditLog({
      action,
      user: req.user?.id,
      userEmail: req.user?.email,
      entityType,
      entityId: req.params.id,
      ipAddress: req.ip,
    }).save();
    next();
  } catch (err) {
    console.error("Audit log error:", err);
    next();
  }
};

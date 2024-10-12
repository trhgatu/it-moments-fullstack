// middleware/permission.middleware.js
export const requirePermission = (permission) => {
    return (req, res, next) => {
      const role = res.locals.role;
      if (!role.permissions.includes(permission)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    };
  };

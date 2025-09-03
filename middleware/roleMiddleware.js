export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Not authenticated" });
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

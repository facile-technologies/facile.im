import HttpError from "./errors/HttpError.js";

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return next(new HttpError(403, "Access denied. Admins only."));
  }
  next();
};

export default isAdmin;

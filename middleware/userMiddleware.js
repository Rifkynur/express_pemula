const jwt = require("jsonwebtoken");
const { user, role } = require("../models");

exports.authMiddleware = async (req, res, next) => {
  let token;
  //   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
  //     token = req.headers.authorization.split(" ")[1];
  //   }
  token = req.cookies.jwt;
  if (!token) {
    return next(
      res.status(401).json({
        status: "unauthorized",
        message: "anda belum login/register",
      })
    );
  }

  let decode;
  try {
    decode = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(
      res.status(401).json({
        error: error.name,
        message: "Token yang dimasukan tidak ada",
      })
    );
  }
  const currentUser = await user.findByPk(decode.id);
  if (!currentUser) {
    return next(
      res.status(401).json({
        status: "unauthorized",
        message: "silakan login dengan email yang terdaftar",
      })
    );
  }
  req.user = currentUser;
  next();
};

exports.permissionUser = (...roles) => {
  return async (req, res, next) => {
    const rolesData = await role.findByPk(req.user.role_id);

    const roleName = rolesData.name;

    if (!roles.includes(roleName)) {
      return next(
        res.status(403).json({
          error: "Access Denied",
          message: "You do not have the necessary permissions to access this resource.",
        })
      );
    }
    next();
  };
};

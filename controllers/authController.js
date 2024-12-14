const { where } = require("sequelize");
const { user, profile } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOption = {
    expire: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOption);
  res.status(statusCode).json({
    status: "success",
    // token,
    data: {
      name: user.name,
      email: user.email,
    },
  });
};

exports.registerUser = async (req, res) => {
  try {
    if (req.body.password != req.body.confirmPassword) {
      return res.status(400).json({
        message: "validation error",
        error: "password dan confirm password berbeda",
      });
    }
    const newUser = await user.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // const token = signToken(newUser.id);

    // return res.status(201).json({
    //   status: "success",
    //   message: "berhasil register akun baru",
    //   data: newUser,
    //   token,
    // });
    createSendToken(newUser, 201, res);
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      error: error.errors.map((err) => err.message),
    });
  }
};

exports.loginUser = async (req, res) => {
  if (!req.body.email || !req.body.name) {
    return res.status(400).json({
      status: "failed",
      message: "Error validasi",
      error: "please input name or email",
    });
  }
  const userData = await user.findOne({ where: { email: req.body.email } });

  if (!userData || !(await userData.correctPassword(req.body.password, userData.password))) {
    return res.status(400).json({
      status: "failed",
      message: "error login",
      error: "invalid email or password",
    });
  }

  // const token = signToken(userData.id);
  // return res.status(200).json({
  //   status: "success",
  //   message: "Login berhasil",
  //   token,
  // });
  createSendToken(userData, 200, res);
};

exports.logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "Logout berhasil",
  });
};

exports.getMyUser = async (req, res) => {
  const currentUser = await user.findOne({
    where: { id: req.user.id },
    include: [
      {
        model: profile,
        attributes: { exclude: ["createdAt", "updatedAt", "user_id"] },
      },
    ],
    attributes: { exclude: ["createdAt", "updatedAt", "password"] },
  });
  if (currentUser) {
    return res.status(200).json({
      data: currentUser,
    });
  }
  return res.status(404).json({
    message: "user not found",
  });
};

const jwt = require("jsonwebtoken");
require("dotenv").config();
const Users = require("../model/users");
const { HttpCode } = require("../helpers/constants");
const UploadAvatar = require("../services/upload-avatars-local");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
const reg = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email is already used",
      });
    }
    const newUser = await Users.create(req.body);
    const { id, email, password, subscription, avatar } = newUser;
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { id, email, password, subscription, avatar },
    });
  } catch (err) {
    next(err);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password, avatar } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTORIZED).json({
        status: "error",
        code: HttpCode.UNAUTORIZED,
        message: "Email or password is wrong",
      });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(user.id, token);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
          avatar: user.avatar,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
const logout = async (req, res, next) => {
  await Users.updateToken(req.user.id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};
const current = async (req, res, next) => {
  try {
    const user = req.user;
    if (user) {
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        data: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    }
    return res.status(HttpCodes.UNAUTORIZED).json({
      status: "error",
      code: HttpCodes.UNAUTORIZED,
      message: "Not authorized",
      data: "Not authorized",
    });
  } catch (err) {
    next(err);
  }
};
const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatar(AVATARS_OF_USERS);
    const avatarUrl = await uploads.saveAvatarToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatar,
    });
    await Users.updateAvatar(id, avatarUrl);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { reg, login, logout, current, avatars };

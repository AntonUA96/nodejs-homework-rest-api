const express = require("express");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const boolParser = require("express-query-boolean");
const { HttpCode } = require("./helpers/constants");
const contactsRouter = require("./routes/api/contacts");
const userRouter = require("./routes/api/users");
const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
require("dotenv").config();
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
app.use(express.static(path.join(__dirname, AVATARS_OF_USERS)));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 1500 }));
app.use(boolParser());
app.use("/api/users", userRouter);
app.use("/api/contacts", contactsRouter);
app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: "error", code: HttpCode.NOT_FOUND, message: "Not found" });
});
app.use((err, req, res, next) => {
  const code = err.status || HttpCode.INTERNAL_SERVER_ERROR;
  const status = err.status ? "error" : "fail";
  res.status(code).json({ status, code, message: err.message });
});
module.exports = app;

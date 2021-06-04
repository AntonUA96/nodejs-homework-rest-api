const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const {
  validateSchemaRegister,
  validateSchemaLogin,
  validateSchemaSubscription,
} = require("./validation");
router.post("/register", validateSchemaRegister, ctrl.reg);
router.post("/login", validateSchemaLogin, ctrl.login);
router.post("/logout", guard, validateSchemaSubscription, ctrl.logout);
router.get("/current", guard, ctrl.current);
module.exports = router;

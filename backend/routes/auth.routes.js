const express = require("express");
const router = express.Router();

const {
  adminLoginAction,
  adminLogoutAction,
  adminSignupAction,
} = require("../controllers/auth.controllers.js");

const {
  verifyAndGetUserInfo,
  requireLogin,
} = require("../middleware/auth.middleware");

const { checkDuplicateUser } = require("../helpers/validation");

// signup
router.route("/adminSignup").post(checkDuplicateUser, adminSignupAction);

// login
router.route("/adminLogin").post(adminLoginAction); // add a .get(adminStayLoggedIn) middleware?

// logout
router
  .route("/adminLogout")
  .post(verifyAndGetUserInfo, requireLogin, adminLogoutAction);

// verify token
router.route(`/verifyToken?token=:token`).get(verifyAndGetUserInfo);

module.exports = router; // We need this at the end of every route file

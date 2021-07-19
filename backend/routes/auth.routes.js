const express = require("express");
const router = express.Router();

const {
  adminLoginAction,
  adminSignupAction,
  me,
  adminLogoutAction,
  refreshTokenAction,
} = require("../controllers/auth.controllers.js");

const { decodeHeader, requireLogin } = require("../middleware/auth.middleware");

const { checkDuplicateUser } = require("../helpers/validation");

// signup
router.route("/adminSignup").post(checkDuplicateUser, adminSignupAction);

// login
router.route("/adminLogin").post(adminLoginAction);

// fetch logged in user info - keeps user logged in on page refresh
router.route("/me").get(decodeHeader, me);

// refresh user's token if the user's access token almost expired
router.route("/refreshToken").post(refreshTokenAction);

// logout
router
  .route("/adminLogout")
  .post(decodeHeader, requireLogin, adminLogoutAction);
// router
//   .route("/adminLogout")
//   .post(verifyAndGetUserInfo, requireLogin, adminLogoutAction);

// verify token
// router.route(`/verifyToken?token=:token`).get(verifyAndGetUserInfo);

module.exports = router; // We need this at the end of every route file

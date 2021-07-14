const express = require("express");
const router = express.Router();

const {
  adminLoginAction,
  // adminLogoutAction,
  adminSignupAction,
  me,
} = require("../controllers/auth.controllers.js");

const { decodeHeader } = require("../middleware/auth.middleware");

const { checkDuplicateUser } = require("../helpers/validation");

// signup
router.route("/adminSignup").post(checkDuplicateUser, adminSignupAction);

// login
router.route("/adminLogin").post(adminLoginAction);

// fetch logged in user info
router.route("/me").get(decodeHeader, me);

// logout
// router
//   .route("/adminLogout")
//   .post(verifyAndGetUserInfo, requireLogin, adminLogoutAction);

// verify token
// router.route(`/verifyToken?token=:token`).get(verifyAndGetUserInfo);

module.exports = router; // We need this at the end of every route file

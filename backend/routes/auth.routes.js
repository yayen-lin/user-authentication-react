const express = require("express");
const router = express.Router();

const {
  adminLoginAction,
  adminLogoutAction,
  adminSignupAction,
  adminUpdateUserAction,
  adminDeleteUserAction,
  adminIsAuth, // TEST: remove
  adminIsLoggedIn,
} = require("../controllers/auth.controllers.js");

const {
  verifyAndGetUserInfo,
  requireLogin,
} = require("../middleware/auth.middleware");

router.route("/isAuth").get(verifyAndGetUserInfo, requireLogin, adminIsAuth); // TEST: remove

router.route("/isLoggedIn").get(adminIsLoggedIn);

// login
router.route("/login").post(adminLoginAction); // add a .get(adminStayLoggedIn) middleware?

// logout
router
  .route("/logout")
  .post(verifyAndGetUserInfo, requireLogin, adminLogoutAction);

// sign up
router.route("/signup").post(adminSignupAction);

// update and delete users
router
  .route("/:username")
  .put(verifyAndGetUserInfo, requireLogin, adminUpdateUserAction)
  .delete(verifyAndGetUserInfo, requireLogin, adminDeleteUserAction);

module.exports = router; // We need this at the end of every route file

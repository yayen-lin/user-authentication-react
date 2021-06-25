const express = require("express");
const router = express.Router();

const {
  adminLoginAction,
  adminLogoutAction,
  adminSignupAction,
  adminUpdateUserAction,
  adminDeleteUserAction,
} = require("../controllers/auth.controllers.js");

const authMiddleware = require("../middleware/auth.middleware");

// login
router.route("/login").post(adminLoginAction);

// logout
router
  .route("/logout")
  .post(
    authMiddleware.verifyAndGetUserInfo,
    authMiddleware.requireLogin,
    adminLogoutAction
  );

// sign up
router.route("/signup").post(adminSignupAction);

// update and delete users
router
  .route("/:username")
  .put(
    authMiddleware.verifyAndGetUserInfo,
    authMiddleware.requireLogin,
    adminUpdateUserAction
  )
  .delete(
    authMiddleware.verifyAndGetUserInfo,
    authMiddleware.requireLogin,
    adminDeleteUserAction
  );

module.exports = router; // We need this at the end of every route file

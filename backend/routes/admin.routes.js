const express = require("express");
const router = express.Router();

const {
  adminUpdateUserAction,
  adminDeleteUserAction,
} = require("../controllers/auth.controllers.js");

const {
  verifyAndGetUserInfo,
  requireLogin,
} = require("../middleware/auth.middleware");

// update and delete users
router
  .route("/:username")
  .put(verifyAndGetUserInfo, requireLogin, adminUpdateUserAction)
  .delete(verifyAndGetUserInfo, requireLogin, adminDeleteUserAction);

module.exports = router; // We need this at the end of every route file

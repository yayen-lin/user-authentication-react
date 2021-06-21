/**
 * Admin login/signup/update/delete actions which execute the queries defined in auth.models.js.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * src: https://github.com/Scavenge-UW/Scavenge
 */

const { promisify } = require("util");
const { execQuery } = require("../query");
const authDB = require("../models/user.models");

/*
 * Helper middleware function that verifies if a user is truly logged in.
 * Sets req.user to the user; otherwise, user will be null.
 */
exports.verifyAndGetUserInfo = async (req, res, next) => {
  if (req.cookies.jwt) {
    // async returns a promise after the await
    // verify is from jwt web tokens
    // 1. verify the token
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );
    console.log(decoded);

    // 2. check if the user still exists and get user info from DB
    const query = `
      SELECT * FROM user WHERE username = ?;
    `;
    execQuery("select", query, [decoded.username])
      .then(async (result) => {
        if (!result) {
          // if user doesn't exist in the database
          req.user = null;
          next();
        } else {
          // verified user
          req.user = result[0];
          next();
        }
      })
      .catch((err) => {
        console.log(err);
        req.user = null;
        return res.status(500).json({
          message: "Server error while setting the user in middleware",
        });
      });
  } else if (req.headers["x-access-token"] || req.headers["authorization"]) {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    // remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // token is not valid
        req.user = null;
        next();
      } else {
        // user is signed in, but we need to check if the username still exists
        const query = `
          SELECT * FROM user WHERE username = ?;
        `;
        execQuery("select", query, [decoded.username])
          .then(async (result) => {
            if (!result) {
              req.user = null;
              next();
            }
            // got login info and user if verified
            req.user = result[0];
            next();
          })
          .catch((err) => {
            console.log(err);
            req.user = null;
            return res.status(500).json({ message: "Server error" });
          });
      }
    });
  } else {
    // no jwt token found
    req.user = null;
    next();
  }
};

exports.requireLogin = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res
      .status(200)
      .json({ message: "You need to be signed in to perform that action." });
  }
};

exports.verifyUsername = async (req, res, next) => {};

exports.getUserType = async (req, res, next) => {};

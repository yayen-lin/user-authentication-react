/**
 * middleware is run on the server-side.
 * - It is run before any of the code in the routes to verify that the user
 *   making the request is authorized
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * src: https://github.com/Scavenge-UW/Scavenge
 */

// TODO: remove debugging console.log

const jwt = require("jsonwebtoken");
const Response = require("../helpers/response");
const Utils = require("../helpers/utils");
const { promisify } = require("util");
const { execQuery } = require("../query");

/**
 *
 * @returns
 */
exports.authenticate = () => {
  console.log("got here");
  return (req, res, next) => {
    try {
      let token =
        req.headers["x-access-token"] ||
        req.headers.authorization ||
        req.body.token;

      console.log(token, "token");

      if (!token) throw new Error("No token provided.");
      if (token.startsWith("Bearer ")) token = token.slice(7, token.length);

      if (!token || token === "" || token === "undefined")
        throw new Error("No token provided.");

      const user = Utils.verifyJWT(token);

      if (!user) throw new Error("Failed to authenticate token.");

      res.user = user.data;
      delete user.data.password;
      res.token = token;
      return next();
    } catch (e) {
      return Response.sendErrorResponse({
        res,
        message: "Failed to authenticate token",
        statusCode: 401,
      });
    }
  };
};

/**
 * decode header middleware
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.decodeHeader = (req, res, next) => {
  console.log("--------------------------------------------------");
  console.log(req.cookies["Carmax168_cookie"]);
  let token =
    req.headers["x-access-token"] ||
    req.headers.authorization ||
    req.body.token ||
    req.cookies["Carmax168_cookie"];
  console.log(token, "------------------");

  if (!token) {
    return Response.sendErrorResponse({
      res,
      message: "No token provided",
      statusCode: 401,
    });
  }

  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
    if (!token || token === "")
      Response.sendErrorResponse({
        res,
        message: "No token provided",
        statusCode: 401,
      });
  }

  const decoded = Utils.verifyJWT(token);
  if (!decoded)
    Response.sendErrorResponse({
      res,
      message: "invalid signature",
      statusCode: 403,
    });

  if (decoded) res.user = decoded;
  res.token = token;
  return next();
};

/**
 * require login middleware
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.requireLogin = async (req, res, next) => {
  console.log("auth.middleware - requireLogin");
  if (res.user) {
    next();
  } else {
    Response.sendErrorResponse({
      res,
      message: "You need to be signed in to perform that action.",
      statusCode: 403,
    });
  }
};

exports.verifyUsername = async (req, res, next) => {};

exports.getUserType = async (req, res, next) => {};

// =======================================================================
/*
 * Helper middleware function that verifies if a user is truly logged in.
 * Sets req.user to the user; otherwise, user will be null.
 */
exports.verifyAndGetUserInfo = async (req, res, next) => {
  if (req.cookies.Carmax168_cookie) {
    // async returns a promise after the await
    // verify is from jwt
    // 1. verify the token
    const decoded = await promisify(jwt.verify)(
      req.cookies.Carmax168_cookie,
      process.env.JWT_SECRET
    );
    console.log("decoded jwt: ", decoded);

    // 2. check if the user still exists and get user info from DB
    const query = `SELECT * FROM users WHERE username = ?;`;
    execQuery("select", query, [decoded.username])
      .then(async (result) => {
        if (!result) {
          // if user doesn't exist in the database
          req.user = null;
          next();
          return Response.sendErrorResponse({
            res,
            message: "Unauthorized User Access",
            statusCode: 501,
          });
        } else {
          // user is verified
          // req.user = result[0];
          res.user = result[0];
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
  } else if (
    req.headers["x-access-token"] ||
    req.headers["authorization"] ||
    req.body.token
  ) {
    let token =
      req.headers["x-access-token"] ||
      req.headers["authorization"] ||
      req.body.token;

    if (!token) throw new Error("No token provided.");

    // remove Bearer from string
    if (token.startsWith("Bearer ")) token = token.slice(7, token.length);

    if (!token || token === "" || token === "undefined")
      throw new Error("No token provided.");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // token is not valid
        req.user = null;
        next();
      } else {
        // user is signed in, but we need to check if the username exists
        const query = `SELECT * FROM users WHERE username = ?;`;
        execQuery("select", query, [decoded.username])
          .then(async (result) => {
            if (!result) {
              // if user doesn't exist in the database
              req.user = null;
              next();
              return res.status(501).json({
                message: "Unauthorized User Access",
              });
            }
            // got login info and user is verified
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

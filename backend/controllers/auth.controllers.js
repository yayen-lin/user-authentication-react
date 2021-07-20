/**
 * Admin login/signup/update/delete actions which execute the queries defined in auth.models.js.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * src: https://github.com/Scavenge-UW/Scavenge
 */

// TODO: remove console log debugging output
// TODO: return json auth needs to be re-determined

// our db for auth action
const authDB = require("../models/auth.models.js");

// helper functions
const Utils = require("../helpers/utils");
const Response = require("../helpers/response");
const Validation = require("../helpers/validation");
const datetimeConverter = require("../helpers/datetimeConverter");

// tools
const moment = require("moment");
const session = require("express-session");

/* -------------------------------------- cookie setting -------------------------------------- */
let refreshTokensByID = {}; // { manager_id: refreshToken }
// cookie setting w/ access token
const accessCookieOptions = {
  // cookie expires after 90 mins from the time it is set.
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_ACCESS_EXPIRES * 60 * 1000
  ),
  httpOnly: true, // for security reason it's recommended to set httpOnly to true
  sameSite: true,
};

// cookie setting w/ refresh token
const refreshCookieOptions = {
  // cookie expires after 3 days from the time it is set.
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_REFRESH_EXPIRES * 60 * 60 * 1000
  ),
  httpOnly: true, // for security reason it's recommended to set httpOnly to true
  sameSite: true,
};

/**
 * Admin sign up action
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.adminSignupAction = (req, res) => {
  const { username, firstname, lastname, password } = req.body;

  const privilegeDefault = "3";
  const activeDefault = "1";
  const createdOn = datetimeConverter.toMySqlDateTime(moment(new Date()));

  // check username
  if (!Validation.validateUsername(username)) {
    return Response.sendErrorResponse({
      res,
      message: "Please provide a valid username",
      statusCode: 400,
    });
  }

  // check password
  if (!Validation.validatePassword(password)) {
    return Response.sendErrorResponse({
      res,
      message: "Please provide a valid password",
      statusCode: 400,
    });
  }

  // hash + salt password
  const hash = Utils.hashPassword(password);

  // new user info
  const vals = [
    username,
    firstname || null,
    lastname || null,
    hash,
    privilegeDefault,
    activeDefault,
    createdOn,
  ];

  authDB
    .adminSignup(req, res, vals)
    .then(async (rows) => {
      console.log("auth.controllers - signup - rows = ", rows);

      // TODO: check and remove password if exists in response
      // dbResponse = rows[0];
      // delete dbResponse.password;

      return Response.sendResponse({
        res,
        responseBody: { user: rows /*dbResponse*/ },
        statusCode: 201,
        message: "User successfully created",
      });
    })
    .catch((err) => {
      console.log(err, "error");
      return Response.sendErrorResponse({
        res,
        message: error,
        statusCode: 500,
      });
    });
};

/**
 * Admin login action
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.adminLoginAction = (req, res) => {
  const { username, password } = req.body;

  if (Validation.isEmpty(username) || !Validation.validateUsername(username)) {
    return Response.sendErrorResponse({
      res,
      message: "Username is missing.",
      statusCode: 400,
    });
  }

  if (Validation.isEmpty(password) || !Validation.validatePassword(password)) {
    return Response.sendErrorResponse({
      res,
      message: "Password is missing.",
      statusCode: 400,
    });
  }

  authDB
    .adminLogin(req, res, username)
    .then(async (results) => {
      console.log("auth.controllers - login - results = ", results);

      // results =  [
      //   RowDataPacket {
      //     manager_id: 6,
      //     username: 'andy-01',
      //     firstname: 'Yayen',
      //     lastname: 'Lin',
      //     password: '$2a$10$LSBVvNc8IU.mA9lKHHKka.vmv./MpDVax.5XZRJoxqvqqPzFZJny6',
      //     privilege: '3',
      //     active: '1',
      //     createdOn: 2021-07-11T09:48:55.000Z
      //   }
      // ]

      const dbResponse = results[0];

      if (!dbResponse)
        return Response.sendErrorResponse({
          res,
          message: "Username does not exist.",
          statusCode: 400,
        });

      if (!Validation.comparePassword(dbResponse.password, password))
        return Response.sendErrorResponse({
          res,
          message: "The password you provided is incorrect",
          statusCode: 400,
        });

      // login successfully
      console.log("Logged in successfully!");
      console.log("dbResponse", dbResponse);

      // access token - give users access to protected resources
      const token = Utils.generateJWT(dbResponse); // passing payload to jwt

      // refresh token - allow users request new tokens
      const refreshExpiry = moment()
        .utc()
        .add(3, "days")
        .endOf("day")
        .format("X");
      const refreshToken = Utils.generateJWT({
        exp: parseInt(refreshExpiry),
        data: dbResponse.manager_id,
      });

      // add cookies to the response
      res.cookie(process.env.JWT_ACCESS, token, accessCookieOptions);
      res.cookie(process.env.JWT_REFRESH, refreshToken, refreshCookieOptions);

      // add refreshToken to our refreshToken obj
      refreshTokensByID[dbResponse.manager_id] = refreshToken;
      console.log("added to refershTokensByID: ", refreshTokensByID);

      // FIXME: create session for logged in user.
      let sess = req.session;
      sess.user_id = dbResponse.manager_id;
      console.log("session", sess);

      delete dbResponse.password; // removed password before return
      return Response.sendResponse({
        res,
        responseBody: {
          user: dbResponse,
          token,
          refresh: refreshToken,
        },
        message: "Login successful.",
      });
    })
    .catch((err) => {
      console.log(err);
      return Response.sendErrorResponse({
        res,
        message: err,
        statusCode: 500,
      });
    });
};

/**
 * fetch logged in user info
 *
 * @param {*} req
 * @param {*} res
 * @returns current logged in user info
 */
exports.me = async (req, res) => {
  const { user, token, tokenExp, toRefresh } = res;

  console.log(res.user);
  delete res.user.iat;
  delete res.user.exp;
  delete res.user.aud;
  delete res.user.iss;
  delete res.user.sub;
  delete res.user.password;
  try {
    return Response.sendResponse({
      res,
      message: "User details successfully fetched",
      responseBody: {
        user: user,
        token: token,
        refresh: refreshTokensByID[user.manager_id],
        tokenExp: tokenExp,
        toRefresh: toRefresh,
      },
    });
  } catch (error) {
    console.log(error);
    return Response.sendErrorResponse({
      res,
      message: "Unable to fetch currently logged in user information.",
      statusCode: 400,
    });
  }
};

/**
 * if access token has expired, renew the access token and call next();
 * if not, call next(); directly.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.refreshTokenAction = async (req, res) => {
  // console.log("----------------------------------------- req");
  // console.log(req.token);
  // console.log(req.user);
  // console.log(req.sessionID);
  // console.log("----------------------------------------- res");
  // console.log(res.token);
  // console.log(res.user);

  const { user } = req.body;

  // console.log("res", res.user.manager_id);
  const refresh = refreshTokensByID[user.manager_id];

  // FIXME: refresh turns undefined sometimes
  console.log("refresh", refresh);
  // if refresh token missing
  if (!refresh)
    return Response.sendErrorResponse({
      res,
      message: "No refresh token provided.",
      statusCode: 403,
    });

  // if refresh token expires
  if (refresh) {
    try {
      const decoded = Utils.verifyJWT(refresh);
      // {
      //   exp: 1626825599,
      //   data: 6,
      //   iat: 1626500973,
      //   aud: 'jwt-node',
      //   iss: 'jwt-node',
      //   sub: 'jwt-node'
      // }
      const exp = decoded.exp || null;
      const now = new Date(Date.now()).getTime() / 1000;

      // if no exp in decoded or id doesn't match
      if (!exp || decoded.data !== user.manager_id)
        return Response.sendErrorResponse({
          res,
          message: "Invalid refresh token.",
          statusCode: 403,
        });

      console.log("Got here - 1");

      // if refresh token expires
      if (now > exp)
        return Response.sendErrorResponse({
          res,
          message: "Refresh token expired, please log back in again.",
          statusCode: 403,
        });

      console.log("Got here - 2");

      // generate new access token using logged in user's info
      const newToken = Utils.generateJWT(user);

      // clear the old cookie
      res.clearCookie(process.env.JWT_ACCESS);
      // add the new cookie to response
      res.cookie(process.env.JWT_ACCESS, newToken, accessCookieOptions);

      console.log("Got here - 3");
      console.log(res.user); // FIXME: undefined?

      return Response.sendResponse({
        res,
        message: "Token renewed.",
        responseBody: {
          user: res.user,
          token: newToken,
          refresh: refresh,
        },
        statusCode: 200,
      });
    } catch (err) {
      console.log(err);
      return Response.sendErrorResponse({
        res,
        message: err,
        statusCode: 500,
      });
    }
  }
};

/**
 * Admin logout action
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.adminLogoutAction = (req, res) => {
  console.log("LOGGIN OUT!!");

  // replace cookie with logout cookie
  res.cookie(process.env.JWT_ACCESS, "logout", {
    // cookie expires after 2 sec from the time it is set.
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
    sameSite: true,
  });

  // replace refresh cookie with logout cookie
  res.cookie(process.env.JWT_REFRESH, "logout", {
    // cookie expires after 2 sec from the time it is set.
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
    sameSite: true,
  });

  // destroy session
  req.session.destroy((err) => {
    if (err)
      return Response.sendErrorResponse({
        res,
        message: "Something happened while destroying the session.",
        statusCode: 400,
      });
  });

  try {
    return Response.sendResponse({
      res,
      message: "Successfully logged out.",
      statusCode: 200,
    });
  } catch (error) {
    console.log(errer);
    return Response.sendErrorResponse({
      res,
      message: "Unable to log out.",
      statusCode: 400,
    });
  }
};

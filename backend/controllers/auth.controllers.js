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

      // cookie setting
      const cookieOptions = {
        // cookie expires after 90 mins from the time it is set.
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 1000
        ),
        httpOnly: true, // for security reason it's recommended to set httpOnly to true
        sameSite: true,
      };

      // adds cookie to the response
      res.cookie(process.env.JWT_NAME, token, cookieOptions);

      // TODO: create session for logged in user.
      let sess = req.session; // a server-side key/val store
      sess.user_id = dbResponse.manager_id;
      console.log("YOYOYO! session = ", sess);

      delete dbResponse.password;
      return Response.sendResponse({
        res,
        responseBody: { user: dbResponse, token, refresh: refreshToken },
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
 * @param {*} req
 * @param {*} res
 * @returns current logged in user info
 */
exports.me = async (req, res) => {
  console.log("res.token: ");
  console.log(res.token);
  console.log("req.sessionID: ");
  console.log(req.sessionID);
  console.log(req.session);
  try {
    return Response.sendResponse({
      res,
      message: "User details successfully fetched",
      responseBody: {
        username: res.user.username,
        firstname: res.user.firstname || null,
        lastname: res.user.lastname || null,
        manager_id: res.user.manager_id,
        privilege: res.user.privilege,
        active: res.user.active,
        token: res.token,
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

exports.adminLogoutAction = (req, res) => {
  console.log("LOGGIN OUT!!");

  // replace cookie
  res.cookie("Carmax168_cookie", "logout", {
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

// // TODO: session is not 'destroyed' and cookie is not 'cleared';
// exports.adminLogoutAction = (req, res) => {
//   console.log("auth.controllers - logout");
//   res.cookie("Carmax168_cookie", "logout", {
//     // cookie expires after 2 sec from the time it is set.
//     expires: new Date(Date.now() + 2 * 1000),
//     httpOnly: true,
//   });
//   console.log("req.session before destroyed: ", req.session);

//   // session destroy set current session to undefined
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(200).json({
//         auth: true,
//         message: "Failed to destroy session during logout",
//       });
//     }
//   });
//   console.log("session destroyed");
//   console.log("req.session after destroyed: ", req.session);
//   return res.status(200).json({
//     auth: false,
//     message: "Successfully logged out!",
//   });
// };

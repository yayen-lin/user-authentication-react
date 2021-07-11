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
const Validation = require("../helpers/validation");
const Response = require("../helpers/response");
const Utils = require("../helpers/utils");

// tools
const moment = require("moment");
// const session = require("express-session");

/**
 * Admin sign up action
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.adminSignupAction = (req, res) => {
  // const newUser = {
  //   username: req.body.username,
  //   firstname: req.body.firstname,
  //   lastname: req.body.lastname,
  //   password: req.body.password,
  // };

  const { username, firstname, lastname, password } = req.body;

  const privilegeDefault = "3";
  const activeDefault = "1";
  const createdOn = moment(new Date());

  // check username
  if (!Validation.validateUsername(username)) {
    return Response.sendErrorResponse({
      res,
      message: "Please provide a valid username",
      statusCode: 400,
    });
  }

  // check password
  if (!Validation.validatePasswrod(password)) {
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

      dbResponse = rows[0];
      delete dbResponse.password;

      return Response.sendResponse({
        res,
        responseBody: { user: dbResponse },
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

exports.adminLoginAction = (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  if (
    !user.username ||
    !user.password ||
    user.username === "" ||
    user.password === ""
  ) {
    return res.status(200).json({
      message: "Please provide a username and password.",
    });
  }

  authDB
    .adminLogin(req, res, user)
    .then(async (results) => {
      console.log("auth.controllers - login - results = ", results);
      // if result is not returned or password is incorrect with `bcrypt.compare`
      if (
        !results[0] ||
        !(await bcrypt.compare(req.body.password, results[0].password))
      ) {
        // wrong password
        return res.status(200).json({
          auth: false,
          message: "Username or password is incorrect.",
        });
      } else {
        // login successfully
        console.log("Logged in successfully!");

        // TODO: create session for logged in user.
        // let sess = req.session; // a server-side key/val store
        // sess.user = results[0].username;
        // sess.privilege = results[0].privilege;
        // console.log("YOYOYO! session = ", sess);

        // create jwt
        const username = results[0].username;
        const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        // cookie setting
        const cookieOptions = {
          // cookie expires after 90 mins from the time it is set.
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 1000
          ),
          httpOnly: true, // for security reason it's recommended to set httpOnly to true
        };

        // adds cookie to the response
        res.cookie("Carmax168_cookie", token, cookieOptions);

        return res.status(200).json({
          auth: true,
          username: username,
          token: token,
          profile: {
            username: results[0].username,
            privilege: results[0].privilege,
          },
          results: results,
        });
      }
    })
    .catch((err) => {
      // Reject case
      console.log(err);
      return res.status(500).json({
        auth: false,
        messsage: "Login failed due to server error.",
      });
    });
};

exports.adminUpdateUserAction = (req, res) => {
  const newInfo = {
    username: req.body.username,
    password: req.body.password,
    privilege: req.body.privilege,
  };

  if (
    !newInfo.username ||
    !newInfo.password ||
    newInfo.username === "" ||
    newInfo.password === ""
  ) {
    return res.status(200).json({
      auth: true,
      message: "Please provide a username and password.",
    });
  }

  authDB
    .adminUpdate(req, res, newInfo)
    .then(async (data) => {
      console.log("auth.controllers - update - data = ", data);
      console.log("auth.controllers - update - newInfo = ", newInfo);
      // create token and insert cookie
      const token = jwt.sign(
        { username: newInfo.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // create cookie
      const cookieOptions = {
        // cookie expires after 90 mins from the time it is set.
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 1000
        ),
        httpOnly: true,
      };

      // can specify any name for cookie
      // need to decode the token to get username
      res.cookie("Carmax168_cookie", token, cookieOptions);
      console.log("YOYOYO! TOKEN: ", token);

      return res.status(200).json({
        auth: true,
        username: newInfo.username,
        token: token,
        profile: {
          username: newInfo.username,
          privilege: newInfo.privilege,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        auth: true,
        message: "Failed to update user due to server error.",
      });
    });
};

exports.adminDeleteUserAction = (req, res) => {
  authDB
    .adminDelete(req, res)
    .then((data) => {
      //set cookie to user logged out
      console.log("auth.controllers - delete - data = ", data);
      res.cookie("Carmax168_cookie", "logout", {
        // cookie expires after 2 sec from the time it is set.
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
      });

      return res.status(200).json({
        auth: true,
        message: "User account deleted.",
      });
    })
    .catch((err) => {
      return res.status(500).json({
        auth: true,
        message: "Failed to delete user due to server error.",
      });
    });
};

// TODO: session is not 'destroyed' and cookie is not 'cleared';
exports.adminLogoutAction = (req, res) => {
  console.log("auth.controllers - logout");
  res.cookie("Carmax168_cookie", "logout", {
    // cookie expires after 2 sec from the time it is set.
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  console.log("req.session before destroyed: ", req.session);

  // session destroy set current session to undefined
  req.session.destroy((err) => {
    if (err) {
      return res.status(200).json({
        auth: true,
        message: "Failed to destroy session during logout",
      });
    }
  });
  console.log("session destroyed");
  console.log("req.session after destroyed: ", req.session);
  return res.status(200).json({
    auth: false,
    message: "Successfully logged out!",
  });
};

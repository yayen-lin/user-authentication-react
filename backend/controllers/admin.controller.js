/**
 * Admin login/signup/update/delete actions which execute the queries defined in auth.models.js.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * src: https://github.com/Scavenge-UW/Scavenge
 */

// TODO: remove console log debugging output
// TODO: return json auth needs to be re-determined

// const session = require("express-session");
const adminDB = require("../models/admin.models.js");

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

  adminDB
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

      // get type
      // try {
      //   var userType = await authDB.adminGetPrivilege(req, res, newInfo);
      // } catch (error) {
      //   console.log(error);
      //   return res.status(500).json({
      //     auth: true,
      //     messsage: "User privilege lookup failed due to server error.",
      //   });
      // }
      // var uType = userType[0].privilege;

      // // get employee-of status
      // // this will always return an empty array for signup because a new user cannot immediately be an employee
      // try {
      //   var pantries = await db1.isEmployeeOf(req, res, newInfo);
      // } catch (err) {
      //   console.log(err);
      //   return res.status(500).json({
      //     messsage: "Employee of pantries lookup failed due to server error.",
      //   });
      // }

      // // make into array
      // var pantriesArr = [];
      // pantries.forEach((obj, index) => {
      //   pantriesArr[index] = obj["pantry_id"];
      // });

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
  adminDB
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

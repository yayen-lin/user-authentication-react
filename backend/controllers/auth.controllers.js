/**
 * Admin login/signup/update/delete actions which execute the queries defined in auth.models.js.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * src: https://github.com/Scavenge-UW/Scavenge
 */

const authDB = require("../models/auth.models.js");
const userDB = require("../models/user.models.js");

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
      // if result is not returned or password is incorrect after `bcrypt.compare`
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

        // create jwt
        const username = results[0].username;
        const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        // TODO: create session for logged in user.
        req.session.user = results;
        console.log(req.session.user);

        // create cookie
        const cookieOptions = {
          expires: { maxAge: 360000 }, // cookie expires after 360000 ms from the time it is set.
          httpOnly: true,
        };

        // can specify any name for cookie - insert cookie
        res.cookie("Carmax168Cookie", token, cookieOptions);

        console.log(token);
        //console.log(results[0]);

        // TODO: user models
        // // get employee-of status
        // try {
        //   pantries = await db1.isEmployeeOf(req, res, user);
        // } catch (e) {
        //   console.log(e);
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

exports.adminSignupAction = (req, res) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
    privilege: req.body.privilege,
  };

  if (
    !newUser.username ||
    !newUser.password ||
    newUser.username === "" ||
    newUser.password === ""
  ) {
    return res.status(200).json({
      auth: false,
      message: "Please provide a username and password.",
    });
  }

  authDB
    .adminSignup(req, res, newUser)
    .then(async (data) => {
      // create jwt
      const token = jwt.sign(
        { username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // create cookie
      const cookieOptions = {
        expires: { maxAge: 360000 }, // cookie expires after 360000 ms from the time it is set.
        httpOnly: true,
      };

      // can specify any name for cookie
      // need to decode the token to get username
      res.cookie("Carmax168Cookie", token, cookieOptions);
      console.log(token);

      // get type
      try {
        var userType = await authDB.adminGetPrivilege(req, res, newUser);
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          auth: false,
          messsage: "User privilege lookup failed due to server error.",
        });
      }
      var uType = userType[0].privilege;

      // TODO: user.models
      // get employee-of status
      // this will always return an empty array for signup because a new user cannot immediately be an employee
      // try {
      //   var pantries = await db1.isEmployeeOf(req, res, newUser);
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
        auth: false,
        username: newUser.username,
        token: token,
        profile: {
          username: newUser.username,
          privilege: uType,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      // Duplicate username error
      return res.status(200).json({
        auth: false,
        message: err,
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
      // create token and insert cookie
      const token = jwt.sign(
        { username: newInfo.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // create cookie
      const cookieOptions = {
        expires: { maxAge: 360000 }, // cookie expires after 360000 ms from the time it is set.
        httpOnly: true,
      };

      // can specify any name for cookie
      // need to decode the token to get username
      res.cookie("Carmax168Cookie", token, cookieOptions);
      console.log(token);

      // get type
      try {
        var userType = await authDB.adminGetPrivilege(req, res, newInfo);
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          auth: true,
          messsage: "User privilege lookup failed due to server error.",
        });
      }
      var uType = userType[0].privilege;

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
          privilege: uType,
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

exports.deleteUserAction = (req, res) => {
  authDB
    .adminDelete(req, res)
    .then((data) => {
      //set cookie to user logged out
      res.cookie("Carmax168Cookie", "logout", {
        expires: { maxAge: 2000 }, // cookie expires after 2000 ms from the time it is set.
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

exports.logoutAction = (req, res) => {
  res.cookie("Carmax168Cookie", "logout", {
    expires: { maxAge: 2000 }, // cookie expires after 2000 ms from the time it is set.
    httpOnly: true,
  });
  return res.status(200).json({
    auth: false,
    message: "Successfully logged out!",
  });
};

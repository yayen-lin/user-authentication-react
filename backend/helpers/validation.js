/**
 * Processing input validation such as password, username, etc.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

const Joi = require("joi");
const authDB = require("../models/auth.models");
const { execQuery } = require("../query");
const Response = require("./response");

const passwordMinLength = 2;
const usernameMinLength = 2;

/**
 * validateUsername helper method
 *
 * @param {string} username
 * @returns {Boolean} true if the username is valid, false otherwise.
 */
exports.validateUsername = (username) => {
  if (!username || username == "" || username.length <= usernameMinLength)
    return false;
  return true;
};

/**
 * validatePassword helper method
 *
 * @param {string} password
 * @returns {Boolean} true if the password is valid, false otherwise.
 */
exports.validatePassword = (password) => {
  if (!password || password === "" || password.length <= passwordMinLength)
    return false;
  return true;
};

/**
 * isValidEmail helper method
 *
 * @param {string} email
 * @returns {Boolean} true if the email is valid, false otherwise.
 */
exports.isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

/**
 * isEmpty helper method
 *
 * @param {string, integer} input
 * @returns {Boolean} true if the given input is undefined or empty "", false otherwise.
 */
const isEmpty = (input) => {
  // undefined or empty
  if (input === undefined || input === "") return true;
  // replace input string with "" and the length > 0 returns false
  if (input.replace(/\s/g, "").length) return false;
  return true;
};

/**
 * check for duplicate user.
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.checkDuplicateUser = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    password: Joi.string().required(),
  });

  const result = schema.validate(req.body);

  if (result.error)
    return Response.sendErrorReponse({
      res,
      message: result.error.details[0].message.replace(/['"]/g, ""),
      statusCode: 422,
    });

  authDB.checkForUsername(req, res, req.body.username).then(async (rows) => {
    const dbResponse = rows[0];
    if (dbResponse)
      return Response.sendErrorResponse({
        res,
        message: "This username already exists, please provide a new username",
      });
    return next();
  });
};

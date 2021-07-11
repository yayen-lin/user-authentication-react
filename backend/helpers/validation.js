/**
 * Processing input validation such as password, username, etc.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

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

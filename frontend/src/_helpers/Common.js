/**
 * get user/token from session storage if user is logged in
 * and set/remove user and token to/from the session storage
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * @reference https://github.com/cluemediator/login-app-reactjs/blob/684f0babd293054a7a119b2ab4ef5f42c389b74e/src/Utils/Common.js
 */

// return user data from session storage
export const getUser = () => {
  const username = sessionStorage.getItem("user");
  if (username) return JSON.parse(username);
  else return null;
};

// return token from session storage
export const getToken = () => {
  return sessionStorage.getItem("token") || null;
};

// remove token and user from session storage
export const removeUserSession = () => {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
};

// set token and user to session storage
export const setUserSession = (username, token) => {
  sessionStorage.setItem("user", username);
  sessionStorage.setItem("token", token);
};

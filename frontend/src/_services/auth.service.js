/**
 * Handling requests from the frontend and send to the backend
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * @reference https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example#fake-backend-js
 *            https://github.com/Scavenge-UW/Scavenge
 */

import request from "./request";

// TODO: remove debugging console.log
// TODO: change user.username, user.firstname, ..., to just user

// send the request to the backend (PORT=8080) (see query.js)

/**
 * Log in, a POST request that is sent to the server
 *
 * @param {*} userinfo contains the user info for the user that has just sent login request
 * @returns a request object
 */
function login(user) {
  console.log("auth.service - login - user = ", user);
  return request({
    method: "POST",
    url: "/adminLogin",
    headers: { "Content-Type": "application/json" },
    data: {
      username: user.username,
      password: user.password,
    },
    // withCredentials: true,
  }).then((response) => {
    return response;
  });
}

/**
 * Sign up, a POST request that is sent to the server
 *
 * @param {*} user contains the user info for the user that has just signed up
 * @returns a request object
 */
function signup(user) {
  console.log("auth.service - signup - user = ", user);
  return request({
    method: "POST",
    url: "/adminSignup",
    data: {
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      password: user.password,
    },
    // withCredentials: true,
  });
}

function logout(token) {
  console.log("auth.service - logout");
  return request({
    method: "POST",
    url: "/adminLogout",
    withCredentials: true,
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });
}

function getUserInfo(token) {
  return request({
    method: "GET",
    url: "/me",
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function refreshToken(user) {
  console.log("refresh token - auth service");
  console.log("user", user);
  return request({
    method: "POST",
    url: "/refreshToken",
    withCredentials: true,
    data: {
      user: user,
    },
  });
}

function editProfile(user, token) {
  console.log("auth.service - editProfile - user = ", user);
  console.log("auth.service - editProfile - token = ", token);

  return request({
    method: "PUT",
    url: "/" + user.username,
    data: {
      username: user.username,
      password: user.password,
      privilege: user.privilege,
    },
    // jwt is stored in http request header after first http request
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
}

function remove(user, token) {
  console.log("auth.service - remove - user = ", user);
  console.log("auth.service - remove - token = ", token);

  return request({
    method: "DELETE",
    url: "/" + user.username,
    data: {
      username: user.username,
      password: user.password,
      privilege: user.privilege,
    },
    // jwt is stored in http request header after first http request
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
}

const AuthService = {
  login,
  signup,
  logout,
  getUserInfo,
  refreshToken,

  // not implemented yet
  editProfile,
  remove,
};
export default AuthService;

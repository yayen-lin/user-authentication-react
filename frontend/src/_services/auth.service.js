/**
 * Handling requests from the frontend and send to the backend
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * @reference https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example#fake-backend-js
 *            https://github.com/Scavenge-UW/Scavenge
 */

import request from "./request";

import { setUserSession, removeUserSession } from "../_helpers/Common";

// TODO: remove debugging console.log

// send the request to the backend (PORT=8080) (see query.js)

/**
 * Log in, a POST request that is sent to the server
 *
 * @param {*} userinfo contains the user info for the user that has just sent login request
 * @returns a request object
 */
function login(userinfo) {
  console.log("auth.service - login - userinfo = ", userinfo);
  return request({
    method: "POST",
    url: "/login",
    headers: { "Content-Type": "application/json" },
    data: {
      username: userinfo.username,
      password: userinfo.password,
    },
    withCredentials: true,
  }).then((response) => {
    console.log(response);
    setUserSession(response.username, response.token);

    return response;
  });
}

function verifyToken(token) {
  return request({
    method: "GET",
    url: `/verifyToken?token=${token}`,
    data: {
      token: token,
    },
    withCredential: true,
  })
    .then((response) => {
      setUserSession(response.user, response.token);
    })
    .catch((error) => {
      removeUserSession();
      console.log(
        `An error occurred while verifying token. error message: ${error}`
      );
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
    url: "/signup",
    data: {
      username: user.username,
      password: user.password,
      privilege: user.privilege,
    },
    withCredentials: true,
  });
}

function logout() {
  console.log("auth.service - logout");
  return request({
    method: "POST",
    url: "/logout",
    withCredentials: true,
  }).then(() => {
    removeUserSession();
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
    method: "delete",
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
  verifyToken,
  signup,
  logout,
  editProfile,
  remove,
};
export default AuthService;

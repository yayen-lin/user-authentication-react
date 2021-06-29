/**
 * Handling requests from the frontend and send to the backend
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * @reference https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example#fake-backend-js
 *            https://github.com/Scavenge-UW/Scavenge
 */

import request from "./request";
import { BehaviorSubject } from "rxjs";

// don't worry about unsubscribing from the observable here because it's the root component
//  of the application, so the only time the component will be destroyed is when the
// application is closed which would destroy any subscriptions as well.
const currentUserSubject = new BehaviorSubject(
  localStorage.getItem("currentUser")
);

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
  }).then((resData) => {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem("currentUser", JSON.stringify(resData));
    currentUserSubject.next(resData); // TODO: this stores username and token in the Subject

    return resData;
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
    url: "/signup",
    method: "POST",
    data: {
      username: user.username,
      password: user.password,
      privilege: user.privilege,
    },
    withCredentials: true,
  });
}

function editProfile(user, token) {
  console.log("auth.service - editProfile - user = ", user);
  console.log("auth.service - editProfile - token = ", token);

  return request({
    url: "/" + user.username,
    method: "PUT",
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

function logout() {
  console.log("auth.service - logout");
  // remove user from local storage to log user out
  console.log("Removing currentUser in local storage.");
  localStorage.removeItem("currentUser");
  currentUserSubject.next(null);
  return request({
    url: "/logout",
    method: "POST",
    withCredentials: true,
  });
}

// TEST: remove
function isAuth(user, token) {
  // TODO: add is_auth user
  console.log("auth.service - isAuth - user = ", user);
  console.log("auth.service - isAuth - token = ", token);

  return request({
    url: "/isAuth",
    method: "GET",
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

function isLoggedIn(username) {
  return request({
    url: "/isLoggedIn",
    method: "GET",
    data: { username: username },
  });
}

const AuthService = {
  signup,
  login,
  editProfile,
  logout,
  isAuth, // TEST: remove
  isLoggedIn,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
};
export default AuthService;

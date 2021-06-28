import request from "./request";

// TODO: remove debugging console.log

// send the request to the backend (PORT=8080) (see query.js)

/**
 * Log in, a POST request that is sent to the server
 *
 * @param {*} user contains the user info for the user that has just sent login request
 * @returns a request object
 */
function login(user) {
  console.log("auth.service - login - user = ", user);
  return request({
    url: "/login",
    method: "POST",
    data: {
      username: user.username,
      password: user.password,
    },
    withCredentials: true,
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

function logout(user) {
  console.log("auth.service - logout - user = ", user);
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
};

export default AuthService;

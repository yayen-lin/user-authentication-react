import request from "./request";

// TODO: remove debugging console.log

// send the request to the backend (PORT=8080) (see query.js)

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
      previlege: user.previlege,
    },
    withCredentials: true,
  });
}

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

function editProfile(user, token) {
  console.log("auth.service - editProfile - user = ", user);
  return request({
    url: "/" + user.username,
    method: "PUT",
    data: {
      username: user.username,
      password: user.password,
      previlege: user.previlege,
    },
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

const AuthService = {
  signup,
  login,
  editProfile,
  logout,
};

export default AuthService;

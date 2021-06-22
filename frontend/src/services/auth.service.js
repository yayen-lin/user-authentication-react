import request from "./request";

// send the request to the backend (PORT=8080) (see query.js)

/**
 * Sign up, a POST request that is sent to the server
 *
 * @param {*} user contains the user info for the user that has just signed up
 * @returns a request object
 */
function signup(user) {
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

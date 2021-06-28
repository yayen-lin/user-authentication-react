import { userConstants } from "../constants/user.constants";

// TODO: remove debugging console.log
console.log(localStorage.getItem("user"));
let user = localStorage.getItem("user");
const initialState = user ? { loggedIn: true, user } : {};

export function authentication(state = initialState, action) {
  console.log("auth.reducer - authentication - initialState = ", initialState);
  console.log("auth.reducer - authentication - action = ", action);

  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user,
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    default:
      return state;
  }
}

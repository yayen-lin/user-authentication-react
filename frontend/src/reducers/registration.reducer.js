import { userConstants } from "../constants/user.constants";
// TODO: remove debugging console.log
export function registration(state = {}, action) {
  console.log("registration.reducer - registration - action = ", action);

  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return { registering: true };
    case userConstants.REGISTER_SUCCESS:
      return {};
    case userConstants.REGISTER_FAILURE:
      return {};
    default:
      return state;
  }
}

import { alertConstants } from "../constants/alert.constants";

// TODO: remove debugging console.log
export function alert(state = {}, action) {
  console.log("alert.reducer - alert - action = ", action);
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: "alert-success",
        message: action.message,
      };
    case alertConstants.ERROR:
      return {
        type: "alert-danger",
        message: action.message,
      };
    case alertConstants.CLEAR:
      return {};
    default:
      return state;
  }
}

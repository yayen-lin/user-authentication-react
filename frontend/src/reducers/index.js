import { combineReducers } from "redux";
import { alert } from "./alert.reducer";
import { authentication } from "./auth.reducer";
import { registration } from "./registration.reducer";
import { user } from "./user.reducer";

console.log('"./reducers/" is accessed');

export default combineReducers({
  auth: authentication,
  user: user,
  alert: alert,
  registration: registration,
});

import { EDIT_PROFILE } from "./types";
import AuthService from "../services/auth.service";
// TODO: remove debugging console.log
export const editProf = (user, token) => (dispatch) => {
  console.log("auth.actions - editProf - user = ", user);
  console.log("auth.actions - editProf - token = ", token);

  AuthService.editProfile(user, token)
    .then((res) => res.json())
    .then((prof) =>
      dispatch({
        type: EDIT_PROFILE,
        payload: prof,
      })
    );
};

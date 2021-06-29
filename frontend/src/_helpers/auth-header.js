import AuthService from "../_services/auth.service";

// TODO: remove debuging output
export function authHeader() {
  // return authorization header with jwt token
  const currentUser = AuthService.currentUserValue;
  console.log("auth.header - currentUser = ", currentUser);
  if (currentUser && currentUser.token) {
    return { Authorization: `Bearer ${currentUser.token}` };
  } else {
    return {};
  }
}

/**
 * Handling requests from the frontend and send to the backend
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * @reference https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example#fake-backend-js
 *            https://github.com/Scavenge-UW/Scavenge
 */

import axios from "axios";
import AuthService from "./auth.service";

let baseURL = "http://localhost:8080";
if (process.env.NODE_ENV === "production") {
  baseURL = "https://www.carmax168.com/";
}

const client = axios.create({
  baseURL: baseURL,
});

// TODO: remove debugging console.log

const request = function (options) {
  let isLoggedIn = null;
  if (options.headers)
    isLoggedIn = options.headers["Authorization"] === "Bearer"; // TODO: change to starts with?

  console.log("request.js - request - options = ", options);

  // handling response on success
  const onSuccess = function (response) {
    console.log("Request Successful!", response);
    return Promise.resolve(response.data);
    // return Promise.resolve(response);
  };

  // handling response if error occurs
  const onError = function (error) {
    // TODO: need test
    console.error("Request Failed:", error.config);

    if (!error.response.ok) {
      if ([401, 403].indexOf(error.response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        AuthService.logout();
        window.location.reload();
      } else if (error.response) {
        // Request was made but server responded with something other than 2xx, 401, and 403
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        console.error("Headers:", error.response.headers);
      } else {
        // Something else happened while setting up the request triggered the error
        console.error("Error Message:", error.message);
      }

      const err =
        (error.response.data && error.message) || error.response.statusText;
      return Promise.reject(err);
    }

    // if (error.response) {
    //   // Request was made but server responded with something
    //   // other than 2xx
    //   console.error("Status:", error.response.status);
    //   console.error("Data:", error.response.data);
    //   console.error("Headers:", error.response.headers);
    // } else {
    //   // Something else happened while setting up the request
    //   // triggered the error
    //   console.error("Error Message:", error.message);
    // }

    // return Promise.reject(error.response || error.message);
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;

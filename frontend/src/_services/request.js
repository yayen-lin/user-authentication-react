/**
 * Handling requests from the frontend and send to the backend
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * @reference https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example#fake-backend-js
 *            https://github.com/Scavenge-UW/Scavenge
 */

import axios from "axios";

axios.defaults.withCredentials = true;

// let baseURL = "http://localhost:8080";
let baseURL = "http://127.0.0.1:8080";
if (process.env.NODE_ENV === "production") {
  baseURL = "https://www.carmax168.com/";
}

const client = axios.create({
  baseURL: baseURL,
});

// TODO: remove debugging console.log

const request = function (options) {
  console.log("request.js - request - options = ", options);

  // handling response on success
  const onSuccess = function (response) {
    console.log("Request Successful!", response);
    return Promise.resolve(response.data);
    // return Promise.resolve(response);
  };

  // TODO: need test
  // handling response if error occurs
  const onError = function (error) {
    console.error("Request Failed:", error.config);
    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.error("Error Message:", error.message);
    }

    return Promise.reject(error.response || error.message);
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;

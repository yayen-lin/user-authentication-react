/**
 * Check if the visitor to this page is authorized, if not redirect to /login
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * @reference https://jasonwatmore.com/post/2019/04/06/react-jwt-authentication-tutorial-example#fake-backend-js
 */

import React from "react";
import { Route, Redirect } from "react-router-dom";

import AuthService from "../_services/auth.service";

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const currentUser = AuthService.currentUserValue;
      if (!currentUser) {
        // not logged in so redirect to login page with the return url
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }

      // authorized so return component
      return <Component {...props} />;
    }}
  />
);

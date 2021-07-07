import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getToken } from "./Common";

/**
 * check if user is logged in, if it is then the logged in user is redirected to the dashboard page.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

// handle public routes (logged in user will not have access)
function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        !getToken() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/dashboard" }} />
        )
      }
    />
  );
}

export default PublicRoute;

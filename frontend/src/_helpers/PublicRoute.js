import React from "react";
import { Route, Redirect } from "react-router-dom";

/**
 * check if user is logged in, if it is then the logged in user is redirected to the dashboard page.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

// handle public routes (logged in user will get redirect to /dashboard)
function PublicRoute({
  Component, // FIXME: avoid warning for route rendering method
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) =>
        !props.token || props.token === "" ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/dashboard" }} />
        )
      }
    />
  );
}

export default PublicRoute;

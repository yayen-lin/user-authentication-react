import React from "react";
import { Route, Redirect } from "react-router-dom";

/**
 * Check if the visitor to this page is authorized, if not redirect to ./login
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

// handle private routes (visitor (not logged in) will get redirect to /login-and-reg)
function PrivateRoute({
  Component, // FIXME: avoid warning for route rendering method
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) =>
        props.token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login-and-reg", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;

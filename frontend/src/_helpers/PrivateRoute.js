import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getToken } from "./Common";

/**
 * Check if the visitor to this page is authorized, if not redirect to ./login
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

// handle private routes (visitor (not logged in) will not have access)
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        getToken() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;

import React from "react";
import { getUser, removeUserSession } from "../../_helpers/Common";

function Dashboard(props) {
  return <h1>Welcome {props.currentUser.username}!</h1>;
}

export default Dashboard;

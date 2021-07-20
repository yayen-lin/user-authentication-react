import React from "react";

function Dashboard(props) {
  return <h1>Welcome {props.currentUser.username}!</h1>;
}

export default Dashboard;

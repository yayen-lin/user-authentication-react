import React from "react";
import { getUser, removeUserSession } from "../../_helpers/Common";

function Dashboard(props) {
  const user = getUser();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    props.history.push("/login");
  };

  console.log(user);

  return (
    <div>
      Welcome {user.name}!<br />
      <br />
      <input type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default Dashboard;

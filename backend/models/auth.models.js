/**
 * Prepares for admin login/signup/update/delete queries.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 * src: https://github.com/Scavenge-UW/Scavenge
 */

// TODO: remove debugging console.log

const { execQuery } = require("../query");

// signup
exports.adminSignup = async (req, res, vals) => {
  console.log("auth.models - signup - vals = ", vals);
  const query = `
    INSERT INTO managers (username, firstname, lastname, password, privilege, active, createdOn) 
    VALUES ?;
  `;
  return execQuery("insert", query, [vals]);
};

// checkForUsername - used for checking for duplicate username
exports.checkForUsername = async (req, res, username) => {
  const query = `
    SELECT username 
    FROM managers 
    WHERE username = ?;
  `;
  return execQuery(
    "select",
    query,
    [[username]],
    "Duplicate username. Please choose another one."
  );
};

// login
exports.adminLogin = async (req, res, username) => {
  console.log("auth.models - login - username = ", username);
  // User fields already validated
  const query = `
    SELECT * 
    FROM managers
    WHERE username = ?;
  `;
  var values = [[username]];

  const results = await execQuery("select", query, values);
  return results;
};

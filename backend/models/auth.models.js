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
  console.log("auth.models - signup - newUser = ", newUser);
  const query = `INSERT INTO managers (username, firstname, lastname, password, privilege, active, createdOn) VALUES ?;`;
  return execQuery(
    "insert",
    query,
    [vals],
    "Duplicate username. Please choose another one."
  );
};

// login
exports.adminLogin = async (req, res, user) => {
  console.log("auth.models - login - user = ", user);
  // User fields already validated
  const query = `
    SELECT * 
    FROM users
    WHERE username = ?;
  `;
  var values = [[user.username]];

  const results = await execQuery("select", query, values);
  return results;
};

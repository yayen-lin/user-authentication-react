/**
 * Admin login/signup/update/delete models.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

const { execQuery } = require("../query");

exports.adminLogin = async (req, res, user) => {
  // User fields already validated
  const query = `
    SELECT * 
    FROM user
    WHERE username = ?;
  `;
  var values = [[user.username]];

  const results = await execQuery("select", query, values);
  return results;
};

exports.adminGetPrivilege = async (req, res, user) => {
  // User fields already validated
  const query = `
    SELECT privilege 
    FROM user
    WHERE username = ?;
  `;
  var values = [[user.username]];

  const results = await execQuery("select", query, values);
  return results;
};

exports.adminSignup = async (req, res, newUser) => {
  const saltRounds = 10;
  const query = `INSERT INTO users (username, password, privilege) VALUES ?;`;

  // hashed + salted password - takes awhile so we need aysnc await
  await bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
    if (err) console.log(err);
    else {
      const values = [[newUser.username, hash, newUser.previlege]];
      return await execQuery(
        "insert",
        query,
        values,
        "Duplicate username. Please choose another one."
      );
    }
  });
};

exports.adminUpdate = async (req, res, newInfo) => {
  const query = `
    UPDATE user u
    SET 
      username = ?,
      password = ?,
      previlege = ?,
    WHERE u.username = ?;
  `;

  // hashed + salted password - takes awhile so we need aysnc await
  await bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
    if (err) console.log(err);
    else {
      const values = [[newUser.username, hash, newUser.previlege]];
      return await execQuery("update", query, values);
    }
  });

  // hash password - takes awhile so we need aysnc await
  // const hashedPassword = await bcrypt.hash(newInfo.password, 8);
  // const values = [
  //   newInfo.username,
  //   hashedPassword,
  //   newInfo.firstName,
  //   newInfo.lastName,
  //   newInfo.email,
  //   newInfo.phone,
  //   newInfo.address,
  //   newInfo.city,
  //   newInfo.state,
  //   newInfo.zipcode,
  //   req.params.username,
  // ];

  // return await execQuery("update", query, values);
};

exports.adminDelete = async (req, res) => {
  const query = `
    DELETE FROM user
    WHERE username = ?;
  `;
  const values = [[req.params.username]];

  return await execQuery("delete", query, values);
};

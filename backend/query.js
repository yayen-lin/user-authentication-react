/**
 * Processing MySQL queries.
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

// imports for mysql and env var
const mysql = require("mysql");
require("dotenv").config();

// DB connection config
const db_config = {
  host: "taipeinerd.com",
  user: "ggdabhmy_admin",
  password: process.env.DB_PASSWORD,
  database: "ggdabhmy_carmax168",
  connectionLimit: 5,
};

const pool = mysql.createPool(db_config);

/**
 * Release a connection.
 *
 * @param {*} conn: db connection to release
 */
function release(conn) {
  const errMsg = "An error occurred while closing the db connection.";
  try {
    conn.release((error) => {
      if (error) console.log(errMsg);
    });
  } catch (err) {
    console.log(errMsg);
  }
}

/**
 * Defines executing query and exports
 */
exports.execQuery = (
  type,
  query,
  values = [[]], // set values param optional
  failure = "No failure message provided."
) => {
  return new Promise((resolve, reject) => {
    // Connect to database
    pool.getConnection((err, conn) => {
      if (err) {
        console.log("An error occurred while connecting to database.");
        console.log(err);
        return reject(err);
      } else {
        var val;
        // insert or replace
        if (type === "insert" || type === "replace") val = [values];
        // select, update, or delete
        else if (type === "select" || type === "update" || type === "delete")
          val = values;
        // out of scope
        else
          return reject({
            msg: "The first parameter must be 'select', 'insert', 'update', 'replace', or 'delete'",
          });

        conn.query(query, val, async (error, results) => {
          // always release the connection back
          release(conn);

          // failure
          if (error) {
            console.log("Syntax error in query!");
            console.log(error);
            return reject({ err: error, failureMsg: failure });
          }
          // success
          else return resolve(results);
        });
      }
    });
  });
};

const moment = require("moment");

/**
 * convert the moment object to MySQL DATETIME format by running moment().toMySqlDateTime();
 *
 * @returns formatted datetime obj
 * @reference https://stackoverflow.com/a/52201499/13007073
 */
exports.toMySqlDateTime = (currentTime) => {
  return currentTime.format("YYYY-MM-DD HH:mm:ss").toString();
};

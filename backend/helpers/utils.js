/**
 * handling encryption for jwt
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// keygen: https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9
const key = fs.readFileSync("./private.key", "utf8");
const pub_key = fs.readFileSync("./public.key", "utf8");

const iss = "jwt-node";
const sub = "jwt-node";
const aud = "jwt-node";

const verifyOptions = {
  issuer: iss,
  subject: sub,
  audience: aud,
  expiresIn: "15m", // Common practice is to keep it around 15 minutes
  algorithm: ["RS256"],
};

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

/**
 * synchronously signs the given payload into a JSON Web Token string
 * by making use of a private key and an options argument.
 *
 * @param {*} payload - info about the user, no sensitive data
 * @returns a jwt, contructed from header, payload, and signature/encryption
 */
exports.generateJWT = (payload) => {
  const signOptions = {
    issuer: iss,
    subject: sub,
    audience: aud,
    expiresIn: "40s", // Common practice is to keep it around 15 minutes
    algorithm: "RS256",
  };

  const options = signOptions;
  if (payload && payload.exp) {
    delete options.expiresIn;
  }
  return jwt.sign({ ...payload }, key, options);
};

/**
 * Make use of the publicKEY to verify that the privateKEY was
 * responsible for signing the header and the payload.
 *
 * @param {*} token
 * @returns decoded value of that token
 */
exports.verifyJWT = (token) => {
  // synchronously verifies a given token
  return jwt.verify(token, pub_key, verifyOptions);
};

/**
 * Hashes (encrypt + salt) the given password
 *
 * @param {*} password
 * @returns a hashed password
 */
exports.hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

exports.refreshTokenAction = (req, res) => {
  // console.log("----------------------------------------- req");
  // console.log(req.token);
  // console.log(req.user);
  // console.log(req.sessionID);
  // console.log("----------------------------------------- res");
  // console.log(res.token);
  // console.log(res.user);

  const { refresh } = req.body;
  // if refresh token missing
  if (!refresh)
    return Response.sendErrorResponse({
      res,
      message: "No refresh token provided.",
      statusCode: 403,
    });

  // if refresh token expires
  if (refresh) {
    try {
      const decoded = Utils.verifyJWT(refresh);
      // {
      //   exp: 1626825599,
      //   data: 6,
      //   iat: 1626500973,
      //   aud: 'jwt-node',
      //   iss: 'jwt-node',
      //   sub: 'jwt-node'
      // }
      const exp = decoded.exp || null;
      const now = new Date(Date.now()).getTime() / 1000;

      // if no exp in decoded or id doesn't match
      if (!exp || decoded.data !== res.user.manager_id)
        return Response.sendErrorResponse({
          res,
          message: "Invalid refresh token.",
          statusCode: 403,
        });

      // if refresh token expires
      if (now > exp)
        return Response.sendErrorResponse({
          res,
          message: "Refresh token expired, please log back in again.",
          statusCode: 403,
        });

      // generate new access token using logged in user's info
      delete res.user.iat;
      delete res.user.exp;
      delete res.user.aud;
      delete res.user.iss;
      delete res.user.sub;
      const newToken = Utils.generateJWT(res.user);

      delete res.user.password; // removed password before return
      return Response.sendResponse({
        res,
        message: "Token renewed.",
        responseBody: {
          user: res.user,
          token: newToken,
          refresh: refresh,
        },
        statusCode: 200,
      });
    } catch (err) {
      return Response.sendErrorResponse({
        res,
        message: err,
        statusCode: 500,
      });
    }
  }
};

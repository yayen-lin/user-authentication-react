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
 * @param {*} payload - info about the user, no sensitive data.
 *                    - If exp is provided, it will replaced the defailt exp setting with the provided exp for token.
 * @returns a jwt, contructed from header, payload, and signature/encryption
 */
exports.generateJWT = (payload) => {
  const signOptions = {
    issuer: iss,
    subject: sub,
    audience: aud,

    // actual
    // expiresIn: "15m", // Common practice is to keep it around 15 minutes

    // test
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

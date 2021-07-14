/**
 * handling encryption for jwt
 *
 * @version 1.0.0
 * @author [Yayen Lin](https://github.com/yayen-lin)
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const key = fs.readFileSync("./private.key", "utf8");
const pub_key = fs.readFileSync("./public.key", "utf8");

const iss = "jwt-node";
const sub = "jwt-node";
const aud = "jwt-node";

const verifyOptions = {
  issuer: iss,
  subject: sub,
  audience: aud,
  expiresIn: "8784h",
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
    expiresIn: "8784h",
    algorithm: "RS256",
  };

  const options = signOptions;
  if (payload && payload.exp) {
    delete options.expiresIn;
  }
  return jwt.sign({ ...payload }, key, options);
};

exports.verifyJWT = (payload) => {
  return jwt.verify(payload, pub_key, verifyOptions);
};

exports.hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

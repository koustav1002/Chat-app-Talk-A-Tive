const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  }); //(unique_id,secret_key,expires_in)
};

module.exports = generateToken;

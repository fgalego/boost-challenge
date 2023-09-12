const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Get user by jwt token
const getUserByToken = async (token) => {
  // If no valid token, block request
  if (!token) {
    return res.status(401).json({ message: "Access Denied!" });
  }

  // Decode token
  const decoded = jwt.verify(token, "boostsecret");

  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return user;
};

module.exports = getUserByToken;

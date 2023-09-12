// Import the jsonwebtoken library
const jwt = require("jsonwebtoken");

// Import the User model
const User = require("../models/User");

// Function to get a user by their token
const getUserByToken = async (token) => {
  // Checl if a valid token is provided
  if (!token) {
    return res.status(401).json({ message: "Access Denied!" });
  }

  // If valid token is provided, decode the token using jwt.verify and the secret key to verify the token's authenticity.
  const decoded = jwt.verify(token, "boostsecret");

  // Extract the userId from the decoded token's id property
  const userId = decoded.id;

  // Use the User model to find a user with the corresponding _id value retrieved from the token to perform the database query
  const user = await User.findOne({ _id: userId });

  // Return the found user object
  return user;
};

module.exports = getUserByToken;

// Import the jsonwebtoken library
const jwt = require("jsonwebtoken");

// Function that takes in three parameters: user, req, and res
const createUserToken = async (user, req, res) => {
  // Create a JSON Web Token, which will include the name and _id properties of the user object
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    // Use the secret key
    "boostsecret"
  );

  // Send a JSON response, including the Token, message, and the user ID in the response body.
  res.status(200).json({
    message: "Authenticated with success!",
    token: token,
    userId: user._id,
  });
};

module.exports = createUserToken;

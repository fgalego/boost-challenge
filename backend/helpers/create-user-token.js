const jwt = require("jsonwebtoken");

const createUserToken = async (user, req, res) => {
  // Create Token
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    "boostsecret"
  );

  // Return Token
  res.status(200).json({
    message: "Authenticated with success!",
    token: token,
    userId: user._id,
  });
};

module.exports = createUserToken;

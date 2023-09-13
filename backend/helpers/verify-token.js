const jwt = require("jsonwebtoken");
const getToken = require("./get-token");

const jwtSecret = process.env.JWT_SECRET;

// Middleware to validate token in the API request.
const checkToken = (req, res, next) => {
  // Check if authorization header is present
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Access Denied!" });
  }

  // Get token from the request
  const token = getToken(req);

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    // Verify the token using jwtSecret
    const verified = jwt.verify(token, `${jwtSecret}`);
    //  If the verification is successful, it sets the req.user property to the verified token and calls the next function to proceed to the next middleware.
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = checkToken;

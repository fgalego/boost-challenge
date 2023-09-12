const jwt = require("jsonwebtoken");
const getToken = require("./get-token");

// middleware to validate token in the API request
const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Access Denied!" });
  }

  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, "boostsecret");
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = checkToken;

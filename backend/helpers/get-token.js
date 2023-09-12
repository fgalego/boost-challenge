const getToken = (req) => {
  // Get auth headers
  const authHeader = req.headers.authorization;

  // Token extraction: create an array with a blank space, (Bearer + "token"), and get token
  const token = authHeader.split(" ")[1];

  return token;
};

module.exports = getToken;

// Module to export the function getToken (function that takes in a req parameter)
const getToken = (req) => {
  // Get auth headers from the request. The function will assume that the authorization header follows the format "Bearer Token", where "token" is the actual token value.
  const authHeader = req.headers.authorization;

  // Token extraction: split the authorization header string using the space character as the delimiter. It creates an array with two elements: "Bearer" and the actual token. The token is extracted by accessing the second element of the array.
  const token = authHeader.split(" ")[1];

  // Return the extracted token
  return token;
};

module.exports = getToken;

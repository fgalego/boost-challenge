// Import the express module
const express = require("express");

// Import the cors module to handle Cross-Origin Resource Sharing in the server, allowing requests from different origins, such as a Front-End App, witch we are not using as for now for this challenge.
const cors = require("cors");

// Create an instance of the Express application
const app = express();

// Add middleware to parse incoming requests with JSON payloads, enabling the server to handle JSON data sent in the request body
app.use(express.json());

// Add the CORS middleware to the app, allowing requests from the specified origin (http://localhost:3000), and enabling support for credentials (like cookies) in CORS requests.
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Set up a static file server to serve files from the public folder, which in this case wil only be images
app.use(express.static("public"));

// Routes: import the UserRoutes module, which contains the route handlers for user-related endpoints
const UserRoutes = require("./routes/UserRoutes");

// Register the UserRoutes middleware for the /users route. Any request with a path starting with /users will be handled by the UserRoutes module.
app.use("/api", UserRoutes);

// Start the Express server and makes it listen on port 5000, enabling it to receive and handle incoming HTTP requests.
app.listen(5000);

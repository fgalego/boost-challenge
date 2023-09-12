// Set up a router using the Express framework for handling HTTP requests
const router = require("express").Router();

// Import the UserController module
const UserController = require("../controllers/UserController");

//  Import two middleware functions
const verifyToken = require("../helpers/verify-token");
const { imageUpload } = require("../helpers/image-upload");

// This route will access UserController

// POST route for registering a new user, which will be handled by the UserController.register function.
router.post("/register", UserController.register);
// POST route for user login, handled by UserController.login.
router.post("/login", UserController.login);
// GET route for checking if a user exists, handled by UserController.checkUser.
router.get("/checkuser", UserController.checkUser);
// GET route for getting a user by their ID, handled by UserController.getUserById.
router.get("/:id", UserController.getUserById);
// PATCH route for editing a user, which requires authentication and provides image upload, handled by UserController.editUser.
router.patch(
  "/edit/:id",
  verifyToken,
  imageUpload.single("image"),
  UserController.editUser
);

module.exports = router;

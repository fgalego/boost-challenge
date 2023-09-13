const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

const jwtSecret = process.env.JWT_SECRET;
module.exports = class UserController {
  // Defining a static method called register, responsible for registering a new user with the provided information.
  static async register(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // Validations
    if (!name) {
      res.status(422).json({ message: "A valid name is required." });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "A valid email is required." });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A valid password is required." });
      return;
    }

    if (!confirmPassword) {
      res.status(422).json({ message: "Please confirm your password." });
      return;
    }

    if (password !== confirmPassword) {
      res.status(422).json({ message: "Passwords do not match." });
      return;
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(422).json({ message: "Please use a different email." });
      return;
    }

    // Create password hash
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name: name,
      email: email,
      password: passwordHash,
    });

    try {
      // Save new user to database
      const newUser = await user.save();

      // Create user token and send response
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // Defining a static method called login, responsible for logging in a user and creating a user token. It takes in a request object (req) and a response object (res) as parameters
  static async login(req, res) {
    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      res.status(422).json({ message: "Email is required!" });
      return;
    }

    // Check if password is provided
    if (!password) {
      res.status(422).json({ message: "Password is required!" });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email: email });

    // Check if user is not found
    if (!user) {
      res.status(422).json({ message: "Email is not registered." });
      return;
    }

    // Check if password is valid
    const checkPassword = await bcrypt.compare(password, user.password);

    // Check if password is invalid
    if (!checkPassword) {
      res.status(422).json({ message: "Invalid Password!" });
      return;
    }

    // Create user token
    await createUserToken(user, req, res);
  }

  static async logout(req, res) {
    if (req.headers && req.headers.authorization) {
      console.log(req.headers.authorization);
      res.status(200).json({ message: "Logged out!" });
    }
  }

  // Check if there is a user in the request and send the user data in the response
  static async checkUser(req, res) {
    let currentUser;

    // Check if the request has an authorization header. If so, it retrieves the token from the header and decodes it using a secret key
    if (req.headers.authorization) {
      const token = getToken(req);
      // Decode the token
      const decoded = jwt.verify(token, `${jwtSecret}`);

      // Use the decoded user ID to find the user in the database
      currentUser = await User.findById(decoded.id);

      // Remove the user's password from the user object
      currentUser.password = undefined;
    } else {
      // If there is no authorization header in the request, the currentUser variable is set to null
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  // API endpoint that retrieves an user by their ID
  static async getUserById(req, res) {
    // Retrieve the user ID from the request parameters
    const id = req.params.id;

    // Find the user by their ID and exclude the password field from the result
    const user = await User.findById(id).select("-password");

    // If the user is not found, return an error message
    if (!user) {
      res.status(422).json({
        message: "User not found!",
      });
      return;
    }

    // Return a 200 status code with the user object
    res.status(200).json({ user });
  }

  // Static method editUser that handles the editing of an user in the API,receiving a request object req and a response object res.
  static async editUser(req, res) {
    // Extract the user ID from the request parameters
    const id = req.params.id;

    // Check if user exists, retrieving the user from the database based on the token extracted from the request
    const token = getToken(req);
    const user = await getUserByToken(token);

    // Extraction of name, email, password, and confirmPassword from the request body
    const { name, email, password, confirmPassword } = req.body;

    // Update the user's img if a file is attached to the request
    if (req.file) {
      user.image = req.file.filename;
    }

    // Perform validations, returning error responses if those fail.
    // if (!name) {
    //   res.status(422).json({ message: "A valid name is required." });
    // }

    // Assign the value of the name variable to the name property of the user object. If validation passes, the name property will be updated with the new value provided in the request.
    // user.name = name;

    // if (!email) {
    //   res.status(422).json({ message: "A valid email is required." });
    //   return;
    // }

    // Check if email already exists in db
    const userExists = await User.findOne({ email: email });

    // Check if user.email is != new email and if the new email already exists in the database for another user.
    if (user.email !== email && userExists) {
      res.status(422).json({ message: "Please use another email." });
      return;
    }

    // Assign the value of the email variable to the email property of the user object. If validation passes, the email property will be updated with the new value provided in the request.
    user.email = email;

    // If the password and confirmPassword match, a new password is created and hashed using bcrypt. The user's password is then updated with the hashed password.
    if (password != confirmPassword) {
      res.status(422).json({ message: "Passwords do not match. " });
    } else if (password === confirmPassword && password != null) {
      // Create new password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }

    try {
      // User's data is updated in the database with success/failure response message.
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );

      res.status(200).json({ message: "User updated!" });
    } catch (error) {
      res.stats(500).json({ message: "error" });
      return;
    }
  }
};

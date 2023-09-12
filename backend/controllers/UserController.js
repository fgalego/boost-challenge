const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    // const confirmPassword = req.body.confirmPassword;

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

    // Password creation
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User
    const user = new User({
      name: name,
      email: email,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();

      // res.status(201).json({ message: "Registered!", newUser });

      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
    // res.json("Registered!");
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "Email is required!" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "Password is required!" });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({ message: "Email is not registered." });
      return;
    }

    // Password check with db password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: "Invalid Password!" });
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      // Decode the token
      const decoded = jwt.verify(token, "boostsecret");

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(422).json({
        message: "User not found!",
      });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const id = req.params.id;

    // Check if user exists
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, password, confirmPassword } = req.body;

    if (req.file) {
      user.image = req.file.filename;
    }

    // Validations
    if (!name) {
      res.status(422).json({ message: "A valid name is required." });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: "A valid email is required." });
      return;
    }

    // Check if email already exists in db
    const userExists = await User.findOne({ email: email });

    // Check if user.email is != new email and if user exists
    if (user.email !== email && userExists) {
      res.status(422).json({ message: "Please use another email." });
      return;
    }

    user.email = email;

    if (password != confirmPassword) {
      res.status(422).json({ message: "Passwords do not match. " });
    } else if (password === confirmPassword && password != null) {
      // Create new password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }

    try {
      // returns user updated data
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

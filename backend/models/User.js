const mongoose = require("../db/conn");

// Define a Mongoose model (function used to create a new model) for a user entity in a MongoDB database, creating an User object to use later on UserController.js
const userSchema = mongoose.Schema(
  // Schema instance created with an object that describes the fields of the user document
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  // Add two additional fields to each user document: createdAt and updatedAt
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);

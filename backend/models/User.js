const mongoose = require("../db/conn");
const { Schema } = mongoose;

// Define a Mongoose model (function used to create a new model) for a user entity in a MongoDB database, creating an User object to use later on UserController.js
const User = mongoose.model(
  // Name of the model
  "User",
  // New instance of the Schema class, which defines the structure of the user document in the database.
  new Schema(
    // Schema instance created with an object that describes the fields of the user document
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
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
  )
);

module.exports = User;

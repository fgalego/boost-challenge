require("dotenv").config();
const mongoose = require("mongoose");

// Credentials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// Connect to the MongoDB database
async function connectToDatabase() {
  // Connect to the MongoDB Atlas cluster using the provided credentials
  await mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.wosiixx.mongodb.net/?retryWrites=true&w=majority`
  );
}

// Define an async function called main which serves as the entry point of the program
async function main() {
  // Connect to the database
  await connectToDatabase();

  // Log a success message if connected with success
  console.log("Connected to MongoDB!");
}

// Run main function. If any error is returned, print it.
main().catch((err) => console.log(err));

module.exports = mongoose;

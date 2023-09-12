require("dotenv").config();
const mongoose = require("mongoose");

// Credentials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

async function main() {
  // await mongoose.connect(`mongodb://localhost:27017/boostchallenge`);
  await mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.wosiixx.mongodb.net/?retryWrites=true&w=majority`
  );

  console.log("Connected to Mongoose!");
}

main().catch((err) => console.log(err));

module.exports = mongoose;

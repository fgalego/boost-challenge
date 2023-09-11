const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/boostchallenge");
  console.log("Connected to Mongoose!");
}

main().catch((err) => console.log(err));

module.exports = mongoose;

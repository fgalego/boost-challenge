// Set up a middleware function to handle image uploads using multer.

// Import the multer module
const multer = require("multer");
// Import the path module
const path = require("path");

// Define a imageStorage object using multer.diskStorage
const imageStorage = multer.diskStorage({
  // Specify the destination directory for storing the uploaded images, determining based on the value of req.baseUrl
  destination: function (req, file, cb) {
    let folder = "";

    // If req.baseUrl includes the string "users", the images will be stored in the "users" folder inside the "public/images" directory.
    if (req.baseUrl.includes("users")) {
      folder = "users";
    }

    // We could add more folders here, such as "categories", continuing the process with:
    // else if (req.baseUrl.includes("another-category")) {
    //     folder = "another-category"
    // }

    cb(null, `public/images/${folder}`);
  },

  // filename function to specify the naming convention for the uploaded images, using the current timestamp as the filename, and retaining the original file extension
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Create imageUpload object using multer with the storage property set to the imageStorage object defined earlier.
const imageUpload = multer({
  storage: imageStorage,

  //  defines a fileFilter function that checks if the uploaded file has a .png or .jpg extension
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(
        new Error("Please upload only images with .png or .jpg format.")
      );
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };

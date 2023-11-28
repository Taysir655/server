const mongoose = require("mongoose");

// Defining a Mongoose schema for the 'Users' collection
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true, // Username must be unique
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

// Exporting the Mongoose model for the 'Users' collection
module.exports = mongoose.model("Users", userSchema);

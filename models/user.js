const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema
const userSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  departmentId: {
    type: String,
    required: true
  },
  semesterId: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  evaluation: [String]
});

// Create a model
const User = mongoose.model("user", userSchema);

// Export the model
module.exports = User;

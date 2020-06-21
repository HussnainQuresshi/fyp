const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a schema
const questionSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: true,
    },
    type: {
      type: String,
      lowercase: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a model
const Question = mongoose.model("question", questionSchema);

// Export the model
module.exports = Question;

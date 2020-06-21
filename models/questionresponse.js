const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionResponseSchema = new Schema({
  courseId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  departmentId: {
    type: String,
    required: true,
  },
  semesterId: {
    type: String,
    required: true,
  },
  teacherId: { type: String, required: true },
  batch: {
    type: String,
    lowercase: true,
    required: true,
  },
  answer: [
    {
      questionId: {
        type: String,
      },
      response: {
        type: String,
        lowercase: true,
      },
    },
  ],
});
const QuestionResponse = mongoose.model(
  "questionresponse",
  questionResponseSchema
);

module.exports = QuestionResponse;

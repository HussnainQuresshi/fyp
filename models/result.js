const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  courseId: {
    type: String,
    required: true
  },
  teacherId: {
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
  totalstudents: {
    type: Number,
    required: true
  },
  courseDetail: [
    {
      questionId: {
        type: String
      },
      response: {
        type: Number
      }
    }
  ],
  teacherDetail: [
    {
      questionId: {
        type: String
      },
      response: {
        type: Number
      }
    }
  ]
});
const Result = mongoose.model("result", resultSchema);

module.exports = Result;

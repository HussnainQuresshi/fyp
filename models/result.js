const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  courseId: {
    type: String,
    required: true,
  },
  teacherId: {
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
  batch: {
    type: String,
    lowercase: true,
    required: true,
  },
  totalstudents: {
    type: Number,
    required: true,
  },
  courseDetail: [
    {
      questionId: {
        type: String,
      },
      response: {
        type: Number,
      },
      sa: {
        type: Number,
      },
      a: {
        type: Number,
      },
      n: {
        type: Number,
      },
      d: {
        type: Number,
      },
      sd: {
        type: Number,
      },
    },
  ],
  teacherDetail: [
    {
      questionId: {
        type: String,
      },
      response: {
        type: Number,
      },
      sa: {
        type: Number,
      },
      a: {
        type: Number,
      },
      n: {
        type: Number,
      },
      d: {
        type: Number,
      },
      sd: {
        type: Number,
      },
    },
  ],
});
const Result = mongoose.model("result", resultSchema);

module.exports = Result;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assignCourseSchema = new Schema({
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
  }
});
const AssignCourse = mongoose.model("assigncourse", assignCourseSchema);

module.exports = AssignCourse;

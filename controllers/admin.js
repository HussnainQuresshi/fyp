const JWT = require("jsonwebtoken");
const Admin = require("../models/admin");
const Department = require("../models/department");
const Teacher = require("../models/teacher");
const Semester = require("../models/semester");
const Course = require("../models/course");
const Question = require("../models/question");
const User = require("../models/user");
const AssignCourse = require("../models/assignCourse");
const Result = require("../models/result");
const { JWT_SECRET } = require("../configuration");

signToken = user => {
  return JWT.sign(
    {
      iss: "Dev_uh",
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    },
    JWT_SECRET
  );
};

module.exports = {
  adminSignUp: async (req, res, next) => {
    let check = await Admin.find();

    if (check.length == 0) {
      const { email, password, username } = req.value.body;
      const newAdmin = new Admin({
        username: username,
        email: email,
        password: password
      });
      await newAdmin.save();
      res.status(200).json({ success: true });
    }
    return res.status(403).json({ message: "account already exist" });
  },

  adminSignIn: (req, res, next) => {
    // Generate token

    const token = signToken(req.user);
    res.cookie("access_token", token, {
      httpOnly: true
    });
    res.status(200).json({ success: true, token: token, userdetail: req.user });
  },
  userSignIn: async (req, res, next) => {
    // Generate token
    let user = await User.findOne({ token: req.body.token });
    if (user) {
      const token = signToken(user);
      res.cookie("access_token", token, {
        httpOnly: true
      });
      return res
        .status(200)
        .json({ success: true, token: token, userdetail: user });
    }
    res.status(403).json({ message: "Token Not Found" });
  },

  adminProfile: (req, res, next) => {
    res.status(200).json({
      success: true,
      data: req.user
    });
  },
  adminUpdate: async (req, res, next) => {
    const data = await Admin.findById(req.user._id);

    data.username = req.body.username;
    data.password = req.body.password;
    data.email = req.body.email;
    const result = await data.save();
    res.status(200).json({
      success: true,
      data: result,
      password: req.body.password
    });
  },
  addDepartment: async (req, res, next) => {
    const { name } = req.value.body;

    let foundDepartment = await Department.findOne({ name: name });

    if (foundDepartment) {
      return res.status(403).json({ message: "department already exist" });
    } else {
      const newDepartment = new Department({
        name: name
      });

      await newDepartment.save();
    }
    res.status(200).json({
      success: true
    });
  },
  getDepartment: async (req, res, next) => {
    const departments = await Department.find();

    return res.status(200).json({
      success: true,
      departments: departments
    });
  },
  deleteDepartment: async (req, res, next) => {
    const del_data = await Department.deleteOne({
      _id: req.body.del_id
    });

    const del_assign_course = await AssignCourse.remove({
      departmentId: req.body.del_id
    });
    return res.status(200).json({ success: true });
  },
  addTeacher: async (req, res, next) => {
    const { name } = req.value.body;
    let foundTeacher = await Teacher.findOne({ name: name });

    if (foundTeacher) {
      return res.status(403).json({ message: "teacher already exist" });
    } else {
      const newTeacher = new Teacher({
        name: name
      });

      await newTeacher.save();
    }
    return res.status(200).json({
      success: true
    });
  },
  getTeacher: async (req, res, next) => {
    const teachers = await Teacher.find();

    return res.status(200).json({
      success: true,
      teachers: teachers
    });
  },
  deleteTeacher: async (req, res, next) => {
    const del_data = await Teacher.deleteOne({
      _id: req.body.del_id
    });
    const del_assign_course = await AssignCourse.remove({
      teacherId: req.body.del_id
    });
    return res.status(200).json({ success: true });
  },
  addSemester: async (req, res, next) => {
    const { name } = req.value.body;
    let foundSemester = await Semester.findOne({ name: name });

    if (foundSemester) {
      return res.status(403).json({ message: "semester already exist" });
    } else {
      const newSemester = new Semester({
        name: name
      });

      await newSemester.save();
    }
    return res.status(200).json({
      success: true
    });
  },
  getSemester: async (req, res, next) => {
    const semesters = await Semester.find();

    return res.status(200).json({
      success: true,
      semesters: semesters
    });
  },
  deleteSemester: async (req, res, next) => {
    const del_data = await Semester.deleteOne({ _id: req.body.del_id });
    const del_assign_course = await AssignCourse.remove({
      semesterId: req.body.del_id
    });
    return res.status(200).json({ success: true });
  },
  addCourse: async (req, res, next) => {
    const { name } = req.value.body;
    let foundCourse = await Course.findOne({ name: name });

    if (foundCourse) {
      return res.status(403).json({ message: "course already exist" });
    } else {
      const newCourse = new Course({
        name: name
      });

      await newCourse.save();
    }
    return res.status(200).json({
      success: true
    });
  },
  getCourse: async (req, res, next) => {
    const courses = await Course.find();

    return res.status(200).json({
      success: true,
      courses: courses
    });
  },
  deleteCourse: async (req, res, next) => {
    const del_data = await Course.deleteOne({ _id: req.body.del_id });
    const del_assign_course = await AssignCourse.remove({
      courseId: req.body.del_id
    });
    return res.status(200).json({ success: true });
  },
  addAssignCourse: async (req, res, next) => {
    const { courseId, semesterId, departmentId, teacherId } = req.value.body;
    let foundCourse = await Course.findOne({ _id: courseId });
    let foundSemester = await Semester.findOne({ _id: semesterId });
    let foundTeacher = await Teacher.findOne({ _id: teacherId });
    let foundDepartment = await Department.findOne({ _id: departmentId });
    if (!foundSemester) {
      return res.status(403).json({ message: `semester id doesn't  exist` });
    } else if (!foundTeacher) {
      return res.status(403).json({ message: `teacher id doesn't  exist` });
    } else if (!foundDepartment) {
      return res.status(403).json({ message: `department id doesn't  exist` });
    } else if (!foundCourse) {
      return res.status(403).json({ message: `course id doesn't  exist` });
    } else {
      const foundAssignCourse = await AssignCourse.findOne().and([
        { courseId: courseId },
        { semesterId: semesterId },
        { departmentId: departmentId }
      ]);
      if (foundAssignCourse) {
        return res.status(403).json({ message: "course already assigned.." });
      } else {
        const newCourse = new AssignCourse({
          courseId: courseId,
          teacherId: teacherId,
          departmentId: departmentId,
          semesterId: semesterId
        });

        await newCourse.save();

        return res.status(200).json({
          success: true
        });
      }
    }
  },
  getAssignCourse: async (req, res, next) => {
    const assignCourses = await AssignCourse.find();
    let updatedAssignCourses = assignCourses.map(async assignCourse => {
      const teacher = await Teacher.findOne({ _id: assignCourse.teacherId });
      assignCourse.teacherId = teacher.name;
      const semester = await Semester.findOne({ _id: assignCourse.semesterId });
      assignCourse.semesterId = semester.name;
      const department = await Department.findOne({
        _id: assignCourse.departmentId
      });
      assignCourse.departmentId = department.name;
      const course = await Course.findOne({ _id: assignCourse.courseId });
      assignCourse.courseId = course.name;
      return assignCourse;
    });
    updatedAssignCourses = await Promise.all(updatedAssignCourses);
    const teachers = await Teacher.find();
    return res.status(200).json({
      success: true,
      data: updatedAssignCourses,
      teachers: teachers
    });
  },
  deleteAssignCourse: async (req, res, next) => {
    const del_data = await AssignCourse.deleteOne({ _id: req.body.del_id });
    return res.status(200).json({ success: true });
  },
  addQuestion: async (req, res, next) => {
    const { name, type } = req.value.body;
    let foundQuestion = await Question.findOne({ name: name });

    if (foundQuestion) {
      return res.status(403).json({ message: "question already exist" });
    } else {
      const newQuestion = new Question({
        name: name,
        type: type
      });

      await newQuestion.save();
    }
    return res.status(200).json({
      success: true
    });
  },
  getQuestion: async (req, res, next) => {
    const questions = await Question.find();

    return res.status(200).json({
      success: true,
      questions: questions
    });
  },
  deleteQuestion: async (req, res, next) => {
    const del_data = await Question.deleteOne({ _id: req.body.del_id });

    return res.status(200).json({ success: true });
  },
  addUser: async (req, res, next) => {
    let { noOfToken, departmentId, semesterId, batch } = req.value.body;

    while (noOfToken > 0 && batch > 0) {
      let token = Math.random()
        .toString(36)
        .substr(2, 10);
      let foundUser = await User.findOne({ token: token });
      if (!foundUser) {
        //repetition say bachnay ka lia
        const newUser = new User({
          token: token,
          semesterId: semesterId,
          departmentId: departmentId,
          batch: batch
        });

        await newUser.save();
        noOfToken--;
      }
    }
    res.status(200).json({ success: true });
  },
  getUser: async (req, res, next) => {
    const users = await User.find({ departmentId: req.body.depId });
    let updatedUsers = users.map(async user => {
      const semester = await Semester.findOne({ _id: user.semesterId });
      user.semesterId = semester.name;
      const department = await Department.findOne({
        _id: user.departmentId
      });
      user.departmentId = department.name;

      return user;
    });
    updatedUsers = await Promise.all(updatedUsers);
    return res.status(200).json({
      success: true,
      tokens: updatedUsers
    });
  },
  addResult: async (req, res, next) => {
    const { courseId, question, teacherId } = req.body;
    const { semesterId, batch, departmentId, _id } = req.user;
    let foundCourse = await Course.findOne({ _id: courseId });
    let foundTeacher = await Teacher.findOne({ name: teacherId });
    let foundSemester = await Semester.findOne({ _id: semesterId });
    let foundUser = await User.findOne({ _id: _id });
    let foundDepartment = await Department.findOne({ _id: departmentId });
    if (!foundSemester) {
      return res.status(403).json({ message: `semester id doesn't  exist` });
    } else if (!foundUser) {
      return res.status(403).json({ message: `user id doesn't  exist` });
    } else if (!foundTeacher) {
      return res.status(403).json({ message: `teacher id doesn't  exist` });
    } else if (!foundDepartment) {
      return res.status(403).json({ message: `department id doesn't  exist` });
    } else if (!foundCourse) {
      return res.status(403).json({ message: `course id doesn't  exist` });
    } else {
      const foundResult = await Result.findOne().and([
        { courseId: courseId },
        { teacherId: foundTeacher._id },
        { departmentId: departmentId },
        { semesterId: semesterId },
        { batch: batch }
      ]);
      if (foundResult) {
        let teacherDetail = [];
        let courseDetail = [];
        let NewCourseDetails = [];
        let NewTeacherDetails = [];
        question.map(ques => {
          if (ques.type === "Course") {
            courseDetail.push(ques);
          } else {
            teacherDetail.push(ques);
          }
        });
        foundResult.courseDetail.map((q, i) => {
          let ques = q.response + courseDetail[i].response;
          ques = ques / 2;
          NewCourseDetails.push({
            questionId: q.questionId,
            response: ques
          });
        });
        foundResult.teacherDetail.map((q, i) => {
          let ques = q.response + teacherDetail[i].response;
          ques = ques / 2;
          NewTeacherDetails.push({
            questionId: q.questionId,
            response: ques
          });
        });
        foundResult.courseDetail = NewCourseDetails;
        foundResult.teacherDetail = NewTeacherDetails;
        foundResult.totalstudents = foundResult.totalstudents + 1;
        const result = await foundResult.save();
        const user = await User.findById({ _id: _id });
        user.evaluation.push(courseId);
        await user.save();
        return res.status(200).json({
          success: true
        });
      } else {
        let teacherDetail = [];
        let courseDetail = [];
        question.map(ques => {
          if (ques.type === "Course") {
            courseDetail.push(ques);
          } else {
            teacherDetail.push(ques);
          }
        });
        const newResult = new Result({
          courseId: courseId,
          teacherId: foundTeacher._id,
          departmentId: departmentId,
          semesterId: semesterId,
          batch: batch,
          courseDetail: courseDetail,
          teacherDetail: teacherDetail,
          totalstudents: 1
        });
        await newResult.save();
        const user = await User.findById({ _id: _id });
        user.evaluation.push(courseId);
        await user.save();
        return res.status(200).json({
          success: true
        });
      }
    }
  },
  getResult: async (req, res, next) => {
    const results = await Result.find();
    if (results) {
      let updatedResults = results.map(async r => {
        let foundCourse = await Course.findOne({ _id: r.courseId });
        let foundTeacher = await Teacher.findOne({ _id: r.teacherId });
        let foundSemester = await Semester.findOne({ _id: r.semesterId });
        let foundDepartment = await Department.findOne({
          _id: r.departmentId
        });
        if (foundSemester && foundTeacher && foundDepartment && foundCourse) {
          r.teacherId = foundTeacher.name;
          r.semesterId = foundSemester.name;
          r.departmentId = foundDepartment.name;
          r.courseId = foundCourse.name;
          return r;
        }
      });
      updatedResults = await Promise.all(updatedResults);
      let x = updatedResults;
      updatedResults = [];

      x.map(r => {
        if (r) {
          updatedResults.push(r);
        }
      });

      return res.status(200).json({
        success: true,
        updatedResults
      });
    }
  },
  isAuth: (req, res, next) => {
    res.status(200).json({ success: true });
  },
  isAuthUser: (req, res, next) => {
    res.status(200).json({ success: true });
  },
  getAll: async (req, res, next) => {
    const semester = await Semester.find();
    const department = await Department.find();
    const teacher = await Teacher.find();
    const course = await Course.find();

    res.status(200).json({
      course: course,
      department: department,
      teacher: teacher,
      semester: semester
    });
  },
  getStudentData: async (req, res, next) => {
    let data = await AssignCourse.find().and([
      { departmentId: req.user.departmentId },
      { semesterId: req.user.semesterId }
    ]);
    let question = await Question.find();

    let copy = data.map(async v => {
      const course = await Course.findOne({ _id: v.courseId });
      const department = await Department.findOne({ _id: v.departmentId });
      const semester = await Semester.findOne({ _id: v.semesterId });
      const teacher = await Teacher.findOne({ _id: v.teacherId });
      return {
        _id: v._id,
        courseId: course.name,
        courseIdn: course._id,
        teacherId: teacher.name,
        departmentId: department.name,
        semesterId: semester.name,
        batch: req.user.batch
      };
    });
    copy = await Promise.all(copy);
    const user = await User.findById({ _id: req.user._id });

    user.evaluation.map(v => {
      let i = 0;
      while (i < copy.length) {
        if (copy[i].courseIdn == v) {
          copy.splice(i, 1);
          break;
        } else {
          ++i;
        }
      }
    });
    res.status(200).json({ success: true, data: copy, Question: question });
  },
  signOutUser: async (req, res, next) => {
    await User.deleteOne({ _id: req.user._id });
    res.clearCookie("access_token");
    res.json({ success: true });
  },
  signOut: (req, res, next) => {
    res.clearCookie("access_token");
    res.json({ success: true });
  }
};

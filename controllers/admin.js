const JWT = require("jsonwebtoken");
const tryCatch = require("../middleware/trycatch");
const Admin = require("../models/admin");
const Department = require("../models/department");
const Teacher = require("../models/teacher");
const Semester = require("../models/semester");
const Course = require("../models/course");
const Question = require("../models/question");
const User = require("../models/user");
const AssignCourse = require("../models/assignCourse");
const Result = require("../models/result");
const { jwtSecret } = require("../configuration/index");

signToken = (user) => {
  return JWT.sign(
    {
      iss: jwtSecret,
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    },
    jwtSecret
  );
};

module.exports = {
  adminSignUp: tryCatch(async (req, res, next) => {
    let check = await Admin.find();

    if (check.length == 0) {
      const { email, password, username } = req.value.body;
      const newAdmin = new Admin({
        username: username,
        email: email,
        password: password,
      });
      await newAdmin.save();
      res.status(200).json({ success: true });
    }
    return res.status(403).json({ message: "account already exist" });
  }),

  adminSignIn: tryCatch((req, res, next) => {
    // Generate token

    const token = signToken(req.user);
    res.cookie("access_token", token, {
      httpOnly: true,
    });
    res.status(200).json({ success: true, token: token, userdetail: req.user });
  }),
  userSignIn: tryCatch(async (req, res, next) => {
    // Generate token

    let user = await User.findOne({ token: req.body.token });
    if (user) {
      const token = signToken(user);
      res.cookie("access_token", token, {
        httpOnly: true,
      });
      return res
        .status(200)
        .json({ success: true, token: token, userdetail: user });
    }
    res.status(403).json({ message: "Token Not Found" });
  }),

  adminProfile: tryCatch((req, res, next) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }),
  adminUpdate: tryCatch(async (req, res, next) => {
    const data = await Admin.findById(req.user._id);

    data.username = req.body.username;
    data.password = req.body.password;
    data.email = req.body.email;
    const result = await data.save();
    res.status(200).json({
      success: true,
      data: result,
      password: req.body.password,
    });
  }),
  addDepartment: tryCatch(async (req, res, next) => {
    const { name } = req.value.body;

    let foundDepartment = await Department.findOne({ name: name });

    if (foundDepartment) {
      return res.status(403).json({ message: "department already exist" });
    } else {
      const newDepartment = new Department({
        name: name,
      });

      await newDepartment.save();
    }
    res.status(200).json({
      success: true,
    });
  }),
  getDepartment: tryCatch(async (req, res, next) => {
    const departments = await Department.find();

    return res.status(200).json({
      success: true,
      departments: departments,
    });
  }),
  deleteDepartment: tryCatch(async (req, res, next) => {
    const del_data = await Department.deleteOne({
      _id: req.body.del_id,
    });

    const del_assign_course = await AssignCourse.remove({
      departmentId: req.body.del_id,
    });
    return res.status(200).json({ success: true });
  }),
  addTeacher: tryCatch(async (req, res, next) => {
    const { name } = req.value.body;
    let foundTeacher = await Teacher.findOne({ name: name });

    if (foundTeacher) {
      return res.status(403).json({ message: "teacher already exist" });
    } else {
      const newTeacher = new Teacher({
        name: name,
      });

      await newTeacher.save();
    }
    return res.status(200).json({
      success: true,
    });
  }),
  getTeacher: tryCatch(async (req, res, next) => {
    const teachers = await Teacher.find();

    return res.status(200).json({
      success: true,
      teachers: teachers,
    });
  }),
  deleteTeacher: tryCatch(async (req, res, next) => {
    const del_data = await Teacher.deleteOne({
      _id: req.body.del_id,
    });
    const del_assign_course = await AssignCourse.remove({
      teacherId: req.body.del_id,
    });
    return res.status(200).json({ success: true });
  }),
  addSemester: tryCatch(async (req, res, next) => {
    const { name } = req.value.body;
    let foundSemester = await Semester.findOne({ name: name });

    if (foundSemester) {
      return res.status(403).json({ message: "semester already exist" });
    } else {
      const newSemester = new Semester({
        name: name,
      });

      await newSemester.save();
    }
    return res.status(200).json({
      success: true,
    });
  }),
  getSemester: tryCatch(async (req, res, next) => {
    const semesters = await Semester.find();

    return res.status(200).json({
      success: true,
      semesters: semesters,
    });
  }),
  deleteSemester: tryCatch(async (req, res, next) => {
    const del_data = await Semester.deleteOne({ _id: req.body.del_id });
    const del_assign_course = await AssignCourse.remove({
      semesterId: req.body.del_id,
    });
    return res.status(200).json({ success: true });
  }),
  addCourse: tryCatch(async (req, res, next) => {
    const { name } = req.value.body;
    let foundCourse = await Course.findOne({ name: name });

    if (foundCourse) {
      return res.status(403).json({ message: "course already exist" });
    } else {
      const newCourse = new Course({
        name: name,
      });

      await newCourse.save();
    }
    return res.status(200).json({
      success: true,
    });
  }),
  getCourse: tryCatch(async (req, res, next) => {
    const courses = await Course.find();

    return res.status(200).json({
      success: true,
      courses: courses,
    });
  }),
  deleteCourse: tryCatch(async (req, res, next) => {
    const del_data = await Course.deleteOne({ _id: req.body.del_id });
    const del_assign_course = await AssignCourse.remove({
      courseId: req.body.del_id,
    });
    return res.status(200).json({ success: true });
  }),
  addAssignCourse: tryCatch(async (req, res, next) => {
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
        { departmentId: departmentId },
      ]);
      if (foundAssignCourse) {
        return res.status(403).json({ message: "course already assigned.." });
      } else {
        const newCourse = new AssignCourse({
          courseId: courseId,
          teacherId: teacherId,
          departmentId: departmentId,
          semesterId: semesterId,
        });

        await newCourse.save();

        return res.status(200).json({
          success: true,
        });
      }
    }
  }),
  getAssignCourse: tryCatch(async (req, res, next) => {
    const assignCourses = await AssignCourse.find();
    let updatedAssignCourses = assignCourses.map(async (assignCourse) => {
      const teacher = await Teacher.findOne({ _id: assignCourse.teacherId });
      assignCourse.teacherId = teacher.name;
      const semester = await Semester.findOne({ _id: assignCourse.semesterId });
      assignCourse.semesterId = semester.name;
      const department = await Department.findOne({
        _id: assignCourse.departmentId,
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
      teachers: teachers,
    });
  }),
  deleteAssignCourse: tryCatch(async (req, res, next) => {
    const del_data = await AssignCourse.deleteOne({ _id: req.body.del_id });
    return res.status(200).json({ success: true });
  }),
  addQuestion: tryCatch(async (req, res, next) => {
    const { name, type } = req.value.body;
    let foundQuestion = await Question.findOne({ name: name });

    if (foundQuestion) {
      return res.status(403).json({ message: "question already exist" });
    } else {
      const newQuestion = new Question({
        name: name,
        type: type,
      });

      await newQuestion.save();
    }
    return res.status(200).json({
      success: true,
    });
  }),
  editQuestion: tryCatch(async (req, res, next) => {
    const { id, name, type } = req.body;
    let foundQuestion = await Question.findById(id);
    if (foundQuestion) {
      foundQuestion.name = name;
      foundQuestion.type = type;
      await foundQuestion.save();
    } else {
      return res.status(403).json({ message: "question already exist" });
    }
    return res.status(200).json({
      success: true,
    });
  }),
  getQuestion: tryCatch(async (req, res, next) => {
    const questions = await Question.find();

    return res.status(200).json({
      success: true,
      questions: questions,
    });
  }),
  deleteQuestion: tryCatch(async (req, res, next) => {
    const del_data = await Question.deleteOne({ _id: req.body.del_id });

    return res.status(200).json({ success: true });
  }),
  addUser: tryCatch(async (req, res, next) => {
    let { noOfToken, departmentId, semesterId, batch } = req.value.body;

    while (noOfToken > 0 && batch > 0) {
      let token = Math.random().toString(36).substr(2, 10);
      let foundUser = await User.findOne({ token: token });
      if (!foundUser) {
        //repetition say bachnay ka lia
        const newUser = new User({
          token: token,
          semesterId: semesterId,
          departmentId: departmentId,
          batch: batch,
        });

        await newUser.save();
        noOfToken--;
      }
    }
    res.status(200).json({ success: true });
  }),
  getUser: tryCatch(async (req, res, next) => {
    const users = await User.find({ departmentId: req.body.depId });
    let updatedUsers = users.map(async (user) => {
      const semester = await Semester.findOne({ _id: user.semesterId });
      user.semesterId = semester.name;
      const department = await Department.findOne({
        _id: user.departmentId,
      });
      user.departmentId = department.name;

      return user;
    });
    updatedUsers = await Promise.all(updatedUsers);
    return res.status(200).json({
      success: true,
      tokens: updatedUsers,
    });
  }),
  addResult: tryCatch(async (req, res, next) => {
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
        { batch: batch },
      ]);
      if (foundResult) {
        let teacherDetail = [];
        let courseDetail = [];
        let NewCourseDetails = [];
        let NewTeacherDetails = [];
        question.map((ques) => {
          if (ques.type == "course") {
            courseDetail.push(ques);
          } else {
            teacherDetail.push(ques);
          }
        });
        foundResult.courseDetail.map((q, i) => {
          let ques = q.response + courseDetail[i].response;
          ques = ques / 2;
          switch (courseDetail[i].response) {
            case 1:
              NewCourseDetails.push({
                questionId: q.questionId,
                response: ques,
                sa: q.sa,
                a: q.a,
                n: q.n,
                d: q.d,
                sd: q.sd + 1,
              });
              break;
            case 2:
              NewCourseDetails.push({
                questionId: q.questionId,
                response: ques,
                sa: q.sa,
                a: q.a,
                n: q.n,
                d: q.d + 1,
                sd: q.sd,
              });
              break;
            case 3:
              NewCourseDetails.push({
                questionId: q.questionId,
                response: ques,
                sa: q.sa,
                a: q.a,
                n: q.n + 1,
                d: q.d,
                sd: q.sd,
              });
              break;
            case 4:
              NewCourseDetails.push({
                questionId: q.questionId,
                response: ques,
                sa: q.sa,
                a: q.a + 1,
                n: q.n,
                d: q.d,
                sd: q.sd,
              });
              break;
            case 5:
              NewCourseDetails.push({
                questionId: q.questionId,
                response: ques,
                sa: q.sa + 1,
                a: q.a,
                n: q.n,
                d: q.d,
                sd: q.sd,
              });
              break;
          }
        });

        foundResult.teacherDetail.map((q, i) => {
          let ques = q.response + teacherDetail[i].response;
          ques = ques / 2;
          switch (teacherDetail[i].response) {
            case 1:
              NewTeacherDetails.push({
                questionId: q.questionId,
                response: ques,
                sa: q.sa,
                a: q.a,
                n: q.n,
                d: q.d,
                sd: q.sd + 1,
              });
              break;
            case 2:
              NewTeacherDetails.push({
                questionId: q.questionId,
                response: ques,
                sa: q.sa,
                a: q.a,
                n: q.n,
                d: q.d + 1,
                sd: q.sd,
              });
              break;
            case 3:
              NewTeacherDetails.push({
                questionId: q.questionId,
                response: ques,
                sa: q.sa,
                a: q.a,
                n: q.n + 1,
                d: q.d,
                sd: q.sd,
              });
              break;
            case 4:
              NewTeacherDetails.push({
                questionId: q.questionId,
                response: ques,
                sa: q.sa,
                a: q.a + 1,
                n: q.n,
                d: q.d,
                sd: q.sd,
              });
              break;
            case 5:
              NewTeacherDetails.push({
                questionId: q.questionId,
                response: ques,
                sa: q.sa + 1,
                a: q.a,
                n: q.n,
                d: q.d,
                sd: q.sd,
              });
              break;
          }
        });
        foundResult.courseDetail = NewCourseDetails;

        foundResult.teacherDetail = NewTeacherDetails;

        foundResult.totalstudents = foundResult.totalstudents + 1;
        await foundResult.save();

        const user = await User.findById({ _id: _id });

        user.evaluation.push(courseId);

        await user.save();

        return res.status(200).json({
          success: true,
        });
      } else {
        let teacherDetail = [];
        let courseDetail = [];
        question.map((ques) => {
          if (ques.type === "course") {
            switch (ques.response) {
              case 1:
                courseDetail.push({
                  questionId: ques.questionId,
                  response: ques.response,
                  sa: 0,
                  a: 0,
                  n: 0,
                  d: 0,
                  sd: 1,
                });
                break;
              case 2:
                courseDetail.push({
                  questionId: ques.questionId,
                  response: ques.response,
                  sa: 0,
                  a: 0,
                  n: 0,
                  d: 1,
                  sd: 0,
                });
                break;
              case 3:
                courseDetail.push({
                  questionId: ques.questionId,
                  response: ques.response,
                  sa: 0,
                  a: 0,
                  n: 1,
                  d: 0,
                  sd: 0,
                });
                break;
              case 4:
                courseDetail.push({
                  questionId: ques.questionId,
                  response: ques.response,
                  sa: 0,
                  a: 1,
                  n: 0,
                  d: 0,
                  sd: 0,
                });
                break;
              case 5:
                courseDetail.push({
                  questionId: ques.questionId,
                  response: ques.response,
                  sa: 1,
                  a: 0,
                  n: 0,
                  d: 0,
                  sd: 0,
                });
                break;
            }
          } else {
            switch (ques.response) {
              case 1:
                teacherDetail.push({
                  questionId: ques.questionId,
                  response: ques.response,
                  sa: 0,
                  a: 0,
                  n: 0,
                  d: 0,
                  sd: 1,
                });
                break;
              case 2:
                teacherDetail.push({
                  questionId: ques.questionId,
                  response: ques.response,
                  sa: 0,
                  a: 0,
                  n: 0,
                  d: 1,
                  sd: 0,
                });
                break;
              case 3:
                teacherDetail.push({
                  questionId: ques.questionId,
                  response: ques.response,
                  sa: 0,
                  a: 0,
                  n: 1,
                  d: 0,
                  sd: 0,
                });
                break;
              case 4:
                teacherDetail.push({
                  questionId: ques.questionId,
                  response: ques.response,
                  sa: 0,
                  a: 1,
                  n: 0,
                  d: 0,
                  sd: 0,
                });
                break;
              case 5:
                teacherDetail.push({
                  questionId: ques.questionId,
                  response: ques.response,
                  sa: 1,
                  a: 0,
                  n: 0,
                  d: 0,
                  sd: 0,
                });
                break;
            }
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
          totalstudents: 1,
        });
        await newResult.save();
        const user = await User.findById({ _id: _id });
        user.evaluation.push(courseId);
        await user.save();
        return res.status(200).json({
          success: true,
        });
      }
    }
  }),
  dashboard: tryCatch(async (req, res, next) => {
    const { department, semester, batch } = req.body;

    const results = await Result.find().and([
      { departmentId: department },
      { semesterId: semester },
      { batch: batch },
    ]);
    if (results) {
      let updatedResults = results.map(async (r) => {
        let foundCourse = await Course.findOne({ _id: r.courseId });
        let foundTeacher = await Teacher.findOne({ _id: r.teacherId });
        let foundSemester = await Semester.findOne({ _id: r.semesterId });
        let foundDepartment = await Department.findOne({
          _id: r.departmentId,
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

      x.map((r) => {
        if (r) {
          updatedResults.push(r);
        }
      });

      return res.status(200).json({
        success: true,
        updatedResults,
      });
    }
  }),

  getResult: tryCatch(async (req, res, next) => {
    const results = await Result.find();

    if (results) {
      let updatedResults = results.map(async (r) => {
        let foundCourse = await Course.findOne({ _id: r.courseId });
        let foundTeacher = await Teacher.findOne({ _id: r.teacherId });
        let foundSemester = await Semester.findOne({ _id: r.semesterId });
        let foundDepartment = await Department.findOne({
          _id: r.departmentId,
        });
        if (foundSemester && foundTeacher && foundDepartment && foundCourse) {
          r.teacherId = foundTeacher.name;
          r.semesterId = foundSemester.name;
          r.departmentId = foundDepartment.name;
          r.courseId = foundCourse.name;

          let newdetail = [];

          newdetail = r.courseDetail.map(async (t) => {
            let x = await Question.findOne({ _id: t.questionId });
            t.questionId = x.name;
            return t;
          });
          newdetail = await Promise.all(newdetail);
          r.courseDetail = newdetail;

          newdetail = r.teacherDetail.map(async (t) => {
            let x = await Question.findOne({ _id: t.questionId });
            t.questionId = x.name;
            return t;
          });

          newdetail = await Promise.all(newdetail);
          r.teacherDetail = newdetail;
          return r;
        }
      });

      updatedResults = await Promise.all(updatedResults);

      let x = updatedResults;
      updatedResults = [];
      x.map((r) => {
        if (r) {
          updatedResults.push(r);
        }
      });

      return res.status(200).json({
        success: true,
        updatedResults,
      });
    }
  }),
  isAuth: (req, res, next) => {
    res.status(200).json({ success: true });
  },
  isAuthUser: (req, res, next) => {
    res.status(200).json({ success: true });
  },
  getAll: tryCatch(async (req, res, next) => {
    const semester = await Semester.find();
    const department = await Department.find();
    const teacher = await Teacher.find();
    const course = await Course.find();

    res.status(200).json({
      course: course,
      department: department,
      teacher: teacher,
      semester: semester,
    });
  }),
  getStudentData: tryCatch(async (req, res, next) => {
    let data = await AssignCourse.find().and([
      { departmentId: req.user.departmentId },
      { semesterId: req.user.semesterId },
    ]);
    let question = await Question.find();

    let copy = data.map(async (v) => {
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
        batch: req.user.batch,
      };
    });
    copy = await Promise.all(copy);
    const user = await User.findById({ _id: req.user._id });

    user.evaluation.map((v) => {
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
  }),
  signOutUser: tryCatch(async (req, res, next) => {
    await User.deleteOne({ _id: req.user._id });
    res.clearCookie("access_token");
    res.json({ success: true });
  }),
  signOut: (req, res, next) => {
    res.clearCookie("access_token");
    res.json({ success: true });
  },
  semestercoursechunk: tryCatch(async (req, res, next) => {
    try {
      const { courseChunk, semesterChunk } = req.body;
      let courses = [];
      let semesters = [];
      if (courseChunk.length > 1)
        for (let i = 1; i < courseChunk.length - 1; i++) {
          let found = await Course.findOne({
            name: courseChunk[i].data[0],
          });
          if (!found) courses.push({ name: courseChunk[i].data[0] });
        }
      if (semesterChunk.length > 1)
        for (let i = 1; i < semesterChunk.length - 1; i++) {
          let found = await Semester.findOne({
            name: semesterChunk[i].data[0],
          });
          if (!found) semesters.push({ name: semesterChunk[i].data[0] });
        }
      if (semesters.length > 0) {
        await Semester.insertMany(semesters);
      }
      if (courses.length > 0) {
        await Course.insertMany(courses);
      }
      if (!courses.length > 0 && !semesters.length > 0) {
        return res.status(400).json({
          error: "something went wrong",
        });
      }

      return res.status(200).json({
        success: true,
      });
    } catch (er) {
      return res.status(400).json({
        error: "something went wrong",
      });
    }
  }),
  teacherchunk: tryCatch(async (req, res, next) => {
    try {
      const { teacherChunk } = req.body;
      let teachers = [];
      if (teacherChunk.length > 1)
        for (let i = 1; i < teacherChunk.length - 1; i++) {
          let found = await Teacher.findOne({
            name: teacherChunk[i].data[0],
          });
          if (!found) teachers.push({ name: teacherChunk[i].data[0] });
        }
      if (teachers.length > 0) {
        await Teacher.insertMany(teachers);
      } else {
        return res.status(400).json({
          error: "something went wrong",
        });
      }

      return res.status(200).json({
        success: true,
      });
    } catch (er) {
      return res.status(400).json({
        error: "something went wrong",
      });
    }
  }),
  departmentchunk: tryCatch(async (req, res, next) => {
    try {
      const { departmentChunk } = req.body;
      let departments = [];
      if (departmentChunk.length > 1)
        for (let i = 1; i < departmentChunk.length - 1; i++) {
          let found = await Department.findOne({
            name: departmentChunk[i].data[0],
          });
          if (!found) departments.push({ name: departmentChunk[i].data[0] });
        }
      if (departments.length > 0) {
        await Department.insertMany(departments);
      } else {
        return res.status(400).json({
          error: "something went wrong",
        });
      }

      return res.status(200).json({
        success: true,
      });
    } catch (er) {
      return res.status(400).json({
        error: "something went wrong",
      });
    }
  }),
  questionchunk: tryCatch(async (req, res, next) => {
    try {
      const { questionChunk } = req.body;
      let questions = [];
      if (questionChunk.length > 1)
        for (let i = 1; i < questionChunk.length - 1; i++) {
          let found = await Question.findOne({
            name: questionChunk[i].data[0],
          });
          if (!found)
            questions.push({
              name: questionChunk[i].data[0],
              type: questionChunk[i].data[1],
            });
        }
      if (questions.length > 0) {
        await Question.insertMany(questions);
      } else {
        return res.status(400).json({
          error: "something went wrong",
        });
      }

      return res.status(200).json({
        success: true,
      });
    } catch (er) {
      return res.status(400).json({
        error: "something went wrong",
      });
    }
  }),
};

const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConf = require("../passport");
const { validateBody, schemas } = require("../helpers/routeHelpers");
const Controller = require("../controllers/admin");
const passportAdminSignIn = passport.authenticate("local", { session: false });
const passportJWT = passport.authenticate("ADMIN", { session: false });
const passportJWT2 = passport.authenticate("USER", { session: false });
router
  .route("/adminsignup")
  .post(validateBody(schemas.adminSignUpSchema), Controller.adminSignUp);
router
  .route("/adminsignin")
  .post(
    validateBody(schemas.adminSignInSchema),
    passportAdminSignIn,
    Controller.adminSignIn
  );
router
  .route("/usersignin")
  .post(validateBody(schemas.userSignInSchema), Controller.userSignIn);
router.route("/adminprofile").get(passportJWT, Controller.adminProfile);
router.route("/adminupdate").post(passportJWT, Controller.adminUpdate);
router
  .route("/department")
  .post(
    validateBody(schemas.departmentSchema),
    passportJWT,
    Controller.addDepartment
  );
router.route("/department").get(passportJWT, Controller.getDepartment);
router.route("/del_department").post(passportJWT, Controller.deleteDepartment);
router
  .route("/teacher")
  .post(
    validateBody(schemas.teacherSchema),
    passportJWT,
    Controller.addTeacher
  );
router.route("/teacher").get(passportJWT, Controller.getTeacher);
router.route("/del_teacher").post(passportJWT, Controller.deleteTeacher);
router
  .route("/semester")
  .post(
    validateBody(schemas.semesterSchema),
    passportJWT,
    Controller.addSemester
  );
router.route("/semester").get(passportJWT, Controller.getSemester);
router.route("/del_semester").post(passportJWT, Controller.deleteSemester);
router
  .route("/course")
  .post(validateBody(schemas.courseSchema), passportJWT, Controller.addCourse);
router.route("/course").get(passportJWT, Controller.getCourse);
router.route("/del_course").post(passportJWT, Controller.deleteCourse);
router
  .route("/assigncourse")
  .post(
    validateBody(schemas.assignCourseSchema),
    passportJWT,
    Controller.addAssignCourse
  );
router.route("/assigncourse").get(passportJWT, Controller.getAssignCourse);
router
  .route("/assign_del_course")
  .post(passportJWT, Controller.deleteAssignCourse);
router
  .route("/question")
  .post(
    validateBody(schemas.questionSchema),
    passportJWT,
    Controller.addQuestion
  );
router.route("/edit_question").post(passportJWT, Controller.editQuestion);
router.route("/question").get(passportJWT, Controller.getQuestion);
router.route("/del_question").post(passportJWT, Controller.deleteQuestion);
router
  .route("/user")
  .post(validateBody(schemas.userSchema), passportJWT, Controller.addUser);
router.route("/getuser").post(passportJWT, Controller.getUser);
router.route("/result").post(passportJWT2, Controller.addResult);
router.route("/dashboard").post(passportJWT, Controller.dashboard);
router.route("/result").get(passportJWT, Controller.getResult);
router.route("/isauth").get(passportJWT, Controller.isAuth);
router.route("/isauthuser").get(passportJWT2, Controller.isAuthUser);
router.route("/getall").get(passportJWT, Controller.getAll);
router.route("/getstudentdata").get(passportJWT2, Controller.getStudentData);
router.route("/signout").get(passportJWT, Controller.signOut);
router.route("/usersignout").get(passportJWT2, Controller.signOutUser);
module.exports = router;

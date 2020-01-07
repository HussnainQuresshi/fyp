const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = {
  validateBody: schema => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) {
        req.value = {};
      }
      req.value["body"] = result.value;
      next();
    };
  },

  schemas: {
    adminSignInSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    }),
    userSignInSchema: Joi.object().keys({
      token: Joi.string().required()
    }),
    adminSignUpSchema: Joi.object().keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
      username: Joi.string().required()
    }),
    departmentSchema: Joi.object().keys({
      name: Joi.string().required()
    }),
    teacherSchema: Joi.object().keys({
      name: Joi.string().required()
    }),
    semesterSchema: Joi.object().keys({
      name: Joi.string().required()
    }),
    assignCourseSchema: Joi.object().keys({
      courseId: Joi.objectId().required(),
      teacherId: Joi.objectId().required(),
      departmentId: Joi.objectId().required(),
      semesterId: Joi.objectId().required()
    }),
    courseSchema: Joi.object().keys({
      name: Joi.string().required()
    }),
    questionSchema: Joi.object().keys({
      name: Joi.string().required(),
      type: Joi.string().required()
    }),
    userSchema: Joi.object().keys({
      noOfToken: Joi.string().required(),
      departmentId: Joi.objectId().required(),
      semesterId: Joi.objectId().required(),
      batch: Joi.string().required()
    }),
    resultSchema: Joi.object().keys({
      courseId: Joi.objectId().required(),
      teacherId: Joi.objectId().required(),
      departmentId: Joi.objectId().required(),
      semesterId: Joi.objectId().required(),
      batch: Joi.string().required()
    })
  }
};

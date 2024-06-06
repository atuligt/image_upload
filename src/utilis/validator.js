const Joi = require("joi");

exports.addCommentsValidator = () => {
  const VALIDATE_DATE = Joi.object().keys({
    imageId: Joi.number().required(),
    commenter: Joi.string().required(),
    comment: Joi.string().required(),
  });
  return VALIDATE_DATE;
};

exports.addRepliesOnCommentsValidator = () => {
  const VALIDATE_DATE = Joi.object().keys({
    commentId: Joi.number().required(),
    parentId: Joi.number(),
    replier: Joi.string().required(),
    reply: Joi.string().required(),
  });
  return VALIDATE_DATE;
};

exports.downloadImageValidator = () => {
  const VALIDATE_DATE = Joi.object().keys({
    fileUrl: Joi.string().required(),
    filePath: Joi.string().required(),
  });
  return VALIDATE_DATE;
};

exports.registerValidator = () => {
  const VALIDATE_DATE = Joi.object().keys({
    name: Joi.string().required(),
    user_email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_+=])[A-Za-z0-9!@#$%^&*()-_+=]{8,}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least 1 capital letter, 1 number, 1 special character and at least 8 characters long",
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
      }),
      confirmPassword: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_+=])[A-Za-z0-9!@#$%^&*()-_+=]{8,}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "confirmPassword must contain at least 1 capital letter, 1 number, and 1 special character",
        "string.min": "confirmPassword must be at least 8 characters long",
        "any.required": "confirmPassword is required",
      }),
  });
  return VALIDATE_DATE;
};

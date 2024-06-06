const jwt = require("jsonwebtoken");
const { registerValidator } = require("../../utilis/validator");
var bcrypt = require("bcryptjs");
const {
  insertUserDetailsInDb,
  getAlreadyRegisteredUser,
} = require("../../utilis/dbUtilis");
exports.register = async (req, res) => {
  try {
    const VALIDATE_DATE = registerValidator();
    const VALIDATE_RESULT = VALIDATE_DATE.validate(req.body);
    console.log(req.body);
    if (VALIDATE_RESULT?.error) {
      return res.status(400).json({
        message: VALIDATE_RESULT.error.details[0].message,
      });
    }
    let { password, user_email, name, confirmPassword } = req.body;
    let alreadyRegister = await getAlreadyRegisteredUser(user_email);
    if (alreadyRegister.length > 0) {
      return res.status(400).json({ message: "User is already registerd" });
    }
    if (password !== confirmPassword) {
      return res
        .status(422)
        .json({ message: "Confirm password is not correct" });
    }
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    const RESULT = await insertUserDetailsInDb(name, user_email, hash);
    if (RESULT == true) {
      return res.status(200).send({ message: "User registered successfully" });
    }
    return res.status(400).send({ message: "Something went wrong" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

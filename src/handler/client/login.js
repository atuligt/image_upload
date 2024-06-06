const jwt = require("jsonwebtoken");
const { getAlreadyRegisteredUser } = require("../../utilis/dbUtilis");
var bcrypt = require("bcryptjs");
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL) {
      if (process.env.ADMIN_PASSWORD === password) {
        let token = await jwt.sign(
          {
            email: email,
          },
          process.env.SECRET,
          { expiresIn: 13000 * 13000 }
        );
        return res.status(200).json({
          data: { access_token: token, email: email },
          message: "Logged in successfully",
        });
      } else {
        return res.status(422).json({ message: "Password mismatch" });
      }
    } else {
      let userDetails = await getAlreadyRegisteredUser(email);
      if (!userDetails || userDetails.length <= 0) {
        return res.status(422).json({ message: "User is not registered" });
      }
      if (email === userDetails[0].user_email) {
        if (await bcrypt.compare(password, userDetails[0].password)) {
          let token = await jwt.sign(
            {
              email: email,
            },
            process.env.SECRET,
            { expiresIn: 13000 * 13000 }
          );
          return res.status(200).json({
            data: { access_token: token, email: email },
            message: "Logged in successfully",
          });
        } else {
          return res.status(422).json({ message: "Password mismatch" });
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

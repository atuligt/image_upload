const { insertRepliesOnCommentsInImages } = require("../../utilis/dbUtilis");
const { verifyToken } = require("../../utilis/utilis");
const { addRepliesOnCommentsValidator } = require("../../utilis/validator");

exports.addRepliesOnComments = async (req, res) => {
  try {
    console.log("in add comments");
    const VALIDATE_DATE = addRepliesOnCommentsValidator();
    const VALIDATE_RESULT = VALIDATE_DATE.validate(req.body);
    console.log(JSON.stringify(VALIDATE_RESULT));
    if (VALIDATE_RESULT?.error) {
      return res.status(400).json({
        message: VALIDATE_RESULT.error.details[0].message,
      });
    }
    if (req.headers.authorization) {
      let response = await verifyToken(req.headers.authorization);
      console.log(response);
      if (response == 2) {
        return res.status(400).json({ message: "Invalid token" });
      }
      const { commentId, parentId, replier, reply } = req.body;
      const replyData = {
        comment_id: commentId,
        parent_id: parentId? parentId: null,
        replier,
        reply,
      };
      let resposne = await insertRepliesOnCommentsInImages(replyData);
      console.log(resposne);
      if (resposne) {
        return res
          .status(200)
          .json({ message: "Replies were added successfully." });
      }
      return res.status(400).json({ message: "Issues while adding comments" });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid user. Please login first." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

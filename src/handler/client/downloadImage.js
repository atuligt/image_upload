const fs = require('fs');
const path = require("path");
const { verifyToken } = require("../../utilis/utilis");
const { downloadImageValidator } = require("../../utilis/validator");
const axios = require('axios');
async function copyFile(source, destination) {
  console.log("source, destination==========",source, destination);
  const response = await axios.get(source, { responseType: 'arraybuffer' });
  const imageData = Buffer.from(response.data, 'binary');
  const filePath = path.join(destination, 'downloaded_image.jpg'); 4
  fs.writeFileSync(filePath, imageData);
}


exports.downloadImage = async (req, res) => {
  try {
    const VALIDATE_DATE = downloadImageValidator();
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
      const { fileUrl, filePath } = req.body;
      const fileName = path.basename(fileUrl);
      const sourcePath = path.resolve(fileUrl);
      console.log(sourcePath);
      const destinationPath = path.join(filePath, fileName);
      console.log(destinationPath);
      await copyFile(fileUrl, filePath);
      
      return res.status(200).json({ message: "Image downloaded successfully" });
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

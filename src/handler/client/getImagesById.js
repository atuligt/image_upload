const fs = require("fs");
const path = require("path");

exports.getImagesById = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join("/tmp/uploads/images", filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("Error accessing file:", err);
      return res.status(404).json({ error: "Image not found" });
    }
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
};

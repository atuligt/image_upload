const express = require("express");
const { uploadImage } = require("../../handler/admin/uploadImage");
const multer = require("multer");
const path = require("path");
const ROUTES = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null,  path.join(__dirname, "../../../uploads/images"));
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images only! (jpeg, jpg, png)");
//   }
// }
// const upload = multer({
//   storage: storage, 
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// });
// const upload = multer({
//   storage: multer.diskStorage({
//       destination: '/var/task/uploads/images', // Uploads directory in your Vercel project
//       filename: function (req, file, cb) {
//           cb(null, file.originalname); // Use the original filename
//       }
//   })
// });

const storage = multer.diskStorage({
  destination: '/tmp/uploads/images',
  filename: function(req, file, cb) {
      const extension = file.originalname.split('.').pop();
      cb(null, `file.originalname`);
  }
});

const upload = multer({ storage: storage });
ROUTES.post("/uploadImage", upload.single("image"), uploadImage);

module.exports = ROUTES;

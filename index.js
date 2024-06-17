const express = require("express");
const app = express();
const AdminRoutes = require("./src/routes/adminRoutes/uploadImage.routes.js");
const clientRoutes = require("./src/routes/clientRoutes/fetchImage.routes.js");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/pingTest", (req, res) => {
  const uploadsPath = path.join(__dirname, "uploads");
  const imagesPath = path.join(__dirname, "images");
  // Check if the 'images' folder exists, create it if it doesn't
  const uploadsFolderPath = "/var/task/uploads"; // Adjust the path as per your specific environment

  const imagesFolderPath = path.join(uploadsFolderPath, "images");
  if (!fs.existsSync(imagesFolderPath)) {
    fs.mkdirSync(imagesFolderPath, { recursive: true });
    console.log("Images folder created successfully.");
  } else {
    console.log("Images folder already exists.");
  }
  console.log("Uploads folder path:", uploadsPath);
  console.log("Images folder path", imagesPath);
  return res.status(200).json({ message: "In index call" });
});
app.use("/admin", AdminRoutes);
app.use("/client", clientRoutes);

app.listen(8000, () => {
  console.info(`Server is listening at port 8000`);
});

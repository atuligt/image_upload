const express = require("express");
const app = express();
const AdminRoutes = require("./src/routes/adminRoutes/uploadImage.routes.js");
const clientRoutes = require("./src/routes/clientRoutes/fetchImage.routes.js");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/pingTest", (req, res) => {
  const uploadsPath = path.join(__dirname, "uploads");

  console.log("Uploads folder path:", uploadsPath);
  return res.status(200).json({ message: "In index call" });
});
app.use("/admin", AdminRoutes);
app.use("/client", clientRoutes);

app.listen(8000, () => {
  console.info(`Server is listening at port 8000`);
});

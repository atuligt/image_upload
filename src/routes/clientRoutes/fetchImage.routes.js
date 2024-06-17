

const express = require("express");
const { fetchImage } = require("../../handler/client/fetchImage");
const { updateImageStatus } = require("../../handler/client/updateImageStatus");
const { fetchImageDetailsById } = require("../../handler/client/fetchImageDetails");
const { downloadImage } = require("../../handler/client/downloadImage");
const { addComments } = require("../../handler/client/addComments");
const { addRepliesOnComments } = require("../../handler/client/addRepliesOnComments");
const { login } = require("../../handler/client/login");
const { register } = require("../../handler/client/register");
const { getImagesById } = require("../../handler/client/getImagesById");
const ROUTES = express.Router();
ROUTES.get("/fetchImage", fetchImage);
ROUTES.post("/updateImageStatus", updateImageStatus);
ROUTES.get("/fetchImageDetails/:id", fetchImageDetailsById);
ROUTES.post("/downloadImage", downloadImage);
ROUTES.post("/addComments",addComments);
ROUTES.post("/addRepliesOnComments", addRepliesOnComments);
ROUTES.post('/login', login);
ROUTES.post('/register', register);
ROUTES.get('/images/:filename', getImagesById);
module.exports = ROUTES;

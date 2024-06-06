const { uploadImagesDbutilis } = require("../../utilis/dbUtilis");
const { verifyToken } = require("../../utilis/utilis");

exports.uploadImage = async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(400).json({ message: "Please provide token" });
        }
        console.log(req.headers.authorization);
        let response = await verifyToken(req.headers.authorization);
        console.log("~~~~~~~~~",response);
        if (!response) {
            return res.status(400).json({ message: "Invalid token" });
        }
        if (response != 3) {
            return res.status(400).json({ message: "Invalid User" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }
        console.log(req.file);
        let result = await uploadImagesDbutilis(req.file);
        if (result === true) {
            return res.status(200).json({ message: "Image uploaded successfully" });
        }
        return res.status(400).json({ message: "Something went wrong" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}
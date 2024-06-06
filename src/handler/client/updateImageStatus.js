const { updateImageStatusDbutilis } = require("../../utilis/dbUtilis");
var ip = require('ip');
exports.updateImageStatus = async (req, res) => {
    try {
        let { image_id } = req.body;
        let result = await updateImageStatusDbutilis(image_id, ip.address());
        if(result){
            return res.status(200).json({ message: "Status updated successfully"});
        }
        return res.status(400).json({ message: "Issues while updating the status"});
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}
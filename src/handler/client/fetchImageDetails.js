const {
  fetchImageDetailsDbUtilis,
  fetchImageDetailsDbUtilisByUser,
  updateImageStatusDbutilis,
} = require("../../utilis/dbUtilis");
const { verifyToken } = require("../../utilis/utilis");
var ip = require("ip");
exports.fetchImageDetailsById = async (req, res) => {
  try {
    let { id } = req.params;
    if (req.headers.authorization) {
      let { date_start, date_end } = req.query;
      let response = await verifyToken(req.headers.authorization);
      console.log(response);
      if (response == 2) {
        let result = await fetchImageDetailsDbUtilisByUser(id);
        let statusUpdated = await updateImageStatusDbutilis(id, ip.address());
        return res.status(200).json({ data: result });
      }
      if (response == 3) {
        let result = await fetchImageDetailsDbUtilis(id, date_start, date_end);
        return res.status(200).json({ data: [result] });
      }
      if (response == 1) {
        let result = await fetchImageDetailsDbUtilisByUser(id);
        let statusUpdated = await updateImageStatusDbutilis(id, ip.address());
        return res.status(200).json({ data: result });
      }
    } else {
      let result = await fetchImageDetailsDbUtilisByUser(id);
      let statusUpdated = await updateImageStatusDbutilis(id, ip.address());
      return res.status(200).json({ data: result });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

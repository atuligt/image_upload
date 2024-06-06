const { connection } = require("../../dbConfig/db");
const { fetchImageDetails } = require("../../utilis/dbUtilis");

exports.fetchImage = async (req, res) => {
  try {
    let result = await fetchImageDetails();
    return res.status(200).json({ data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

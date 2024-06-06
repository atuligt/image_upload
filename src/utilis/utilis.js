
const jwt = require('jsonwebtoken');
exports.verifyToken = async (token) => {
    try {
        const decode = jwt.verify(token, process.env.SECRET);
        if (decode.email === process.env.ADMIN_EMAIL) {
            return 3;
        }
        if (decode.email) {
            return 1;
        }
        return 2;

    } catch (error) {
        console.error(error);
        return 2;
    }
}
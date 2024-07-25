require('dotenv').config();
const jwt = require("jsonwebtoken");

const verifyAccount = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const accName = req.params.accName;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (accName == decoded.username) {
            next();
        }
    });
};

module.exports = verifyAccount;
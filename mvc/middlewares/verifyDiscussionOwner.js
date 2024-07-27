require('dotenv').config();
const jwt = require("jsonwebtoken");

const verifyDiscussionOwner = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const dscName = req.params.dscName;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        for (let i = 0; i < decoded.discussionOwner.length; i++) {
            if (dscName == decoded.discussionOwner[i]) {
                next();
            }
        }
    });
};

module.exports = verifyDiscussionOwner;
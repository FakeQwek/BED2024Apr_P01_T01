const jwt = require("jsonwebtoken");
const SECRET_KEY = "3f3a94e1c0b5f11a8e0f2747d2a5e2f7a9a1c3b7d4d6e1e2f7b8c9d1a3e4f6a2"; // Change this to a secure key

const verifyDiscussionOwner = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const dscName = req.params.dscName;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
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
require('dotenv').config();
const jwt = require("jsonwebtoken");

const verifyCommentOwner = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const cmtId = parseInt(req.params.cmtId);

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        async function checkCommentOwner() {
            const res = await fetch("http://localhost:3000/commentOwner/" + cmtId);
            const owner = await res.json();

            if (owner == decoded.username) {
                next();
            }
        }
        checkCommentOwner();
    });
};

module.exports = verifyCommentOwner;
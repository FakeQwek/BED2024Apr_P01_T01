require('dotenv').config();
const jwt = require("jsonwebtoken");

const verifyPostOwner = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const postId = parseInt(req.params.postId);

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        async function checkPostOwner() {
            const res = await fetch("http://localhost:3000/postOwner/" + postId);
            const owner = await res.json();

            if (owner == decoded.username) {
                next();
            }
        }

        checkPostOwner();
    });
};

module.exports = verifyPostOwner;
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

        async function getDiscussionOwner() {
            const res = await fetch("http://localhost:3000/discussions/" + dscName);
            const discussion = await res.json();

            if (discussion.accName == decoded.username) {
                console.log("PASSED")
                next();
            }
        }
        getDiscussionOwner();
    });
};

module.exports = verifyDiscussionOwner;
require('dotenv').config();
const jwt = require("jsonwebtoken");

const verifyDiscussionMember = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const dscName = req.params.dscName;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }

        async function getDiscussion() {
            const res = await fetch("http://localhost:3000/discussions/" + dscName);
            const discussion = await res.json();

            if (discussion.dscType == "Public") {
                next();
            } else {
                async function getDiscussionMember() {
                    const res = await fetch("http://localhost:3000/discussionMembers/" + dscName);
                    const discussionMembers = await res.json();
        
                    for (let i = 0; i < discussionMembers.length; i++) {
                        if (discussionMembers[i].accName == decoded.username) {
                            next();
                        }
                    }
                }
                getDiscussionMember();
            }
        }
        
        if (dscName != null) {
            getDiscussion();
        }
    });
};

module.exports = verifyDiscussionMember;
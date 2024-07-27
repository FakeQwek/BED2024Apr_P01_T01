require('dotenv').config();
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

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
            const response = await fetch("http://localhost:3000/discussions/" + dscName);
            
            if (!response.ok) {
                // If the discussion is not found, handle the error
                if (response.status === 404) {
                    return res.status(404).json({ message: "Discussion not found" });
                } else {
                    return res.status(500).json({ message: "Error retrieving discussion" });
                }
            }

            const discussion = await response.json();

            if (discussion.dscType == "Public") {
                next();
            } else {
                async function getDiscussionMember() {
                    const response = await fetch("http://localhost:3000/discussionMembers/" + dscName);
                    
                    if (!response.ok) {
                        // If discussion members are not found, handle the error
                        if (response.status === 404) {
                            return res.status(404).json({ message: "Discussion members not found" });
                        } else {
                            return res.status(500).json({ message: "Error retrieving discussion members" });
                        }
                    }

                    const discussionMembers = await response.json();
        
                    for (let i = 0; i < discussionMembers.length; i++) {
                        if (discussionMembers[i].accName == decoded.username) {
                            return next();
                        }
                    }
                    return res.status(403).json({ message: "Forbidden" }); // Add this line to handle when user is not a member
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

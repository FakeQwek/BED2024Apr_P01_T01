const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET:", JWT_SECRET); // Ensure the secret is printed correctly

function verifyJWT(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Token verification error:", err);
            return res.status(403).json({ message: "Forbidden" });
        }

        console.log("Decoded Token:", decoded); // Ensure the token is decoded correctly
        req.user = decoded;
        next();
    });
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log("Role not authorized:", req.user.role);
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}

module.exports = { verifyJWT, authorizeRoles };

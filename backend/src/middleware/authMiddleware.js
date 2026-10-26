const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {

    try {

        // Get Authorization Header
        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Access denied. No token provided."

            });

        }

        // Check Bearer Token
        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                success: false,

                message: "Invalid token format."

            });

        }

        // Extract Token
        const token = authHeader.split(" ")[1];

        // Verify Token
        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        // Attach user information
        req.user = decoded;

        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,

            message: "Invalid or expired token."

        });

    }

};

module.exports = authenticateUser;
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const register = async (userData) => {

    const {
        firstName,
        lastName,
        email,
        password,
        preferredLanguage = "English"
    } = userData;

    // Check existing user
    const [existingUser] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );

    if (existingUser.length > 0) {

        return {

            success: false,

            message: "Email already registered."

        };

    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert User
    const [result] = await db.query(

        `INSERT INTO users
        (
            first_name,
            last_name,
            email,
            password_hash,
            preferred_language
        )
        VALUES (?, ?, ?, ?, ?)`,

        [
            firstName,
            lastName,
            email,
            passwordHash,
            preferredLanguage
        ]

    );

    return {

        success: true,

        message: "User registered successfully.",

        user: {

            id: result.insertId,

            firstName,

            lastName,

            email,

            preferredLanguage

        }

    };

};

const generateToken = require("../utils/generateToken");

const login = async (loginData) => {

    const {

        email,

        password

    } = loginData;

    // Find user
    const [users] = await db.query(

        `SELECT *
         FROM users
         WHERE email = ?`,

        [email]

    );

    if (users.length === 0) {

        return {

            success: false,

            message: "Invalid email or password."

        };

    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(

        password,

        user.password_hash

    );

    if (!isMatch) {

        return {

            success: false,

            message: "Invalid email or password."

        };

    }

    // Generate JWT
    const token = generateToken(user);

    return {

        success: true,

        message: "Login successful.",

        token,

        user: {

            id: user.id,

            firstName: user.first_name,

            lastName: user.last_name,

            email: user.email,

            preferredLanguage: user.preferred_language

        }

    };

};

module.exports = {
    register,
    login
};
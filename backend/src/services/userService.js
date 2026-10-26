const bcrypt = require("bcryptjs");
const db = require("../config/db");

/**
 * ==========================================
 * GET USER PROFILE
 * ==========================================
 */
const getProfile = async (userId) => {

    const [users] = await db.query(

        `SELECT
            id,
            first_name,
            last_name,
            email,
            preferred_language,
            created_at,
            updated_at
        FROM users
        WHERE id = ?`,

        [userId]

    );

    if (users.length === 0) {

        return {

            success: false,

            message: "User not found."

        };

    }

    const user = users[0];

    return {

        success: true,

        user: {

            id: user.id,

            firstName: user.first_name,

            lastName: user.last_name,

            email: user.email,

            preferredLanguage: user.preferred_language,

            createdAt: user.created_at,

            updatedAt: user.updated_at

        }

    };

};

/**
 * ==========================================
 * UPDATE PROFILE
 * ==========================================
 */
const updateProfile = async (userId, userData) => {

    const {

        firstName,

        lastName,

        preferredLanguage

    } = userData;

    const [result] = await db.query(

        `UPDATE users
        SET
            first_name = ?,
            last_name = ?,
            preferred_language = ?,
            updated_at = NOW()
        WHERE id = ?`,

        [

            firstName,

            lastName,

            preferredLanguage,

            userId

        ]

    );

    if (result.affectedRows === 0) {

        return {

            success: false,

            message: "User not found."

        };

    }

    return {

        success: true,

        message: "Profile updated successfully."

    };

};

/**
 * ==========================================
 * CHANGE PASSWORD
 * ==========================================
 */
const changePassword = async (userId, passwordData) => {

    const {

        currentPassword,

        newPassword

    } = passwordData;

    // Find user
    const [users] = await db.query(

        `SELECT password_hash
         FROM users
         WHERE id = ?`,

        [userId]

    );

    if (users.length === 0) {

        return {

            success: false,

            message: "User not found."

        };

    }

    const user = users[0];

    // Compare current password
    const isMatch = await bcrypt.compare(

        currentPassword,

        user.password_hash

    );

    if (!isMatch) {

        return {

            success: false,

            message: "Current password is incorrect."

        };

    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(

        newPassword,

        10

    );

    // Update password
    await db.query(

        `UPDATE users
        SET
            password_hash = ?,
            updated_at = NOW()
        WHERE id = ?`,

        [

            hashedPassword,

            userId

        ]

    );

    return {

        success: true,

        message: "Password updated successfully."

    };

};

module.exports = {

    getProfile,

    updateProfile,

    changePassword

};
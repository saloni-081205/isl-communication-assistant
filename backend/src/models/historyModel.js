const db = require("../config/db");

// ============================================================
// CREATE HISTORY
// ============================================================

const createHistory = async ({
    userId,
    detectedWord,
    confidenceScore,
    generatedSentence,
    contextMode,
    englishText,
    hindiText,
    gujaratiText,
}) => {

    const sql = `
        INSERT INTO conversation_history
        (
            user_id,
            detected_word,
            confidence_score,
            generated_sentence,
            context_mode,
            english_text,
            hindi_text,
            gujarati_text
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
        userId,
        detectedWord,
        confidenceScore,
        generatedSentence,
        contextMode,
        englishText,
        hindiText,
        gujaratiText,
    ]);

    return result.insertId;
};


// ============================================================
// GET USER HISTORY
// ============================================================

const getHistoryByUserId = async (
    userId,
    limit,
    offset
) => {

    const sql = `
        SELECT
            id,
            user_id,
            detected_word,
            confidence_score,
            generated_sentence,
            context_mode,
            english_text,
            hindi_text,
            gujarati_text,
            created_at
        FROM conversation_history
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `;

    const [rows] = await db.execute(sql, [
        userId,
        Number(limit),
        Number(offset),
    ]);

    return rows;
};


// ============================================================
// COUNT USER HISTORY
// ============================================================

const countHistoryByUserId = async (userId) => {

    const sql = `
        SELECT COUNT(*) AS total
        FROM conversation_history
        WHERE user_id = ?
    `;

    const [rows] = await db.execute(sql, [userId]);

    return rows[0].total;
};


// ============================================================
// GET SINGLE HISTORY
// ============================================================

const getHistoryById = async (
    historyId,
    userId
) => {

    const sql = `
        SELECT
            id,
            user_id,
            detected_word,
            confidence_score,
            generated_sentence,
            context_mode,
            english_text,
            hindi_text,
            gujarati_text,
            created_at
        FROM conversation_history
        WHERE id = ?
        AND user_id = ?
        LIMIT 1
    `;

    const [rows] = await db.execute(sql, [
        historyId,
        userId,
    ]);

    return rows[0] || null;
};


// ============================================================
// DELETE SINGLE HISTORY
// ============================================================

const deleteHistoryById = async (
    historyId,
    userId
) => {

    const sql = `
        DELETE FROM conversation_history
        WHERE id = ?
        AND user_id = ?
    `;

    const [result] = await db.execute(sql, [
        historyId,
        userId,
    ]);

    return result.affectedRows;
};


// ============================================================
// DELETE ALL HISTORY
// ============================================================

const deleteAllHistory = async (userId) => {

    const sql = `
        DELETE FROM conversation_history
        WHERE user_id = ?
    `;

    const [result] = await db.execute(sql, [userId]);

    return result.affectedRows;
};


module.exports = {
    createHistory,
    getHistoryByUserId,
    countHistoryByUserId,
    getHistoryById,
    deleteHistoryById,
    deleteAllHistory,
};
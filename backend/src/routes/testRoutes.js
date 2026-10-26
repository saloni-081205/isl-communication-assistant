const express = require("express");

const router = express.Router();

const db = require("../config/db");

router.get("/", async (req, res) => {

    try {

        const [rows] = await db.query("SELECT NOW() AS currentTime");

        res.json({

            success: true,

            database: "Connected",

            serverTime: rows[0].currentTime

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Database Connection Failed"

        });

    }

});

module.exports = router;
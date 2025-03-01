const express = require("express");
const router = express.Router();
const {
    getIndexAdmin,
} = require("../controllers/admin.controller");

router.get("/admin", getIndexAdmin);

module.exports = router;

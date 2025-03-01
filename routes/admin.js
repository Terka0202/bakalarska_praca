const express = require("express");
const router = express.Router();
const {
    getIndexAdmin,
} = require("../controllers/students.controller");

router.get("/admin", getIndexAdmin);
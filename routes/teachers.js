const express = require("express");
const router = express.Router();

const {
    getProfilUcitel
} = require("../controllers/teachers.controller");


router.get("/ucitel/profil", getProfilUcitel);

module.exports = router;
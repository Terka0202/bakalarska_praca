const express = require("express");
const router = express.Router();
const {
    getProfilZiak,
    getProfilUcitel,
    getIndexZiak,
    getHomeworks,
    getHomeworkDetails,
    insertHomework_ziak
} = require("../controllers/students.controller");


router.get("/ziak/profil", getProfilZiak);
router.get("/ucitel/profil", getProfilUcitel);

router.get("/ziak/domov", getIndexZiak);
router.get("/ziak/domace-ulohy", getHomeworks);
router.get("/ziak/domace-ulohy/:id", getHomeworkDetails);
router.post("/ziak/domace-ulohy/:id", insertHomework_ziak);

module.exports = router;
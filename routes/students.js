const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
    getProfilZiak,
    getProfilUcitel,
    getIndexZiak,
    getHomeworks,
    getHomeworkDetails,
    insertHomework_ziak,
    getChallenges
} = require("../controllers/students.controller");


router.get("/ziak/profil", getProfilZiak);
router.get("/ucitel/profil", getProfilUcitel);

router.get("/ziak/domov", getIndexZiak);

router.get("/ziak/domace-ulohy", getHomeworks);
router.get("/ziak/domace-ulohy/:id", getHomeworkDetails);
router.post("/ziak/domace-ulohy/:id", upload.single("file_path"), insertHomework_ziak);

router.get("/ziak/tyzdenne-vyzvy", getChallenges);

module.exports = router;
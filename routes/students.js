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
    getChallenges,
    getChallengeDetails,
    insertChallenge_ziak,
    getExcursions,
    getExcursionDetails,
    getQuizzes,
    getQuizzesDetails,
    getTeachingMaterials_category,
    getTeachingMaterials
} = require("../controllers/students.controller");


router.get("/ziak/profil", getProfilZiak);
router.get("/ucitel/profil", getProfilUcitel);

router.get("/ziak/domov", getIndexZiak);

router.get("/ziak/domace-ulohy", getHomeworks);
router.get("/ziak/domace-ulohy/:id", getHomeworkDetails);
router.post("/ziak/domace-ulohy/:id", upload.single("file_path"), insertHomework_ziak);

router.get("/ziak/tyzdenne-vyzvy", getChallenges);
router.get("/ziak/tyzdenne-vyzvy/:id", getChallengeDetails);
router.post("/ziak/tyzdenne-vyzvy/:id", upload.single("file_path_challenge"), insertChallenge_ziak);

router.get("/ziak/exkurzie", getExcursions);
router.get("/ziak/exkurzie/:id", getExcursionDetails);

router.get("/ziak/kvizy", getQuizzes);
router.get("/ziak/kvizy/:id", getQuizzesDetails);

router.get("/ziak/ucebne-materialy", getTeachingMaterials_category);
router.get("/ziak/ucebne-materialy/:id", getTeachingMaterials);

module.exports = router;
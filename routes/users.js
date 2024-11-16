const express = require("express");
const router = express.Router();
const {
    getLoginZiak,
    getLoginUcitel,
    getSignUpZiak,
    getSignUpUcitel,
    createSignUpZiak,
    createSignUpUcitel,
    existingLoginZiak,
    existingLoginUcitel,
    logOut
} = require("../controllers/users.controller");

router.get("/prihlasenie-ziak", getLoginZiak);
router.post("/prihlasenie-ziak", existingLoginZiak);

router.get("/prihlasenie-ucitel", getLoginUcitel);
router.post("/prihlasenie-ucitel", existingLoginUcitel);

router.get("/registracia-ziak", getSignUpZiak);
router.post("/registracia-ziak", createSignUpZiak);

router.get("/registracia-ucitel", getSignUpUcitel);
router.post("/registracia-ucitel", createSignUpUcitel);

router.post("/odhlasenie", logOut);

module.exports = router;
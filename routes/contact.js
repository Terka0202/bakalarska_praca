const express = require("express");
const router = express.Router();
const {
    getContactForm,
    getContactForm_ziak,
    postSendMail,
    postSendMailUvod,
} = require("../controllers/contact.controller");

router.get("/kontakt", getContactForm);
router.post("/kontakt/odoslanie-formularu", postSendMailUvod);

router.get("/ziak/kontakt", getContactForm_ziak);
router.post("/ziak/kontakt/odoslanie-formularu", postSendMail);

module.exports = router;
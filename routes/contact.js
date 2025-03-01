const express = require("express");
const router = express.Router();
const {
    getContactForm,
    getContactForm_ziak,
    postSendMail
} = require("../controllers/contact.controller");

router.get("/kontakt", getContactForm);
router.get("/ziak/kontakt", getContactForm_ziak);
router.post("/ziak/kontakt/odoslanie-emailu", postSendMail);

module.exports = router;
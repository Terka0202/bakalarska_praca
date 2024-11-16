const express = require("express");
const router = express.Router();
const {
    getContactForm,
    getContactForm_ziak,
} = require("../controllers/contact.controller");

router.get("/kontakt", getContactForm);
router.get("/ziak/kontakt", getContactForm_ziak);

module.exports = router;
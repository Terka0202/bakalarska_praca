const express = require("express");
const router = express.Router();
const {
  getUvod,
  getWebInformations,
  getNameDay,
} = require("../controllers/default.controller");

router.get("/uvod", getUvod);
router.get("/o-webe", getWebInformations);
router.get("/meniny", getNameDay);

module.exports = router;
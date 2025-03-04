const express = require("express");
const router = express.Router();
const {
    getIndexAdmin,
    getAcceptUsers,
    postAcceptedUsers,
    deleteAcceptedUsers,
} = require("../controllers/admin.controller");

router.get("/admin", getIndexAdmin);
router.get("/admin/pouzivatelia", getAcceptUsers);
router.post("/admin/pouzivatelia/schvalene", postAcceptedUsers);
router.post("/admin/pouzivatelia/deaktivovane", deleteAcceptedUsers);

module.exports = router;

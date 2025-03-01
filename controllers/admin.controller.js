const Admin = require("../models/admin.model");

const getIndexAdmin = (req, res) => {
    res.render("users/admin/index_admin");
};

module.exports = {
    getIndexAdmin,
};
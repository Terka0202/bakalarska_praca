const getContactForm = (req, res) => {
    res.render("forms/contact_form");
}

const getContactForm_ziak = (req, res) => {
    res.render("forms/contact_ziak");
}

module.exports = {
    getContactForm,
    getContactForm_ziak
};
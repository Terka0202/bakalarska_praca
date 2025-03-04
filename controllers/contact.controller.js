const nodemailer = require("nodemailer");


const getContactForm = (req, res) => {
    res.render("forms/contact_form");
}

const postSendMailUvod = async (req, res) => {
    const { name, surname, email, text } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            replyTo: email,
            to: process.env.EMAIL_USER,
            subject: `Nová správa od ${name} ${surname}`,
            text: text,
        });

        res.redirect("/uvod")
    
    } catch (error) {
        console.error("Chyba pri odosielaní e-mailu:", error);
        return res.status(500).render("shared/500");
    }
};

const getContactForm_ziak = (req, res) => {
    res.render("forms/contact_ziak");
}

const postSendMail = async (req, res) => {
    const { name, surname, email, text } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            replyTo: email,
            to: process.env.EMAIL_USER,
            subject: `Nová správa od ${name} ${surname}`,
            text: text,
        });

        res.redirect("/ziak/kontakt")
    
    } catch (error) {
        console.error("Chyba pri odosielaní e-mailu:", error);
        return res.status(500).render("shared/500");
    }
};

module.exports = {
    getContactForm,
    getContactForm_ziak,
    postSendMail,
    postSendMailUvod,
};
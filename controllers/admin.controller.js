const Admin = require("../models/admin.model");
const nodemailer = require("nodemailer");

const getIndexAdmin = (req, res) => {
    res.render("users/admin/index_admin");
};

const getAcceptUsers = async (req, res) => {
    try {
        const allUsers = await Admin.getAllUsersAdmin();
        res.render("users/admin/accept-users", {allUsers});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
};

const postAcceptedUsers = async (req, res) => {
    const {email, name} = req.body;

    try {
        await Admin.activateUser(email);

        await sendActivationEmail(email, name);

        res.redirect("/admin/pouzivatelia");
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
};

const deleteAcceptedUsers = async (req, res) => {
    const {email, name} = req.body;

    try {
        await Admin.deactivateUser(email);

        await sendDeactivationEmail(email, name);

        res.redirect("/admin/pouzivatelia");
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
};

const sendActivationEmail = async (email, name) => {
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
            to: email,
            subject: "Aktivácia účtu",
            html: `<h1>Milý/á, ${name}!</h1>
                   <p>Váš účet bol úspešne aktivovaný, môžete sa prihlásiť a radovať sa spolu s Edom.</p>`,
        });

    } catch (error) {
        console.error("Chyba pri odosielaní e-mailu:", error);
        return res.status(500).render("shared/500");
    }
};

const sendDeactivationEmail = async (email, name) => {
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
            to: email,
            subject: "Deaktivácia účtu",
            html: `<h1>Milý/á, ${name}!</h1>
                   <p>Váš účet bol deaktivovaný. Ak máte akékoľvek otázky, môžete nás kontaktovať na ${process.env.EMAIL_USER}.</p>`,
        });

    } catch (error) {
        console.error("Chyba pri odosielaní e-mailu:", error);
        return res.status(500).render("shared/500");
    }
};

module.exports = {
    getIndexAdmin,
    getAcceptUsers,
    postAcceptedUsers,
    deleteAcceptedUsers,
};
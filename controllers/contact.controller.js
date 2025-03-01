const nodemailer = require("nodemailer");


const getContactForm = (req, res) => {
    res.render("forms/contact_form");
}

const getContactForm_ziak = (req, res) => {
    res.render("forms/contact_ziak");
}

const postSendMail = async (req, res) => {
    const { name, surname, email, text } = req.body;
    // len skusam
    try {
        // Nastavenie SMTP servera (napr. MS Outlook)
        const transporter = nodemailer.createTransport({
            host: "smtp.office365.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        transporter.verify((error, success) => {
            if (error) {
                console.error("SMTP spojenie zlyhalo:", error);
            } else {
                console.log("SMTP spojenie úspešné, pripravené na odosielanie emailov");
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "martiakova22@gmail.com",
            subject: `Nová správa od ${name} ${surname}`,
            text: text,
            replyTo: email
        };
        
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: "Správa bola odoslaná!" });
        
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

module.exports = {
    getContactForm,
    getContactForm_ziak,
    postSendMail
};
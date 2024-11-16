const Student = require("../models/student.model");
const multer  = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require('fs');

/*PROFIL*/
const getProfilZiak = (req, res) => {
    res.render("users/ziak/profile_ziak");
}

const getProfilUcitel = (req, res) => {
    res.render("users/ucitel/profile_ucitel");
}

/*INDEX*/
const getIndexZiak = (req, res) => {
    res.render("users/ziak/index_ziak");
}

const getHomeworks = async (req, res) => {
    try {
        const homeworks = await Student.getAllHomeworks();
        res.render("users/ziak/homeworks", {homeworks});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const getHomeworkDetails = async (req, res) => {
    try {
        const id_homework = req.params.id;
        const homeworks = await Student.getHomework_details(id_homework);
        const homework = homeworks[0];
        res.render("users/ziak/homework-details", {homework});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const insertHomework_ziak = async (req, res) => {

    const {text_homework} = req.body;
    console.log("toto je body text:", req.body);

    try {
       
        let id_homework = req.params.id; 
        let id_user = res.locals.user.id;

        let isAllRight = false; 

        let db_file_path = "";

        upload.single("file_path")(req, res, async (err) => {

            // Ak nebolbol súbor úspešne nahraný, vypíše chybu
            if (err) {
                console.error("Chyba pri nahrávaní súboru:", err.message);
                return res.status(400).send("Chyba pri nahrávaní súboru. Uistite sa, že súbor je vo formáte PDF.");
            }

            console.log("Súbor nahraný:", req.file); // Skontroluj, či je súbor správne priradený

            // Ak bol súbor úspešne nahraný, nastavíme jeho cestu
            if (req.file) {
                const destination = "./public/pdf_files/";
                const filename = req.file.originalname;
                const filePath = destination + filename;
                fs.renameSync(req.file.path, filePath);
                db_file_path = "/pdf_files/" + filename; 
            }


            const newStudentHomework = new Student(id_homework, id_user, text_homework, db_file_path, isAllRight);
            await newStudentHomework.insertHomeworkByZiak();

            res.redirect("/ziak/domace-ulohy");
        });

    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}


module.exports = {
    getProfilZiak,
    getProfilUcitel,
    getIndexZiak,
    getHomeworks,
    getHomeworkDetails,
    insertHomework_ziak
};
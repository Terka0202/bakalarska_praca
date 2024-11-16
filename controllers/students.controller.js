const Student = require("../models/student.model");
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
        const submittedHomeworks = await Student.getAllSubmittedHomeworks();
        const homeworks = await Student.getAllHomeworks();

        for (let i = 0; i < submittedHomeworks.length; i++) {
            const submitted_homework = submittedHomeworks[i];
            const deadline = new Date(submitted_homework.deadline); // Konvertuj textový dátum na objekt Date
            const now = new Date(); // Získaj aktuálny dátum
            homeworks.isDeadlinePassed = deadline < now; // Pridaj vlastnosť isDeadlinePassed
        }

        res.render("users/ziak/homeworks", {homeworks: homeworks, submittedHomeworks}); // ked mám dve rozne tabulky a chcem ich vykreslit v jednej sablone, určím si spoločnú premennú pre obe volané metody
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

    try {
       
        let id_homework = req.params.id; 
        let id_user = res.locals.user.id;

        let isAllRight = false; 

        let db_file_path = "";

        
        // Ak bol súbor úspešne nahraný, nastavíme jeho cestu
        // Ak nebol súbor úspešne nahraný, vypíše chybu
        if (req.file) {
            const destination = "./public/pdf_files/students_homeworks/";
            const filename = req.file.originalname;
            const filePath = destination + filename;
            fs.renameSync(req.file.path, filePath);
            db_file_path = "/pdf_files/students_homeworks/" + filename; 
        } else {
            return res.status(400).send("Chyba pri nahrávaní súboru. Súbor musí byť vo formáte PDF.");
        }

        console.log("Cesta suboru", db_file_path);

        const newStudentHomework = new Student(id_homework, id_user, text_homework, db_file_path, isAllRight);
        await newStudentHomework.insertHomeworkByZiak();

        res.redirect("/ziak/domace-ulohy");

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
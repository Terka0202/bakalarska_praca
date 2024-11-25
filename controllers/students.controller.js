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
        const id_user = res.locals.user.id;
        const submittedHomeworks = await Student.getSubmittedHomeworksByIdUser(id_user);
        const homeworks = await Student.getAllHomeworks();

        for (let i = 0; i < homeworks.length; i++) {
            const homework = homeworks[i];
            const deadline = new Date(homework.deadline); // Konvertovany textovy datum na format DATE
            const now = new Date(); // aktuálny dátum       
            homework.DeadlinePassed = deadline < now; // pridam do homeworks kazdemu objektu novy stlpec boolean DeadlinePassed 

            // SOME hľadá v poli objektov submittedHomeworks, či existuje aspoň jeden prvok s danou podmienkou, ak ano, tak vracia TRUE a ukonči prehladavanie, ak nenajde, vrati FALSE
            const exists_id = submittedHomeworks.some(sub_homework => sub_homework.id_homework === homework.id_homework);
            
            if (exists_id && deadline > now) {
                homework.isSubmitted = "odovzdane";
            } else if (deadline < now) {
                homework.isSubmitted = "oneskorene odovzdanie";
            } else if (!exists_id) {
                homework.isSubmitted = "neodovzdane";
            }
        }

        const SH_id_homeworks = submittedHomeworks.map(function(sub_homework) {  // MAP prehľadáva celú tabuľku (pole objektov) a vytvorí nové pole obsahujúce len hodnoty id_homework => napr. [1,2,3]
            return sub_homework.id_homework;
        });

        const SH_hodnotenia = submittedHomeworks.map(hodnotenie => hodnotenie.isAllRight); // map pomocou arrow function

        res.render("users/ziak/homeworks", {homeworks, SH_id_homeworks, SH_hodnotenia});
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

const getChallenges = (req, res) => {
    res.render("users/ziak/challenges");
}

module.exports = {
    getProfilZiak,
    getProfilUcitel,
    getIndexZiak,
    getHomeworks,
    getHomeworkDetails,
    insertHomework_ziak,
    getChallenges
};
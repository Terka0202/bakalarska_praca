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
            } else if (deadline < now && exists_id) {
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
            console.log("Cesta k uloženému súboru:", db_file_path);
        } else {
            return res.status(400).send("Chyba pri nahrávaní súboru. Súbor musí byť vo formáte PDF.");
        }

        const newStudentHomework = new Student({type: "homework", id_homework, id_user, text_homework, file_path: db_file_path, isAllRight});
        await newStudentHomework.insertHomeworkByZiak();

        res.redirect("/ziak/domace-ulohy");

    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const getChallenges = async (req, res) => {
    try {
        const id_user = res.locals.user.id;
        const submittedChallenges = await Student.getSubmittedChallengesByIdUser(id_user);
        const challenges = await Student.getAllChallenges();

        for (let i = 0; i < challenges.length; i++) {
            const challenge = challenges[i];
            const deadline = new Date(challenge.deadline);
            const now = new Date(); 
            challenge.DeadlinePassed = deadline < now; 

            const exists_id = submittedChallenges.some(sub_challenge => sub_challenge.id_challenge === challenge.id_challenge);
            
            if (exists_id && deadline > now) {
                challenge.isSubmitted = "odovzdane";
            } else if (deadline < now && exists_id) {
                challenge.isSubmitted = "oneskorene odovzdanie";
            } else if (!exists_id) {
                challenge.isSubmitted = "neodovzdane";
            }
        }

        const SCH_id_challenges = submittedChallenges.map(function(sub_challenge) {
            return sub_challenge.id_challenge;
        });

        const SCH_hodnotenia = submittedChallenges.map(hodnotenie => hodnotenie.isAllRight);

        res.render("users/ziak/challenges", {challenges, SCH_id_challenges, SCH_hodnotenia});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const getChallengeDetails = async (req, res) => {
    try {
        const id_challenge = req.params.id;
        const challenges = await Student.getChallenge_details(id_challenge);
        const challenge = challenges[0];
        res.render("users/ziak/challenge-details", {challenge});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const insertChallenge_ziak = async (req, res) => {

    const {text_challenge} = req.body;

    try {
       
        let id_challenge = req.params.id; 
        let id_user = res.locals.user.id;

        let isCorrect = false; 

        let db_file_path = "";

        
        if (req.file) {
            const destination = "./public/pdf_files/students_challenges/";
            const filename = req.file.originalname;
            const filePath = destination + filename;
            fs.renameSync(req.file.path, filePath);
            db_file_path = "/pdf_files/students_challenges/" + filename; 
        } else {
            return res.status(400).send("Chyba pri nahrávaní súboru. Súbor musí byť vo formáte PDF.");
        }

        const newStudentChallenge = new Student({type: "challenge", id_challenge, id_user, text_challenge, file_path_challenge: db_file_path, isCorrect});
        await newStudentChallenge.insertChallengeByZiak();

        res.redirect("/ziak/tyzdenne-vyzvy");

    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const getExcursions = async (req, res) => {
    try {
        const excursions = await Student.getAllExcursions();

        res.render("users/ziak/excursions", {excursions});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const getExcursionDetails = async (req, res) => {
    try {
        const id_excursion = req.params.id;
        const excursions = await Student.getExcursion_details(id_excursion);
        const excursion = excursions[0];
        res.render("users/ziak/excursion-details", {excursion});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const getTeachingMaterials_category = async (req, res) => {
    try {
        const categories = await Student.getTeaching_materials_category();

        res.render("users/ziak/teaching_materials", {categories});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const getTeachingMaterials = async (req, res) => {
    try {
        const id_category = req.params.id;
        const materials = await Student.getTeaching_materials(id_category);
        const categories = await Student.getTeaching_materials_category();

        let category_title = "";

        for (let i = 0; i < categories.length; i++) {
            if (id_category == categories[i].id_category) {
                category_title = categories[i].title_category;
            }
        }

        res.render("users/ziak/teaching_materials-details", {materials, category_title});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Student.getAllQuizzes();
        res.render("users/ziak/quizzes", {quizzes});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const getQuizzesDetails = async (req, res) => {
    try {
        const id_quiz = req.params.id;
        const quizzes = await Student.getQuizzesById(id_quiz);
        const quiz = quizzes[0];

        res.render("users/ziak/quizzes-details", {quiz});
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
    insertHomework_ziak,
    getChallenges,
    getChallengeDetails,
    insertChallenge_ziak,
    getExcursions,
    getExcursionDetails,
    getQuizzes,
    getQuizzesDetails,
    getTeachingMaterials_category,
    getTeachingMaterials
};
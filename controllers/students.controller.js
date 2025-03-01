const Student = require("../models/student.model");
const User = require("../models/user.model");
const fs = require('fs');
const crypto = require("crypto");

/*PROFIL*/
const getProfilZiak = (req, res) => {
    res.render("users/ziak/profile_ziak");
}

const postNewStudentNameSurname = async (req, res) => {

    const {name, surname} = req.body;

    try {
        const id_user = res.locals.user.id;
 
        const newStudentNameSurname = new User(id_user, name, surname);
        await newStudentNameSurname.updateNameSurname();

        req.session.user.name = name;
        req.session.user.surname = surname;

        res.redirect("/ziak/profil");
   
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const postNewStudentPassword = async (req, res) => {

    const {oldPassword, newPassword} = req.body;

    try {
        const id_user = res.locals.user.id;
        const existPassword = await User.getUserPassword(id_user);
        const password = existPassword[0].password;
        const salt = existPassword[0].salt;
        

        if (!existPassword) {
            return res.status(400).send("Heslo neexistuje.");
        }

        const hashedOldPassword = crypto.pbkdf2Sync(oldPassword, salt, 1000, 64, "sha512").toString("hex");

    
        if (hashedOldPassword === password) {
            const newSalt = crypto.randomBytes(16).toString("hex");
            const hashedNewPassword = crypto.pbkdf2Sync(newPassword, newSalt, 1000, 64, "sha512").toString("hex");

            const updatePassword = new User(id_user, null, null, null, hashedNewPassword, newSalt, null); // poradie konštruktora musí byť dodržané!!!!
            await updatePassword.updatePassword();
        } else {
            return res.status(401).json({ error: "Nesprávne staré heslo" });
        }

        res.redirect("/ziak/profil");
   
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

/*INDEX*/
const getIndexZiak = async (req, res) => {
    try {
        const homeworks = await Student.getAllHomeworks();
        const challenges = await Student.getAllChallenges();
        const newDateExcursion = await Student.getLastExcursion();
        const lastExcursion = newDateExcursion[0];

        res.render("users/ziak/index_ziak", {homeworks, challenges, lastExcursion});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

/*DOMACE ULOHY*/
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
            

            // ukladam si status do databazy
            if (exists_id && deadline > now) {
                await Student.getHomeworkStatus("odovzdane", homework.id_homework);
                homework.isSubmitted = "odovzdane";
            } else if (deadline < now && exists_id) {
                await Student.getHomeworkStatus("oneskorene odovzdanie", homework.id_homework);
                homework.isSubmitted = "oneskorene odovzdanie";
            } else if (!exists_id) {
                await Student.getHomeworkStatus("neodovzdane", homework.id_homework);
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

/*TYZDENNE VYZVY*/
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
                await Student.getChallengeStatus("odovzdane", challenge.id_challenge); // zaznamenavanie statusu do tabulky kvoli notifikaciam
                challenge.isSubmitted = "odovzdane"; // kvoli filtru to tu musim davat
            } else if (deadline < now && exists_id) {
                await Student.getChallengeStatus("oneskorene odovzdanie", challenge.id_challenge);
                challenge.isSubmitted = "oneskorene odovzdanie";
            } else if (!exists_id) {
                await Student.getChallengeStatus("neodovzdane", challenge.id_challenge);
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

/*EXKURZIE*/
const getExcursions = async (req, res) => {
    try {
        const excursions = await Student.getCurrentExcursions();

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
        const countStudents = await Student.getLoggedInStudentsCount();
        const allStudents = countStudents[0]['COUNT(*)'];
        const excursion = excursions[0];

        res.render("users/ziak/excursion-details", {excursion, allStudents});
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const postLogged_in_students = async (req, res) => {
    try {
        const id_user = res.locals.user.id;
        const id_excursion = req.params.id;

        let isLogged_in = true;

        const loggedInStudent = new Student({type: "excursion", id_excursion, id_user, isLogged_in});
        await loggedInStudent.insertLogedInStudent();
        
        res.redirect("/ziak/exkurzie");
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

/*UCEBNE MATERIALY*/
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

/*KVIZY*/
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
    getIndexZiak,
    getHomeworks,
    getHomeworkDetails,
    insertHomework_ziak,
    getChallenges,
    getChallengeDetails,
    insertChallenge_ziak,
    getExcursions,
    getExcursionDetails,
    postLogged_in_students,
    getQuizzes,
    getQuizzesDetails,
    getTeachingMaterials_category,
    getTeachingMaterials,
    postNewStudentNameSurname,
    postNewStudentPassword
};
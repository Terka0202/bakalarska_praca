const db = require("../data/database");

class Student {
    constructor(data) {
        if (data.type === "homework") {
            this.id_homework = data.id_homework;
            this.id_user = data.id_user;
            this.text_homework = data.text_homework;
            this.file_path = data.file_path;
            this.isAllRight = data.isAllRight;
        } else if (data.type === "challenge") {
            this.id_challenge = data.id_challenge;
            this.id_user = data.id_user;
            this.text_challenge = data.text_challenge;
            this.file_path_challenge = data.file_path_challenge;
            this.isCorrect = data.isCorrect;
        }
    }

    static async getAllHomeworks() {
        try {
            const query = `
                SELECT * FROM homeworks;
            `;
            const[records] = await db.query(query);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getSubmittedHomeworksByIdUser(id_user) {
        try {
            const query = `
                SELECT * FROM submitted_homeworks WHERE id_user = ?;
            `;
            const[records] = await db.query(query, [id_user]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

   
    static async getHomework_details(id_homework) {
        try {
            const query = `
                SELECT * FROM homeworks WHERE id_homework = ?;
            `;
            const[records] = await db.query(query, [id_homework]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    async insertHomeworkByZiak() {
        try {
            const query = `
                INSERT INTO submitted_homeworks (id_homework, id_user, text_homework, file_path, isAllRight)
                VALUES (?)
            `;

            const [result] = await db.query(query, [[this.id_homework, this.id_user, this.text_homework, this.file_path, this.isAllRight]]);
            return result;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getHomeworkStatus(status, id_homework) {
        try {
            const query = `
                UPDATE homeworks SET status = ? WHERE id_homework = ?;
            `;
            const[records] = await db.query(query, [status, id_homework]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getChallengeStatus(status, id_challenge) {
        try {
            const query = `
                UPDATE weekly_challenges SET status = ? WHERE id_challenge = ?;
            `;
            const[records] = await db.query(query, [status, id_challenge]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getAllChallenges() {
        try {
            const query = `
                SELECT * FROM weekly_challenges;
            `;
            const[records] = await db.query(query);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getSubmittedChallengesByIdUser(id_user) {
        try {
            const query = `
                SELECT * FROM submitted_challenges WHERE id_user = ?;
            `;
            const[records] = await db.query(query, [id_user]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getChallenge_details(id_challenge) {
        try {
            const query = `
                SELECT * FROM weekly_challenges WHERE id_challenge = ?;
            `;
            const[records] = await db.query(query, [id_challenge]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    async insertChallengeByZiak() {
        try {
            const query = `
                INSERT INTO submitted_challenges (id_challenge, id_user, text_challenge, file_path_challenge, isCorrect)
                VALUES (?)
            `;

            console.log('skuskam id', this.id_challenge);

            const [result] = await db.query(query, [[this.id_challenge, this.id_user, this.text_challenge, this.file_path_challenge, this.isCorrect]]);
            return result;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getAllExcursions() {
        try {
            const query = `
                SELECT * FROM excursions;
            `;
            const[records] = await db.query(query);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getExcursion_details(id_excursion) {
        try {
            const query = `
                SELECT * FROM excursions WHERE id_excursion = ?;
            `;
            const[records] = await db.query(query, [id_excursion]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getCurrentExcursions() {
        try {
            const query = `
                SELECT * FROM excursions ORDER BY date_excursion;
            `;
            const[records] = await db.query(query);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getLastExcursion() {
        try {
            const query = `
                SELECT * FROM excursions ORDER BY date_excursion DESC LIMIT 1;
            `;
            const[records] = await db.query(query);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }


    static async getTeaching_materials_category() {
        try {
            const query = `
                SELECT * FROM teaching_materials_category;
            `;
            const[records] = await db.query(query);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getTeaching_materials(id_category) {
        try {
            const query = `
                SELECT * FROM teaching_materials WHERE id_category = ?;
            `;
            const[records] = await db.query(query, [id_category]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getAllQuizzes() {
        try {
            const query = `
                SELECT * FROM quizzes;
            `;
            const[records] = await db.query(query);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getQuizzesById(id_quiz) {
        try {
            const query = `
                SELECT * FROM quizzes WHERE id_quiz = ?;
            `;
            const[records] = await db.query(query, [id_quiz]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }
}

module.exports = Student;
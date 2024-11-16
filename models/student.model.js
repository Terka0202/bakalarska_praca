const db = require("../data/database");

class Student {
    constructor(paId_homework, paId_user, paText_homework, paFile_path, paIsAllRight) {
        this.id_homework = paId_homework;
        this.id_user = paId_user;
        this.text_homework = paText_homework;
        this.file_path = paFile_path;
        this.isAllRight = paIsAllRight;
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

    static async getAllSubmittedHomeworks() {
        try {
            const query = `
                SELECT * FROM submitted_homeworks;
            `;
            const[records] = await db.query(query);
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
}

module.exports = Student;
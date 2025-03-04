const crypto = require("crypto");
const db = require("../data/database");

class User {

    constructor(paId_user = null, paName, paSurname, paEmail, paPassword, paSalt = null,  paIsTeacher) {
        this.id_user = paId_user;
        this.name = paName;
        this.surname = paSurname;
        this.email = paEmail;
        this.password = paPassword;
        this.salt = paSalt;
        this.isTeacher = paIsTeacher
    }
    
    static async getAllUsers() {
        try {
            const query = `
                SELECT * FROM users;
            `;
            const[records] = await db.query(query);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getUserByEmail(email) {
        try {
            const query = `
                SELECT * FROM users WHERE email = ?;
            `;
            const[records] = await db.query(query, [email]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getUserById(id_user) {
        try {
            const query = `
                SELECT * FROM users WHERE id_user = ?;
            `;
            const[records] = await db.query(query, [id_user]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    async signUp() {
        try {
            const salt = crypto.randomBytes(16).toString("hex");
            console.log()
            const hashedPassword = crypto.pbkdf2Sync(this.password.trim(), salt, 1000, 64, "sha512").toString("hex");
            const query = `
                INSERT INTO users (name, surname, email, password, salt, isTeacher) VALUES (?)
            `;
            const [result] = await db.query(query, [[this.name.trim(), this.surname.trim(), this.email.trim(), hashedPassword, salt, this.isTeacher]]);
            return result;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async login(inputPassword, userPassword, salt) {
        const hashed_password = crypto.pbkdf2Sync(inputPassword, salt, 1000, 64, "sha512").toString("hex");
        if (userPassword === hashed_password) {
            return true;
        } else {
            return false;
        }
    }

    async updateNameSurname() {
        try {
            const query = `
                UPDATE users SET name = ?, surname = ? WHERE id_user = ?;
            `;
            const[result] = await db.query(query, [this.name, this.surname, this.id_user]); 
            return result;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    static async getUserPassword(id_user) {
        try {
            const query = `
                SELECT password, salt FROM users WHERE id_user = ?;
            `;
            const[records] = await db.query(query, [id_user]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

    async updatePassword() {
        try {
            const query = `
                UPDATE users SET password = ?, salt = ? WHERE id_user = ?;
            `;
            const[records] = await db.query(query, [this.password, this.salt, this.id_user]);
            return records;
        } catch (error) {
            console.error(error);
            return res.status(500).render("shared/500");
        }
    }

}

module.exports = User;
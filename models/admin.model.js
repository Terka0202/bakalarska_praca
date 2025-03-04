const db = require("../data/database");

class Admin { 
    constructor(data) {
        if (data.type === "users") {
            this.id_user = data.id_user;
            this.name = data.name;
            this.surname = data.surname;
            this.email = data.email;
            this.password = data.password;
            this.salt = data.salt;
            this.isTeacher = data.isTeacher;
        } 
    }

    static async getAllUsersAdmin() {
        try {
            const query = `SELECT * FROM users ORDER BY id_user DESC`;
            const [records] = await db.query(query);
            return records;
        } catch (error) {
            console.error(error);
            return { success: false, message: "Chyba pri získavaní používateľov." };    
        }
    }

    static async activateUser(email) {
        try {
            const query = `
                UPDATE users SET isActivated = 1 WHERE email = ?
            `;
            const[records] = await db.query(query, [email]);
            return records;
        } catch (error) {
            console.error(error);
            return { success: false, message: "Chyba pri schvaľovaní používateľa." };
        }
    }

    static async deactivateUser(email) {
        try {
            const query = `
                UPDATE users SET isActivated = 0 WHERE email = ?
            `;
            const[records] = await db.query(query, [email]);
            return records;
        } catch (error) {
            console.error(error);
            return { success: false, message: "Chyba pri schvaľovaní používateľa." };
        }
    }
};

module.exports = Admin;
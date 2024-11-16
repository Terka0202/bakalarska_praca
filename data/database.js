const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    database: "bakalarska_praca",
    user: "root",
    password: "password",

});

module.exports = pool;
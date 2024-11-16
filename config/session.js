const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'password',
	database: 'session_data'
};

const sessionStore = new MySQLStore(options);

const createSessionConfig = () => {
    return session({
        secret: 'session_cookie_secret',
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    });
};

module.exports = {
    createSessionConfig,
}
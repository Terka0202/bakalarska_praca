const User = require("../models/user.model");

/*PRIHLASENIE*/
const getLoginZiak = (req, res) => {
    let error = req.session.loginError;

    if (!error) {
        error = "";
    }

    req.session.loginError = null;
    res.render("users/login_ziak", {error});
};

const existingLoginZiak = async (req, res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.getUserByEmail(email);
        
        if (existingUser.length === 0) { //pytam sa či pole s takymto uzivatelom existuje alebo nie
            req.session.loginError = "Zadané prihlasovacie údaje neexistujú";
            req.session.save(() => {
                res.redirect("/prihlasenie-ziak");
            });
            return;
        }

        if (existingUser[0].isTeacher) {
            req.session.loginError = "Nepovolený prístup do žiackeho konta";
            req.session.save(() => {
                res.redirect("/prihlasenie-ziak");
            });
            return;
        }

        const isLoginSuccsesfull = await User.login(password, existingUser[0].password, existingUser[0].salt);

        if (isLoginSuccsesfull) {
            req.session.user = {
                id: existingUser[0].id_user,
                name: existingUser[0].name,
                surname: existingUser[0].surname,
                email: existingUser[0].email,
                isTeacher: existingUser[0].isTeacher,
            };

            req.session.isAdmin = existingUser[0].isAdmin === 1;
            req.session.save(() => {
                res.redirect("/ziak/profil");
            });
        
        } else {
            req.session.loginError = "Zadané heslo je nesprávne";
            req.session.save(() => {
               res.redirect("/prihlasenie-ziak");
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
    
};

const getLoginUcitel = (req, res) => {
    let error = req.session.loginError;

    if (!error) {
        error = "";
    }

    req.session.loginError = null;
    res.render("users/login_ucitel", {error});
};

const existingLoginUcitel = async (req, res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.getUserByEmail(email);
        
        if (existingUser.length === 0) { 
            req.session.loginError = "Zadané prihlasovacie údaje neexistujú";
            req.session.save(() => {
                res.redirect("/prihlasenie-ucitel");
            });
            return;
        }

        if (!existingUser[0].isTeacher) {
            req.session.loginError = "Nepovolený prístup do učiteľského konta";
            req.session.save(() => {
                res.redirect("/prihlasenie-ucitel");
            });
            return;
        }

        const isLoginSuccsesfull = await User.login(password, existingUser[0].password, existingUser[0].salt);

        if (isLoginSuccsesfull) {
            req.session.user = {
                id: existingUser[0].id_user,
                name: existingUser[0].name,
                surname: existingUser[0].surname,
                email: existingUser[0].email,
                isTeacher: existingUser[0].isTeacher,
            };
            
            req.session.isAdmin = existingUser[0].isAdmin === 1;
            req.session.save(() => {
                res.redirect("/ucitel/profil");
            });
        
        } else {
            req.session.loginError = "Zadané heslo je nesprávne";
            req.session.save(() => {
               res.redirect("/prihlasenie-ucitel");
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
};


/*REGISTRACIA*/
const getSignUpZiak = (req, res) => {
    let error = req.session.signUpError;
    let loginData = req.session.loginData;

    if (!error || !loginData) {
        error = "";
        loginData = "";
    }

    req.session.signUpError = null;
    req.session.loginData = null;
    res.render("users/signUp_ziak", {error, loginData});
};

const createSignUpZiak = async (req, res) => {
    const {name, surname, email, password, password_repeat} = req.body;

    try {
        if (password !== password_repeat) {
            req.session.signUpError = "Heslá sa nezhodujú";
            req.session.loginData = {name, surname, email};
            return res.redirect("/registracia-ziak");
        }

        const newUser = new User(name, surname, email, password, false);
        await newUser.signUp();

        /*await User.signUp({name, surname, email, password, password_repeat}) - ked je metoda staticka*/
        res.redirect("/prihlasenie-ziak");
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

const getSignUpUcitel = (req, res) => {
    let error = req.session.signUpError;
    let signUpData = req.session.signUpData;

    if (!error || !signUpData) {
        error = "";
        signUpData = "";
    }

    req.session.signUpError = null;
    req.session.signUpData = null;
    res.render("users/signUp_ucitel", {error, signUpData});
};

const createSignUpUcitel = async (req, res) => {
    const {name, surname, email, password, password_repeat} = req.body;

    try {
        if (password !== password_repeat) {
            req.session.signUpError = "Heslá sa nezhodujú";
            req.session.signUpData = {name, surname, email};
            return res.redirect("/registracia-ucitel");
        }

        const newUser = new User(name, surname, email, password, true);
        await newUser.signUp();

        res.redirect("/prihlasenie-ucitel");
    } catch (error) {
        console.error(error);
        return res.status(500).render("shared/500");
    }
}

/*ODHLASENIE*/
const logOut = (req, res) => {
    req.session.user = null;
    req.session.save(() => {
        res.redirect("/uvod");
    });
}


module.exports = {
    getLoginZiak,
    getLoginUcitel,
    existingLoginZiak,
    existingLoginUcitel,
    getSignUpZiak,
    getSignUpUcitel,
    createSignUpZiak,
    createSignUpUcitel,
    logOut
};
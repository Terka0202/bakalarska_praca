function checkUserAuth(req, res, next) {
	const user = req.session.user;

	if (!user) {  // ak session bude prazdne, ak tam nebudu ziadne user info
		res.locals.isAuth = false;
		res.locals.isAdmin = false;
		return next();
	}
	res.locals.isAuth = true;  // ak bude user prihlaseny, vrati true, ak nie vrati false
	res.locals.isAdmin = req.session.isAdmin;
	res.locals.user = {...user};

	next();
}

module.exports = checkUserAuth;
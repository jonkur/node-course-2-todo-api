var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
	var token = req.header('x-auth');
	if (!token) res.status(401).send();

	User.findByToken(token).then( (user) => {
		if (!user) {
			Promise.reject(); // stop this function and move to reject (catch) block
		}

		req.user = user;
		req.token = token;
		next();
	} ).catch( (e) => {
		res.status(401).send();
	} );
};

module.exports = {authenticate};
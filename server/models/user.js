const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: (value) => {
				return validator.isEmail(value);
			},
			message: '{VALUE} is not a valid email'
		}
		// match: /^(\w+\.\w+|\w+)@((\w+\.\w+\.\w+)|(\w+\.\w+))$/  // just screwing around with regex for mail validation... lol
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function() {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() { // Using a normal function instead of arrow function here, to ensure that "this" keyword points to this particular object instance
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens.push({access, token});

	return user.save().then( () => {
		return token;
	} );
};

UserSchema.statics.findByToken = function(token) {
	var User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, 'abc123');
	} catch (e) {
		// return new Promise( (resolve, reject) => {
		// 	reject();
		// } );
		return Promise.reject(); // same as above but shorter
	}

	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.statics.findByCredentials = function(email, password) {
	var User = this;

	return User.findOne({email}).then( (user) => {
		if (!user) return Promise.reject();

		return new Promise( (resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		} );
	} );
};

UserSchema.pre('save', function(next) {
	var user = this;

	if (user.isModified('password')) {
		var salt = bcrypt.genSaltSync(10);
		user.password = bcrypt.hashSync(user.password, salt);
		next();
	} else {
		next();
	}
});

var User = mongoose.model('User', UserSchema);

module.exports = {
	User
};
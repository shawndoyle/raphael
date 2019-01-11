const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	email: {
		required: true,
		trim: true,
		type: String,
		minLength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email',
		}
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
	},
	tokens: [{
		access: {
			type: String,
			required: true,
		},
		token: {
			type: String,
			required: true,
		}
	}]
});

UserSchema.methods.toJSON = function() {
	userObject = this.toObject();
	return _.pick(userObject, ['_id', 'email']);
};


UserSchema.methods.generateAuthToken = function () {
	let user = this;
	let access = 'auth';
	let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
	user.tokens.push({access, token});
	return user.save().then(() => {
		return token;
	});
};

UserSchema.methods.updatePassword = function () {

}

UserSchema.methods.removeToken = function (token) {
	return this.update({
		$pull: {
			tokens: {token}
		}
	})
}

UserSchema.statics.findByCredentials = function (email, password) {
	const User = this;
	return User.findOne({email})
	.then(user => {
		if(!user) {
			return Promise.reject();
		}
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if(res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};

UserSchema.statics.findByToken = function (token) {
	const User = this;
	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch(e) {
		return Promise.reject();
	}
	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

UserSchema.pre('save', function (next) {
	let user = this;
	if(user.isModified('password')){
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});


const User = mongoose.model('User', UserSchema);

module.exports = {User};
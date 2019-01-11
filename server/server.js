require('./config/config.js');

//Libraries
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

//Local imports
const {mongoose} = require('./db/mongoose.js');
const {File} = require('./models/File.js');
const {User} = require('./models/User.js');
const {authenticate} = require('./middleware/authenticate.js');

//Constants
const port = process.env.PORT;
const app = express();

//Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
	let now = new Date().toString();
	console.log(`${now}:  ${req.method} ${req.url}`);
	next();
})


//User routes
	//CREATE
	app.post('/users/new', (req, res) => {
		let {email, password} = req.body;
		const user = new User({email, password});
		user.save()
		.then(user => {
			return user.generateAuthToken();
		})
		.then(token => {
			res.header('x-auth', token).send(user);
		})
		.catch(e => {
			res.status(400).send();
		});
	});

	//LOGIN
	app.post('/users/login', (req, res) => {
		let {email, password} = req.body;
		User.findByCredentials(email, password)
		.then(user => {
			return user.generateAuthToken()
			.then(token => {
				res.header('x-auth', token).send(user);
			})
		}).catch(e => {
			res.status(400).send(e);
		});
	});

	//LOGOUT
	app.delete('/users/logout', authenticate, (req, res) => {
		req.user.removeToken(req.token)
		.then(() => {
			res.send();
		})
		.catch(e => {
			res.status(400).send();
		});
	});

	//UPDATE
	app.patch('/users/password', authenticate, (req, res) => {
		let {password} = req.body;
		req.user.password = password;
		req.user.save()
		.then(user => {
			res.send({user});
		})
		.catch(e => {
			res.status(400).send();
		})
	});

	//DELETE
	app.delete('/users/delete', authenticate, (req, res) => {
		let {_id} = req.user
		User.findByIdAndRemove(_id)
		.then(user => {
			if(!user) {
				return res.status(400).send();
			}
			res.send({user});
		}).catch(e => {
			res.status(400).send();
		})
	});

//File routes
	//CREATE
	app.post('/files', authenticate, (req, res) => {
		let {dataURL, name} = req.body;
		let _creator = req.user._id;
		let file = new File({dataURL, name, _creator});
		file.save()
		.then(doc => {
			res.send(doc);
		}).catch((e) => {
			res.status(400).send(e);
		});
	});
	//READ ALL
	app.get('/files', authenticate, (req, res) => {
		let _creator = req.user._id;
		File.find({_creator})
		.then(files => {
			res.send({files});
		})
		.catch(e => {
			res.status(400).send();
		});
	})

	//READ ONE
	app.get('/files/:id', authenticate, (req, res) => {
		let _id = req.params.id;
		let _creator = req.user._id;
		if(!ObjectID.isValid(_id)) {
			return res.status(404).send();
		}
		File.findOne({_id, _creator})
		.then(file => {
			if(!file) {
				return res.status(404).send();
			}
			res.send({file});
		}).catch(e => {
			res.status(400).send();
		});
	});

	//UPDATE
	app.patch('/files/:id', authenticate, (req, res) => {
		let _id = req.params.id;
		let _creator = req.user._id;
		let {dataURL} = req.body;
		if(!ObjectID.isValid(_id)) {
			return res.status(404).send();
		}
		File.findOneAndUpdate({_id, _creator}, {$set: {dataURL}}, {new: true})
		.then(file => {
			if(!file) {
				return res.status(404).send();
			}
			res.send({file});
		}).catch(e => {
			res.status(400).send(e);
		});
	});
	//DELETE 
	app.delete('/files/:id', authenticate, (req, res) => {
		let _id = req.params.id;
		let _creator = req.user._id;
		if(!ObjectID.isValid(_id)) {
			return res.status(404).send();
		}
		File.findOneAndRemove({_id, _creator})
		.then(file => {
			if(!file){
				return res.status(404).send();
			}
			res.send({file});
		}).catch(e => {
			res.status(400).send();
		});
	});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

module.exports = {app};
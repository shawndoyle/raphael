//Libraries
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

//Local imports
const {mongoose} = require('./db/mongoose.js');
const {File} = require('./models/File.js');

//Constants
const port = process.env.PORT || 2000;
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
	app.post('/user', (req, res) => {
		const user = new User(_.pick(req.body, ['email', 'password']));
		user.save()
		.then(user => {
			
		})
	})

	//READ (LOGIN)

	//UPDATE

	//DELETE

//File routes
	//CREATE
	app.post('/files', (req, res) => {
		let file = new File(_.pick(req.body, ['dataURL']));
		file.save()
		.then(doc => {
			res.send(doc);
		}).catch((e) => {
			res.status(400).send(e);
		});
	});
	//READ
	app.get('/files/:id', (req, res) => {
		let {id} = req.params;
		if(!ObjectID.isValid(id)) {
			return res.status(404).send();
		}
		File.findById(id)
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
	app.patch('/files/:id', (req, res) => {
		let {id} = req.params;
		let {dataURL} = req.body;
		console.log(id);
		if(!ObjectID.isValid(id)) {
			return res.status(404).send();
		}
		File.findByIdAndUpdate(id, {$set: {dataURL}}, {new: true})
		.then(file => {
			if(!file) {
				return res.status(404).send();
			}
			res.send({file});
		}).catch(e => {
			res.status(400).send(e);
			console.log(e);
		});
	});
	//DELETE 
	app.delete('/files/:id', (req, res) => {
		let {id} = req.params;
		if(!ObjectID.isValid(id)) {
			return res.status(404).send();
		}
		File.findByIdAndRemove(id)
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
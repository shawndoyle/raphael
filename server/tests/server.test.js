const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {File} = require('./../models/File.js');
const {User} = require('./../models/User.js');
const {testFiles, populateFiles, testUsers, populateUsers, newDataURLs, fakeToken} = require('./seed.js');


beforeEach(populateFiles);
beforeEach(populateUsers);

describe('POST /files', () => {
	it('should create a new file', done => {
		let {token} = testUsers[0].tokens[0];
		let dataURL = newDataURLs[0];
		let name = 'A name';
		request(app)
		.post('/files')
		.set('x-auth', token)
		.send({dataURL, name})
		.expect(200)
		.expect(res => {
			expect(res.body.dataURL).toBe(dataURL);
			expect(res.body._creator).toBe(testUsers[0]._id.toHexString());
			expect(res.body.name).toBe(name);
		})
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			File.find().then(files => {
				expect(files.length).toBe(3);
				expect(files.reverse()[0].dataURL).toBe(dataURL);
				done();
			}).catch(e => done(e));
		});
	});
	it('should no create a file with invalid body data', done => {
		let {token} = testUsers[0].tokens[0];
		let test = {};
		request(app)
		.post('/files')
		.set('x-auth', token)
		.send(test)
		.expect(400)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			File.find().then(files => {
				expect(files.length).toBe(2);
				done()
			}).catch(done);
		});
	});
	it('should reject an invalid token', done => {
		let token = fakeToken;
		let dataURL = newDataURLs[0];
		let name = 'A name';
		request(app)
		.post('/files')
		.set('x-auth', token)
		.send({dataURL, name})
		.expect(401)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			File.find().then(files => {
				expect(files.length).toBe(2);
				done()
			}).catch(done);
		});
	});
});

describe('GET /files', () => {
	it('should return all files for the user', done => {
		let {token} = testUsers[1].tokens[0];
		request(app)
		.get('/files')
		.set('x-auth', token)
		.expect(200)
		.expect(res => {
			expect(res.body.files[0].name).toBe(testFiles[1].name);
			expect(res.body.files[0].dataURL).toBe(testFiles[1].dataURL);
			expect(res.body.files.length).toBe(1);
		})
		.end(done);
	});
	it('should reject an invalid token', done => {
		let token = fakeToken;
		request(app)
		.get('/files')
		.set('x-auth', token)
		.expect(401)
		.end(done);
	});
});

describe('GET /files/:id', () => {
	it('should return the correct file', done => {
		let {token} = testUsers[0].tokens[0];
		let id = testFiles[0]._id.toHexString();
		request(app)
		.get(`/files/${id}`)
		.set('x-auth', token)
		.expect(200)
		.expect(res => {
			expect(res.body.file.dataURL).toBe(testFiles[0].dataURL);
		})
		.end(done);
	});
	it('should return 404 if not found', done => {
		let {token} = testUsers[1].tokens[0];
		let id = new ObjectID().toHexString();
		request(app)
		.get(`/files/${id}`)
		.set('x-auth', token)
		.expect(404)
		.end(done);
	});
	it('should return 404 for non-valid ObjectID', done => {
		let {token} = testUsers[1].tokens[0];
		let id = 'NotValidObjectID';
		request(app)
		.get(`/files/${id}`)
		.set('x-auth', token)
		.expect(404)
		.end(done);
	});
	it('should reject an invalid token', done => {
		let token = fakeToken;
		let id = testFiles[0]._id.toHexString();
		request(app)
		.get(`/files/${id}`)
		.set('x-auth', token)
		.expect(401)
		.end(done);
	});
});

describe('PATCH /files/:id', () => {
	it('should update the file', done => {
		let {token} = testUsers[1].tokens[0];
		let id = testFiles[1]._id.toHexString();
		let dataURL = newDataURLs[0];
		request(app)
		.patch(`/files/${id}`)
		.set('x-auth', token)
		.send({dataURL})
		.expect(200)
		.expect(res => {
			expect(res.body.file.dataURL).toBe(dataURL);
		})
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			File.findById(id).then(file => {
				expect(file.dataURL).toBe(dataURL);
				done()
			}).catch(done);
		})
	});
	it('should return 404 if file not found', done => {
		let {token} = testUsers[0].tokens[0];
		let id = new ObjectID().toHexString();
		let dataURL = newDataURLs[1];
		request(app)
		.patch(`/files/${id}`)
		.set('x-auth', token)
		.send({dataURL})
		.expect(404)
		.end(done);
	});
	it('should return 404 for non-valid ObjectID', done => {
		let {token} = testUsers[0].tokens[0];
		let id = 'NotValidObjectID';
		let dataURL = newDataURLs[1];
		request(app)
		.patch(`/files/${id}`)
		.set('x-auth', token)
		.send({dataURL})
		.expect(404)
		.end(done);
	});
	it('should reject invalid token', done => {
		let token = fakeToken;
		let id = testFiles[1]._id.toHexString();
		let dataURL = newDataURLs[0];
		request(app)
		.patch(`/files/${id}`)
		.set('x-auth', token)
		.send({dataURL})
		.expect(401)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			File.findById(id).then(file => {
				expect(file.dataURL).not.toBe(dataURL);
				done()
			}).catch(done);
		})
	});
});
describe('DELETE /files/:id', () => {
	it('should remove the file', done => {
		let {token} = testUsers[0].tokens[0];
		let id = testFiles[0]._id.toHexString();
		request(app)
		.delete(`/files/${id}`)
		.set('x-auth', token)
		.expect(200)
		.expect(res => {
			expect(res.body.file._id).toBe(id);
		})
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			File.findById(id)
			.then(file => {
				expect(file).toBeNull();
				done()
			}).catch(done);
		});
	});
	it('should return 404 if file not found', done => {
		let {token} = testUsers[1].tokens[0];
		let id = new ObjectID().toHexString();
		request(app)
		.delete(`/files/${id}`)
		.set('x-auth', token)
		.expect(404)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			File.findById(id)
			.then(file => {
				expect(file).toBeDefined();
				done()
			}).catch(done);
		});
	});
	it('should return 404 for non-valid ObjectID', done => {
		let {token} = testUsers[0].tokens[0];
		let id = "NotValidObjectID";
		request(app)
		.delete(`/files/${id}`)
		.set('x-auth', token)
		.expect(404)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			File.findById(id)
			.then(file => {
				expect(file).toBeDefined();
				done()
			}).catch(done);
		});
	});
	it('should reject invalid token', done => {
		let token = fakeToken;
		let id = testFiles[0]._id.toHexString();
		request(app)
		.delete(`/files/${id}`)
		.set('x-auth', token)
		.expect(401)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			File.findById(id)
			.then(file => {
				expect(file).toBeDefined();
				done()
			}).catch(done);
		});
	});
});
describe('POST /users/new', () => {
	it('should create a new user', done => {
		let email = 'test@example.com';
		let password = 'ANewPassword';
		request(app)
		.post('/users/new')
		.send({email, password})
		.expect(200)
		.expect(res => {
			expect(res.body._id).toBeDefined();
			expect(res.body.email).toBe(email);
			expect(res.headers['x-auth']).toBeDefined();
		})
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			User.find()
			.then(users => {
				expect(users.length).toBe(3);
				expect(users[2]).toBeDefined();
				expect(users[2].email).toBe(email);
				expect(users[2].password).not.toBe(password);
				done()
			})
			.catch(done);
		});
	});
	it('should return 400 with invalid email', done => {
		let email = 'NotAValidEmail';
		let password = 'testPassword';
		request(app)
		.post('/users/new')
		.send({email, password})
		.expect(400)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			User.find()
			.then(users => {
				expect(users.length).toBe(2);
				done()
			})
			.catch(done);
		});	
	});
	it('should return 400 with invalid password', done => {
		let email = 'valid@email.com';
		let password = [];
		request(app)
		.post('/users/new')
		.send({email, password})
		.expect(400)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			User.find()
			.then(users => {
				expect(users.length).toBe(2);
				done()
			})
			.catch(done);
		});	
	});
	it('should return 400 if the email is already in use', done => {
		let email = 'first@user.com';
		let password = 'testPassword';
		request(app)
		.post('/users/new')
		.send({email, password})
		.expect(400)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			User.find()
			.then(users => {
				expect(users.length).toBe(2);
				done()
			})
			.catch(done);
		});	
	});
});
describe('POST /users/login', () => {
	it('should login user and return auth token', done => {
		let {email, password, _id} = testUsers[1];
		request(app)
		.post('/users/login')
		.send({email, password})
		.expect(200)
		.expect(res => {
			expect(res.body.email).toBe(email);
			expect(res.headers['x-auth']).toBeDefined();
		})
		.end((err, res) => {
			User.findById(_id)
			.then(user => {
				expect(user.tokens[1]).toMatchObject({
					access: 'auth',
					token: res.headers['x-auth']
				});
				done();
			})
			.catch(done);
		});
	});
	it('should reject an invalid login', done => {
		let {email, _id} = testUsers[0];
		let password = 'invalidPassword';
		request(app)
		.post('/users/login')
		.send({email, password})
		.expect(400)
		.expect(res => {
			res.headers['x-auth'].not.toBeDefined();
		})
		.end((err, res) => {
			User.findById(_id)
			.then(user => {
				expect(user.tokens.length).toBe(1);
				done();
			})
			.catch(done);
		});
	});
});
describe('DELETE /users/logout', () => {
	it('should remove the user token', done => {
		let {_id} = testUsers[0];
		let {token} = testUsers[0].tokens[0];
		request(app)
		.delete('/users/logout')
		.set('x-auth', token)
		.expect(200)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			User.findById(_id)
			.then(user => {
				expect(user.tokens.length).toBe(0);
				done();
			})
			.catch(done);
		});
	});
});
describe('PATCH /users/password', () => {
	it('should update the user password', done => {
		let {email} = testUsers[1];
		let {token} = testUsers[1].tokens[0];
		let password = 'ChangedPassword';
		request(app)
		.patch('/users/password')
		.set('x-auth', token)
		.send({password})
		.expect(200)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			request(app)
			.post('/users/login')
			.send({email, password})
			.expect(200);
			done();
		});
	});
	it('should reject the invalid token', done => {
		let {email} = testUsers[1];
		let token = fakeToken;
		let password = 'ChangedPassword';
		request(app)
		.patch('/users/password')
		.set('x-auth', token)
		.send({password})
		.expect(401)
		.end((err, res) => {
			if(err) {
				return done(err);
			}
			request(app)
			.post('/users/login')
			.send({email, password})
			.expect(400);
			done();
		});
	});
});
describe('DELETE /users/delete', () => {
	it('should remove the user', done => {
		let {email} = testUsers[0];
		let {token} = testUsers[0].tokens[0];
		request(app)
		.delete('/users/delete')
		.set('x-auth', token)
		.expect(200)
		.end((err, res) => {
			User.find({email})
			.then(users => {
				expect(users.length).toBe(0);
				done();
			}).catch(done);
		});
	});
	it('should reject the invalid token', done => {
		let {email} = testUsers[0];
		let token = fakeToken;
		request(app)
		.delete('/users/delete')
		.set('x-auth', token)
		.expect(401)
		.end((err, res) => {
			User.find({email})
			.then(users => {
				expect(users.length).toBe(1);
				done();
			}).catch(done);
		});
	});
});
const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
	dataURL: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	lastUpdatedAt: {
		type: Number,
	},
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

FileSchema.pre('save', function (next) {
	this.lastUpdatedAt = new Date();
	next();
});

const File = mongoose.model('File', FileSchema);

module.exports = {File};
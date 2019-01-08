const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
	dataURL: {
		type: String,
		required: true,
	}
})



const File = mongoose.model('File', FileSchema);

module.exports = {File};
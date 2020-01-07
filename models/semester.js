const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const semesterSchema = new Schema({
	name: {
		type: String,
		required: true
	}
});

// Create a model
const Semester = mongoose.model('semester', semesterSchema);

// Export the model
module.exports = Semester;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const teacherSchema = new Schema({
	name: {
		type: String,
		required: true
	}
});

// Create a model
const Teacher = mongoose.model('teacher', teacherSchema);

// Export the model
module.exports = Teacher;

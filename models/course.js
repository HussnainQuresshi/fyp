const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const courseSchema = new Schema({
	name: {
		type: String,
		required: true
	}
});

// Create a model
const Course = mongoose.model('course', courseSchema);

// Export the model
module.exports = Course;

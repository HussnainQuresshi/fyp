const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const departmentSchema = new Schema(
	{
		name: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

// Create a model
const Department = mongoose.model('department', departmentSchema);

// Export the model
module.exports = Department;

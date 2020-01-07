const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const adminSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		lowercase: true,
		required: true
	},

	password: {
		type: String,
		required: true
	}
});

adminSchema.pre('save', async function(next) {
	try {
		//the user schema is instantiated
		const user = this;
		//check if the user has been modified to know if the password has already been hashed
		if (!user.isModified('password')) {
			next();
		}
		// Generate a salt
		const salt = await bcrypt.genSalt(10);
		// Generate a password hash (salt + hash)
		const passwordHash = await bcrypt.hash(this.password, salt);
		// Re-assign hashed version over original, plain text password
		this.password = passwordHash;
		next();
	} catch (error) {
		next(error);
	}
});

adminSchema.methods.isValidPassword = async function(newPassword) {
	try {
		return await bcrypt.compare(newPassword, this.password);
	} catch (error) {
		throw new Error(error);
	}
};

// Create a model
const Admin = mongoose.model('admin', adminSchema);

// Export the model
module.exports = Admin;

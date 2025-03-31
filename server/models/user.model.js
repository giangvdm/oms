import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
        passwordHash: {
            type: String,
			required: true
        }
	},
	{
		timestamps: true, // createdAt, updatedAt
	}
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('passwordHash')) return next();
  
	try {
		const salt = await bcrypt.genSalt(10);
		this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
		next();
	} catch (err) {
	  	next(err);
	}
});

userSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

export default User;

import mongoose, { Schema, Document } from 'mongoose';

export interface IUser {
	email: string;
	password: string;
	profilepic: any;
	fullname: string;
	username: string;
	bio: string;
}

const UserSchema: Schema = new Schema(
	{
		_id: mongoose.Types.ObjectId,
		email: { type: String, required: true, unique: true },
		fullname: { type: String, required: true },
		password: { type: String, required: true },
		profilepic: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		bio: { type: String, required: true },
	},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model<IUser & Document>('User', UserSchema);

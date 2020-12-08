import User, { IUser } from '../models/users';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { uploadImage } from '../gcloud';

export const signIn: any = async (req: any, res: any, next: any) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (!user || !password) {
		const error: any = new Error('Invalid email or password.');
		error.code = 422;
		return next(error);
	}

	const isTrue: any = await bcrypt.compare(password, user.password);

	if (!isTrue) {
		const error: any = new Error('Invalid email or password.');
		error.code = 422;
		return next(error);
	}

	const token = await jwt.sign(
		{
			email: user.email,
		},
		process.env.ACCESS_TOKEN || '',
		{ expiresIn: '24hr' }
	);

	res.status(200).json(token);
};

export const signUp = async (req: any, res: any, next: any) => {
	const { fullname, password, bio }: IUser = req.body;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		const error: any = new Error('Invalid input.');
		error.code = 422;
		return next(error);
	}
	if (!req.files || !req.files.profilepic) {
		const error: any = new Error('No image uploaded.');
		error.code = 422;
		return next(error);
	}
	const email = req.body.email.toLowerCase();
	const username = req.body.username.toLowerCase();

	const user = await User.findOne({ email });

	const usernameExist = await User.findOne({ username });

	if (user || usernameExist) {
		const error: any = new Error('User already exist.');
		error.code = 409;
		return next(error);
	}

	const image = await uploadImage(req.files.profilepic, username, 'users/');

	const hashedPassword = await bcrypt.hash(password, 15);

	await User.create({
		_id: mongoose.Types.ObjectId(),
		email,
		password: hashedPassword,
		fullname,
		profilepic: image,
		username,
		bio,
	});
	res.status(201).json('Account created successfully.');
};

export const verify = (_: any, res: any) => {
	res.send('Verified successfully');
};

import User, { IUser } from '../models/users';
import mongoose from 'mongoose';
import Post, { IPost } from '../models/posts';
import { uploadImage } from '../gcloud';

export const editPost: any = async (req: any, res: any, next: any) => {
	const user = await User.findOne({ email: req.email });

	if (!user) {
		const error: any = new Error('User not found.');
		error.code = 404;
		return next(error);
	}

	const postUrl = req.params.url;

	const { title, body } = req.body;
	const post = await Post.findOne({ url: postUrl, userId: user.id });

	if (!post) {
		const error: any = new Error('Post not found.');
		error.code = 404;
		return next(error);
	} else if (post.userId.toString() !== user.id) {
		const error: any = new Error('Not authorized');
		error.code = 401;
		return next(error);
	}

	let image;
	if (req.files && req.files.featuredimage) {
		image = await uploadImage(req.files.featuredimage, title, 'posts/');
	}

	const data = {
		url: title ? url(title) + '-' + generateRand(12) : postUrl,
		title: title || post.title,
		featuredimage: image || post.featuredimage,
		body: body || post.body,
	};

	await Post.updateOne({ _id: post.id }, data);

	res.status(200).json('Updated post successfully');
};

export const createPost: any = async (req: any, res: any, next: any) => {
	const user = await User.findOne({ email: req.email });

	if (!user) {
		const error: any = new Error('User not found.');
		error.code = 404;
		return next(error);
	}

	const { title, body }: IPost = req.body;

	if (!title || !body) {
		const error: any = new Error('Invalid input');
		error.code = 422;
		return next(error);
	}

	if (title.length < 5 || body.length < 10) {
		const error: any = new Error('Invalid input.');
		error.code = 409;
		return next(error);
	}

	if (title.toLowerCase() === 'create') {
		const error: any = new Error('Change title.');
		error.code = 409;
		return next(error);
	}
	if (!req.files || !req.files.featuredimage) {
		const error: any = new Error('No image uploaded.');
		error.code = 422;
		return next(error);
	}

	const postUrl = url(title) + '-' + generateRand(12);

	const image = await uploadImage(req.files.featuredimage, title, 'posts/');
	await Post.create({
		_id: mongoose.Types.ObjectId(),
		title,
		featuredimage: image,
		body,
		url: postUrl,
		userId: user.id,
	});

	res.status(201).json('Created post successfully.');
};

export const imageUpload = async (req: any, res: any, next: any) => {
	const image = await uploadImage(req.files.image, 'images', 'editor/');

	res.status(200).send(image);
};

const ITEMS_PER_PAGE = 6;

const postData = { _id: 0, title: '', body: '', created_at: '', url: '', featuredimage: '' };

export const myPosts = async (req: any, res: any, next: any) => {
	const page = req.query.page;

	const user = await User.findOne({ email: req.email });

	if (!user) {
		const error: any = new Error('User not found.');
		error.code = 404;
		return next(error);
	}

	const allPosts = await Post.find({ userId: user.id }, postData)
		.skip((page - 1) * ITEMS_PER_PAGE)
		.limit(ITEMS_PER_PAGE);

	res.status(200).send(allPosts);
};

export const posts = async (req: any, res: any, next: any) => {
	try {
		const page: number = req.query.page;
		const count = await Post.countDocuments();
		const allPosts = await Post.find({}, postData)
			.skip((page - 1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE);
		const data = [];
		for (let i = 0; i < allPosts.length; i++) {
			const post = allPosts[i];
			const user = await User.findOne({ id: post.userId });
			data.push({
				fullname: user?.fullname,
				//@ts-ignore
				...post._doc,
			});
		}
		const len = Math.ceil(count / ITEMS_PER_PAGE);
		if (allPosts.length === 0) {
			const error: any = new Error('Post not found.');
			error.code = 404;
			return next(error);
		}
		res.status(200).send({ posts: data, len });
	} catch (e) {}
};

type Data = {
	fullname: string;
	profilepic: string;
	title: string;
	body: string;
	url: string;
	bio: string;
	prevPost: data;
	nextPost: data;
};

type data = {
	title: string;
	url: string;
};

export const post = async (req: any, res: any, next: any) => {
	const url: string = req.params.url.toLowerCase();

	const post = await Post.findOne({ url }, postData);
	const user = await User.findOne({ id: post?.userId });
	if (!post) {
		const error: any = new Error('Post not found.');
		error.code = 404;
		return next(error);
	}

	if (!user) {
		const error: any = new Error('User not found.');
		error.code = 404;
		return next(error);
	}
	const { fullname, profilepic, bio } = user;
	//@ts-ignore
	const nextPost = await Post.find({ created_at: { $lt: post.created_at } }).limit(1);
	//@ts-ignore
	const prevPost = await Post.find({ created_at: { $gt: post.created_at } }).limit(1);
	const data: Data = {
		fullname,
		profilepic,
		bio,
		nextPost: null,
		prevPost: null,
		//@ts-ignore
		...post._doc,
	};
	//@ts-ignore
	if (prevPost.length !== 0)
		data.prevPost = {
			title: prevPost[0].title,
			url: prevPost[0].url,
		};
	//@ts-ignore
	if (nextPost.length !== 0) data.nextPost = { title: nextPost[0].title, url: nextPost[0].url };

	res.status(200).send(data);
};

export const deletePost = async (req: any, res: any, next: any) => {
	const user = await User.findOne({ email: req.email });
	const page = req.query.page;

	if (!user) {
		const error: any = new Error('User not found.');
		error.code = 404;
		return next(error);
	}
	const url: string = req.params.url.toLowerCase();

	const post = await Post.findOne({ url });
	if (!post) {
		const error: any = new Error('Post not found.');
		error.code = 404;
		return next(error);
	} else if (post.userId.toString() !== user.id) {
		const error: any = new Error('Not authorized');
		error.code = 401;
		return next(error);
	}
	await Post.deleteOne({ url });
	const posts = await Post.find({ userId: user.id }, postData)
		.skip((page - 1) * ITEMS_PER_PAGE)
		.limit(ITEMS_PER_PAGE);

	req.app.get('io').emit('postdelete', posts);

	res.status(200).send('Post deleted successfully');
};

function generateRand(len: number) {
	var res = '';
	var char = 'abcdefghijklmnopqrstuvwxyz0123456789';
	var charLen = char.length;
	for (var i = 0; i < len; i++) {
		res += char.charAt(Math.floor(Math.random() * charLen));
	}
	return res;
}

function url(str: string): string {
	const newStr: string[] = str.split(' ');
	const s: string = newStr.join('-');

	if (s[s.length - 1] == '.') {
		const s1: string = s.slice(0, -1);
		return s1.toLowerCase();
	}
	return s.toLowerCase();
}

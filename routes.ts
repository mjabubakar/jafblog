import express from 'express';
import { body } from 'express-validator';

const router = express.Router();

import auth from './middleware/auth';

import { signUp, signIn, verify } from './controllers/userController';

import { createPost, myPosts, post, posts, editPost, deletePost, imageUpload } from './controllers/postController';

router.post('/signin', signIn);

router.post(
	'/signup',
	[
		body('email').isEmail().normalizeEmail(),
		body('password').isLength({ min: 6 }),
		body('fullname').isLength({ min: 5 }),
		body('username').isLength({ min: 4 }),
		body('bio').isLength({ min: 10 }),
	],
	signUp
);

router.post('/createpost', auth, createPost);

router.put('/edit/:url', auth, editPost);

router.get('/myposts', auth, myPosts);

router.get('/posts', posts);

router.delete('/delete/:url', auth, deletePost);

router.get('/post/:url', post);

router.get('/verify', auth, verify);

router.post('/imageupload', imageUpload);

export default router;

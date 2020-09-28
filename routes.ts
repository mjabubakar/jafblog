import express from "express";
import { body } from "express-validator";

const router = express.Router();

import auth from "./middleware/auth";

import { signUp, signIn } from "./controllers/userController";

import { createPost, myPosts, post, posts } from "./controllers/postController";

router.post("/signin", signIn);

router.post("/signup", [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("fullname").isLength({ min: 5 })
], signUp);

router.post("/createpost", auth, createPost);

router.get("/myposts", auth, myPosts);

router.get("/posts",posts);

router.get("/post/:url", auth, post);

export default router;
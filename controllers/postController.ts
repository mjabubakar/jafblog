import User, { IUser } from "../models/users";
import mongoose from "mongoose";
import Post, { IPost } from "../models/posts";

export const createPost: any = async (req: any, res: any, next: any) => {

    const user = await User.findOne({ email: req.email });

    if (!user) {
        const error: any = new Error("User not found.");
        error.code = 404;
        return next(error);
    }

    const { title, body }: IPost = req.body;

    if(!title || !body){
        const error: any = new Error("Invalid input");
        error.code = 422;
        return next(error);
    }

    if (!req.files) {
        const error: any = new Error("No image uploaded.");
        error.code = 422;
        return next(error);
    }

    const postUrl = url(title);

    const featuredimage = req.files.featuredimage;

    featuredimage.mv("./uploads/", featuredimage.name);

    const postTitle: any = await Post.findOne({ title, url: postUrl });

    if (title.length < 5 || body.length < 10 || !featuredimage) {
        const error: any = new Error("Invalid input.");
        error.code = 409;
        return next(error);
    }

    if (postTitle) {
        const error: any = new Error("Change post title.");
        error.code = 409;
        return next(error);
    }

    await Post.create({
        _id: mongoose.Types.ObjectId(),
        title,
        featuredimage: featuredimage.name,
        body,
        url: postUrl,
        userId: user.id
    });

    res.status(201).json("Created post successfully.");

};

const ITEMS_PER_PAGE = 10;

export const myPosts = async (req: any, res: any, next: any) => {
    const page = req.query.page;

    const user = await User.findOne({ email: req.email });

    if (!user) {
        const error: any = new Error("User not found.");
        error.code = 404;
        return next(error);
    }

    const allPosts = await Post.find({ userId: user.id },
        ['title', 'url', "body", "created_at", "featuredimage"]
    ).skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);

    res.status(200).send(allPosts);
}

export const posts = async (req: any, res: any, next: any) => {
    const page = req.query.page;
    const allPosts = await Post
        .find({}, ['title', 'url', "body", "featuredimage", "created_at"])
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);

    res.status(200).send(allPosts);
}

export const post = async (req: any, res: any, next: any) => {
    const url: string = req.params.url;

    const post = await Post.findOne({ url }, ['title', 'url', "body", "featuredimage", "created_at"]);

    if (!post) {
        const error: any = new Error("Post not found.");
        error.code = 404;
        return next(error);
    }

    res.status(200).send(post);
}

function url(str: string): string {
    const newStr: string[] = str.split(" ");
    const s: string = newStr.join("-")

    if (s[s.length - 1] == ".") {
        const s1: string = s.slice(0, -1);
        return s1;
    }
    return s;
}
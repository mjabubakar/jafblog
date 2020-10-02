import User, { IUser } from "../models/users";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";


export const signIn: any = async (req: any, res: any, next: any) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !password) {
        const error: any = new Error("Invalid email or password.");
        error.code = 409;
        return next(error);
    }

    const isTrue: any = await bcrypt.compare(password, user.password);

    if (!isTrue) {
        const error: any = new Error("Invalid email or password.");
        error.code = 422;
        return next(error);
    }

    const token = await jwt.sign({
        email: user.email,
    },
        "sdhbdsgvdgsdv",
        { expiresIn: "24hr" },
    );

    res.status(200).json(token);
}

export const signUp = async (req: any, res: any, next: any) => {

    const { fullname, email, password }: IUser = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error: any = new Error("Invalid input.");
        error.code = 422;
        return next(error);
    }

   
    const user = await User.findOne({ email });

    if (user) {
        const error: any = new Error("User already exist.");
        error.code = 409;
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    await User.create({
        _id: mongoose.Types.ObjectId(),
        email,
        password: hashedPassword,
        fullname,
    })
    res.status(201).json("Account created successfully.");
}
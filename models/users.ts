import mongoose, { Schema, Document } from "mongoose";
import Post from "./posts";

export interface IUser {
    email: string;
    password: string;
    fullname: string;
}

const UserSchema: Schema = new Schema({
    _id: mongoose.Types.ObjectId,
    email: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }]
},
    { timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } });


export default mongoose.model<IUser & Document>("User", UserSchema)
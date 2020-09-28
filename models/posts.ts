import mongoose, { Schema, Document } from "mongoose";

export interface IPost {
    title: string;
    body: string;
    featuredimage: string;
    userId: number;
    url: string;
}

const PostSchema: Schema = new Schema({
    _id: mongoose.Types.ObjectId,
    title: { type: String, required: true, unique: true },
    featuredimage: { type: String, required: true },
    body: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
    { timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } });

export default mongoose.model<IPost & Document>("Post", PostSchema);
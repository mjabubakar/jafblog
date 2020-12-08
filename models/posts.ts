import mongoose, { Schema, Document } from 'mongoose';

export interface IPost {
	title: string;
	body: string;
	featuredimage: any;
	userId: string;
	url: string;
}

const PostSchema: Schema = new Schema(
	{
		_id: mongoose.Types.ObjectId,
		title: { type: String, required: true },
		featuredimage: { type: String, required: true },
		body: { type: String, required: true },
		url: { type: String, required: true, unique: true },
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model<IPost & Document>('Post', PostSchema);

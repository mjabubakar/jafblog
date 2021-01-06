import { Storage } from '@google-cloud/storage';

const gc = new Storage({
	keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
	projectId: process.env.GCLOUD_PROJECT_ID,
});

const bucket = gc.bucket(process.env.GCLOUD_STORAGE_BUCKET_URL || '');

const bc = process.env.GCLOUD_STORAGE_BUCKET_URL || '';

const bcLink = bc.split('gs://')[1];

export const uploadImage = (file: any, name: string, type: string) =>
	new Promise(async (resolve, reject) => {
		const d = new Date();
		//@ts-ignore
		const name = Date.parse(d);
		const url = type + name + '/' + name;
		const publicUrl = 'https://storage.googleapis.com/' + bcLink + url;

		const blob = bucket.file(url);
		const blobStream = blob.createWriteStream({
			resumable: false,
			gzip: true,
		});

		blobStream
			.on('finish', () => {
				resolve(publicUrl);
			})
			.on('error', (error) => {
				console.log(error)
				reject(`Unable to upload image, something went wrong.`);
			})
			.end(file.data);
	});

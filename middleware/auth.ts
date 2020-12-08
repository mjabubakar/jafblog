const jwt = require('jsonwebtoken');

interface Data {
	email: string;
}

export default (req: any, _: any, next: any) => {
	const header: string = req.headers['authorization'];
	const token: string = header && header.split(' ')[1];

	jwt.verify(token, process.env.ACCESS_TOKEN || '', (err: any, data: Data) => {
		if (err || !data) {
			const error: any = new Error('Authentication error.');
			error.code = 403;
			throw error;
		}
		req.email = data.email;
		next();
	});
};

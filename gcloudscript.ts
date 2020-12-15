const fs = require('fs');
require('dotenv/config');
//@ts-ignore
fs.appendFile('key.json', process.env.GCLOUD_CRED, function (err) {
	if (err) throw err;
});

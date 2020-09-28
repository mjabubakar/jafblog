import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

require("dotenv/config");

import routes from "./routes";

const app: express.Application = express();

const port: any = process.env.PORT || 4000;

app.use(fileUpload({
    createParentPath: true
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(routes);

app.use((error: any, req: any, res: any, next: any) => {
    const status = error.code || 500;
    const message = error.message || "Server error occured.";
    res.status(status).json({ message });
});


app.listen(port);


//@ts-ignore
mongoose.connect(process.env.URI,
    {
        useNewUrlParser: true
    });
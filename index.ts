import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
require("dotenv/config");

import routes from "./routes";

const app: express.Application = express();

const port: any = process.env.PORT || 4000;

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(cors());

app.use(routes);

app.use((error: any, req: any, res: any, next: any) => {
  const status = error.code || 500;
  const message = error.message || "Server error occured.";
  res.status(status).json({ message });
});

mongoose.set("useCreateIndex", true);
mongoose
  //@ts-ignore
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port);
    console.log(`Server running on port ${port}`);
  })
  .catch(() => {
    throw new Error("Server error");
  });

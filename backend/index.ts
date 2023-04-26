import express, { json } from "express";
const app = express();
const port = process.env.PORT || 5001;
import cors from "cors";

import habitsRouter from "./habitsRouter";
import usersRouter from "./usersRouter";
import { config } from "dotenv";
config();
const corsOptions = {
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));
app.use(json());
app.use(habitsRouter);
app.use(usersRouter);

//TODO: generate index for user database

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

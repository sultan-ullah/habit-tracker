const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const cors = require("cors");

const habitsRouter = require('./habitsRouter');
const usersRouter = require('./usersRouter');
const dotenv = require('dotenv');
dotenv.config();
const corsOptions = {
  origin: "http://localhost:3000",
};




app.use(cors(corsOptions));
app.use(express.json());
app.use(habitsRouter);
app.use(usersRouter);


//TODO: generate index for user database

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


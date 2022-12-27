const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const cors = require("cors");
const basicAuth = require("express-basic-auth");
const usersRouter = require('./usersRouter');
const habitsRouter = require('./habitsRouter');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();
const corsOptions = {
  origin: "http://localhost:3001",
};

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(cookieParser());

app.use(cors(corsOptions));
app.use(express.json());

app.use(usersRouter);
app.use(habitsRouter);

//TODO: generate index for user database

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
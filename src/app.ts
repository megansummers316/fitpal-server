// express imports
import express, { Application } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser"; // to read body of http POST / PUT requests

// local file imports
import exercises from './controllers/exercises.controller.js';

// create new express application
const app: Application = express();
app.use(express.json()); //bodyParser.json());

//mongoose db connection
const db: string = process.env.DB || '';
mongoose.connect(db, {})
    .then((res) => console.log('Connected to MongoDB'))
    .catch((err) => console.log(`Connection error: ${err}`));

// map urls to appropriate controllers
app.use('/api/v1/exercises', exercises);

// start server. use random port on render server w/4000 as fallback
const port = process.env.PORT || 4000;
app.listen(port, () => {
    // confirm server running
    console.log(`Express running on port `, port);
});


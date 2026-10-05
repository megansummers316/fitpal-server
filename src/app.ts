// express imports
import express, { Application } from "express";
import bodyParser from "body-parser"; // to read body of http POST / PUT requests

// local file imports
const exercises = require('./controllers/exercises.controller');

// create new express application
const app: Application = express();
app.use(express.json()); //bodyParser.json());

// map urls to appropriate controllers
app.use('/api/v1/exercises', exercises);

// start server. use random port on render server w/4000 as fallback
const port = process.env.PORT || 4000;
app.listen(port, () => {
    // confirm server running
    console.log(`Express running on port {port}`);
});


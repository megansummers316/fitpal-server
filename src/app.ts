import dotenv from "dotenv";
dotenv.config();

// express imports
import express, { Application } from "express";
import mongoose from "mongoose";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
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

//swagger setup for api doc generation
const swaggerSpec = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fitpal API',
            version: '1.0.0'
        }
    },
    apis: ['./dist/controllers/*.js'] //api methods with YAML comment location
};

const openApiSpecs = swaggerJSDoc(swaggerSpec);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(openApiSpecs));

// map urls to appropriate controllers
app.use('/api/v1/exercises', exercises);

// start server. use random port on render server w/4000 as fallback
const port = process.env.PORT || 4000;
app.listen(port, () => {
    // confirm server running
    console.log(`Express running on port `, port);
});


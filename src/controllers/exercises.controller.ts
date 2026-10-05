// express imports
import express, { Request, Response, Router } from "express";

//model import for CRUD
import Exercise from "../models/exercise.model.js";

// create router to map url requests to correct methods
const router: Router = express.Router();

// mock data for CRUD
interface Exercise {
    id: number,
    name: string
}

let exercises = [
    { id: 1, name: 'Squats' },
    { id: 2, name: 'Rope Jumping' },
    { id: 3, name: 'Jogging' },
    { id: 4, name: 'Volleyball' }
];

/* GET: /api/v1/exercises => fetch all exercises */
router.get('/', async (req: Request, res: Response) => {
    //use Model to retrieve exercise documents from MongoDB
    const exercises = await Exercise.find();
    return res.status(200).json(exercises);
});

/* POST: /api/v1/exercises => create new exercise */
router.post('/', async (req: Request,  res: Response) => {
    // validate request body
    if (!req.body) {
        return res.status(400).json({ err: 'Invalid Request Body' });
    }

    // add new exercise to array from request body
    //exercises.push(req.body);
    await Exercise.create(req.body);

    // send response back
    return res.status(201).json(); // 201: resource created
});

/* PUT: /api/v1/exercises/4 => update selected exercise based on id param in url */
router.put('/:id', (req: Request,  res: Response) => {
    // search array for id in url param
    const index: number = exercises.findIndex(e => e.id.toString() == req.params.id);

    if (index === -1) {
        return res.status(404).json({ err: 'Exercise Not Found' });
    }

    // update name of selected exercise in array
    exercises[index].name = req.body.name;
    return res.status(204).json({ msg: 'Exercise Updated' });
});

// make router public so other files can access it
export default router;
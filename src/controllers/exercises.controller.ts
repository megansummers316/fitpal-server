// express imports
import express, { Request, Response, Router } from "express";

//model import for CRUD
import Exercise from "../models/exercise.model.js";

// create router to map url requests to correct methods
const router: Router = express.Router();

/**
 * @swagger
 * /api/v1/exercises:
 *   get:
 *     tags:
 *       - Exercise
 *     summary: Retrieve all exercises
 *     responses:
 *       200:
 *         description: A list of exercises
 *       404:
 *         description: No exercises found
 */
router.get('/', async (req: Request, res: Response) => {
    //check request for "querystring" (url query) eg ?name=Yoga
    const filter = req.query; //could exist, could not exist

    //use Model to retrieve exercise documents from MongoDB
    const exercises = await Exercise.find(filter); //adding filter => if no filter, it wont do anything different but it will only look for the filter if there is a value to it
    //this is an exact match, no partial search eg "walk" != "walking"
    if (exercises.length === 0) return res.status(404).json({err: "No Exercises Found."});
    return res.status(200).json(exercises);
});

/**
 * @swagger
 * /api/v1/exercises/{id}:
 *   get:
 *     tags:
 *       - Exercise
 *     summary: Find exercise by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns the selected exercise
 *       404:
 *         description: Exercise not found
 */
router.get('/:id', async (req: Request, res: Response) => {
    const exercise = await Exercise.findById(req.params.id);

    if (exercise == null) return res.status(404).json({err: 'Exercise Not Found'});

    return res.status(200).json(exercise);
});

/**
 * @swagger
 * /api/v1/exercises:
 *   post:
 *     tags:
 *       - Exercise
 *     summary: Add a new exercise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - duration
 *               - intensity
 *             properties:
 *               name:
 *                 type: string
 *               duration:
 *                 type: integer
 *               intensity:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exercise created
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Exercise not found
 */
router.post('/', async (req: Request,  res: Response) => {
    // validate request body
    if (!req.body) {
        return res.status(400).json({ err: 'Invalid Request Body' });
    }
    await Exercise.create(req.body);

    // send response back
    return res.status(201).json(); // 201: resource created
});

/**
 * @swagger
 * /api/v1/exercises/{id}:
 *   put:
 *     tags:
 *       - Exercise
 *     summary: Update an exercise
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               duration:
 *                 type: integer
 *               intensity:
 *                 type: string
 *     responses:
 *       204:
 *         description: Exercise updated
 *       404:
 *         description: Exercise not found
 */
router.put('/:id', async (req: Request,  res: Response) => {
    // search array for id in url param
    const exercise = await Exercise.findById(req.params.id);

    if (exercise == null) {
        return res.status(404).json({ err: 'Exercise Not Found' });
    }

    // update name of selected exercise in array
    exercise.set(req.body);
    await exercise.save(req.body);
    return res.status(204).json({ msg: 'Exercise Updated' });
});

/**
 * @swagger
 * /api/v1/exercises/{id}:
 *   delete:
 *     tags:
 *       - Exercise
 *     summary: Delete selected exercise
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *         type: string
 *         required: true
 *     responses:
 *       204:
 *         description: Deletes selected exercise
 *       404:
 *         description: Not found
 */
router.delete('/:id', async (req: Request, res: Response) => {
    const exercise = await Exercise.findById(req.params.id);

    if (exercise == null) return res.status(404).json({err: 'Exercise Not Found'});

    await exercise.deleteOne({ _id: req.params.id });
    return res.status(200).json(exercise);
});

/**
 * @swagger
 * /api/v1/exercises/{id}/sets:
 *   post:
 *     tags:
 *       - Exercise, Sets
 *     summary: Update selected exercise to add child SET doc
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *         type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reps:
 *                 type: integer
 *                 min: 1
 *                 required: true
 *               setCount:
 *                 type: integer
 *                 min: 1
 *                 required: true
 *               weight:
 *                 type: integer
 *                 min: 1
 *               units:
 *                 type: string
 *               restTime:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Child set added
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Exercise not found
 */
router.post('/:id/sets', async (req: Request, res: Response) => {
    const exercise = await Exercise.findById(req.params.id); //find doc by id

    if (exercise == null) return res.status(404).json({ err: 'Exercise not found' }); //if no exercise, throw an error

    try {
        //use JS 'spread' operator to destructure an array into separate properties (parsing an array)
        //then add the set as a child object to the current exercise doc
        exercise.sets.push({
            ...req.body
        })
        //commit change to mongoDB
        await exercise.save();
        return res.status(201).json(exercise); //201: resource created
    } catch (error) {
        return res.status(400).json({ errror: JSON.stringify(error) });
    }
});

// make router public so other files can access it
export default router;
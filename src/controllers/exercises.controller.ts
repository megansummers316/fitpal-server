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
    //use Model to retrieve exercise documents from MongoDB
    const exercises = await Exercise.find();

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
 *         description: Bad request
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

// make router public so other files can access it
export default router;
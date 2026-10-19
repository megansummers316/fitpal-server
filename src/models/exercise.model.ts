import mongoose, {Schema} from "mongoose";

interface IExercise {
    name: string;
    duration: number;
    intensity: string;
    date: Date;
    sets: ISet[];
}

interface ISet {
    reps: number;
    setCount: number;
    weight: number;
    units: string;
    restTime: number;
}

const setSchema = new Schema({
    reps: {
        type: Number,
        min: 1,
        required: true
    },
    setCount: {
        type: Number,
        min: 1,
        required: true
    },
    weight: {
        type: Number,
        min: 1
    },
    units: {
        type: String,
        enum: ['kg', 'lbs']
    },
    restTime: {
        type: Number,
        default: 60 //seconds
    }
});

const exerciseSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    duration: {
        type: Number,
        min: 1
    },
    intensity: {
        type: String,
        enum: ['Low', 'Medium', 'High']
    },
    date: {
        type: Date,
        default: Date.now
    },
    sets: [setSchema]
});

//create model and make public
const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);
export default Exercise;
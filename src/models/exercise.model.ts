import mongoose, {Schema} from "mongoose";

interface IExercise {
    name: string;
    duration: number;
    intensity: string;
    date: Date;
}

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
    }
});

//create model and make public
const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);
export default Exercise;
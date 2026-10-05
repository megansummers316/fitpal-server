import mongoose, { Schema } from "mongoose";
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
const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;

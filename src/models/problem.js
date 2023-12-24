import mongoose from "mongoose";
import { supportedLangs } from "../utils/utils.js";
const { Schema } = mongoose;

const problemSchema = new Schema({
    name: {
        type: String,
        required: 'Problem name must be provided',
        minLength: 5,
        maxLength: 30
    },
    description: {
        type: String,
        required: 'Problem description must be provided'
    },

    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: 'Difficulty of the question must be provided'
    },
    defaultCodes: [{
         language: { 
            type: String, required: true,
             enum: supportedLangs
            },
         code: { 
            type: String,
            required: true 
        },
    }],
    solutionLanguage: {
            type: String,
            required: ['Language must be provided for the solution']
    },
    solutionCode: {
        type: String,
        required: ['Solution of the problem must be provided to check against']
    },
}, {
    timestamps: true
});

export const Problem = mongoose.model('Problem', problemSchema);
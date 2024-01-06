import mongoose from "mongoose";
import { supportedLangs } from "../utils/utils.js";
const { Schema } = mongoose;


const submissionSchema = new Schema({
    status: {
        type: String,
        enum: ['error', 'success', 'wa', 'tle', 'queued'],
        required: 'Status is a required field'
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required: 'Problem ID is required'
    },
    language: {
        type: String,
        enum: supportedLangs,
        required: 'Submission Language is required'
    }
}, {
    timestamps: true
})

export const Submission = mongoose.model('Submission', submissionSchema);
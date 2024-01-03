import Joi from 'joi';
import { supportedLangs } from '../utils/utils.js';


const defaultCodeValidator = Joi.object({
    language: Joi.string().allow(...supportedLangs),
    code: Joi.string().trim().not(''),
})
const problemValidator = Joi.object({
    name: Joi.string().min(5).max(30),
    description: Joi.string().trim().not(''),
    difficulty: Joi.string().allow('easy', 'medium', 'hard'),
    defaultCodes: Joi.array().items(defaultCodeValidator),
    solutionLanguage: Joi.string().allow(...supportedLangs),
    solutionCode: Joi.string().trim().not(''),
    testCases: Joi.string().trim().required()
})

export const validateProblemData = (data) => {
    return problemValidator.validate(data)['error'];
}
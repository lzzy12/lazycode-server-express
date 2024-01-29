import Joi from 'joi';
import { supportedLangs } from "../utils/utils.js";


const compileValidator = Joi.object({
    code: Joi.string().trim().required(),
    language: Joi.string().allow(...supportedLangs).required(),
    problemId: Joi.string().trim().required(),
})

export const validateCompileReq = (data) => {
    return compileValidator.validate(data).error;
}
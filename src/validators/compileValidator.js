import Joi from 'joi';
import { supportedLangs } from "../utils/utils";


const compileValidator = Joi.object({
    code: Joi.string().trim().required(),
    language: Joi.string().allow(...supportedLangs),
    problemId: Joi.string(),
})

export const validateCompileReq = (data) => {
    return compileValidator.validate(data).error;
}
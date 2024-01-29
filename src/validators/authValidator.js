import Joi from 'joi';

const authValidator = Joi.object({
    token: Joi.string().required(),
})

export const validateAuth = (data) => {
    return authValidator.validate(data)['error'];
}
import Joi from "joi";


const userSignUpSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6),
})
export const validateUserSignUp = (data) => {
    return userSignUpSchema.validate(data)['error'];
}

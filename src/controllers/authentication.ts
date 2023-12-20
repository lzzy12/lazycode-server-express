import { StatusCodes } from "http-status-codes";
import { validateUserSignUp } from "../validators/userValidator"
import { Request, Response } from "express";
import { User } from "../models/user";


const hashedPassword = (password) => {
    
}
export const register = (req, res: Response)=> {
    const data = req.body;
    const validationErrors = validateUserSignUp(data);
    if (validationErrors != undefined){
        return res.status(StatusCodes.BAD_REQUEST).json(validationErrors['details']);
    }

    new User({
        email: data.email,
        password: hashedPassword(data.password),
        lastActive: Date.now(),
    })
}
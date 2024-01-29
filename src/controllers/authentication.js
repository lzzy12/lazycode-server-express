import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.js";
import { validateAuth } from "../validators/authValidator.js";
import admin from 'firebase-admin';

export const login = async (req, res) => {
    const data = req.body;
    const validationErrors = validateAuth(data);
    if (validationErrors){
        return res.status(StatusCodes.BAD_REQUEST).json(validationErrors);
    }
    const validToken = await admin.auth().verifyIdToken(data.token);
    try {
        if (validToken){
        let user = await User.find({
            email: validToken.email,
        })
            if (user){
                return res.status(StatusCodes.OK).json(user);
            } else {
                user = await (new User({
                    email: validToken.email,
                    providerId: validToken.uid,
                    provider: validToken.firebase.sign_in_provider
                })).save();
                return res.status(StatusCodes.CREATED).json(user);
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }
    } catch(e){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
}

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token){
        const decodedToken = await admin.auth().verifyIdToken(token);
        if (decodedToken){
            next()
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }
    } else {
        res.status(StatusCodes.UNAUTHORIZED).send();
    }
}
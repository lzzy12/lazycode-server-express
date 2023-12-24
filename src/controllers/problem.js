import { validateProblemData } from "../validators/problemValidators.js";
import { StatusCodes } from "http-status-codes";
import { Problem } from "../models/problem.js";

export const addProblem = async (req, res) => {
    const data = req.body;
    const errors = validateProblemData(data)
    if (errors != null){
        return res.status(StatusCodes.BAD_REQUEST).json(errors);
    }
    try {
        const problem = new Problem({
                name: data.name,
                description: data.description,
                difficulty: data.difficulty,
                defaultCodes: data.defaultCodes,
                solutionCode: data.solutionCode,
                solutionLanguage: data.solutionLanguage,
            })
        const newProblem = await problem.save()
        res.status(StatusCodes.OK).json({
            id: newProblem._id,
        })
    } catch(e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
}

export const getAllProblemsWithoutSolution = async (req, res) => {
    try{
        const problems = await Problem.find({}).select('-solutionCode').select('-solutionLanguage');
        return res.status(StatusCodes.ACCEPTED).json(problems);
    } catch(e){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
}

export const getProblemById = async (req, res) => {
    try{
        const id = req.params.id;
        const problem = await Problem.findById(id).select('-solutionCode').select('-solutionLanguage');
        if (problem === null){
            return res.status(StatusCodes.NOT_FOUND).send();
        }
        return res.status(StatusCodes.ACCEPTED).json(problem);
    } catch(e){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    }
}

export const updateProblemById = async (req, res) => {
    try{
        
    } catch(e){
        
    }
}
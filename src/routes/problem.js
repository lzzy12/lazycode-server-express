import express from "express";
import { addProblem, getAllProblemsWithoutSolution, getProblemById, updateProblemById } from "../controllers/problem.js";

const router = express.Router()

router.post('/', addProblem);
router.get('/', getAllProblemsWithoutSolution)
router.get('/:id', getProblemById)
router.patch('/:id', updateProblemById);
export default router;
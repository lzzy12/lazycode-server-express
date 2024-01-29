import express from "express";
import { addProblem, getAllProblemsWithoutSolution, getProblemById, updateProblemById } from "../controllers/problem.js";
import { authenticate } from "../controllers/authentication.js";

const router = express.Router()

router.post('/', authenticate, addProblem);
router.get('/', getAllProblemsWithoutSolution)
router.get('/:id', getProblemById)
router.patch('/:id', authenticate, updateProblemById);
export default router;
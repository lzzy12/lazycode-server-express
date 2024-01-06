import { Router } from "express";
import { compile, compileStatus } from "../controllers/compiler";

const router = Router()

router.post('/submit', compile);

router.get('/result', compileStatus);

export default router;
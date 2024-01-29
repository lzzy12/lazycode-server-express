import { StatusCodes } from "http-status-codes";
import { validateCompileReq } from "../validators/compileValidator.js";
import process from 'child_process'
import queue from './queue.js'
import redisClient from "../config/redis.js";
import { promisify } from "util";
// import { SubmissionStatus } from "../utils/utils";
import { Submission } from "../models/submission.js";
import { SubmissionStatus } from "../utils/utils.js";
import { randomUUID } from "crypto";
import fs from 'node:fs'
import { Problem } from "../models/problem.js";

const promisifiedExec = promisify(process.exec);


const problemStore = {};
const submissionStore = {};

const compileCmds = (lang, path, jobId) => {
    if (lang.toLowerCase() === 'cpp') {
        return `wsl g++ ${path} -o compile-outputs/${jobId}.out -Werror&& wsl ./compile-outputs/${jobId}.out`
    }
    return '';
}
const extensions = {
    'cpp': 'cpp',
    'javascript': 'js',
    'typescript': 'ts'
}
const storeToFile = async (lang, code, jobId) => {
    const ext = extensions[lang];
    if (!fs.existsSync('compile-outputs/'))
        fs.mkdirSync('compile-outputs/');
    fs.writeFileSync(`compile-outputs/${jobId}.${ext}`, code);
    return `compile-outputs/${jobId}.${ext}`;
}
export const compile = async (req, res) => {
    const jobId = randomUUID();
    try {
        const data = req.body;
        const validationErrors = validateCompileReq(data);
        if (validationErrors != null) {
            return res.status(StatusCodes.BAD_REQUEST).json(validationErrors);
        }

        const initialSubmissionData = {
            jobId,
            status: SubmissionStatus.queued,
            problemId: data.problemId,
            language: data.language,
        };
        submissionStore[jobId] = initialSubmissionData;
        res.status(StatusCodes.ACCEPTED).json({
            jobId
        });
        const compileJob = async () => {
            submissionStore[jobId] = {
                ...initialSubmissionData,
                status: SubmissionStatus.processing,
            };

            let solutionData = problemStore[data.problemId];
            const problem = await Problem.findById(data.problemId);

            if (!solutionData || solutionData.error) {
                // Running the correct code
                const runSolCode = async () => {
                    try {
                        new Promise(async (resolve) => {
                            const path = await storeToFile(problem.solutionLanguage, problem.solutionCode, problem.id);

                            const compileProcess = process.spawn(compileCmds(problem.solutionLanguage, path, problem.id), [], { shell: true });

                            let stdout = '';
                            let stderr = '';

                            compileProcess.stdout.on('data', data => {
                                stdout += data.toString();
                            });

                            compileProcess.stderr.on('data', data => {
                                stderr += data.toString();
                            });

                            compileProcess.on('close', code => {
                                const solData = {
                                    id: data.problemId,
                                    error: stderr,
                                    output: stdout,
                                };
                                if (stderr || code != 0) {
                                    console.log(stderr)
                                    solData.status = SubmissionStatus.error;
                                    submissionStore[jobId] = {
                                        ...initialSubmissionData,
                                        error: "Server error. Try again later",
                                        status: SubmissionStatus.error,
                                    }
                                } else {
                                    solData.status = SubmissionStatus.success;
                                }
                                problemStore[data.problemId] = solData;
                                resolve(solData.status === SubmissionStatus.success);
                            });

                            compileProcess.on('error', err => {
                                console.error('Error occurred:', err);
                                resolve(false);
                            });
                            if (problem.testCases) {
                                console.log(problem.testCases);
                                compileProcess.stdin.write(problem.testCases);
                                compileProcess.stdin.end()
                            }
                        });
                    } catch (e) {
                        console.log(e);
                        problemStore[jobId] = {
                            ...problemStore[jobId],
                            error: e,
                        };
                    }
                };

                if (!await runSolCode()) return;
                solutionData = problemStore[data.problemId];
                console.log(solutionData);
            }

            // Running the code sent by user
            const path = await storeToFile(data.language, data.code, jobId);
            try {
                const compileProcess = process.spawn(compileCmds(data.language, path, jobId), [], { shell: true });

                let stdout = '';
                let stderr = '';

                compileProcess.stdout.on('data', data => {
                    stdout += data.toString();
                });

                compileProcess.stderr.on('data', data => {
                    stderr += data.toString();
                });
                compileProcess.on('close', code => {
                    const submissionData = {
                        id: jobId,
                        output: stdout,
                        error: stderr,
                        status: SubmissionStatus.processing,
                    };

                    if (stderr || code != 0) {
                        submissionData.status = SubmissionStatus.error;
                    } else {
                        if (solutionData.output === stdout) {
                            submissionData.status = SubmissionStatus.success;
                        } else {
                            submissionData.status = SubmissionStatus.wa;
                        }
                        submissionStore[jobId] = submissionData;
                    }
                });
                if (problem.testCases) {
                    compileProcess.stdin.write(problem.testCases);
                    compileProcess.stdin.write('\n');
                    compileProcess.stdin.end()
                }
                compileProcess.on('error', err => {
                    console.error('Error occurred:', err);
                });
            } catch (e) {
                submissionStore[jobId] = {
                    ...submissionStore[jobId],
                    error: e.stderr,
                    output: e.stdout,
                    status: SubmissionStatus.error,
                };
            }
        };
        await compileJob();

    } catch (e) {
        submissionStore[jobId] = {
            id: jobId,
            status: SubmissionStatus.error,
            error: 'Server error. Something went wrong'
        }
        console.log(e);
    }
}

export const compileStatus = async (req, res) => {
    try {
        const { jobId } = req.query;
        const jobData = submissionStore[jobId];
        console.log(jobData);
        if (!jobData) {
            return res.status(StatusCodes.NOT_FOUND).json({
                error: "Submission not found"
            });
        }
        return res.status(StatusCodes.OK).json(jobData);
    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
        console.log(e);
    }
}
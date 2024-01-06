import { StatusCodes } from "http-status-codes";
import { validateCompileReq } from "../validators/compileValidator";
import process from 'child_process'.
import queue from './queue'
import redisClient from "../config/redis";
import { promisify } from "util";
import { SubmissionStatus } from "../utils/utils";
import { Submission } from "../models/submission";
const promisifiedExec = promisify(process.exec);


const compileCmds = (lang, code, jobId) => {
    if (lang === 'CPP'){

        return `echo ${code} > ${jobId}.cpp && g++ ${filename} -o ${filename}.out`
    }
}
export const compile = (req, res) => {
    try {
        const data = req.body;
        const validationErrors = validateCompileReq(data);
        if (validationErrors == null){
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        const submission = await (new Submission( {
            status: SubmissionStatus.queued,
            problemId: data.problemId,
            language: data.language,
        }).save());
        const {jobId} = submission;
        const compileJob = () => {
            const output = ''
            const error = ''
            return new Promise( async (resolve) => {
                Submission.findByIdAndUpdate(jobId, {
                    status: SubmissionStatus.queued,
                });
                let solutionData = await redisClient.hGetAll(`solution-${data.problemId}`)
                if (solutionData == null || solutionData == undefined || solutionData.error){
                    const runSolCode = async () => {
                        return new Promise( async (resolve, reject) => {
                            try{
                                const {stdout, stderr} = await promisifiedExec(compileCmds(data.language, data.code, data.problemId));
                                
                                const data = {
                                    id: data.problemId,
                                    error: stderr,
                                    output: stdout,
                                }
                                redisClient.hSet(`solution-${data.problemId}`, data);
                                if (stderr){
                                    redisClient.hSet(`submission-${jobId}`, {
                                        id: jobId,
                                        error: 'Internal server error',
                                    })
                                    reject(stderr);
                                    return;
                                }
                                resolve(data);
                            } catch(e){
                                console.log(e);
                            }
                        })
                    }
                    solutionData = await runSolCode();
                }
                process.exec(compileCmds(data.language, data.code, jobId), (err, stdout, stderr) => {
                    if (err){
                        resolve(null);
                    } else {
                        if (stderr.length != 0){
                            error.concat(stderr);
                        }
                        output.concat(stdout);
                    }
                }).on('exit', (errorCode, _) => {
                    const data = {
                        id: jobId,
                        output,
                        error,
                    }
                    if (errorCode != 0){
                        data.status = SubmissionStatus.error;
                    } else {
                        if (solutionData.output === output){
                            data.status = SubmissionStatus.success;
                        } else{
                            data.status = SubmissionStatus.wa;
                        }
                    }
                    redisClient.hSet(`submission-${jobId}`, data);
                    resolve(data);
                });
            })
            
        };
        queue.enqueueTask(compileJob);
        res.status(StatusCodes.ACCEPTED).json({
            jobId
        });
    } catch(e){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        console.log(e);
    }
}

export const compileStatus = async (req, res) => {
    try {
        const {jobId} = req.body;
        const jobData = await redisClient.hGetAll(`submission-${jobId}`);
        return res.status(StatusCodes.OK).json(jobData);
    } catch(e){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e);
        console.log(e);
    }
}
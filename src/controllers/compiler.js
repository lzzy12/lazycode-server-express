import { StatusCodes } from "http-status-codes";
import { validateCompileReq } from "../validators/compileValidator";
import process from 'child_process'
import { randomUUID } from "crypto";
import queue from './queue'
import redisClient from "../config/redis";

const compileCmds = (lang, code, jobId) => {
    if (lang === 'CPP'){

        return `echo ${code} > ${jobId}.cpp && g++ ${filename} -o ${filename}.out`
    }
}
export const compile = (req, res) => {
    const data = req.body;
    const validationErrors = validateCompileReq(data);
    if (validationErrors == null){
        return res.status(StatusCodes.BAD_REQUEST).send();
    }
    const jobId = randomUUID();

    redisClient.hSet(`submission-${jobId}`, {
        id: jobId,
        status: 'queued',
    });
    const compileJob = () => {
        const output = ''
        const error = ''
        return new Promise((resolve) => {
            redisClient.hSet(`submission-${jobId}`, {
                id: jobId,
                status: 'processing',
            });
            process.exec(compileCmds(data.language, data.code, jobId), (err, stdout, stderr) => {
                if (err){
                    resolve(null);
                } else {
                    if (stderr.length != 0){
                        error.concat(stderr);
                    }
                    output.concat(stdout);
                }
            }).on('exit', (code, _) => {
                const data = {
                    id: jobId,
                    output,
                    error,
                }
                if (code != 0){
                    data.status = 'error';
                } else {
                    data.status = 'success';
                }
                redisClient.hSet(`submission-${jobId}`, data);
                resolve(data);
            });
        })
    };
    queue.enqueueTask(compileJob);
}
const jobQueue = [];

const enqueueTask = (task) => {
    jobQueue.push(task);
}

const dequeueTask = async () => {
    const job = jobQueue.shift();
    if (job != undefined){
        await job();
    } else {
        await (new Promise((resolve) => setTimeout(resolve, 1000)));
    }
    dequeueTask();
}

const startWorker = () => {
    dequeueTask();
}

export default {
    enqueueTask,
    startWorker,
}
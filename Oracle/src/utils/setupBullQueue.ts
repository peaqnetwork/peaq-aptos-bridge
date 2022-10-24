import { Queue, Worker } from "bullmq";

const variableNames = {
  queue: "",
  worker: "",
  scheduler: "",
};

/**
 * @description creates a new bullmq queue instance
 * @param queueName name of the queue should be unique
 * @param jobName name of the job which the worker will work on
 * @param jobId id for the job should be unique if running multiple instances
 * @param repeatCron cron specificiation for repeat interval
 * @param filePath sandboxed processed file location
 * @param queueNamePrefix prefix to attach to the queue name useful when running multi cluster setup.
 * @returns call to the setupBullQueue function
 */
export const createBullQueue = async (
  queueName: string,
  jobName: string,
  jobId: string,
  repeatCron: string,
  filePath: string,
  queueNamePrefix: string = "oracle"
): Promise<any> => {
  return await setupBullQueue.call(
    variableNames,
    queueName,
    jobName,
    jobId,
    repeatCron,
    filePath,
    queueNamePrefix
  );
};

/**
 * @description set ups and starts the queue instance from the createBullQueue function
 * @param queueName name of the queue should be unique
 * @param jobName name of the job which the worker will work on
 * @param jobId id for the job should be unique if running multiple instances
 * @param repeatCron cron specificiation for repeat interval
 * @param filePath sandboxed processed file location
 * @param queueNamePrefix prefix to attach to the queue name useful when running multi cluster setup.
 * @returns worker,queue,scheduler instance
 */
async function setupBullQueue(
  queueName: string,
  jobName: string,
  jobId: string,
  repeatCron: string,
  filePath: string,
  queueNamePrefix: string = "oracle"
): Promise<any> {
  this.queue = new Queue(queueName, {
    prefix: queueNamePrefix,
  });

  await this.queue.add(
    `${queueNamePrefix}${jobName}`,
    {},
    {
      repeat: { cron: repeatCron },
      removeOnComplete: true,
      removeOnFail: true,
      jobId: `${queueNamePrefix}${jobId}`,
    }
  );

  this.worker = new Worker(queueName, filePath, {
    prefix: queueNamePrefix,
  });
  this.worker.on("completed", () => {
    console.log(`${queueName} completed the job`);
  });
  return { worker: this.worker, queue: this.queue, scheduler: this.scheduler };
}

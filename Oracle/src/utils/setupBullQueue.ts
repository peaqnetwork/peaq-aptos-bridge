import { Queue, Worker } from "bullmq";

const variableNames = {
  queue: "",
  worker: "",
  scheduler: "",
};

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

import { Queue } from 'bullmq'
import { BULLMQ_CONNECTION, WORKER_RR_QUEUE_NAME } from '../settings'
import { Logger } from 'pino'

export async function removeRepeatingJob(jobId: string, logger: Logger) {
  try {
    const queue = new Queue(WORKER_RR_QUEUE_NAME, BULLMQ_CONNECTION)

    // Remove the repeatable job
    const removed = await queue.removeRepeatableByKey(jobId)

    // Also remove any existing jobs with this ID
    const job = await queue.getJob(jobId)
    if (job) {
      await job.remove()
    }

    logger.info({ jobId, removed }, 'Removed repeating job')
    await queue.close()

    return removed
  } catch (error) {
    logger.error({ error, jobId }, 'Failed to remove repeating job')
    throw error
  }
}

// Example usage:
// import { createLogger } from '../logger'
// const logger = createLogger()
// await removeRepeatingJob('adcs_123', logger)

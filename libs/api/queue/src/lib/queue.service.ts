import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from './queue.constants';

@Injectable()
export class QueueService {
  constructor(@InjectQueue(QUEUE_NAMES.EMAIL) private emailQueue: Queue) {}

  async addTicketCreatedJob(email: string, ticketId: string) {
    await this.emailQueue.add(
      JOB_NAMES.SEND_TICKET_CREATED_EMAIL, // Job name
      { email, ticketId }, // Job data
      {
        attempts: 3, // Retry 3 times if an error occurs
        backoff: 5000, // Wait 5 seconds between retries
        delay: 1000, // Start with a 1 second delay
      },
    );
  }
}

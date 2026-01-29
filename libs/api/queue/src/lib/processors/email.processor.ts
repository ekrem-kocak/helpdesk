import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from '../queue.constants';

@Processor(QUEUE_NAMES.EMAIL)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case JOB_NAMES.SEND_TICKET_CREATED_EMAIL:
        return this.handleTicketCreatedEmail(job);
      default:
        this.logger.warn(`Unknown job: ${job.name}`);
    }
  }

  private async handleTicketCreatedEmail(job: Job) {
    this.logger.log(
      `📧 Mail sending... To: ${job.data.email}, Ticket ID: ${job.data.ticketId}`,
    );

    // Simulate email sending by waiting for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.logger.log(`✅ Mail sent successfully! (Job ID: ${job.id})`);
    return { sent: true };
  }
}

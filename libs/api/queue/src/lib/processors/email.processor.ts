import { MailService } from '@helpdesk/api/mail';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from '../queue.constants';

@Processor(QUEUE_NAMES.EMAIL)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

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

    await this.mailService.sendTicketCreatedEmail(
      job.data.name,
      job.data.email,
      job.data.ticketId,
      job.data.title,
    );

    this.logger.log(`✅ Mail sent successfully! (Job ID: ${job.id})`);
    return { sent: true };
  }
}

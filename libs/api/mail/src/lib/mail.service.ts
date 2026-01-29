import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendTicketCreatedEmail(
    name: string,
    to: string,
    ticketId: string,
    title: string,
  ) {
    this.logger.log(
      `Sending ticket created email to ${to} for ticket ID: ${ticketId}`,
    );

    await this.mailerService.sendMail({
      to,
      subject: `Your ticket #${ticketId} has been created`,
      template: 'ticket-created', // Name of the template file (e.g., ticket-created.hbs)
      context: {
        name,
        ticketId,
        title,
      },
    });

    this.logger.log(
      `Ticket created email sent to ${to} for ticket ID: ${ticketId}`,
    );
  }
}

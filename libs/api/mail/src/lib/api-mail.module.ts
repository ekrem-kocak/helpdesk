import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow('mail.host'),
          port: configService.getOrThrow<number>('mail.port'),
          secure: false, // TODO: change based on port
          auth: {
            user: configService.getOrThrow('mail.user'),
            pass: configService.getOrThrow('mail.pass'),
          },
        },
        defaults: {
          from: configService.getOrThrow('mail.from'),
        },
        template: {
          dir: join(__dirname, 'mail-templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class ApiMailModule {}

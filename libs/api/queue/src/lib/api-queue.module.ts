import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProcessor } from './processors/email.processor';
import { QUEUE_NAMES } from './queue.constants';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.getOrThrow<string>('redis.url'),
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue({
      name: QUEUE_NAMES.EMAIL,
    }),
  ],
  providers: [QueueService, EmailProcessor],
  exports: [BullModule, QueueService],
})
export class ApiQueueModule {}

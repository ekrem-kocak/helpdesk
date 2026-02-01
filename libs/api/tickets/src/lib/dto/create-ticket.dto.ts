import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Priority } from '@helpdesk/shared/interfaces';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description!: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}

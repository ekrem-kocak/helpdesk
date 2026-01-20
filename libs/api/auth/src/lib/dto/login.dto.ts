import { ILoginRequest } from '@helpdesk/shared/interfaces';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto implements ILoginRequest {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

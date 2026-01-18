import { IAuthResponse } from '@helpdesk/shared/interfaces';

export class AuthResponseDto implements IAuthResponse {
  accessToken!: string;
}
